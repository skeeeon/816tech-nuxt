---
title: "Building a Grug-Brained NATS Rule Engine in Go"
date: "2025-11-01"
author: "Brian Miller"
slug: "grug-brain-nats-rule-engine"
excerpt: "Complexity is bad"
tags: ["nats", "golang", "event-driven"]
image: "/images/blog/grug.jpg"
imageAlt: "Grug-brained developer trapping complexity"
---
![Alt text](/images/blog/grug.jpg "Optional title")

We've all been there. An access control platform from one vendor, a video platform from another, and a dozen third-party services that don't talk to each other.

This space between distributed services is where complexity thrives. It's where we write endless boilerplate for message validation, spin up microservices just for a simple webhook, and watch technical debt pile up. It's the essential but unglamorous work.

To fight this, we built a new open-source project: a high-performance NATS message router and bidirectional HTTP gateway, built in Go. More importantly, we built it with a clear and disciplined philosophy of simplicity.

### Keep It Simple

Our approach is heavily inspired by the "grug brained developer," an engineering mindset that champions simplicity and fights relentlessly against unnecessary complexity. (If you haven't read it, you should: https://grugbrain.dev/)

The core tenets are powerful:

1.  **Isolate Necessary Complexity:** You can't eliminate all complexity, especially when solving hard problems. The goal is to identify what is truly complex and contain it behind a simple, narrow interface.
2.  **Prioritize Locality of Behavior (LoB):** To understand a feature, you should be able to look in one place. Logic should be self-contained and easy to follow.
3.  **Build Focused, Powerful Tools:** Invest in tooling that solves a specific problem well. Good tools reduce cognitive load and prevent common errors.
4.  **Maintain a Clear, Focused Scope:** The best way to prevent a system from becoming a complex monolith is to be disciplined about what it *doesn't* do.

This philosophy isn't about being unsophisticated, it's about building systems that are simple, maintainable, and easy to reason about.

---

### Introducing the Rule Router & HTTP Gateway

Our project is a monorepo containing two applications built on a shared rule engine, designed to simplify connecting services in a NATS-based architecture.

1.  **`rule-router`**: A high-throughput NATS-to-NATS message router for internal, event-driven workflows. It filters, enriches, and routes messages between NATS subjects.
2.  **`http-gateway`**: A bidirectional bridge for integrating external systems. It ingests webhooks and publishes them to NATS, and it consumes NATS messages to trigger outbound API calls.

The goal is to empower developers to define complex message flows not with custom code, but with simple, declarative YAML.

### The Anatomy of a Rule

At the heart of the system is the "rule." This is where we contain complexity. All the difficult logic of parsing, evaluation, and templating is hidden behind this simple structure, which consists of three parts: a `trigger`, `conditions`, and an `action`.

Here's a practical example:

```yaml
# A rule to alert when a sensor's temperature exceeds a threshold
- trigger:
    # The "If": The rule starts when a message arrives on this subject
    nats:
      subject: "sensors.temperature.>"
  
  conditions:
    # The "When": This logic must pass for the action to run
    operator: and
    items:
      - field: "temperature"
        operator: "gt"
        value: 30
  
  action:
    # The "Then": This is what we do if the conditions are met
    nats:
      subject: "alerts.high_temp.{@subject.2}" # Use subject tokens for dynamic routing
      payload: |
        {
          "alert": "High temperature detected!",
          "temp": {temperature},
          "location": "{@subject.2}",
          "timestamp": "{@timestamp()}"
        }
```

This single block of YAML defines a complete, self-contained piece of business logic. It perfectly embodies the **Locality of Behavior** principle. To understand this workflow, you only need to read this one rule.

---

### Architectural Principles in Action

Our philosophy directly shaped key architectural decisions.

**1. Containing Complexity with a Declarative Core**
The most complex part of our codebase is the rule engine (`internal/rule`). It handles JSON traversal, context management (time, headers, subjects), KV store lookups with caching, and signature verification. This is *necessary complexity*. By building a capable engine, we ensure that the developers writing the rules have a radically simple experience. They write YAML, not Go.

**2. Purpose-Built Tooling for a Better Workflow**
A reliable system requires good tooling. The `rule-cli` is a standalone utility for creating, linting, scaffolding, and testing rules *offline*. This is critical for maintaining quality. It allows developers to validate their logic before deployment and integrate rule testing directly into their CI/CD pipelines, preventing errors in production.

**3. A Focused Scope: Saying 'No' to Feature Creep**
The `http-gateway` is a great example of maintaining a focused scope. You might ask:
*   **Does it handle TLS or rate-limiting?** No. A reverse proxy does that better in both scenarios. 
*	**Does it handle auth?** No. You can use simple header checks, but you're better off using an API gateway if you need something more powerful.
*   **Does it have a fancy UI?** No. It has declarative YAML files that live in git.

By focusing solely on its core competency (bridging HTTP and NATS) the application remains small, fast, and easy to manage. It uses the same rule syntax, evaluation logic, and actions as the `rule-router` so you have a consistent experience. 

---

### Powerful Features for Real-World Problems

A simple design doesn't mean a lack of power. The rule engine is packed with features designed to solve common, painful integration challenges.

#### Batch Processing with `forEach`

Third-party systems love sending events in batches. Instead of writing custom fan-out logic every time, you can use a `forEach` action.

```yaml
# Process a batch of security events, creating one alert per critical event
- trigger:
    nats:
      subject: "security.events.batch"
  action:
    nats:
      forEach: "events"  # Iterate over the "events" array in the message
      filter:            # Only process elements that match this condition
        operator: and
        items:
          - field: "status"
            operator: "eq"
            value: "critical"
      subject: "alerts.critical.{event_id}"
      payload: |
        {
          "event_id": "{event_id}",
          "batch_id": "{@msg.batch_id}" # Access root message with @msg
        }
```
This declarative approach is vastly simpler and less error-prone than writing the equivalent Go code.

#### KV Enrichment with a Local Cache

Events often need to be enriched with data from another source. Our engine can look up values from NATS KV stores and use them in both conditions and templates.

```yaml
# Check if a device is active before processing its data
- trigger:
    nats:
      subject: "sensors.data.{device_id}"
  conditions:
    operator: and
    items:
      # Look up the device's status from the 'device_status' KV bucket
      - field: "@kv.device_status.{device_id}:active"
        operator: "eq"
        value: true
  action:
    nats:
      subject: "processed.data.{device_id}"
      payload: |
        {
          "device_name": "{@kv.device_status.{device_id}:name}",
          "data": {data}
        }
```
To make this incredibly fast, the applications have an opt-in feature that maintains a local, in-memory mirror of the KV buckets, updated in real-time via Jetstream watch subscriptions. This gives us a significant performance boost over direct NATS lookups for every message, but it's optional to keep the default footprint minimal.

---

### Why We Built This (And How to Get Started)

We built this because we were tired of spending too much time on plumbing and not enough on results. Why not use CEL (Common Expression Language) or Go's text/template? Those tools are powerful, but they are, in effect, mini-scripting languages that add their own complexity. Why not just use an existing enterprise platform? We found they were often too heavyweight, too complex, and slow to get started with for a majority of our workload.

This project is our solution: a simple, performant tool that provides a pragmatic middle ground between writing dozens of microservices and adopting a monolithic integration platform. For us, it means shipping integrations in hours, not weeks, and focusing on building features that matter.

We've open-sourced the entire rule-router monorepo on GitHub. We'd love for you to check it out, open an issue, or contribute. Let us know what you think of this "grug-brained" approach to integration.

GitHub: https://github.com/skeeeon/rule-router

