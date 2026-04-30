---
description: Q&A to refine context for a phase before planning or executing (optional)
argument-hint: "<phase-number> [prof]"
allowed-tools: Read, Glob, Grep, Bash(git *)
disable-model-invocation: true
---

Discuss a phase to refine its context before planning or executing.

Usage: `/bet-discuss-phase <phase-number> [prof]`

This command is **optional**. It creates a detailed context document for the phase through Q&A. Use it when the phase touches unfamiliar code, has ambiguous requirements, or involves complex technical decisions.

## Setup

1. Read `.planning/STATE.md` — identify the **active** feature (from the `Active:` line).
2. Parse `$ARGUMENTS` — extract phase number and check for `prof` flag.
3. Read `.planning/<feature>/PLAN.md` — load ONLY the target phase definition.
4. Read `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/STACK.md` for project context.
5. If a previous phase has a SUMMARY.md, read it for continuity.

**Do NOT load other phases, previous conversation history, or unrelated codebase docs.**

## Discussion

Start with a summary of what you understand about this phase:

> **Phase <N> — <title>**
> _Goal: <goal from PLAN.md>_
>
> **What I understand:**
> - <point 1>
> - <point 2>
>
> **What I'd like to clarify:**
> 1. <question — explain why this matters for implementation>
> 2. <question>
> 3. <question>
> _(2-5 questions max)_

This is a conversation. Go back and forth with the user until both sides are aligned. Topics to explore:
- Exact behavior expected (inputs, outputs, edge cases)
- Technical approach (which patterns, libraries, services to use)
- Integration points with existing code
- Performance or security considerations
- UI/UX details if frontend-related

## Prof Mode

If `prof` is in arguments:
- Explain **why** each question matters
- When the user answers, explain the implications of their choice
- Point out trade-offs between approaches
- Reference similar patterns in the existing codebase
- Ask "Does this make sense?" before moving on

## Output

When the discussion is complete, save `.planning/<feature>/phase-<NN>/CONTEXT.md`:

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
- <constraint 2>

## Edge Cases to Handle
- <case 1>
- <case 2>

## Files to Touch
- <file> — <what to do>
- <file> — <what to do>
```

Confirm to the user:

```
Context saved for Phase <N>.

Next:
  /bet-plan-phase <N>     Detail the technical plan
  /bet-execute <N>         Jump to implementation (plan-phase recommended first)
```
