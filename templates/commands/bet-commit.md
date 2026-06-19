---
description: Propose a commit following BetArena conventions and wait for user approval
allowed-tools: Read, Bash(git status*), Bash(git diff*), Bash(git add *), Bash(git commit *), Bash(git log*)
disable-model-invocation: true
---

Propose a commit following BetArena conventions and wait for user approval.

## Instructions

1. Read `CONTRIBUTING.md` — source of truth for commit format.
2. Read `.planning/STATE.md` — identify the **active** feature (from the `Active:` line) and its phase.
3. Read `.planning/IDENTITY.md` — for commit author info.
4. Run `git status` and `git diff --staged` (or `git diff` if nothing is staged) to see what changed.
5. **Lint/format check** — the project uses [Task](https://taskfile.dev) as its task runner. Identify the area(s) touched by the diff (frontend, backend, mobile) and run the matching command(s):
   - Frontend touched → `task front:lint` (or `task front:format-lint` for full check)
   - Backend touched → `task back:build` (no dedicated `back:lint` — TypeScript compilation acts as the lint gate)
   - Mobile touched → `task mobile:lint`
   - If any fails, **stop and tell the user** before proposing a commit. Do **not** invent commands — only use what `task --list` exposes.
6. **Tests** — there is no top-level `task test` command yet. If the diff touches code with tests (e.g. `src/backend/**`), run Jest via the corresponding workspace (`npm --workspace=src/backend test` or equivalent). If tests fail, **stop and tell the user** instead of proposing a commit.

## Build the commit message

Analyze the changes and determine the correct **type** and **scope** based on `CONTRIBUTING.md`:

```
<type>(<scope>): <short description in present tense, imperative, lowercase>

- <meaningful detail about what changed>
- <another detail if needed>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scopes:** `mobile`, `backend`, `shared`, `landing`, `ci`, `docs`

> If the change does not fit any scope above, ask the user — do **not** invent a new scope.

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
- On `main` or `develop` → **refuse** and suggest `/bet-new-feature [fix] <name>` to create a proper branch first.
- On a `feature/*` or `fix/*` branch → proceed.
