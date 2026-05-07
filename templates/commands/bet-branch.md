---
description: Create a new branch following the BetArena simplified Git Flow (feature/BA-XXX-* or fix/BA-XXX-*, both from develop)
argument-hint: "[feature|fix] [BA-XXX] [name]"
allowed-tools: Bash(git *)
disable-model-invocation: true
---

Create a new branch following the BetArena simplified Git Flow.

## Instructions

1. Check the current branch with `git branch --show-current`.
2. Ask the user (if not provided in $ARGUMENTS):
   - **Type:** `feature` (new functionality) or `fix` (bug correction)?
   - **Jira ticket:** `BA-XXX` (omit only if no ticket exists)
   - **Name:** short kebab-case name describing the work (lowercase, hyphens, no accents)

3. Compute the branch name:
   - With ticket: `<type>/BA-<number>-<kebab-name>` (e.g. `feature/BA-123-add-bet-placement`)
   - Without ticket: `<type>/<kebab-name>` (e.g. `fix/landing-button-color`)

4. Determine the base branch:
   - `feature/*` and `fix/*` → branch from `develop`

5. Check for uncommitted changes — warn if any exist.

6. Create the branch:
   ```
   git checkout develop
   git pull origin develop
   git checkout -b <type>/<branch-name>
   ```

7. Confirm: "Branch `<type>/<branch-name>` created from `develop`. Ready to work."

## Rules

- **All branches** (feature and fix) **start from `develop`** in the simplified Git Flow.
- **Never branch from `main`.** Releases happen via `develop` → `main` PRs.
- **Never create a branch if there are uncommitted changes** — warn the user first.
- Branch name must be kebab-case, no spaces, no uppercase.
- Always include the Jira ticket prefix `BA-XXX` when one exists.
