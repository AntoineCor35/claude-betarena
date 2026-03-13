Prepare and create a Pull Request following BetArena conventions.

## Instructions

1. Read `CONTRIBUTING.md` — source of truth for PR format.
2. Read `.planning/STATE.md` — current feature.
3. Read `.planning/<feature>/TRACKING.md` — full feature summary.
4. Read `.planning/<feature>/PLAN.md` — what was planned.
5. Read `.planning/IDENTITY.md` — author info.

## Pre-flight checks

- Verify all phases are marked complete in TRACKING.md. If not, warn:
  > "Phases <list> are not complete. Are you sure you want to open a PR now?"
- Run `git status` — warn if uncommitted changes exist.
- Run tests if available — warn if failing.

## Determine PR target

From the current branch name:
- `feature/*` → target `develop`
- `hotfix/*` → target `main`
- Other → ask the user for the target.

## Build the PR

**Title:** `[<SCOPE>] <Description>` (from CONTRIBUTING.md)

**Scope:** Determine from the changes — `FRONT`, `BACK`, `GLOBAL`, `MOBILE`, `DATA`, `DB`.

**Body:**

```markdown
## What does this PR do?
<1-2 sentences from PLAN.md summary>

## Changes
<list of meaningful changes, organized by phase>

### Phase 1 — <title>
- <change>
- <change>

### Phase 2 — <title>
- <change>

## Tests
- [ ] All existing tests pass
- [ ] New tests added for: <list from test phase>

## How to test manually
1. <step>
2. <step>
3. Expected result: <...>

## Jira
<ticket link if available, or "N/A">

## Notes
<trade-offs, known limitations, next steps — or "None">
```

## Propose

Show the PR title and body to the user:
> "Here's the PR. Approve? (yes / edit / cancel)"

**Wait for explicit response.**

## On approval

1. Push the branch if not already pushed: `git push -u origin <branch>`
2. Create the PR with `gh pr create`
3. Assign the PR to the current user (from IDENTITY.md)
4. If targeting `main`, add reviewers: Antoine Cormier & Maxence Guidez
5. Ask the user which labels to add
6. Return the PR URL

## After PR creation

Update TRACKING.md: add PR URL and date.
Update STATE.md: mark feature as complete.

```
PR created! <URL>
━━━━━━━━━━━━━━━━━━
Feature "<name>" is complete.

  /bet-new-feature <name>    Start the next feature
  /bet-progress              View overall status
━━━━━━━━━━━━━━━━━━
```

## Rules

- **Never create a PR without user approval.**
- **Never create a PR from `main` or `develop`** — warn the user.
- Follow the title format from `CONTRIBUTING.md`: `[SCOPE] Description`.
