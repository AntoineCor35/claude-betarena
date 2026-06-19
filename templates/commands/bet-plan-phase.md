---
description: Create a detailed technical plan for a specific phase — optionally preceded by an interactive Q&A to refine context.
argument-hint: "<phase-number> [discuss] [prof]"
allowed-tools: Read, Write, Glob, Grep
disable-model-invocation: true
---

Create a detailed technical plan for a specific phase. Use the `discuss` argument first if the phase touches unfamiliar code, has ambiguous requirements, or involves complex technical decisions — the agent will run a Q&A to refine the context before producing the plan.

Usage:
- `/bet-plan-phase <phase-number>` — plan directly
- `/bet-plan-phase <phase-number> discuss` — Q&A first, then plan
- `/bet-plan-phase <phase-number> prof` — plan in Professor Mode (explanations for each step)
- Combine flags : `/bet-plan-phase 2 discuss prof`

## Setup

1. Read `.planning/STATE.md` — identify the **active** feature (from the `Active:` line).
2. Parse `$ARGUMENTS` — extract phase number and check for `discuss` / `prof` flags.
3. Read `.planning/<feature>/PLAN.md` — load ONLY the target phase.
4. Read `.planning/<feature>/phase-<NN>/CONTEXT.md` if it exists (already populated from a previous `discuss` run).
5. Read `.planning/codebase/CONVENTIONS.md` — to align with project patterns.
6. If previous phase has SUMMARY.md, read it for context continuity.
7. Actually explore the files listed in the phase definition — read them, understand them.

**Do NOT load other phases or unrelated files.**

## Optional pre-step — Discuss (if `discuss` flag passed)

Run a short Q&A to refine the phase context before planning. Topics to explore :
- Exact behavior expected (inputs, outputs, edge cases)
- Technical approach (which patterns, libraries, services to use)
- Integration points with existing code
- Performance / security considerations
- UI/UX details if frontend-related

Start with a summary of what you understand, then ask **2-5 questions max**, one block at a time. Wait for each batch of answers.

When the discussion converges, save the context to `.planning/<feature>/phase-<NN>/CONTEXT.md` :

```markdown
# Context: Phase <N> — <title>

Date: <today>
Feature: <feature name>

## Goal
<refined goal based on discussion>

## Technical Approach
- <decided approach>
- <key libraries/patterns to use>

## Decisions Made
- <decision 1 — and why>
- <decision 2 — and why>

## Constraints
- <constraint 1>

## Edge Cases to Handle
- <case 1>

## Files to Touch
- <file> — <what to do>
```

Then continue with the planning step below — the planner will use this CONTEXT.md.

If the `discuss` flag was **not** passed but the phase looks ambiguous (vague description in PLAN.md, no CONTEXT.md, touches unfamiliar files), **suggest it gently** :
> "Cette phase a l'air un peu floue. Tu préfères qu'on en discute avant de planifier ? (yes / no — défaut no)"

If user says yes, run the discuss block. Otherwise plan directly.

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
