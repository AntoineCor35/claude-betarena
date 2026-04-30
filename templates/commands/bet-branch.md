---
description: Create a new GitFlow branch (feature/* from develop or hotfix/* from main)
argument-hint: "[feature|hotfix] [name]"
allowed-tools: Bash(git *)
disable-model-invocation: true
---

Create a new branch following GitFlow conventions.

## Instructions

1. Check the current branch with `git branch --show-current`.
2. Ask the user (if not provided in $ARGUMENTS):
   - **Type:** feature or hotfix?
   - **Name:** short kebab-case name describing the work

3. Determine the base branch:
   - `feature/*` → branch from `develop`
   - `hotfix/*` → branch from `main`

4. Check for uncommitted changes — warn if any exist.

5. Create the branch:
   ```
   git checkout <base-branch>
   git pull origin <base-branch>
   git checkout -b <type>/<name>
   ```

6. Confirm: "Branch `<type>/<name>` created from `<base>`. Ready to work."

## Rules

- **Never create a branch from `main` for features** — always from `develop`.
- **Never create a branch if there are uncommitted changes** — warn the user first.
- Branch name must be kebab-case, no spaces, no uppercase.
