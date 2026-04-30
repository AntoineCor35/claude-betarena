---
description: Move to the next phase, summarize progress, propose next commands
allowed-tools: Read, Edit, Bash(git status*), Bash(git log*)
disable-model-invocation: true
---

Move to the next phase. Summarizes progress and proposes available commands.

## Instructions

1. Read `.planning/STATE.md` — find the **active** feature (from the `Active:` line) and its phase number.
2. Read `.planning/<feature>/TRACKING.md` — get full phase list and status.
3. Read `CONTRIBUTING.md` — for commit conventions.

## Check current phase status

- If the current phase is NOT marked as done in TRACKING.md, warn:
  > "Phase <N> doesn't seem complete yet. Run `/bet-execute <N>` to finish it, or confirm you want to skip."
  - Wait for response. If user confirms skip, continue.

## Check for uncommitted work

- Run `git status` to see if there are uncommitted changes.
- If there are changes:
  > "You have uncommitted changes from Phase <N>. Recommend committing first."
  > "  /bet-commit    → Commit now"
  > "  /bet-next      → Run again after committing"
  - **Stop and wait.** Do not advance until changes are committed or user explicitly says to skip.

## Advance to next phase

Determine what's next:

### If there IS a next phase:

Update STATE.md with the new phase number. Then display:

```
Phase <N> done ✓ → Moving to Phase <N+1>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase <N+1> — <title>
Goal: <goal>

Progress: [████░░░░░░] <N>/<total> phases complete

Available commands:
  /bet-discuss-phase <N+1>       Discuss to refine context (optional)
  /bet-plan-phase <N+1>          Detail the technical plan (recommended)
  /bet-execute <N+1>             Jump to implementation
  /bet-progress                  Full status overview

  Tip: Add "prof" for explanations (e.g., /bet-execute <N+1> prof)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Assess and recommend:
- If the next phase is complex or unfamiliar → recommend `/bet-discuss-phase` first
- If the context is clear → recommend `/bet-plan-phase` then `/bet-execute`
- If it's a simple, well-defined phase → can suggest going straight to `/bet-execute`

### If this was the LAST phase (tests):

All phases are complete. Display:

```
All phases complete! Feature "<name>" is done.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: [██████████] <total>/<total> phases complete

Remaining steps:
  1. /bet-commit       Final commit (if not already committed)
  2. /bet-doc          Update project documentation
  3. /bet-pr           Create the Pull Request

Let's start with /bet-commit to wrap things up.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Update TRACKING.md: mark feature as complete. Update STATE.md.
