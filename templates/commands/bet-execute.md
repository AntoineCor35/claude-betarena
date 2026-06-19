---
description: Execute a phase — implement the planned code changes
argument-hint: "<phase-number> [prof]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
disable-model-invocation: true
---

Execute a phase: implement the code.

Usage: `/bet-execute <phase-number> [prof]`

## Setup

1. Read `.planning/STATE.md` — identify the **active** feature (from the `Active:` line).
2. Parse `$ARGUMENTS` — extract phase number and check for `prof` flag.
3. Read `.planning/<feature>/PLAN.md` — load ONLY the target phase (with detailed steps if plan-phase was run).
4. Read `.planning/<feature>/phase-<NN>/CONTEXT.md` if it exists.
5. Read `.planning/codebase/CONVENTIONS.md` — to follow project patterns.
6. If previous phase has SUMMARY.md, read it for context.
7. Read `CONTRIBUTING.md` — for commit conventions.

**Do NOT load all phases. Only load what's needed for THIS phase.**

## Pre-flight check

- Verify the phase hasn't already been completed (check TRACKING.md).
- If it's already done, tell the user and suggest `/bet-next` or `/bet-execute <N+1>`.
- If a phase before this one is not done, warn the user but allow override.

## Prof Mode Toggle

If `prof` is in arguments, announce:

> **Professor Mode active for this phase.**
> I'll explain the reasoning behind each file creation/modification before doing it. Ask me anything along the way.

## Execution

For each step in the plan:

### In Builder Mode:
1. Announce what you're about to do (one short sentence).
2. Implement it.
3. Move to next step.

### In Professor Mode:
1. **Before** creating/modifying a file, explain:
   - What this file does in the architecture
   - Why we're making this change
   - What pattern we're following and why
   - Any interesting technical choice
2. Ask: "Ready to proceed?" (only for significant steps, not every line)
3. Implement it.
4. Show what changed and briefly explain the result.
5. Move to next step.

## Execution order

Follow the plan steps in order. For each:
- Create or modify the file
- If the step produces something testable, do a quick sanity check
- Continue to next step

**Do NOT write tests in this phase** (unless it's the test phase). Tests come in the dedicated test phase.

## Completion

After all steps are done:

1. Update `.planning/<feature>/phase-<NN>/SUMMARY.md`:

```markdown
# Summary: Phase <N> — <title>

Completed: <today>
Feature: <feature name>

## What was done
- <concrete action 1>
- <concrete action 2>

## Files modified
- <file> — <what changed>
- <file> — <what changed>

## Files created
- <file> — <purpose>

## Key decisions during implementation
- <decision — and why>

## Notes for next phases
- <anything the next phase needs to know>
```

2. Update `.planning/<feature>/TRACKING.md`:
   - Change phase status: `⬚ todo` → `✅ done`
   - Fill the summary column
   - Update the "Context Briefing" section with what was accomplished
   - Update "Current state" to reflect next phase

3. Update `.planning/STATE.md` with current phase number.

4. Present next steps:

```
Phase <N>/<total> complete — <title>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<one-line summary of what was built>

Available commands:
  /bet-commit                Commit this phase's work
  /bet-next                  Move to next phase
  /bet-plan-phase <N+1> discuss   Discuss next phase (optional)
  /bet-plan-phase <N+1>      Plan next phase
  /bet-progress              See full status

Recommendation: /bet-commit then /bet-next
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Special case: Test phase (last phase)

If executing the LAST phase (tests), follow a structured **test strategy Q&A** before writing any test code. This step exists to align with the **Plan Qualité §6** (test levels, coverage targets, critical business logic).

### Step 1 — Read context

Re-read **all** previous `phase-<NN>/SUMMARY.md` files (the only phase where you load every summary). Also read `.planning/codebase/TESTING.md` and `docs/quality-plan.md` if available.

### Step 2 — Test strategy Q&A

Open with a recap, then ask in this order. **Wait for each answer before continuing.**

> **Test strategy — Phase <N> (final)**
>
> **Recap of what was built:**
> - Phase 1 — <title> : <summary>
> - Phase 2 — <title> : <summary>
> - …
>
> Is this accurate? (yes / corrections)

Then:

> **Q1 — Levels.** Per Plan Qualité §6.1:
>   - **Unit (Jest)** — business logic in isolation. Target: 70% coverage on critical logic.
>   - **Integration (Jest + Supertest)** — full API endpoints (if backend touched). Target: all critical endpoints.
>   - **Manual** — for UX/parcours (last sprint, not this phase).
>
>   Which levels should this phase deliver? (suggest based on what was built; user confirms or adjusts)

> **Q2 — Coverage focus.** From Plan Qualité §6.2 — which categories does this feature touch?
>   - Économie virtuelle (atomic debit/credit, insufficient balance, concurrent debits, weekly salary)
>   - Calcul de cotes (nominal, données insuffisantes, cas limites min/max)
>   - Résolution de paris (simple win/loss, combiné partiel, combiné full win, match annulé)
>   - Achievements (déclenchement, unicité, streaks)
>   - Auth (signup, login, refresh token, input validation)
>   - Other: <user describes>
>
>   List the relevant ones — these drive the unit test list.

> **Q3 — Edge cases.** For each chosen category, surface concrete edge cases:
>   - Examples: empty inputs, null IDs, simultaneous writes, transaction rollback, expired tokens, malformed JSON, rate limits, etc.
>   - Add any business-specific edge cases the user wants covered.

> **Q4 — Scope confirmation.** Before writing:
>   - Files to test: <list — derived from previous phases' SUMMARY.md>
>   - Test files to create: <list>
>   - Estimated count: <N> unit + <M> integration
>
>   Sound right? (yes / adjust)

### Step 3 — Write tests

Follow the test plan from `PLAN.md` enriched by the Q&A answers. Place test files according to project conventions (see `.planning/codebase/TESTING.md`).

### Step 4 — Run tests

Run via the appropriate workspace (no top-level `task test` exists yet):

```bash
npm --workspace=src/backend test
npm --workspace=src/shared test
# etc.
```

If tests fail → fix the code or tests, then re-run. **Never disable a test to make CI green.**

### Step 5 — Coverage check

If coverage tooling is configured, run it and compare against the 70% target on business logic. Report the actual numbers in the phase SUMMARY.md.

### Prof Mode for tests

- Explain what each test validates and why
- Explain the testing pattern used (unit vs integration, AAA, given-when-then, etc.)
- Show how the test relates to the feature behavior
- Ask "Does this coverage feel right?" at the end
