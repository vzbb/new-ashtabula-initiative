---
description: Read-only NAI triage on a bounded question (slug mapping, blank route, stale evidence, gate reality) via the diagnostician subagent
argument-hint: <question or slug>
allowed-tools: Agent, Bash(./nai pipeline status), Bash(./nai pipeline validate), Bash(./nai scan:*), Read, Grep, Glob
---

Triage this, read-only: **$ARGUMENTS**

Spawn the `nai-diagnostician` subagent with the question, the canonical slug (or
the ambiguity to resolve), and any evidence path already in play. Tell it
explicitly: writes nothing, no builds, no screenshots, no state commands, no
deploy, and it must distinguish current tooling output from historical documents.

When it returns, relay in your own words: the answer, the evidence behind each
claim, which sources were stale, what remains unknown, and the single
orchestrator action you recommend. Do not act on the recommendation in this
command — wait for the user, or open a proper assignment afterwards.
