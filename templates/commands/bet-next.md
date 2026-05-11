---
description: Move to the next phase — runs a Definition of Done gate before advancing
allowed-tools: Read, Edit, Bash(git status*), Bash(git log*), Bash(task *), Bash(npm *)
disable-model-invocation: true
---

Move to the next phase. Runs a Definition of Done gate before advancing.

## Instructions

1. Read `.planning/STATE.md` — find the **active** feature (from the `Active:` line) and its phase number.
2. Read `.planning/<feature>/TRACKING.md` — phase list, status, Jira ticket.
3. Read `.planning/<feature>/PLAN.md` — current phase goal and acceptance criteria.
4. Read `CONTRIBUTING.md` — commit conventions.
5. Read `.planning/codebase/STACK.md` if present — to know which Task commands are available.

## Definition of Done — Phase gate

Before advancing, verify the current phase satisfies its DoD. **If anything fails, do NOT advance silently — surface it and let the user decide.**

### Hard checks (block by default)

- [ ] **Phase marked done in TRACKING.md.** If not, warn:
  > "Phase <N> isn't marked done. Run `/bet-execute <N>` first, or confirm you want to skip (yes / no)."
- [ ] **Working tree clean.** Run `git status`. If uncommitted changes:
  > "You have uncommitted changes from Phase <N>. Run `/bet-commit` first.
  >   /bet-commit    → Commit now
  >   /bet-next      → Run again after committing"
  > **Stop. Do not advance.**

### Soft checks (warn, don't block)

These checks aim to catch DoD violations early. Run only what makes sense for the **current phase area**:

- [ ] **Lint/build green** — run the matching Task command(s) for the area touched by the phase:
  - Frontend area → `task front:format-lint`
  - Backend area → `task back:build` (TypeScript compilation = lint gate)
  - Mobile area → `task mobile:lint`
- [ ] **Tests** — for non-test phases this is informational (the dedicated last phase will add coverage). For backend/shared phases, run any existing Jest suite via `npm --workspace=<ws> test` to catch regressions.
- [ ] **Acceptance criteria covered** — open the phase's `SUMMARY.md` and confirm the goal from `PLAN.md` is reflected. If not obvious, ask:
  > "Phase <N> goal was: <goal>. Looking at the summary, is this fully addressed? (yes / partial / no)"

If any soft check raises a concern:
> "DoD partial: <list>. Advance anyway? (yes / no)"
> Wait for user decision.

## Advance to next phase

### If there IS a next phase

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

  Tip: prefix any command with prof for explanations (e.g., /bet-execute <N+1> prof)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Recommend:
- Next phase is complex or unfamiliar → `/bet-discuss-phase` first
- Context clear → `/bet-plan-phase` then `/bet-execute`
- Simple, well-defined → straight to `/bet-execute`

### If next phase is the LAST phase (tests)

The last phase is dedicated to tests. **Surface the test strategy Q&A** from `/bet-execute` before the user dives in:

```
Phase <N> done ✓ → Next phase is TESTS (Phase <N+1>)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing tests, /bet-execute <N+1> will run a Q&A to align on:
  • Test levels (unit, integration) per area touched
  • Coverage targets (quality plan: 70% on business logic)
  • Critical edge cases from quality-plan.md §6.2

Run /bet-execute <N+1> to start the test phase.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If this WAS the LAST phase (tests)

All phases are complete. Run a **final DoD audit** before announcing readiness for PR.

Walk through the **Story-DoD** checklist (from `CLAUDE.md` / `quality-plan.md` §9.1):

```
DoD audit — Feature "<name>"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] All phases marked done in TRACKING.md
[ ] CI commands pass locally:
    • Lint (Task commands per area)
    • Build (task back:build, task front:build)
    • Tests (Jest per workspace)
[ ] Unit tests cover nominal + error cases on critical business logic
[ ] Integration tests cover touched endpoints (if backend)
[ ] Acceptance criteria from PRD/Jira ticket are met
[ ] Feature is testable on simulator/device (if mobile/frontend)
[ ] Jira ticket BET-XXX ready to move to "Done"

Status: <PASS | <list of fails>>
```

If any item fails:
> "DoD audit not satisfied: <list>. Address these before opening a PR, or proceed to draft PR? (fix / draft / cancel)"

If all pass, display:

```
All phases complete! Feature "<name>" is ready to ship.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: [██████████] <total>/<total>
DoD     : ✓ all items satisfied

Remaining steps:
  1. /bet-commit       Final commit (if not already)
  2. /bet-doc          Update project documentation in docs/
  3. /bet-pr           Create the Pull Request (runs a final DoD gate)

Recommended: /bet-doc → /bet-pr
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Update TRACKING.md: mark feature as ready-for-PR. Update STATE.md.

## Rules

- **Never advance silently past a DoD failure.** Always surface and wait for user decision.
- **Never auto-commit or auto-fix** during the gate. Only diagnose; the user fixes.
- The DoD gate respects the user's authority — if they say "advance anyway", you advance.
