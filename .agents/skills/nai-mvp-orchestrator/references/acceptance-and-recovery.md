# Acceptance and Recovery

## Accept

Pass only when every checklist item is demonstrated by current, asset-bound
evidence and the evidence paths satisfy `./nai pipeline pass` validation.

## Fail

Fail when the worker completed the attempt but the gate is not acceptable. Keep
prior passed gates intact. Include a precise reason and any diagnostic evidence.

## Retry

Retry the same gate after a correctable failure when the worker and scope remain
valid. The attempt number must increase.

## Reassign

Reassign when the current worker cannot continue or the attempt needs a clean
handoff. State the same eligible gate explicitly, optionally record the new
worker audit ID, and preserve the reason and evidence.

## Block

Block when progress depends on a missing fact, credential, authorization, or
external asset. Unblock only after the dependency is actually resolved.

## Reset

Reset to the earliest gate whose accepted premise is no longer valid. Downstream
passes become invalidated but their evidence remains available for revalidation.

## Quarantine

Quarantine when the asset is unsafe or incoherent enough that routine retries
would waste work, or when a template defect should stop new dependents. Do not
invalidate already verified clones pinned to an earlier template revision.
