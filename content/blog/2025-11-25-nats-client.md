---
title: "NATS Web Client: Sometimes You Just Want to Click Buttons"
date: "2025-11-25"
author: "Brian Miller"
slug: "nats-web-client"
excerpt: "A browser-based NATS client that does exactly what it says on the label"
tags: ["nats", "javascript", "devtools"]
image: "/images/blog/nats.jpg"
imageAlt: "NATS Logo with browser window"
---
![NATS Web Client](/images/blog/nats.jpg)

You're debugging a distributed system. You need to check if messages are flowing on a specific subject. Maybe you need to peek at some keys in a JetStream KV bucket. Perhaps you want to inspect what's actually stored in that stream that's been causing issues all morning.

You could reach for the NATS CLI. It's powerful, it's complete, and it requires remembering the exact flags for `nats pub`, `nats sub`, `nats kv get`, and about thirty other commands. But sometimes you want to open a browser tab and click some buttons.

### Tools Don't Match the Task

The NATS ecosystem has excellent tools. The CLI is comprehensive and scriptable. But there's a gap between "I need to quickly check something" and "I need to install software" or "I need to remember command syntax."

This gap gets wider in certain scenarios:
- You're on a locked-down corporate machine where you can't install anything
- You're doing a live demo and want to show real-time message flow
- You're onboarding a new developer who's learning NATS concepts
- You just want to see your data without opening a terminal

The modern web has solved this problem for databases (phpMyAdmin, Adminer) and for APIs (Postman, Insomnia). NATS deserved the same treatment.

### Just a Web Page

We built a NATS client that runs entirely in your browser. No backend, no installation, no configuration files. Just open it, point it at your NATS server's WebSocket port, and start clicking.

The entire thing is built with vanilla JavaScript, standard CSS, and Vite for bundling. That's it. No React, no Vue, no TypeScript, no build system complexity.

**Here's what you get:**

**1. Pub/Sub That Just Works**
- Click a subscription, it appears in the publish field
- `Ctrl+Enter` to send (because typing is faster than clicking)
- Real-time message log with JSON syntax highlighting
- Pause the log when things get chatty
- Filter messages as they stream in

**2. Request/Reply**
- Same interface as publish, just click "Req" instead
- Configurable timeouts
- Clear visual distinction between messages and replies

**3. JetStream KV Store Management**
- Create and edit buckets through a JSON config modal
- **Live watching**: The key list updates in real-time when any client adds or deletes keys
- Full revision history for every key
- View mode with syntax highlighting or edit mode for changes
- One-click copy for values

**4. JetStream Stream Management**
- List, create, edit, and delete streams
- View consumer details (pending counts, durable vs ephemeral)
- Fetch specific message ranges from streams (e.g., "show me messages 1000-1050")
- Inspect raw message data with timestamps and subjects

### Architecture

The codebase is organized simply:

```
dom.js         → Where buttons live (the map)
ui.js          → How to paint the screen (the painter)
main.js        → What to do when button pressed (the brain)
nats-client.js → How to talk to NATS (the engine)
utils.js       → Helper functions (the tools)
storage.js     → Remember things (the memory)
```

No clever abstractions. No "separation of concerns" taken to eleven layers. Just files that do one thing and do it well.

The NATS client wrapper has *zero* UI dependencies. The UI module has *zero* NATS logic. `main.js` just connects them. This is simple, straightforward architecture.

### The Technical Details

**WebSocket Connection**
Browsers can't speak the NATS TCP protocol, so you need to enable WebSockets on your NATS server:

```conf
websocket {
    port: 9222
    no_tls: true
}

jetstream {
    store_dir: './data'
}
```

That's the entire server-side requirement. The client handles the rest. In production though, make sure you properly configure TLS.

**Authentication**
We support user/password, token auth, and even `.creds` files (JWT/NKey). The credentials never leave your browser, they're used directly to authenticate the WebSocket connection.

**Real-Time Updates**
The KV watcher uses NATS's native watch API. When you open a bucket, we subscribe to key change events. Other clients can add or delete keys, and your list updates instantly. This isn't polling; this is the data plane doing what it does best.

**Performance Choices**
- Message log auto-prunes to 200 visible entries (prevents DOM bloat)
- JSON syntax highlighting disabled for payloads over 20KB (prevents browser lockup)
- Parallel fetching for stream messages (efficient without being clever)

These aren't premature optimizations, they're lessons learned from watching the tool slow down in real usage.

### What This Tool Is NOT

Let's be honest about scope, because we appreciate honesty:

- **Not a production monitoring tool**: Use Prometheus and Grafana for that
- **Not a complete admin interface**: Use the CLI for complex operations
- **Not a data pipeline**: Use your actual application code for that

This is a **debugging tool**. It's a **learning tool**. It's a **"I need to check something real quick"** tool.

### Considering the Alternatives

**NATS CLI:** More powerful, requires installation, command-line interface. Perfect for scripting and automation. Less visual, steeper learning curve.

**nui-app:** A full-featured desktop application with native NATS protocol support (no WebSocket requirement). More capabilities, better for power users. It's the inspiration for us building this.

**Custom Scripts:** Maximum flexibility. Time-consuming to write. Not reusable across projects.

**Our Web Client:** Zero installation. Visual. Good enough for 80% of debugging scenarios. Trade-off: limited to what a browser can do.

Different tools for different jobs. We're the screwdriver, not the power drill.

### The Mobile Surprise

We didn't set out to build a mobile-friendly tool, but during testing we opened it on an iPad and almost everything just worked. So we fixed the obvious problems: font sizes that prevent iOS zoom, touch-friendly button sizes, responsive layout that works in portrait mode. It's not an "app," but it's usable on a phone or tablet in a pinch. 

### The Right Tool for the Job

The NATS Web Client isn't trying to be everything. It's trying to be the tool you reach for when you need to quickly check something, when you're demoing a concept, when you're learning NATS, or when you just want to see your data without typing commands.

It's built with the same Grug-brained philosophy as our other tools: solve the actual problem, don't add complexity, make it maintainable. The codebase is intentionally simple so you can hack on it. Fork it, modify it, make it yours.

Sometimes the best tool is the one that gets out of your way and lets you work.

**Try it out:**
- **Source Code:** [github.com/stone-age-io/nats-client](https://github.com/stone-age-io/nats-client)
- **Live Demo:** https://nc.stone-age.io

Now go debug something. Or just click buttons. We won't judge.
