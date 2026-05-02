# BetArena — Agent Rules

## Golden Rules

1. **Never commit directly to `main` or `develop`.** All changes go through branches and PRs.
2. **Never commit without user approval.** Always propose the message first.
3. **Follow GitFlow.** `feature/*` → `develop`, `hotfix/*` → `main`.
4. **Always plan before coding.** Every non-trivial feature goes through the workflow tunnel.

## Workflow — The Tunnel

Every feature follows: `/bet-new-feature` → per-phase (`/bet-plan-phase` → `/bet-execute` → `/bet-commit` → `/bet-next`) → `/bet-doc` → `/bet-pr`. The agent **never skips steps** and **always proposes next commands**. Last phase is always tests. Use `/bet-progress` to resume a session.

## Context Isolation

Each phase loads ONLY what it needs from `.planning/`. The SUMMARY.md of previous phases provides continuity WITHOUT loading full conversation history. Never commit `.planning/` files.

## Commit Convention

Format: `<type>(<scope>): <description>` — Read `CONTRIBUTING.md` for full conventions.

- **Types:** `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`, `perf`, `ci`, `build`, `revert`
- **Scopes:** `global`, `front`, `back`, `mobile`, `data`, `db`
- Description in present tense, imperative mood, lowercase, no period

## PR Convention

Title format: `[<SCOPE>] <Description>` — Scopes: `GLOBAL`, `FRONT`, `BACK`, `MOBILE`, `DATA`, `DB`

The author must fill the description, assign themselves, and add labels. PRs targeting `main` must include reviewers: Antoine Cormier & Maxence Guidez.

## Branch Naming

| Type | Pattern | Merge target |
|------|---------|-------------|
| Feature | `feature/<name>` | `develop` |
| Hotfix | `hotfix/<name>` | `main` |

## Professor Mode

Activate globally with `/bet-prof on` or per-command with `prof` argument (e.g., `/bet-execute 1 prof`). Explains the *why* behind every decision.

## Layer-Specific Rules

For multi-layer projects, add CLAUDE.md in subdirectories (e.g., `src/screens/CLAUDE.md`, `src/api/CLAUDE.md`). Claude merges these automatically with root rules.

## Jira Integration

If Atlassian MCP is installed, `/bet-new-feature` checks for matching Jira tickets. See `/bet-onboarding` for setup.

## Hooks & Safety

Deterministic hooks in `.claude/settings.json` enforce branch protection, block destructive commands, auto-lint after edits, and inject session context. These are **system-level guards** — not suggestions.

## Recommended Model Config

`model: opusplan` (Opus 4.7 in plan mode, Sonnet 4.6 in execute mode) with `effortLevel: xhigh`. Sub-agents declare their own model via frontmatter (`reviewer`/`tester` use Sonnet, `security` keeps Opus). Opus 4.7 always uses adaptive reasoning — control depth with `effortLevel` or `/effort`, not `MAX_THINKING_TOKENS`.
