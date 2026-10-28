---
title: "One Row Is the Device, Its Login, and Its Keys"
date: "2026-10-19"
author: "Brian Miller"
slug: "stone-age-platform"
excerpt: "An MIT-licensed multi-tenant IoT platform where a device's inventory row, its NATS user, and its Nebula certificate are the same record"
tags: ["nats", "pocketbase", "nebula", "golang", "iot"]
image: "/images/blog/stone-age-platform.jpg"
imageAlt: "Stone-Age.io platform"
---
![Stone-Age.io](/images/blog/stone-age-platform.jpg)

NATS is so hot right now. We keep finding it in places it wasn't a year ago, and more of the people showing up are putting real workloads on it rather than kicking the tires. Maybe that's just the algorithm feeding us back our own echo chamber. Either way, we love to see it.

Last November we [wrote up the pattern underneath this](https://www.816tech.com/blog/pocketbase-nats-pattern): PocketBase minting NATS account and user credentials straight from database records. That post ended by saying the libraries were the foundation of a platform we were building. This is that platform.

[Stone-Age.io](https://stone-age.io) is an MIT-licensed multi-tenant control plane for fleets of equipment and the software that runs alongside it. The equipment we had in mind fills a building or a warehouse: video servers, access control panels, cameras, door readers, freezer probes, power meters, and the small Linux boxes at each site doing the actual talking. Integrators and managed service providers run one Stone-Age.io deployment with a tenant per customer. If the fleet is your own, it's the same deployment with one tenant in it.

One row in its inventory is the thing's record, its login, its messaging identity and its certificate on a private network, all at once. If you keep an asset inventory in one system, a device registry in another, certificates in a third, and a job somewhere holding the three together, you already know the problem this is built to remove.

### A second job to learn

Every time we've looked hard at a hyperscaler's IoT offering, it has read like a second job: a device registry, shadows or twins, a rules engine, policies, an edge runtime, a credential provider, and the cloud's own IAM model holding it all together. They're well built, and plenty of people run on them happily. The cost is knowledge and vocabulary that apply nowhere else, as well as a dependency and a roadmap you don't really get a vote in. Google retired IoT Core outright and gave customers about a year to move; another of the big three has carried two or three overlapping products long enough that picking between them is its own project.

The bet we're making is that if you already understand NATS subjects, JSON payloads and JWT identity, you know most of what this platform asks of you. That's a big if for some readers. But what you learn here transfers to anything else you build on NATS, which is more than we can say for the alternatives.

### Accounts carry more than permissions

A NATS account is usually introduced as a permission boundary, and it is one. But the subject space inside it is complete, and with JetStream turned on, so is the storage. Streams, consumers, KV and object buckets are all scoped to the account, and reachable from outside only through an export you create. Two tenants can both publish on `telemetry.>` and neither sees the other's traffic, with no prefix convention for anyone to enforce.

Provisioning a tenant hands over that whole namespace, and durability comes with it. Their telemetry replays from a stream nobody else can bind to, their device state sits in a KV bucket another account can't reach even if it uses the same name, and their consumers track their own position. At the edge, a site's leaf node mirrors that bucket down so the site keeps answering through a WAN outage. Where a broker has no tenant namespace of its own, this is plumbing you write yourself and defend in code review.

What NATS deliberately leaves open is where the credentials come from. `nsc` manages the operator, account and user hierarchy well when that hierarchy is reasonably static, and less well when tenants and devices are being created, rotated and revoked all day. The same gap exists for Nebula certificates. Filling both from one place is what the control plane is for: a developer asks an API for a credential instead of asking a person for a file, and the broker and the overlay network stop drifting apart because the same record provisions both.

### Inventory as identity

The idea the whole platform hangs off: the record for a thing and the credentials that thing uses are the same record.

Here, the video management server at a site, or the VPS running a NetSuite sync, is one row in a `things` collection. That row is an auth record, and it holds a NATS user and a Nebula host certificate. Creating it mints both:

```bash
curl -X POST http://localhost:8090/api/org/things \
  -H "Authorization: $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"HQ Video Server","code":"vms-hq","location":"'"$LOC_ID"'",
       "nats":{"mode":"auto"},"nebula":{"mode":"auto"}}'
```

One request, one transaction, and that box exists as an inventory entry, a login, a messaging identity and a mesh node at once. There is no second registry to reconcile against.

![A door's thing page in the demo console: the subjects it publishes and subscribes to, and its live state read from KV](/images/blog/stone-age-thing-page.png)

*A door in the demo, one record: the subjects its type declares, and its live state straight from KV.*

Most equipment can't hold an identity of its own and shouldn't have to. A camera, a door on a vendor's panel, a power meter: those are rows with `"mode":"none"` on both halves, inventory records whose data reaches the bus through whatever runs code nearby, usually the VMS, a site gateway, or a rule polling the vendor's API. The row is the same shape either way, so the day something can speak for itself you attach identities to the record you already have.

The same goes for equipment that already reports to a vendor's cloud. Rule-router takes that cloud's webhooks and polls its API on a schedule, so its events land on the tenant's bus next to everything else, and one rule can act on both. You keep the vendor's cloud; you lose the silo.

The same idea one level up: creating an Organization provisions its NATS account and its own private Nebula CA, and one organization's CA can't sign a certificate another organization trusts. Suspending the organization withdraws the account and drops every device and browser in that tenant off the hub. The tenant boundary is a signature rather than a filter somebody has to remember to apply.

The agent on a box like that one never gets a credential file copied to it. It signs in as its own Thing, pulls its `.creds`, and re-checks every 24 hours, so hitting Regenerate in the console reaches the fleet without a site visit.

### Adopt one depth at a time

The platform is built in layers, and each layer is a complete working system by itself. You can stop at any of them:

1. A multi-tenant inventory. Things, Locations, types, a REST API, a console, floor plans and maps. No messaging, no mesh.
2. Identities. Organizations get NATS accounts and Nebula CAs, Things get users and host certs, and you write your own consumers.
3. A contract layer. Thing Types declare a subject prefix, and their operations declare a capability and a suffix, so another team can work out a device's subjects from the records themselves.
4. Everything that consumes the bus: rule-router, the agent, a stream processor, Telegraf into whatever TSDB you like.

Each depth keeps the records from the one before, so adding the next one rewrites nothing. The inventory row you create on day one is the same row that later gains identities, contracts and consumers. Most deployments settle at 2 or 3, and the ones that go further get there a layer at a time.

This is for you if you run equipment across more than one site or more than one customer, you want the inventory and the credentials to be the same thing, and you'd rather own the box that holds them. If you have a handful of devices in one building, it's more machinery than your problem needs. And if what you want on day one is a device shadow, OTA campaign management and a certified module ecosystem, a hyperscaler has those and we don't.

### The parts underneath

Nothing here is forked and nothing is a protocol we invented.

PocketBase is what the control plane is built on: identity, inventory, SQLite, REST, admin UI, one binary. Nebula is the connectivity layer, peer to peer with NAT traversal and outbound-only connections, so no port opens on a customer network.

NATS is the bus, and it carries more than that word suggests. Pub/sub and request/reply, native MQTT for devices that speak nothing else, JetStream for anything that has to survive a restart, KV and object buckets, a microservice framework in the clients with discovery and stats built in, and leaf nodes so a site keeps running when the WAN drops. A broker, a cache, a job queue and a service registry collapse into one binary you can run on a Raspberry Pi. That's why we build on NATS rather than on a broker and three other things we'd also have to run.

What we've built on top is the glue holding everything together: the console; [rule-router](https://www.816tech.com/blog/rule-router-six-months-later) for the YAML automation across NATS, HTTP and cron; the `stone` CLI for pulling a tenant's records into YAML you can diff and apply from CI; and the agent, which is how any of this reaches edge hardware. It's a service on Linux, Windows or FreeBSD that can run the device's Nebula host in process and, on a site gateway, host the leaf node too.

![Terminal recording of the stone CLI: switching to a tenant, listing things, a live NATS subscription, a KV read, and pulling the tenant to YAML](/images/blog/stone-cli.gif)

*The `stone` CLI against the demo: switch tenant, list things, watch live telemetry, read a twin value from KV, pull the tenant to YAML. The telemetry is sped up.*

Everything else plugs into the same subjects: Telegraf for long-term storage, eKuiper, Benthos or Wombat for windowed aggregation, or a model of your choosing, since inference is just another client with a credential. We'd rather point at those than write worse versions of them.

### Credit where it's due

NATS is [Synadia's](https://synadia.com) work, and the reason any of this was possible is that they made something this complete and made it open source. They also sell the managed answer: Synadia Cloud runs the bus for you, and Synadia Platform's Control Plane manages accounts and clusters at a scale we aren't pretending to serve. If your problem is operating NATS well, start there.

The same goes for the other half. Nebula came out of Slack and is now developed by [Defined Networking](https://defined.net), founded by the people who wrote it. They sell Managed Nebula, which runs the control plane and the enrollment for you, lighthouses included if you want them managed. If you want someone else operating your overlay, ask them. We generate Nebula config because the same record that mints a NATS user should mint the host certificate, not because the world needed another CA.

Both of those products answer the question of running these things well. Ours is the provisioning question: where credentials come from, and which inventory they belong to.

### The trade-offs we're making

This isn't fewer moving parts. At full depth you're running a control plane, a broker, an overlay network, an agent per site, a rule engine, a stream processor and a TSDB. Most deployments run a fraction of that, and the first three get you through depth 2. The honest claim is narrower: where the tenant boundary lives, and how easily you can walk away. Your data is in SQLite, your messages are on NATS, your history is in a time series database you picked. To leave, keep what you want and stop running the control plane.

The control plane also holds keys, and we expect grief for it. It has the NATS operator key and every organization's Nebula CA private key, because the thing that mints identities has to hold the key that signs them. Those minting keys can be encrypted at rest with `nats.encryption_key` and `nebula.encryption_key`, both of which default to empty for simplicity's sake, so set them before you create real data. What they cover is the material that mints identities, not the credentials already issued: a `.creds` file holds the user seed, and a Nebula host config holds its key inline, because that's where Nebula needs it. Either way, a control plane backup is as sensitive as the live database. Moving the signing operations behind a KMS is a longer-term idea and not something we've done yet. If you want the keys on a machine you own in the meantime, that's the self-hosted install, and it's the free one.

### Running it

Download `stone-age` for your architecture from the [releases page](https://github.com/stone-age-io/platform/releases), then run these in order:

```bash
./stone-age superuser upsert admin@example.com 'change-me-8-chars-min'
./stone-age migrate up
./stone-age bootstrap --email admin@example.com --org "System" --operator-org "Acme MSP"
./stone-age nats export --output ./nats-config/
./stone-age serve --nats
```

That's the control plane and the bus in one process, with the console at `http://localhost:8090`. The order matters: `bootstrap` writes fields that `migrate up` creates, and `nats export` needs the data `bootstrap` seeds.

Then, against a throwaway database:

```bash
./stone-age demo-seed --confirm
```

That builds three tenants, a type taxonomy, locations on a real map, a fleet of things and gateways, NATS roles, signed identities and a Nebula network with a lighthouse. It runs in-process through the same provisioning hooks the console and the API use, so what you get is what you'd have built by hand. Run it again and it tops up rather than duplicating, because it finds every record by its per-organization `code`.

The seed writes records, not traffic, so dashboards stay empty until something publishes. The rule-router files in [`demo/rules/`](https://github.com/stone-age-io/platform/tree/main/demo/rules) put live telemetry on the seeded subjects. Run one rule-router per organization, pointed at that organization's folder: each tenant is its own NATS account, so one process can't publish for all three.

![A cold-chain dashboard in the demo console with live freezer temperatures, reefer gauges, a site map and shipment events](/images/blog/stone-age-cold-chain-dashboard.png)

*One of the seeded tenants, a cold-chain distributor, with the demo rules running. The dashboard is ours, built in the console on top of the seed; the readings are live.*

There's a single container that does all of this on first boot if you'd rather not run the steps yourself. The [docs](https://docs.stone-age.io/doc/platform/getting-started) have it.

It's early, and we'd rather hear where it breaks than have it starred. If you run NATS in production and think we've got the account provisioning wrong, that's the feedback we want most.

If you'd rather see it running before you install anything, [ask us for a read-only login](mailto:info@stone-age.io?subject=Demo%20access) to the demo. And if you'd rather not run it at all, [we host it too](https://stone-age.io/#pricing).

* Platform: [github.com/stone-age-io/platform](https://github.com/stone-age-io/platform)
* Agent: [github.com/stone-age-io/agent](https://github.com/stone-age-io/agent)
* Rule engine: [github.com/skeeeon/rule-router](https://github.com/skeeeon/rule-router)
* CLI: [github.com/stone-age-io/stone-cli](https://github.com/stone-age-io/stone-cli)
* Docs: [docs.stone-age.io](https://docs.stone-age.io)
