---
name: betarena-conventions
description: BetArena project conventions — load when about to commit, push, open a PR, create a branch, or run lint/build/tests. Covers Conventional Commits format, branch naming with BA-XXX Jira prefix, the mandatory Task runner (never npm directly), the simplified Git Flow, and the Definition of Done checklist. Use proactively whenever the agent is about to invoke `git commit`, `git push`, `gh pr create`, or any quality gate command.
---

# BetArena — Conventions Quick Reference

You are about to perform a code-quality, version-control, or delivery action on a BetArena project. Apply the rules below. The authoritative sources are `CONTRIBUTING.md` (commits/PRs/branches/code) and `docs/quality-plan.md` (DoD, tests, CI/CD) — read them when in doubt.

---

## Commits — Conventional Commits

Format: `<type>(<scope>): <description>`

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scopes:** `mobile`, `backend`, `shared`, `landing`, `ci`, `docs`
- **Description:** English, present tense, imperative, lowercase, no trailing period.

If a change does not fit any scope above, **ask the user** — do not invent a new scope.

Examples:
- `feat(backend): add bet resolution service`
- `fix(mobile): resolve wallet balance refresh bug`
- `test(shared): add unit tests for odds calculator`

**Forbidden:** committing on `main` or `develop`. Always work on a `feature/BA-XXX-*` or `fix/BA-XXX-*` branch.

---

## Pull Requests

Title: `[<SCOPE>] BA-XXX <Description>` — scope uppercase: `MOBILE`, `BACKEND`, `SHARED`, `LANDING`, `CI`, `DOCS`. Omit `BA-XXX` only if no Jira ticket.

Required body sections: *What does this PR do?*, *Jira*, *How to test*, *Screenshots* (if UI), *Tests* (CI passes / new tests / existing pass), *Notes*.

Author must self-assign and add the Jira component label. Reviewers: minimum 1 approval; PRs targeting `main` require **Antoine Cormier** + **Maxence Guidez**.

Merge: **squash merge** only, **CI green** required, branch deleted after merge.

---

## Branches — Simplified Git Flow

```
main ─────────────── Production
  └── develop ─────  Integration
        ├── feature/BA-XXX-<kebab-name>   → develop (PR)
        └── fix/BA-XXX-<kebab-name>       → develop (PR)
```

- All branches (feature **and** fix) start from `develop`.
- `BA-XXX` is the Jira ticket ID — include it whenever a ticket exists.
- `<kebab-name>` is lowercase, hyphenated, no spaces, no accents.
- Never branch from `main` directly. Releases happen via `develop` → `main` PRs.

---

## Task runner — mandatory

The project uses **Task** ([taskfile.dev](https://taskfile.dev)). **Never** invoke `npm run <script>` directly when a `task` wrapper exists.

| Action | Command |
|--------|---------|
| Lint frontend | `task front:lint` (or `task front:format-lint`) |
| Lint mobile | `task mobile:lint` |
| Build backend (acts as TS lint gate) | `task back:build` |
| Build frontend | `task front:build` |
| Start Docker dev stack | `task dev:up` |
| Restart a service | `task dev:restart -- <service>` |
| Stop everything | `task dev:down` |
| Setup repo | `task setup` |

Tests: **no top-level `task test` exists yet**. Run Jest via the relevant npm workspace (e.g. `npm --workspace=src/backend test`). When `task test` ships, switch to it immediately.

If a wrapper does not exist, run `task --list` first to discover it before falling back to npm.

---

## Code conventions

- **TypeScript strict** across the monorepo (mobile, backend, shared).
- **ESLint + Prettier** (shared configs `@betarena/eslint-config`).
- **Imports** via TS aliases (`@shared/`, `@services/`) — no deep relative paths.
- **Naming:** `camelCase` (vars/fns), `PascalCase` (components/types), `UPPER_SNAKE_CASE` (constants).
- **Comments:** only for non-obvious logic. JSDoc for public service functions. No trivial comments.
- **Languages:** code in **English**, project documentation in **French**.

---

## Definition of Done — Story (per `quality-plan.md` §9.1)

A story is *Done* when:

- [ ] Code merged to `develop` via approved PR (≥ 1 approval)
- [ ] CI green (lint + tests)
- [ ] Unit tests cover nominal + error cases on critical business logic (target 70 %)
- [ ] Integration tests cover touched endpoints (if backend)
- [ ] Jira ticket BA-XXX moved to "Done"
- [ ] Feature testable on simulator/device (if mobile/frontend)
- [ ] Acceptance criteria from PRD/ticket are met

Critical test domains (per quality-plan §6.2): **économie virtuelle**, **calcul de cotes**, **résolution de paris**, **achievements**, **auth**.

---

## Bug priorities (quick reference)

| Priority | Description | Resolution |
|----------|-------------|-----------|
| P0 — Bloquant | App crash, data loss, credit loss | Immediate (drop everything) |
| P1 — Critique | Major feature broken (auth, betting) | Current sprint |
| P2 — Majeur | Degraded feature (display, slowness) | Next sprint |
| P3 — Mineur | Cosmetic, copy, minor improvement | Backlog |

---

## When you are unsure

- For commit format details → re-read `CONTRIBUTING.md`.
- For test strategy / coverage targets → re-read `docs/quality-plan.md` §6.
- For Task command syntax → re-read `docs/taskfile.md` or run `task --list`.
- For Docker setup details → re-read `docs/docker.md`.

**Always ask the user** before inventing a new scope, branch type, or Task command.
