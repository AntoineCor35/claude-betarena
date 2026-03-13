Create a detailed technical plan for a specific phase.

Usage: `/bet-plan-phase <phase-number> [prof]`

## Setup

1. Read `.planning/STATE.md` — identify the **active** feature (from the `Active:` line).
2. Parse `$ARGUMENTS` — extract phase number and check for `prof` flag.
3. Read `.planning/<feature>/PLAN.md` — load ONLY the target phase.
4. Read `.planning/<feature>/phase-<NN>/CONTEXT.md` if it exists (from discuss-phase).
5. Read `.planning/codebase/CONVENTIONS.md` — to align with project patterns.
6. If previous phase has SUMMARY.md, read it for context continuity.
7. Actually explore the files listed in the phase definition — read them, understand them.

**Do NOT load other phases or unrelated files.**

## Planning

Analyze the phase goal and produce a step-by-step implementation plan.

For each step:
- What file to create or modify
- What exactly to do (not vague — specific functions, methods, components)
- What the expected result is
- Order of operations (what depends on what)

Present the plan:

```
Phase <N> — <title> — Technical Plan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: <action>
  File: <path>
  Detail: <what to do specifically>

Step 2: <action>
  File: <path>
  Detail: <what to do specifically>
  Depends on: Step 1

Step 3: ...

Estimated files: <N> modified, <N> created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask the user:
> "Does this plan look right? (approve / modify / discuss more)"

**Wait for approval.**

## Prof Mode

If `prof` is in arguments:
- For each step, explain **why** this approach was chosen over alternatives
- Point out patterns from the existing codebase being followed
- Explain any new concepts or libraries being introduced
- Highlight potential pitfalls and how the plan avoids them
- Ask "Clear?" after each major step

## Save

After approval, update `.planning/<feature>/PLAN.md` — enrich the target phase section with the detailed steps. Do NOT modify other phases.

Confirm:

```
Phase <N> plan detailed and saved.

Next:
  /bet-execute <N>          Start implementation
  /bet-execute <N> prof     Start with explanations
```
