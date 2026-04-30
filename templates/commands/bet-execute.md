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
  /bet-discuss-phase <N+1>   Discuss next phase (optional)
  /bet-plan-phase <N+1>      Plan next phase
  /bet-progress              See full status

Recommendation: /bet-commit then /bet-next
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Special case: Test phase (last phase)

If executing the LAST phase (tests):

1. Before writing tests, ask context-validation questions:
   - "Based on phases 1-N, here's what I understand was built: <summary>. Is this accurate?"
   - "Any specific edge cases or scenarios you want me to cover beyond the plan?"

2. Write tests following the test plan from PLAN.md.
3. Run the tests.
4. If tests fail → fix the code or tests, then re-run.
5. Show test results.

In Prof Mode for tests:
- Explain what each test validates and why
- Explain the testing pattern used (unit, integration, etc.)
- Show how the test relates to the feature behavior
- Ask "Does this coverage feel right?" at the end
