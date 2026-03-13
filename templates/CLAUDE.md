# BetArena — Agent Rules

## Golden Rules

1. **Never commit directly to `main` or `develop`.** All changes go through branches and PRs.
2. **Never commit without user approval.** Always propose the message first.
3. **Follow GitFlow.** `feature/*` → `develop`, `hotfix/*` → `main`.
4. **Always plan before coding.** Every non-trivial feature goes through the workflow tunnel.

## Workflow — The Tunnel

Every feature follows a guided tunnel. The agent **never skips steps** and **always proposes next commands**.

```
/bet-onboarding (one-time)
    └→ Identity, codebase audit, MCP setup

/bet-new-feature <name>
    └→ Questions → Plan → Review → Phases → Tracking → Branch
    └→ Proposes: /bet-discuss-phase, /bet-plan-phase, /bet-execute

Per phase:
    /bet-discuss-phase <N> [prof]   → Optional Q&A to refine context
    /bet-plan-phase <N> [prof]      → Detail technical plan (recommended)
    /bet-execute <N> [prof]         → Implement code
    /bet-commit                     → Commit (after each phase)
    /bet-next                       → Advance to next phase

Last phase is always tests:
    /bet-execute <last> [prof]      → Write and run tests

End of feature:
    /bet-commit → /bet-doc → /bet-pr

Session resumption:
    /bet-progress                   → Full contextual briefing + next commands
```

## Context Isolation

Each phase has its own context window. Commands load ONLY what's needed:

- **Phase context:** `.planning/<feature>/phase-<NN>/CONTEXT.md`
- **Phase summary:** `.planning/<feature>/phase-<NN>/SUMMARY.md`
- **Codebase audit:** `.planning/codebase/*.md`
- **Feature plan:** `.planning/<feature>/PLAN.md`
- **Tracking:** `.planning/<feature>/TRACKING.md`

The SUMMARY.md of previous phases provides continuity WITHOUT loading full conversation history.

## Commands Reference

| Command | Purpose |
|---------|---------|
| `/bet-onboarding` | One-time setup: identity, audit, MCPs |
| `/bet-new-feature <name>` | Start feature tunnel |
| `/bet-discuss-phase <N> [prof]` | Q&A to refine phase context (optional) |
| `/bet-plan-phase <N> [prof]` | Detail technical plan for phase |
| `/bet-execute <N> [prof]` | Implement phase code |
| `/bet-commit` | Propose commit (contributing.md format) |
| `/bet-next` | Advance to next phase |
| `/bet-progress` | Resume session with full briefing |
| `/bet-pr` | Create Pull Request |
| `/bet-doc` | Update documentation |
| `/bet-prof on/off` | Toggle Professor Mode globally |
| `/bet-branch` | Create GitFlow branch |
| `/bet-refresh` | Re-audit codebase after pull |
| `/bet-docker` | Docker management (placeholder) |

## Professor Mode

Two ways to activate:
- **Global:** `/bet-prof on` — affects all commands until toggled off
- **Per-command:** Add `prof` as argument — e.g., `/bet-execute 1 prof`

In Professor Mode, the agent explains the *why* behind every decision, breaks down concepts, and asks if the user understood before moving on.

## Commit Convention

Format: `<type>(<scope>): <description>`

- **Types:** `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`, `perf`, `ci`, `build`, `revert`
- **Scopes:** `global`, `front`, `back`, `mobile`, `data`, `db`
- Description in present tense, imperative mood, lowercase, no period

Read `CONTRIBUTING.md` for full conventions.

## PR Convention

Title format: `[<SCOPE>] <Description>`

- **Scopes:** `GLOBAL`, `FRONT`, `BACK`, `MOBILE`, `DATA`, `DB`
- The author must fill the description, assign themselves, and add labels.
- PRs targeting `main` must include reviewers: Antoine Cormier & Maxence Guidez.

## Branch Naming

| Type | Pattern | Merge target |
|------|---------|-------------|
| Feature | `feature/<name>` | `develop` |
| Hotfix | `hotfix/<name>` | `main` |

## State Tracking

- **State:** `.planning/STATE.md` — current feature, phase, mode
- **Plans:** `.planning/<feature>/PLAN.md` — feature plan with phases
- **Tracking:** `.planning/<feature>/TRACKING.md` — phase progress and context briefing
- **Phase context:** `.planning/<feature>/phase-<NN>/CONTEXT.md` — per-phase decisions
- **Phase summary:** `.planning/<feature>/phase-<NN>/SUMMARY.md` — post-execution recap
- **Codebase audit:** `.planning/codebase/*.md` — project analysis
- **Identity:** `.planning/IDENTITY.md` — user info for commits/PRs

Everything in `.planning/` is gitignored. Never commit planning files.

## Jira Integration

If Atlassian MCP is installed (`Jira: enabled` in STATE.md):
- `/bet-new-feature` checks for matching Jira tickets
- User can reference a ticket ID or describe the feature for auto-matching
- If no match, propose creating a new ticket
- Track ticket ID in TRACKING.md

## Testing

- The **last phase** of every feature is dedicated to tests
- At minimum: one happy path + one edge case per feature
- Tests must pass before proposing a commit
- In Professor Mode: explain what each test validates and why
