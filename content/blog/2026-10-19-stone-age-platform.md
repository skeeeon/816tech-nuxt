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

Last November we [wrote up the PocketBase + NATS pattern](https://www.816tech.com/blog/pocketbase-nats-pattern): use PocketBase as a control plane, use `pb-nats` to mint NATS account and user JWTs from database records, and push the account claims over `$SYS.REQ.CLAIMS.UPDATE` so nothing restarts. User JWTs are signed by the account and presented by the client, so they never need pushing at all. That post ended by saying the libraries were the foundation of a platform we were building.

That platform is [Stone-Age.io](https://stone-age.io), and it's MIT licensed. This post is what it turned into and where we think it fits.

### A second job to learn

Every time we've looked hard at a hyperscaler's IoT offering, it has read like a second job: a device registry, shadows or twins, a rules engine, policies, an edge runtime, a credential provider, and the cloud's own IAM model holding it all together. They're well built, and plenty of people run on them happily. The cost is a vocabulary that applies nowhere else, and a dependency you don't get a vote in. One of the big three retired its IoT service outright and gave customers about a year to move; another has carried two or three overlapping products long enough that picking between them is its own project.

The bet we're making is that if you already know NATS subjects, JSON payloads and JWT identity, you know most of what this platform asks of you. That's a conditional and not a free lunch, and what you learn here transfers to anything else you build on NATS.

That list stays short because NATS covers most of what an application needs by itself. Pub/sub and request/reply, native MQTT for devices that speak nothing else, JetStream for anything that has to survive a restart, KV and object buckets, a micro service framework in the clients with discovery and stats in it, and leaf nodes so a site keeps running when the WAN drops. A broker, a cache, a job queue and a service registry collapse into one binary you can run on a Raspberry Pi.

### Accounts carry more than permissions

An account is usually introduced as a permission boundary, and it is one, but the subject space inside it is complete and, with JetStream turned on, so is the storage: streams, consumers, KV and object buckets, all scoped to the account and reachable from outside only through an export you create. Two tenants can both publish on `telemetry.>` and neither sees the other's traffic, with no prefix convention for anyone to enforce.

Provisioning a tenant hands over that whole namespace, and durability comes with it. Their telemetry replays from a stream nobody else can bind to, their device state sits in a KV bucket another account can't reach even if it uses the same name, and their consumers track their own position. At the edge, a site's leaf node mirrors that bucket down so the site keeps answering through a WAN outage. Where a broker has no tenant namespace of its own, this is plumbing you write yourself and defend in code review.

What NATS deliberately leaves open is where the credentials come from. `nsc` manages the operator, account and user hierarchy well when that hierarchy is reasonably static, and less well when tenants and devices are being created, rotated and revoked all day. The same gap exists for Nebula certificates. Filling both from one place is what the control plane is for: a developer asks an API for a credential instead of asking a person for a file, and the broker and the overlay network stop drifting apart because the same record provisions both.

### Inventory as identity

The idea the whole platform hangs off: the record for a thing and the credentials that thing uses are the same record.

In most stacks you have an asset inventory in one system, a device registry in another, a certificate in a third, and a job somewhere keeping them in sync. Here, the VMS at a site, or the VPS running a Salesforce sync, is one row in a `things` collection. That row is an auth record, and it holds a NATS user and a Nebula host certificate. Creating it mints both:

```bash
curl -X POST http://localhost:8090/api/org/things \
  -H "Authorization: $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"HQ Video Server","code":"vms-hq","location":"'"$LOC_ID"'",
       "nats":{"mode":"auto"},"nebula":{"mode":"auto"}}'
```

One request, one transaction, and that box exists as an inventory entry, a login, a messaging identity and a mesh node at once. There is no second registry to reconcile against.

Most equipment can't hold an identity of its own and shouldn't have to. A camera, a door on a vendor's panel, a power meter: those are rows with `"mode":"none"` on both halves, inventory records whose data reaches the bus through whatever runs code nearby, usually the VMS, a site gateway, or a rule polling the vendor's API. The row is the same shape either way, so the day something can speak for itself you attach identities to the record you already have.

The same idea one level up: creating an Organization provisions its NATS account and its own private Nebula CA, and one organization's CA can't sign a certificate another organization trusts. Suspending the organization withdraws the account and drops every device and browser in that tenant off the hub. The tenant boundary is a signature rather than a filter somebody has to remember to apply.

The agent that runs on that box never gets a credential file copied to it. It signs in as its own Thing, pulls its `.creds`, and re-checks every 24 hours, so hitting Regenerate in the console reaches the fleet without a site visit.

### Adopt one depth at a time

The platform is built in layers, and each layer is a complete working system by itself. There are four, and you can run at any of them:

1. A multi-tenant inventory. Things, Locations, types, a REST API, a console, floor plans and maps. No messaging, no mesh.
2. Identities. Organizations get NATS accounts and Nebula CAs, Things get users and host certs, and you write your own consumers.
3. A contract layer. Thing Types declare a subject prefix, and their operations declare a capability and a suffix, so another team can work out a device's subjects from the records themselves.
4. Everything that consumes the bus: rule-router, the agent, a stream processor, Telegraf into whatever TSDB you like.

Each depth keeps the records from the one before, so adding the next one rewrites nothing. The inventory row you create on day one is the same row that gains identities, contracts and consumers. Most deployments settle at 2 or 3, and the ones that go further get there a layer at a time.

### The parts underneath

Nothing here is forked and nothing is a protocol we invented.

PocketBase is what the control plane is built on: identity, inventory, SQLite, REST, admin UI, one binary. NATS is the bus. Nebula is the connectivity layer, peer to peer with NAT traversal and outbound-only connections, so no port opens on a customer network.

Ours is the console, [rule-router](https://www.816tech.com/blog/rule-router-six-months-later) for the YAML automation across NATS, HTTP and cron, the `stone` CLI for pulling a tenant's records into YAML you can diff and apply from CI, and the agent, which is how any of this reaches hardware: a service on Linux, Windows or FreeBSD that can run the device's Nebula host in process and, on a site gateway, host the leaf node too.

Everything else plugs into the same subjects: Telegraf for long-term storage, eKuiper or Wombat for windowed aggregation, an inference service if you want one, since a model is just another client with a credential. We'd rather point at those than write worse versions of them.

### Credit where it's due

NATS is Synadia's work, and the reason any of this was buildable is that they made something this complete and gave it away. They also sell the managed answer: Synadia Cloud runs the bus for you, and Synadia Platform's Control Plane manages accounts and clusters at a scale we aren't pretending to serve. If your problem is operating NATS well, start there.

The same goes for the other half. Nebula came out of Slack and is now developed by Defined Networking, founded by the people who wrote it. They sell Managed Nebula, which runs the control plane, the lighthouses and the enrollment for you. If you want someone else operating your overlay, ask them. We generate Nebula config because the same record that mints a NATS user should mint the host certificate, not because the world needed another CA.

Both of those products answer the question of running these things well. Ours is the provisioning question, and the inventory the credentials belong to.

### The trade-offs we're making

If someone else were pitching this to us, here's what we'd want them to say out loud.

It isn't fewer moving parts. With every layer running you have a control plane, a broker, an overlay network, an agent per site, a rule engine, a stream processor, a metrics agent and a TSDB. That's eight component types, and the honest claim is narrower: where the tenant boundary lives, and how easily you can walk away. Your data is in SQLite, your messages are on NATS, your history is in a database you picked. To leave, keep those three and stop running the control plane.

And the control plane holds keys. It has the NATS operator key and every organization's Nebula CA private key, because the thing that mints identities has to hold the key that signs them. Those minting keys can be encrypted at rest with `nats.encryption_key` and `nebula.encryption_key`, both of which default to empty, so set them before you create real data. The credentials already issued from them stay plaintext by construction, which makes a control plane backup as sensitive as the live database. Moving the signing operations behind a KMS is a longer-term idea and not something we've done. If you want the keys on a machine you own in the meantime, that's the self-hosted install, and it's the free one.

### Running it

One container, which seeds itself and runs the bus in the same process:

```bash
docker run -d --name stone-age \
  -p 8090:8090 -p 4222:4222 -p 9222:9222 \
  -v stone-age-data:/data \
  -e STONE_AGE_BOOTSTRAP_PASSWORD='change-me-8-chars-min' \
  -e STONE_AGE_NATS_WEBSOCKET_URLS='ws://localhost:9222' \
  ghcr.io/stone-age-io/platform:latest
```

Then, against a throwaway database, `./stone-age demo-seed --confirm` builds three tenants with locations on a real map, a fleet of things and gateways, NATS roles, signed identities and a Nebula network with a lighthouse. It runs through the same provisioning hooks the console uses, so what you get is what you'd have built by hand.

It's early, and we'd rather hear where it breaks than have it starred. If you run NATS in production and think we've got the account provisioning wrong, that's the feedback we want most.

* Platform: [github.com/stone-age-io/platform](https://github.com/stone-age-io/platform)
* Agent: [github.com/stone-age-io/agent](https://github.com/stone-age-io/agent)
* Rule engine: [github.com/skeeeon/rule-router](https://github.com/skeeeon/rule-router)
* CLI: [github.com/stone-age-io/stone-cli](https://github.com/stone-age-io/stone-cli)
* Docs: [docs.stone-age.io](https://docs.stone-age.io)
