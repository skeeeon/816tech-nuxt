---
title: "Rule Router, Six Months Later: One Binary, A Scheduler, and Rules in KV"
date: "2026-05-12"
author: "Brian Miller"
slug: "rule-router-six-months-later"
excerpt: "What we changed, what we learned, and why the rule engine kept earning new responsibilities"
tags: ["nats", "golang", "event-driven", "gitops"]
image: "/images/blog/grug-six-months.jpg"
imageAlt: "Grug-brained developer trapping complexity"
---
![Alt text](/images/blog/grug-six-months.jpg "Grug through time")

When we [wrote about rule-router last November](https://www.816tech.com/blog/grug-brain-nats-rule-engine), the project was two binaries and a CLI: a NATS-to-NATS router and an HTTP gateway that shared a rule engine. For anyone landing here cold: rule-router is a small Go service that watches NATS subjects and HTTP endpoints, evaluates incoming events against YAML rules, and routes, enriches, or transforms them into new NATS messages or HTTP calls. The pitch was that most of the glue code between services can be replaced with YAML if the rule engine is good enough.

Six months of running it in real systems later, the pitch still holds, and the shape of the project has changed quite a bit.

This post is a tour of what's new, organized by what hurt the most before each change went in.

### Credit where it's due

Some of the bigger changes were directly inspired by [`shunt`](https://github.com/danielmichaels/shunt), a personal fork of rule-router. The fork took the project in a direction we hadn't planned and solved three problems we'd been circling: collapsing the binaries, adding a KV-backed rule store, and adding debounce. We read the code, learned from it, and ported the ideas back upstream with our own implementations. It was one of the most useful pieces of feedback the project has gotten.

### One binary instead of three

The most visible structural change is that the executable boundary moved.

We started with three binaries: `rule-router`, `http-gateway`, and (a bit later) `rule-scheduler` for cron-based publishing. Each had its own config, its own metrics port, its own NATS connection pool. The split made sense on paper, since the workloads are different. In practice almost every deployment ended up running at least two of them, often all three, against the same NATS cluster, against the same KV buckets, evaluating rules with the same engine.

So in 0.11.0 we collapsed them into one binary with feature flags:

```yaml
features:
  router: true
  gateway: true
  scheduler: true
```

You can flip features on with environment variables too (`RR_FEATURES_GATEWAY=true`). The default with no `features` block is `router: true`, so existing deployments kept working without any change.

Most of our deployments are bare metal or small VMs, not orchestrated container environments, and one binary fits that model a lot better than three. One systemd unit, one process to monitor, one set of logs to tail, one place for the KV cache to live. The image is also smaller because the Go build folds the three command trees into a single binary with shared dependencies. The `nats-auth-manager` is still its own binary because its lifecycle is genuinely different, and `rule-cli` is its own thing because you run it on developer laptops and in CI.

### A scheduler that publishes to NATS *and* HTTP

The original router was reactive: a message arrives, a rule fires. But a lot of real integration work isn't reactive. Some vendors don't offer webhooks, so you poll them on an interval. Office doors need to unlock at 8am on weekdays. Daily digests need to go out at 06:00 UTC. None of that fits a "wait for a message" model.

We added a `schedule` trigger:

```yaml
- trigger:
    schedule:
      cron: "0 8 * * 1-5"
      timezone: "America/New_York"
  action:
    nats:
      subject: "access.doors.unlock_all"
      payload: '{"source": "scheduler", "id": "{@uuid7()}"}'
```

Schedule rules have no incoming message, so conditions can reference time variables (`{@time.hour}`, `{@day.name}`) and KV lookups (`{@kv.*}`), but not message fields. Everything else (templating, KV enrichment, `forEach`, signature output) works the same.

NATS itself is adding native support for scheduled publishing, and for the pure case of "publish this static payload on this cron," it'll be the better tool. What rule-router's scheduler offers on top is the rest of the rule engine wrapped around the schedule: conditional execution, KV enrichment in the payload, templated subjects, fan-out with `forEach`, and HTTP actions. If you just need a heartbeat, use native NATS. If you need "every 5 minutes, look up each tenant's config in KV and publish a per-tenant tick if their plan is active," that's what this is for.

The thing that surprised us was how much of our HTTP-polling work disappeared once we added HTTP actions to the scheduler. A cron rule can hit an external API, and if you set `publishResponse`, the response body gets republished to a NATS subject:

```yaml
- trigger:
    schedule:
      cron: "*/5 * * * *"
  action:
    http:
      url: "https://api.example.com/devices/status"
      method: GET
      publishResponse:
        subject: "poll.devices.status"
      retry:
        maxAttempts: 3
        initialDelay: "1s"
        maxDelay: "30s"
```

Then a normal router rule subscribes to `poll.devices.status` and does the actual evaluation. "Poll an API every five minutes and alert on changes" stops being a microservice and becomes two YAML files. The retry block has exponential backoff with jitter and respects shutdown signals, which we learned to care about after the first time a deploy left a process hanging on a 30-second retry chain.

`publishResponse` works anywhere there's an HTTP action: in the scheduler and in the gateway's outbound NATS-to-HTTP path. It only fires on 2xx, caps the body at 1MB, and a publish failure logs an error but doesn't fail the HTTP call. That last part matters more than it sounds: the HTTP call already succeeded, so retrying it just to get the publish through would be wrong.

### Rules in KV, hot-reloaded

The change with the biggest workflow impact is probably the KV rule store.

In the file-based model, rules live in a `rules/` directory and load at startup. SIGHUP reloads them. That's fine for small deployments, painful for anything larger: every rule change is a file deploy, which usually means a container rebuild, which usually means a five-minute round trip for what should be a five-second edit.

In 0.9.0 we added an optional KV-backed rule store:

```yaml
kv:
  rules:
    enabled: true
    bucket: "rules"
    autoProvision: false
```

When this is on, the `rules/` directory is ignored. Rules come from a NATS KV bucket, the application watches it with KV Watch, and any put or delete is picked up live. JetStream consumers are created for new subjects, removed when rules are deleted. The scheduler rebuilds its cron jobs on the fly without interrupting jobs that are already running. No restart, no SIGHUP, no gap.

You push rules with `rule-cli kv push`:

```bash
rule-cli kv push sensors/      --url nats://prod:4222 --creds ./prod.creds
rule-cli kv push alerts/       --url nats://prod:4222 --creds ./prod.creds
```

The CLI converts file paths to KV keys (`sensors/tank.yaml` becomes `sensors.tank`), so your directory layout becomes a dotted namespace in NATS without any extra mapping logic. There's a `--dry-run` flag for previewing.

This combines well with putting rules in their own git repository. We have several deployments now where rules-as-code is genuinely separate from infrastructure-as-code: a domain team owns a rules repo, CI runs `rule-cli lint` and `rule-cli test` on every PR, and merge to main pushes to a NATS KV bucket. The application picks up the change in well under a second.

If you set `autoProvision: true`, the bucket gets created with JetStream defaults on first startup. If you keep it `false` (the default), you provision the bucket yourself, which is what you want in any environment where bucket settings are part of your IaC surface.

### A web UI for the people who don't want to write YAML

We resisted this one for a while, because of the philosophy thing. Then we watched enough people stare at a blank `.yaml` file and we built it anyway.

The web UI is a Vue 3 app that lives in the `web/` directory. The form covers the full rule format: triggers, recursive condition groups, every action type, `forEach` with filters and merge payloads, debounce config, headers, retry blocks. A live YAML preview updates as you type. The goal isn't to replace raw YAML, it's to give you a path to learn the syntax: build something in the form, watch the YAML, eventually stop needing the form.

The part that actually won us over is browser-side testing. The same Go rule engine that runs in production is compiled to WebAssembly and ships with the UI. Paste a sample message, click "test," see what the rule would produce, all locally with no server round trip. Iterating on a rule against real-looking input without leaving the page is a meaningfully better workflow than any of our previous combinations of editor, file, terminal, and re-run.

KV push and pull work over WebSocket using the official `@nats-io/nats-core` and `@nats-io/kv` packages, so you can load an existing rules bucket, edit a rule, and push it back without leaving the page. There's a download button if you'd rather commit the YAML to git, which is what we usually do.

It runs as an optional Docker Compose profile (`--profile web`) on port 3000, or you can serve the built assets behind whatever you already have.

### Smaller things in the rule engine that punched above their weight

A few changes to the core engine made a disproportionate amount of glue code disappear, and they're worth calling out because they're easy to miss in the changelog.

The original engine required condition values to be literals. You could template the field side, but the right-hand side had to be a hard-coded number or string. We loosened that, so values can be templates too. A condition like `value: "{@kv.sensor_config.{sensor_id}:max_temp}"` now means "compare against whatever max_temp this sensor has in KV right now." Different thresholds per sensor, edited live, no rule deploy. We use the same pattern for permission levels, rate limits, and most of our dynamic logic. The type system resolves variables to their native JSON types before comparing, so numbers stay numbers and strings stay strings, which sounds obvious until you've debugged a string-vs-int comparison that silently returned false.

Action payloads gained a third mode beyond `payload:` and `passthrough:`. With `merge: true`, the original message passes through and a templated overlay is deep-merged onto it. Adding two enrichment fields to an incoming order no longer means re-specifying every other field:

```yaml
action:
  nats:
    subject: "enriched.orders"
    merge: true
    payload: |
      {
        "customer_tier": "{@kv.customers.{customer_id}:tier}",
        "trace_id": "{@uuid7()}"
      }
```

Nested objects merge recursively, arrays in the overlay replace arrays in the base. This is the default mode for most of our enrichment rules now.

The other two are smaller but worth knowing. Triggers and actions both support an optional `debounce` block with fire-first semantics: the first message goes through immediately, anything within the configured window is suppressed. The `key` field lets you group by subject token, header, or field value, so you can write rules like "one alert per room every 30 seconds." Trigger debounce skips evaluation entirely; action debounce lets the rule match but suppresses the output. Each rule has its own state, so two rules on the same subject don't interfere with each other.

And `forEach` can now source its array from a KV bucket instead of the message:

```yaml
action:
  nats:
    forEach: "{@kv.config.door_list}"
    subject: "access.door.{id}.command"
    payload: '{"command": "unlock", "id": "{@uuid7()}"}'
```

This is what made scheduler fan-out feel natural. A cron job has no incoming payload, but it can iterate over a KV-managed array of targets, and adding or removing a target is a `nats kv put` away.

### What we didn't do

A short list of things we considered and decided not to add, in case it's useful to anyone else weighing this kind of thing:

- A scripting language for actions. CEL and Go templates both came up. We kept saying no. The rule format is verbose by design; if you need real logic, use a full-fledged stream processor like eKuiper, or Wombat. Or go crazy and write a NATS service in any language and call it.
- Rule versioning inside KV. KV history works fine; we didn't need to invent more.
- HTTP gateway auth beyond header checks. A real API gateway does this better. We never want to be a reverse proxy.

Each "no" kept the surface area small. The project is around the same size as it was last November, even with everything we added.

### Where to look

The repo is still at https://github.com/skeeeon/rule-router. The README walks through Docker Compose setup with bundled NATS if you want to try the whole thing in a few commands. The `docs/` folder has the deeper material: core concepts, system variables, array processing, primitive messages, signature verification, and a guide to the KV rule store.

If you tried rule-router earlier and bounced off it, the things most likely to bring you back are the scheduler, KV-backed rules, and the web UI. If you're new, the quickstart in the README is the place to start.

We're still building this in public. Open an issue, send a PR, or tell us what's missing.
