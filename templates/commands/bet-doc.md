---
description: Update project documentation routed to the right file (README, CONTRIBUTING, docs/*)
argument-hint: "[prof]"
allowed-tools: Read, Edit, Write, Glob, Grep
disable-model-invocation: true
---

Update project documentation for the current or recently completed feature, routed to the right file.

Usage: `/bet-doc [prof]`

## Setup

1. Read `.planning/STATE.md` — identify the feature.
2. Read `.planning/<feature>/PLAN.md` — what was built.
3. Read `.planning/<feature>/TRACKING.md` — phase summaries.
4. Read each `.planning/<feature>/phase-<NN>/SUMMARY.md` to know which files were touched.
5. List the existing project docs:
   - `README.md` — vision projet
   - `CONTRIBUTING.md` — conventions (commits, PRs, branches, code, langue)
   - `docs/getting-started.md` — setup poste neuf (Node, npm, Task, Docker)
   - `docs/taskfile.md` — référence des commandes Task
   - `docs/docker.md` — architecture Docker
   - `docs/quality-plan.md` — plan qualité (Scrum, DoD, CI/CD, tests)
   - Any other `docs/*.md` already present (read them once to know what's covered)

## Routing — which doc to update?

For each meaningful change in the feature, route to the **right** file. Don't dump everything into the README.

| Type of change | Target doc |
|----------------|-----------|
| New user-facing feature, UX flow, screenshot | `README.md` (Features section) |
| New `task ...` command added or behavior changed | `docs/taskfile.md` |
| New Docker service, volume, env var, port | `docs/docker.md` + `docs/getting-started.md` (port table if conflict-prone) |
| New onboarding step, prerequisite, version bump (Node/npm) | `docs/getting-started.md` |
| Convention change (commit type/scope, branch naming, langue, etc.) | `CONTRIBUTING.md` (and ping the user — these often need team alignment) |
| Test strategy, coverage target, DoD update | `docs/quality-plan.md` (and ping the user — same reason) |
| New module/service with non-trivial internals | New `docs/<module>.md` (propose the filename to the user first) |
| Internal mechanism, complex algorithm | Inline comment / JSDoc on the function — **not** a doc file |

If a change spans multiple categories, propose updates to **each** relevant file separately.

## Workflow

For each doc that needs updating:

1. **Read** the current content of the doc.
2. **Draft** the change as a unified diff or "before/after" block. Keep it short, honest, and aligned with the doc's existing tone (the project docs are in **French** — keep it that way).
3. **Present** the proposal to the user:

   > **Doc to update:** `docs/taskfile.md`
   > **Reason:** new `task back:migrate` command added in Phase 2.
   >
   > **Proposed change** *(under "Backend — Local" section)* :
   > ```diff
   > | `task back:preview` | Lance le backend compilé depuis `dist/`             |
   > +| `task back:migrate` | Lance les migrations Prisma sur la DB locale        |
   > ```
   >
   > Apply this change? (yes / edit / skip)

4. **Wait** for explicit approval per doc. Apply only after approval.

## Rules

- **Never write to a doc without user approval.** One approval = one doc.
- **Never invent facts.** If you're not sure something is true, ask the user before writing it.
- **Keep doc language consistent.** Project docs are in French; keep them in French unless the user explicitly says otherwise.
- **Don't duplicate.** If something is already in `CONTRIBUTING.md`, don't restate it in `README.md` — link to it.
- **Don't bloat the README.** If a section grows past ~10 lines for a single feature, move it to a dedicated `docs/<feature>.md` and link from the README.

## Prof mode

If `prof` is in `$ARGUMENTS`:
- Explain what makes good documentation (concision, honnêteté, tone aligné)
- Show before/after for each proposed change with a one-line rationale
- Explain why a particular doc was chosen over another (e.g. "this is a Task command so it goes in `docs/taskfile.md`, not the README")
- Ask "Compris ?" before applying

## Finish

After all approved updates are applied:

```
Documentation updated.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files modified:
  • <file 1>
  • <file 2>

Next:
  /bet-pr        Create the Pull Request (will run final DoD gate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
