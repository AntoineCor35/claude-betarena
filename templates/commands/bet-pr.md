---
description: Prepare and create a Pull Request following BetArena conventions
allowed-tools: Read, Bash(git *), Bash(gh *)
disable-model-invocation: true
---

Prepare and create a Pull Request following BetArena conventions.

## Instructions

1. Read `CONTRIBUTING.md` — source of truth for PR format.
2. Read `.planning/STATE.md` — current feature.
3. Read `.planning/<feature>/TRACKING.md` — full feature summary (including Jira ticket ID).
4. Read `.planning/<feature>/PLAN.md` — what was planned.
5. Read `.planning/IDENTITY.md` — author info.

## Pre-flight checks (DoD gate)

Walk through the **Definition of Done — Story** before proposing the PR. Block (or warn loudly) if any item fails:

- [ ] All phases are marked complete in TRACKING.md
- [ ] No uncommitted changes (`git status` clean)
- [ ] Lint + format pass — run the matching Task commands for each touched area:
  - Frontend → `task front:format-lint`
  - Backend → `task back:build` (TypeScript compilation acts as the lint gate)
  - Mobile → `task mobile:lint`
- [ ] Tests pass — no top-level `task test` exists yet. Run Jest per workspace for areas with tests (e.g. `npm --workspace=src/backend test`). Unit tests cover nominal + error cases. Integration tests cover the touched endpoints (if backend).
- [ ] Acceptance criteria from PRD/ticket are met
- [ ] Feature is testable on a simulator/device

If any item fails:
> "DoD not satisfied: <list>. Fix these before opening the PR, or confirm you want to open a draft PR (yes / no)."

**Wait for the user's decision.** Do not push past a DoD failure silently.

## Determine PR target

From the current branch name:
- `feature/BA-XXX-*` → target `develop`
- `fix/BA-XXX-*` → target `develop`
- `develop` → target `main` (release PR)
- Other → ask the user for the target.

## Build the PR

### Title

Format: `[<SCOPE>] BA-XXX <Description>`

- **Scope (uppercase):** `MOBILE`, `BACKEND`, `SHARED`, `LANDING`, `CI`, `DOCS`
- **BA-XXX:** Jira ticket from TRACKING.md. Omit only if no ticket exists.
- **Description:** short, present tense, in English.

Examples:
- `[BACKEND] BA-123 Add bet placement endpoint`
- `[MOBILE] BA-456 Fix wallet balance refresh`

### Body

```markdown
## What does this PR do?
<1-2 sentences from PLAN.md summary>

## Jira
<BA-XXX link, or "N/A">

## Changes
<organized by phase>

### Phase 1 — <title>
- <change>
- <change>

### Phase 2 — <title>
- <change>

## How to test
1. <step>
2. <step>
3. Expected: <...>

## Screenshots
<if UI changes — otherwise "N/A">

## Tests
- [ ] CI passes (lint + tests)
- [ ] Unit tests added: <list>
- [ ] Integration tests added: <list — if backend>
- [ ] All existing tests pass

## Notes
<trade-offs, known limits, follow-ups — or "None">
```

## Propose

Show the PR title and body to the user:
> "Here's the PR. Approve? (yes / edit / cancel)"

**Wait for explicit response.**

## On approval

1. Push the branch if not already pushed: `git push -u origin <branch>`
2. Create the PR with `gh pr create`
3. Assign the PR to the current user (from IDENTITY.md)
4. If targeting `main`, add reviewers: **Antoine Cormier** & **Maxence Guidez**
5. Ask the user which Jira component label(s) to add (mobile, backend, shared, landing, ci, docs, management, web3, data, devops)
6. Return the PR URL

## After PR creation

Update TRACKING.md: add PR URL and date.
Update STATE.md: mark feature as complete (only after merge — see note below).

```
PR created! <URL>
━━━━━━━━━━━━━━━━━━
Feature "<name>" PR opened.

Reminders:
  • CI must pass (lint + tests)
  • At least 1 review approval required
  • Squash merge once green and approved
  • Delete the branch after merge

  /bet-progress              View overall status
  /bet-new-feature <name>    Start next feature (only after current is merged)
━━━━━━━━━━━━━━━━━━
```

## Rules

- **Never create a PR without user approval.**
- **Never create a PR from `main` or `develop`** (except `develop` → `main` release PR) — warn the user otherwise.
- Always follow the title format from `CONTRIBUTING.md`: `[SCOPE] BA-XXX Description`.
- Never bypass the DoD gate silently — surface failures, let the user decide.
