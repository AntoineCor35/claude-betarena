---
description: Resume a session — full contextual briefing and recommended next command
allowed-tools: Read, Glob, Bash(git status*), Bash(git log*), Bash(git branch*)
disable-model-invocation: true
---

Resume a session. Full contextual briefing for picking up where you left off.

This command replaces `/bet-status`. It's designed for session resumption — it reloads all relevant context and tells Claude exactly where things stand.

## Instructions

1. Read `.planning/STATE.md`.
2. Read `.planning/IDENTITY.md` if it exists.
3. Read `CONTRIBUTING.md`.

### If no feature in progress (no `Active:` line or `Active: none`):

```
No feature in progress.
━━━━━━━━━━━━━━━━━━━━━━
  /bet-new-feature <name>    Start a new feature
  /bet-onboarding            Set up the project (if not done)
━━━━━━━━━━━━━━━━━━━━━━
```

### If multiple features exist:

Show ALL features from `## Features` section, highlight the active one (from `Active:` line):

```
Features:
  ◀ <active-slug>     Phase <N>/<total>  (feature/<slug>)
    <paused-slug>     Phase <N>/<total>  (hotfix/<slug>)  — paused

Switch with: /bet-switch <slug>
```

Then continue with the full briefing for the **active** feature only.

### If a feature is in progress:

4. Read `.planning/<feature>/TRACKING.md` — full tracking document.
5. Read `.planning/<feature>/PLAN.md` — the plan.
6. Read all existing `phase-<NN>/SUMMARY.md` files — completed phase summaries.
7. Read the current phase's `CONTEXT.md` if it exists.
8. **Read `.planning/<feature>/HANDOFF.md` if it exists** — written by `/bet-pause`. This holds the user's subjective state at the moment they stopped (current file, next micro-step, blockers, mental notes). It supersedes any inferred state from artifacts.
9. Run `git branch --show-current`.
10. Run `git log --oneline -5` — recent commits.
11. Run `git status` — uncommitted changes.

Build and display a **full contextual briefing**. If `HANDOFF.md` was found, surface it as the **first section** so the user lands directly back in their head-space :

```
Session Resumption — Feature: "<name>"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(only if HANDOFF.md exists:)
## Dernier handoff — <timestamp from HANDOFF.md>
> Tu t'arrêtais sur : <Q1 from HANDOFF>
> Prochaine micro-étape prévue : <Q2 from HANDOFF>
> Blockers : <Q3 from HANDOFF>
> Notes : <Q4 from HANDOFF>
>
> (Le fichier complet : .planning/<feature>/HANDOFF.md — il est conservé tel quel jusqu'au prochain /bet-pause.)

(then the standard briefing:)

Branch  : <current branch>
Jira    : <ticket or "none">
Started : <date>
Progress: [████░░░░░░] <done>/<total> phases

## What's been done

### Phase 1 — <title> ✓
<summary from SUMMARY.md — 2-3 lines>
Files: <list of key files modified/created>
Committed: <yes/no — commit hash if yes>

### Phase 2 — <title> ✓
<summary>

## Current Phase

### Phase <N> — <title> ◀ YOU ARE HERE
Goal: <goal>
Status: <not started | in progress | blocked>
<context from CONTEXT.md if available>

## What's remaining

### Phase <N+1> — <title>
<brief goal>

### Phase <N+2> — Tests
<brief goal>

## Uncommitted changes
<git status summary, or "Working tree clean">

## Available commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  /bet-plan-phase <N> discuss     Refine context for current phase
  /bet-plan-phase <N>        Detail technical plan
  /bet-execute <N>           Implement current phase
  /bet-commit                Commit pending changes
  /bet-next                  Move to next phase
  /bet-pause                 Save a handoff before stopping (re-read at next /bet-progress)

  Add "prof" to any command for explanations.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Recommend the most logical next action** based on the state:
- Uncommitted changes? → `/bet-commit`
- Phase in progress but not done? → `/bet-execute <N>`
- Phase done but not committed? → `/bet-commit` then `/bet-next`
- Phase done and committed? → `/bet-next`
- No detailed plan yet? → `/bet-plan-phase <N>`

## Context injection

This briefing serves as the **context window** for the rest of the session. All the summaries loaded here allow Claude to continue working without needing to re-read all the code from previous phases. The SUMMARY.md files are the key — they capture enough context to maintain continuity.
