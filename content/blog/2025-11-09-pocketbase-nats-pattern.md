---
title: "Pocketbase + NATS = A Pattern For Success"
date: "2025-11-09"
author: "Brian Miller"
slug: "pocketbase-nats-pattern"
excerpt: "Using PocketBase as a Multi-Tenant Control Plane for NATS"
tags: ["nats", "pocketbase", "golang"]
image: "/images/blog/pb-plus-nats.jpeg"
imageAlt: "PocketBase Logo and NATS Logo"
---
![PocketBase Plus NATS](/images/blog/pb-plus-nats.jpeg)

It's no surprise we think NATS is a phenomenal data plane. It's the simple, high-performance nervous system we've always wanted for our distributed systems. But once you move beyond a handful of services, a critical question emerges: **Where does the configuration live?**

How do you manage users, tenants, and things? How do you handle authentication and permissions dynamically, without restarting servers or manually distributing config files? How do you build a multi-tenant SaaS on top of this powerful but unopinionated data plane?

You need a control plane.

The modern developer has a wealth of "backend-in-a-box" solutions to choose from. Platforms like Supabase, Firebase, and Appwrite offer fantastic, integrated experiences with databases, authentication, and serverless functions. They are excellent for building web and mobile applications. However, they are often HTTP-centric and not purpose-built to act as a dynamic, real-time controller for a separate, high-performance messaging system like NATS.

On the other end of the spectrum are "big brain" solutions. You could build a fleet of microservices on Kubernetes, backed by a distributed PostgreSQL cluster, with a separate identity provider. This is powerful, but it's also immensely complex. It's the kind of complexity that Grug warns us about, the kind that slows down development and requires a dedicated team to manage.

We believe there's a simpler, more pragmatic way. In this post, we'll introduce the architectural pattern that powers our open-source IoT platform: a Grug-brained control plane built with **PocketBase**, bridged seamlessly to the NATS data plane.

### Decoupling the Control and Data Planes

The core of our architecture is a classic, robust design: a clean separation between the system's brain (the control plane) and its nervous system (the data plane).

![PocketBase NATS Diagram](/images/blog/pb-nats-diagram.png)

*   **The Control Plane** is the single source of truth. It's where you manage your business logic: who your tenants are, which users belong to them, what things they own, and what their permissions are. It's an HTTP-based API that is optimized for consistency and ease of management.
*   **The Data Plane** is the high-performance messaging layer. It's responsible for moving tens of thousands of events per second with low latency and high resilience.

This decoupled design is incredibly resilient. The data plane can continue to operate at full speed even if the control plane is down for maintenance.

### Why PocketBase

For our control plane, we chose PocketBase, and it's one of the most Grug-brained decisions we've made. Here's why:

1.  **Radical Simplicity:** PocketBase is a single Go binary with an embedded SQLite database. There are no external dependencies. You run one file, and you have a complete backend with an Admin UI, a REST API, and real-time subscriptions. The operational overhead is virtually zero.
2.  **Blazing Performance:** Don't let "SQLite" fool you. For the write-infrequent, read-heavy workload of a control plane, it is incredibly fast. With Go on the backend, API responses are measured in microseconds.
3.  **Good Enough for Most:** While it's not a globally distributed, multi-region database, it is more than capable of managing the configuration for thousands of tenants and millions of devices. It's the 80/20 solution that works for the vast majority of use cases without the complexity of a traditional database cluster.
4.  **Extensible with Go:** You can use PocketBase as a framework and extend it with your own Go code, which is exactly what we did to build our custom libraries.

### Manage NATS Authentication - pb-nats

This is the magic that ties the two planes together. While NATS has an excellent, native CLI tool `nsc` that can manage the operator/account/user hierarchy, this doesn't always work for a dynamic, multi-tenant SaaS where users are signing up and changing permissions regularly.

Our `pb-nats` library solves this problem. It's a Go library that hooks directly into PocketBase and acts as a real-time NATS authentication controller similar to `nsc`.

**Here's how it works:**
1.  An administrator creates a new `nats_account` record in PocketBase.
2.  A PocketBase hook fires, triggering `pb-nats`.
3.  `pb-nats` generates a new NATS account JWT, signed by the operator key (which is also stored securely in a separate PocketBase collection).
4.  `pb-nats` then publishes this new JWT directly to the NATS server's system account (`$SYS.REQ.CLAIMS.UPDATE`), which instantly loads the new account.
5.  When a `nats_user` is added to that account in PocketBase, the same process happens: a user JWT is generated, signed by the new account key, and pushed to NATS.

The result is a fully dynamic authentication system where the NATS server itself requires only a minimal, static configuration to point to its operator JWT and system account. All subsequent account and user management happens in real-time, driven by your application's database. PocketBase becomes the central control for the entire NATS security topology. This is the "narrow interface" Grug talks about, hiding the immense complexity of JWT management behind simple database records.

### Enhancing PocketBase - pb-tenancy and pb-audit 

To build a real product, you need more than just auth. We've also open-sourced the foundational libraries we built on PocketBase:

*   **`pb-tenancy`:** A minimal, self-contained library that adds organization-based multi-tenancy. It handles creating organizations, managing memberships, and a secure email-based invitation system.
*   **`pb-audit`:** A production-ready audit logging system. It automatically captures the before-and-after state of every database change, user login, and API request, providing the compliance and security trail that any serious application needs.

These libraries provide the essential, non-negotiable features for a SaaS product, allowing developers to focus on their core business logic.

### Managing the Control Plane with pb-cli

A powerful platform is only as good as the tools you have to manage it. Grug loves good tools because they do the thinking for him. In that spirit, we built `pb-cli`, a command-line interface designed for the day-to-day operations of a PocketBase-driven control plane.

While our libraries create the foundation, `pb-cli` is the tool you'll use to interact with it. It's a generic, multi-environment CLI that can manage *any* PocketBase instance, providing:

*   Full CRUD operations on any collection.
*   Multi-environment context switching (dev, staging, prod).
*   Complete backup and restore management.
*   Scriptable output (JSON, YAML, table) for automation.

By providing a powerful, scriptable CLI, we embrace the "infrastructure as code" philosophy. Your entire platform from tenant creation to nightly backups can be automated and version-controlled, keeping the complexity demon at bay.

### Considering the Alternatives

*   **The DIY Approach:** You could absolutely build this yourself with a framework like Gin or Echo, backed by PostgreSQL. But you would spend months writing the code to manage users, tenants, invites, and audit logs. You would then have to write a custom service to generate and manage NATS JWTs. We've already done that plumbing so you can get back to building features.

*   **Synadia Cloud:** We absolutely love Synadia, they're the main team behind NATS. They offer a fantastic, fully-managed commercial product called Synadia Cloud and Synadia Platform which has supporting products like Control-Plane. For many enterprises, choosing a Synadia option is the correct choice and an excellent one at that.

Our platform offers a compelling alternative for those who value simplicity. By leveraging PocketBase, our control plane is arguably simpler to manage and extend for application-specific logic than a generic, all-purpose control plane.

### Pragmatic Pattern for the Modern Web

The "PocketBase + NATS" pattern, bridged by `pb-nats`, is a powerful, pragmatic, and Grug-brained approach to building modern, real-time applications. It provides the best of both worlds: a simple, fast, and easy-to-manage control plane, and a high-performance, resilient data plane.

By building on this foundation, our `rule-router` and `http-gateway` become more than just tools—they become the workhorses of a complete, manageable, and scalable platform.

We invite you to explore the libraries and see how this pattern can simplify your own distributed systems.

*   **NATS Management:** [github.com/skeeeon/pb-nats](https://github.com/skeeeon/pb-nats)
*   **Multi-Tenancy:** [github.com/skeeeon/pb-tenancy](https://github.com/skeeeon/pb-tenancy)
*   **Audit Logging:** [github.com/skeeeon/pb-audit](https://github.com/skeeeon/pb-audit)
*   **CLI:** [github.com/skeeeon/pb-cli](https://github.com/skeeeon/pb-cli)
