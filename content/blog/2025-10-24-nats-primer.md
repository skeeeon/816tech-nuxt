---
title: "What is Nats? A Simple Primer on High-Performance Messaging"
date: "2025-10-24"
author: "Brian Miller"
slug: "nats-primer"
excerpt: "Connective Technology for Adaptive Edge & Distributed Systems"
tags: ["nats", "golang", "event-driven"]
image: "/images/blog/nats.jpg"
imageAlt: "NATS.io"
---
![Nats.io](/images/blog/nats.jpg)

Why is it so hard to connect two services?

We build decoupled microservices, but then spend all our time writing the glue to couple them back together. Service A needs to fire a webhook to Service B. Service C needs to poll a REST endpoint on Service D.

Before you know it, you’re not a feature developer; you’re a full-time plumber. You're managing retry logic, handling network failures, and trying to figure out why a "simple" notification failed to send. This isn't just technical debt; it's a tax on every new feature you build.

NATS is a tool built to alleviate that tax. It’s a simple, high-performance messaging system. Think of it less like a massive enterprise service bus and more like a dial tone for your applications. It's the central nervous system that connects all your services, and it *just works*.

---

### The Core Idea: Publish-Subscribe

At its heart, NATS is built on a dead-simple model: **Publish-Subscribe (Pub/Sub)**.

Instead of your services knowing about each other directly—creating a tangled web of dependencies—they just know about NATS.

1.  **Subjects:** You don't pre-define complex "topics" or "queues." You just have **subjects**. A subject is just a string, usually with dots as separators. For example: `orders.shipped` or `users.signed_up`.
2.  **Publish:** A service (a "publisher") sends a message to a subject. It doesn't know who's listening. It doesn't care. It just fires its message at the subject and moves on.
3.  **Subscribe:** Other services ("subscribers") tell NATS they are interested in one or more subjects. One service might listen to `users.signed_up`. Another might listen to `orders.shipped`.

That's it. A publisher sends a message to `users.signed_up`, and *all* active subscribers on that subject get the message instantly. The services are completely decoupled.

This model is powerful because it's simple. You can even use wildcards:
* Listen to `orders.*` to get all messages like `orders.shipped`, `orders.created`, and `orders.cancelled`.
* Listen to `users.>` to get all messages that *start* with `users.`, no matter how many more parts, like `users.profile.updated.avatar`.

---

### Why Not Just Use HTTP?

This is where the NATS philosophy shines.

* **It's Blazing Fast.** NATS is written in Go and is obsessed with performance. It's a tiny, single binary that adds almost no latency. It's designed to move millions of small messages per second.
* **It's Radically Simple.** The protocol is simple. The client APIs are small and intuitive. You and your team can be productive in minutes, not weeks.
* **It's Resilient.** NATS clients are designed to be "always on." If a connection to the server drops, the client will just keep trying to reconnect. It’s built to be the reliable, connective tissue for modern distributed systems.

---

### But What If I Can't "Fire and Forget"?

"Fire and forget" is great, but what if a service is down? What if I *need* that message to be delivered? What about persistence?

This is where **NATS Jetstream** comes in.

Jetstream is the persistence layer built right into NATS, and it’s just as simple. You can tell NATS: "Hey, for any message sent to `orders.>`, I want you to capture it."

* **Streams:** This creates a **Stream**, which is just a durable, persistent log of all those `orders` messages.
* **Consumers:** Services can then create **Consumers** to read from that Stream. A consumer keeps track of which messages it has processed. If your service goes down for an hour, it just reconnects, asks the consumer for any messages it missed, and catches up. No data is lost.

Jetstream gives you all the power of a "real" message queue—persistence, message replay, at-least-once delivery—without the crushing complexity.

---

### What Else Can Jetstream Do? (KV & Object Stores)

Because Jetstream is so good at persistently storing data in a log, NATS uses it as the engine for even more powerful, familiar features.

* **NATS KV (Key-Value Store):**
    This is exactly what it sounds like: a simple key-value store, like a `dict` in Python or a `Map` in Go. You can `put` a value for a key, `get` a key's value, or `delete` a key. But under the hood, it's just a Jetstream stream. When you "update" a key, NATS simply appends the new value to the stream and marks it as the "latest." This gives you a powerful bonus: you can "watch" a key for changes (it's just a subscription!) or even look at the entire history of a key's values.

* **NATS Object Store:**
    This is a simple S3-like blob store. It's designed for storing larger files—megabytes, gigabytes, etc. And just like KV, it's built directly on Jetstream. It cleverly chunks up large files into smaller pieces and stores them in a stream, reassembling them when you `get` the object. It's a simple, effective way to store and retrieve files, all using the same NATS infrastructure you already have.

Both of these tools are built *from* the core primitives of NATS. You get a KV store and an object store without needing to add a new database, a new S3 subscription, or any new moving parts. It's all just NATS.

---

### Focus on What Matters

We spend too much time on plumbing. We write custom retry logic, build our own fan-out services, and debug complex network configurations.

NATS is a tool that solves a specific problem incredibly well: letting your services talk to each other. It's simple enough to run on your laptop, but powerful enough to scale to a global platform.

It gets out of your way so you can get back to writing the code that actually matters.

