---
description: Switch the active feature context to another in-progress feature
argument-hint: "[feature-slug]"
allowed-tools: Read, Edit, Bash(git *)
disable-model-invocation: true
---

Switch the active feature context. Useful when you need to pause a feature (e.g., for a hotfix) and come back later.

Usage: `/bet-switch` or `/bet-switch <feature-slug>`

## Step 1 — Load state

1. Read `.planning/STATE.md`.
2. Parse the `## Features` section to list all in-progress features.

## Step 2 — No argument: list features

If no argument provided, display all features:

```
Active features:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ◀ <active-slug>     Phase <N>/<total>  (feature/<slug>)
    <other-slug>      Phase <N>/<total>  (hotfix/<slug>)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Switch with: /bet-switch <slug>
```

If only one feature exists, tell the user there's nothing to switch to.

## Step 3 — With argument: switch

1. Verify the target `<feature-slug>` exists in STATE.md.
2. If not found, show available features and stop.
3. Update `Active:` line in STATE.md to the target slug.
4. Switch git branch: `git checkout <branch-for-target-feature>` (read branch from STATE.md feature entry).
5. Warn if there are uncommitted changes on the current branch.

## Step 4 — Mini progress

After switching, display a brief status of the new active feature:

```
Switched to: <feature-slug>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch  : <branch>
Phase   : <N>/<total>
Status  : <current phase title>

Resume with:
  /bet-progress            Full briefing
  /bet-execute <N>         Continue implementation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
