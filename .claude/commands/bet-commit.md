Propose a commit following BetArena conventions and wait for user approval.

## Instructions

1. Read `CONTRIBUTING.md` — source of truth for commit format.
2. Read `.planning/STATE.md` — current feature and phase.
3. Read `.planning/IDENTITY.md` — for commit author info.
4. Run `git status` and `git diff --staged` (or `git diff` if nothing is staged) to see what changed.
5. If the project has a test suite and this is relevant, run it — if tests fail, **stop and tell the user** instead of proposing a commit.

## Build the commit message

Analyze the changes and determine the correct **type** and **scope** based on `CONTRIBUTING.md`:

```
<type>(<scope>): <short description in present tense, imperative, lowercase>

- <meaningful detail about what changed>
- <another detail if needed>
```

**Types:** `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`, `perf`, `ci`, `build`, `revert`
**Scopes:** `global`, `front`, `back`, `mobile`, `data`, `db`

## Propose

Show the message to the user:

> **Proposed commit:**
> ```
> <commit message>
> ```
> Files to stage: <list>
>
> Approve? (yes / edit / cancel)

**Wait for explicit response:**
- **yes** → stage relevant files and commit
- **edit** → apply the user's version and commit
- **cancel** → do nothing

## Rules

- **Never commit without approval.**
- **Never use `git add -A` or `git add .`** — stage only the relevant files.
- If nothing is staged and nothing is modified, tell the user there's nothing to commit.
- If the user is on `main` or `develop`, warn them and suggest creating a branch first.
- After committing, confirm: "Committed: `<message>`"
- If this is a phase commit, remind: "Run `/bet-next` to continue."

## Branch safety

Check the current branch before committing:
- On `main` or `develop` → **refuse** and suggest `/bet-new-feature` or `/bet-branch`.
- On a feature/hotfix branch → proceed.
