---
title: "A Face Reader, a KV Bucket, and Some YAML Rules"
date: "2026-08-26"
author: "Brian Miller"
slug: "face-reader-access-control-rules"
excerpt: "An attribute-based authorization layer for facial recognition readers, declared in YAML instead of written in Go"
tags: ["nats", "access-control", "golang", "event-driven"]
image: "/images/blog/walks-into-bar.jpg"
imageAlt: "Cartoon illustration of a face reader, a key-value bucket, and two YAML scrolls walking into a bar called The Code & Cocktail"
---
![A face reader, a key-value bucket, and two YAML scrolls walk into a bar called The Code & Cocktail](/images/blog/walks-into-bar.webp)

The [iDFace Max](https://www.controlid.com.br/en/access-control/idface-max/) is Control iD's current face reader: two 1080p cameras, a 7" touchscreen, and room for 100,000 faces with liveness detection. Control iD is an ASSA ABLOY company, and the matching runs on [Paravision](https://www.paravision.ai/news/control-id-partners-with-paravision-to-launch-new-idface-max-access-control-system/) rather than an in-house algorithm, which is most of why we looked at it. Paravision places top five worldwide on NIST's 1:N visa-border benchmark. The part of this problem we have no business writing ourselves is handled by a company that does only that.

What made us buy one is how much of the device is reachable from outside it: a documented HTTP API, a notification stream you can point anywhere, and an [online identification mode](https://www.controlid.com.br/docs/access-api-en/operating-modes/online-identification-events/) that tells the reader to stop deciding things for itself. Someone stands in front of the camera, the device matches the face against its local template store, and then instead of deciding on its own it asks a server what to do. It POSTs the identification to an endpoint you control and blocks, holding the door, until it gets back a JSON verdict.

Whoever answers that call is the actual access control system. The reader is a camera with an opinion about who you are; the authorization logic lives on your side.

That server is normally a small application somebody writes and then maintains forever. We've written a few. This time we didn't, because [rule-router](https://github.com/skeeeon/rule-router) already had most of the pieces, and the two it was missing turned out to be small.

Everything below is specific to this reader. We haven't surveyed the field and won't pretend to. If your hardware has a callback mode that blocks on a response, the field names and the response shape will be different, but the arrangement should carry over.

### What the device sends

An identification arrives like this:

```
POST /new_user_identified.fcgi HTTP/1.1
Content-Type: application/x-www-form-urlencoded

device_id=9876&user_id=42&user_name=Neal+Caffrey&confidence=93
```

And the device sits there, holding the door closed, until it gets back something like:

```json
{"result": {"event": 7, "user_id": 42, "user_name": "Neal Caffrey",
            "user_image": false, "portal_id": 1,
            "actions": [{"action": "door", "parameters": "door=1"}]}}
```

Event 7 is access granted, event 6 is access denied, and `actions` is the list of relays to fire. The [return message format](https://www.controlid.com.br/docs/access-api-en/operating-modes/online-identification-events/#return-message) is fixed, and the whole exchange has to complete inside the device's timeout, which is short.

Two things here were outside what rule-router could do: the body is form-encoded rather than JSON, and some deployments want to distinguish doors by a query parameter on the callback URL. Both went in for 0.19.0. The form decoder was the one we argued about, because a rule engine that accepts every content type anyone asks for stops being a rule engine. The test we settled on: no configuration, and the same flat map of fields JSON produces. Form encoding passes. XML, multipart, and Protobuf don't.

A form field lands in a rule exactly like a JSON field. `{device_id}`, `{user_id}`, `{confidence}`. Values stay strings, always, because inferring types would turn a PIN of `007` into `7`. Comparisons coerce, so `gte: 85` still works against `"93"`.

### The rules that answer the door

Three rules on the same path, evaluated top to bottom.

```yaml
# 1. Audit: publish the granted identification to NATS.
- trigger:
    http:
      path: /new_user_identified.fcgi
      method: POST
  conditions:
    operator: and
    items:
      - field: "{@kv.access_users.{user_id}:active}"
        operator: eq
        value: true
  action:
    nats:
      subject: access.{device_id}.granted
      payload: |
        {
          "deviceId": "{device_id}",
          "userId": "{user_id}",
          "userName": "{user_name}",
          "confidence": "{confidence}",
          "at": "{@timestamp()}",
          "eventId": "{@uuid7()}"
        }

# 2. Grant. Must come before rule 3.
- trigger:
    http:
      path: /new_user_identified.fcgi
      method: POST
  conditions:
    operator: and
    items:
      - field: "{@kv.access_users.{user_id}:active}"
        operator: eq
        value: true
  action:
    respond:
      statusCode: 200
      headers:
        Content-Type: "application/json"
      payload: |
        {
          "result": {
            "event": 7,
            "user_id": {user_id},
            "user_name": "{user_name}",
            "user_image": false,
            "portal_id": 1,
            "actions": [
              {"action": "door", "parameters": "door=1"}
            ]
          }
        }

# 3. Deny. No conditions, so it always matches.
- trigger:
    http:
      path: /new_user_identified.fcgi
      method: POST
  action:
    respond:
      statusCode: 200
      headers:
        Content-Type: "application/json"
      payload: |
        {
          "result": {
            "event": 6,
            "user_id": {user_id},
            "user_name": "{user_name}",
            "user_image": false,
            "portal_id": 1,
            "actions": []
          }
        }
```

A few things here are load-bearing.

Rules 1 and 2 are separate because a rule has exactly one action. You can't publish to NATS and respond to the caller from the same rule, so the audit trail and the door decision are two rules with identical conditions. It looked redundant the first time we wrote it, and stopped looking that way once the two sets of conditions began to diverge.

Every matching rule on the path is evaluated, but only the first `respond` is written back. On a granted identification all three rules match and produce three actions; the caller gets event 7 because rule 2 got there first. Put the deny rule above the grant rule and every door in the building stops working, which the file order alone is enough to tell you.

The deny rule has no conditions on purpose. If the KV lookup misses, or the bucket is unreachable, or the face belongs to nobody in the system, the grant conditions evaluate false and the request falls through to event 6. Failure closes the door.

Leaving that rule out is worse than it looks. A request matching no rule returns 404, and this reader reads a 404 as a dead server and switches to contingency mode, authorizing locally against its own template store. A missing rule turns into an open door and doesn't announce itself. Any synchronous path that decides something needs to end in an unconditional fallback.

### The access list is a KV bucket

The condition every rule keys off is `{@kv.access_users.{user_id}:active}`. That reads key `42` out of the `access_users` bucket and pulls the `active` field out of its JSON value.

Revoking somebody is one command:

```bash
nats kv put access_users 42 '{"active": false, "name": "Neal Caffrey"}'
```

There's no reload, no deploy, no cache to wait out. The next identification at any reader in the fleet reads the new value. Whatever manages your users, an HR system or a PocketBase admin panel or a script, writes to that bucket, and the door layer picks it up on the next face.

### From a list of people to a set of conditions

Once the decision is a set of conditions rather than a single lookup, nothing stops you from adding more of them. The same grant rule with real policy on it:

```yaml
- trigger:
    http:
      path: /new_user_identified.fcgi
      method: POST
  conditions:
    operator: and
    items:
      # Employed and not suspended
      - field: "{@kv.access_users.{user_id}:active}"
        operator: eq
        value: true
      # Cleared for whichever area this reader guards
      - field: "{@kv.access_users.{user_id}:areas}"
        operator: contains
        value: "{@kv.devices.{device_id}:area}"
      # Clocked in for a shift
      - field: "{@kv.timeclock.{user_id}:status}"
        operator: eq
        value: "clocked_in"
      # Weak matches don't open doors
      - field: "{confidence}"
        operator: gte
        value: 85
      # Business hours, weekdays
      - field: "{@time.hour}"
        operator: gte
        value: 6
      - field: "{@time.hour}"
        operator: lt
        value: 18
      - field: "{@day.name}"
        operator: not_in
        value: ["saturday", "sunday"]
  action:
    respond:
      statusCode: 200
      headers:
        Content-Type: "application/json"
      payload: |
        {"result": {"event": 7, "user_id": {user_id}, "user_name": "{user_name}",
                    "user_image": false, "portal_id": 1,
                    "actions": [{"action": "door", "parameters": "door=1"}]}}
```

Seven attributes. Three looked up live from KV, one from the device's own claim about match quality, three from the clock. No code.

The area check does the most work per line. `{@kv.devices.{device_id}:area}` maps the reader that made the call to the space it guards, and `contains` tests that against the user's list of cleared areas. One rule file covers every door in the building, and adding a door means adding a KV key rather than a rule.

The timeclock condition is the interlock we originally built this for. A contractor who hasn't clocked in doesn't get into the lab, even with a perfectly good face and an active badge record. The timeclock system writes `{"status": "clocked_in"}` to a bucket on punch, something most of them can do over a webhook, and the door layer reads it a hundred times a day without either system knowing the other exists.

Other interlocks have the same shape. An occupancy counter in KV, incremented by a NATS rule on grant, caps how many people are in a room. A muster flag flipped during a fire alarm puts every door into one mode. A certification expiry on the user record can gate a machine authorization reader on the shop floor: the same engine that answers a door will answer a "should this person start this press" endpoint, with a different bucket and a different `portal_id`. None of those need new features, just another key in a bucket and another condition in a list.

### The two boring endpoints

The reader also wants a heartbeat target and a place to push its own event stream. Those are one rule each.

```yaml
- trigger:
    http:
      path: /device_is_alive.fcgi
  action:
    respond:
      payload: |
        {"status":"ok"}
```

```yaml
- trigger:
    http:
      path: /api/notifications/>
  action:
    nats:
      subject: control-id.notifications
      passthrough: true
```

The `>` wildcard catches every notification subpath the device uses, and `passthrough: true` forwards the body unchanged. Everything the reader has an opinion about (door forced, door held, tamper, template updates) now shows up on a NATS subject where the rest of the system can subscribe to it. That's the audit trail, and we didn't write a parser for it.

### What we got wrong

The grant path worked almost immediately. The deny path took an embarrassing amount of time.

Our first deny response was minimal, on the theory that a denial doesn't need much:

```json
{"result": {"event": 6, "message": "Access denied"}}
```

The reader rejected it and reported a generic server error, which looks exactly like a connectivity problem. We chased a connectivity problem for a while.

The response has to carry the full field set. `user_id`, `user_name`, `user_image`, `portal_id`, and `actions` are all required, even when `actions` is empty and the answer is no. The documentation has complete examples for granted responses and none for denied ones. We filled that gap by inventing something reasonable, rather than copying the documented shape and changing the event number.

Every test we wrote passed, because every test verified that the correct bytes left the gateway. None could verify the device would accept those bytes. What found it was changing event 7 to event 6 in the working grant rule and watching the denial go through fine. That isolated the variable in one shot.

If you're integrating with hardware that blocks on your response, assume its parser is stricter than its documentation, and mirror whatever example the vendor did publish.

### Where to look

rule-router lives at [github.com/skeeeon/rule-router](https://github.com/skeeeon/rule-router). The `docs/` directory covers the gateway, system variables, and the KV rule store. `rule-cli check` evaluates any of the rules above against a sample request offline, with a mock KV file, before it touches a door:

```bash
printf 'device_id=9876&user_id=42&user_name=Neal+Caffrey&confidence=93' > id.form
rule-cli check --rule access.yaml --message id.form --kv-mock kv.json -n 1 --header 'Content-Type: application/x-www-form-urlencoded'
```

Every rule in this post was checked that way before it was published.
