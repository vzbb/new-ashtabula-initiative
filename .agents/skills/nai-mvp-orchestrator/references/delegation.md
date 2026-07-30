# Delegation Prompts

`./nai pipeline assign` prints the complete worker packet. Pass it through the
current harness's native delegation surface. The packet and handoff contract are
portable; transport is not.

Use the harness's native sub-agent, task, session, or messaging mechanism. If no
delegation surface exists, the orchestrator may execute the packet sequentially
after adopting `$nai-mvp-worker`, then return to the orchestrator role before
changing state.

## Worker assignment

```text
Use $nai-mvp-worker to complete this single NAI assignment.

Follow the context packet exactly. Do not inspect other sites, change canonical
state, deploy, publish, or contact another worker. Return changed files, check
results, evidence paths, risks, and a recommended transition to the orchestrator.

<paste the output of ./nai pipeline context --assignment ID>
```

The generated packet already contains the durable objective and deliverables.
Do not add a separate prose work order that can drift from canonical state.

## Independent verification

```text
Use $nai-mvp-worker to verify this assigned MVP without modifying its source.
Exercise the actual user workflow, inspect browser console and network results,
capture the required evidence, and return findings to the orchestrator. Do not accept the
gate yourself.

<paste the verification assignment packet>
```

## Follow-up after a failed check

```text
Continue the same assignment and attempt. Address only this failing check:
<check and evidence>. Preserve the original context boundaries and return fresh
evidence; do not broaden the task.
```

## User clarification during an active attempt

```text
Treat this user message as clarification of assignment <ID> only if it remains
inside the existing asset, gate, deliverables, and read/write boundaries. Still
return the completion handoff to the orchestrator. If it changes scope, stop and
ask the orchestrator for a replacement assignment packet.
```
