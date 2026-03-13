Start a new feature. Enters a guided tunnel: questions → plan → review → phases → tracking.

Usage: `/bet-new-feature <feature description>`

## Guard — Check for in-progress feature

1. Read `.planning/STATE.md`.
2. If a feature is already in progress (not completed):
   - **Block.** Display:

```
⚠ Feature "<name>" is already in progress (Phase <N>/<total>).

You must finish or close it before starting a new one.
  /bet-progress        → Resume where you left off
  /bet-next            → Continue to next phase
  /bet-execute <N>     → Execute current phase
```

   - **Stop here.** Do not continue.

3. If no feature in progress, continue.

## Step 1 — Load project context

Read (if they exist):
- `.planning/codebase/STACK.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/IDENTITY.md`
- `CONTRIBUTING.md`

If `.planning/codebase/` doesn't exist, warn: "Run `/bet-onboarding` first for a better experience."

## Step 2 — Jira integration (if enabled)

Check STATE.md for `Jira: enabled`.

If enabled:
- Ask: "Are you working on a Jira ticket? If yes, give me the ticket ID. Otherwise, describe what you want to build and I'll look for a matching ticket."
- If the user gives a ticket ID → fetch ticket details via Atlassian MCP, use title + description as feature context.
- If the user describes the feature → search Jira for matching tickets. If found, propose: "This looks like ticket <ID> — <title>. Use this? (yes / no)"
- If no match → propose: "Want me to create a Jira ticket for this? (yes / no)"
- Save the ticket reference in the feature tracking.

If Jira not enabled, skip this step.

## Step 3 — Explore the codebase

Based on the feature "$ARGUMENTS", identify:
- Which existing files are likely involved
- Which similar features have already been implemented
- What tests already exist and how they're structured
- What dependencies or libraries are relevant

Actually look at the code — don't guess. Use the codebase audit docs as a starting point.

## Step 4 — Ask questions

Present findings and questions:

> **What I found in the codebase**
> _Brief summary of relevant files, patterns, related features_
>
> **Questions before I plan**
> 1. <specific question — explain why you're asking>
> 2. ...
> _(2-5 questions max, focused on scope, business logic, and technical choices)_

**Wait for the user to answer before continuing.**

## Step 5 — Write the plan

Create `.planning/<feature-slug>/PLAN.md`:

```markdown
# Plan: <Feature Name>

Date: <today>
Jira: <ticket ID or "none">
Branch: feature/<feature-slug>

## Summary
<2-3 sentences describing what this feature does>

## Phases

### Phase 1 — <short title>
- **Goal:** <what works at the end of this phase>
- **Files affected:** <list>
- **Dependencies:** <what must exist before this phase>

### Phase 2 — <short title>
- **Goal:** ...
- **Files affected:** ...
- **Dependencies:** ...

### Phase N — Tests
- **Goal:** Full test coverage for all phases
- **Files affected:** <test files>
- **Test plan:**
  - Happy path: <list>
  - Edge cases: <list>
```

Phase sizing:
- Small feature → 1-2 phases + tests
- Medium feature → 2-3 phases + tests
- Large feature → 3-5 phases + tests
- **The last phase is ALWAYS tests**

Show the plan and ask:
> "Does this breakdown make sense? Any phase to rename, split, or merge?"

**Wait for approval or modifications.**

## Step 6 — Create tracking document

Create `.planning/<feature-slug>/TRACKING.md`:

```markdown
# Tracking: <Feature Name>

Feature: <name>
Branch: feature/<feature-slug>
Started: <today>
Jira: <ticket ID or "none">
Total phases: <N>

## Phase Progress

| # | Phase | Status | Summary |
|---|-------|--------|---------|
| 1 | <title> | ⬚ todo | — |
| 2 | <title> | ⬚ todo | — |
| N | Tests  | ⬚ todo | — |

## Context Briefing
_Updated after each phase completion for session resumption._

### Completed phases
_None yet._

### Current state
Phase 1 is ready to start.

### Key decisions
_None yet._
```

## Step 7 — Create branch

- Check for uncommitted changes (warn if any).
- Create branch: `git checkout develop && git pull origin develop && git checkout -b feature/<feature-slug>`
- If branch already exists, ask before switching.

## Step 8 — Update STATE.md

```markdown
Feature: <name>
Phase: 0/<total> — Planning complete
```

## Step 9 — Present next steps

```
Feature "<name>" is ready! (Phase 0/<total>)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch: feature/<feature-slug>

Available commands:
  /bet-discuss-phase 1       Discuss phase 1 to refine context (optional)
  /bet-plan-phase 1          Detail the technical plan for phase 1 (recommended)
  /bet-execute 1             Jump straight to implementation

  Tip: Add "prof" to any command for explanations
       e.g., /bet-plan-phase 1 prof
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Assess whether `/bet-discuss-phase 1` is recommended based on context clarity:
- If the feature is complex or touches unfamiliar code → recommend discuss first
- If the feature is straightforward and well-defined → recommend skipping to plan-phase
