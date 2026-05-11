# BetArena — Claude Code Workflow

[![npm version](https://img.shields.io/npm/v/claude-betarena.svg)](https://www.npmjs.com/package/claude-betarena)
[![license](https://img.shields.io/npm/l/claude-betarena.svg)](https://github.com/AntoineCor35/claude-betarena/blob/main/LICENSE)

A guided workflow system for [Claude Code](https://claude.ai/claude-code) that turns your AI assistant into a structured development partner.

Instead of free-form prompting, BetArena provides a **tunnel-based workflow**: every feature goes through a defined pipeline — from planning to implementation to PR — with context isolation, session resumption, and an optional Professor Mode for learning along the way.

---

## Why?

Working with Claude Code on real projects, you quickly run into problems:

- **Context loss** — long conversations degrade quality as the context window fills up
- **No structure** — the agent doesn't know where you are in your work
- **Session breaks** — when you come back the next day, all context is gone
- **No guardrails** — nothing stops you from committing to `main` or skipping tests

BetArena solves this with **file-based state management**, **phase-isolated context**, and **deterministic hooks** that enforce rules at the system level.

---

## What's New in v2

- **Deterministic hooks** — branch protection, destructive command blocking, auto-lint, and session context injection are now enforced via `.claude/settings.json` hooks (not just CLAUDE.md suggestions)
- **Subagents** — dedicated reviewer, tester, and security agents using the Writer/Reviewer pattern for unbiased code review
- **Multi-feature support** — work on multiple features in parallel, switch context with `/bet-switch`
- **React Native conventions** — CONTRIBUTING.md now includes mobile-specific conventions
- **Auto-sync templates** — `npm run sync` copies `.claude/` to `templates/` so you only maintain one copy

---

## Quick Start

### 1. Install

Run this in your project root:

```bash
npx claude-betarena
```

This installs, into the project:

- `.claude/commands/` — 16 slash commands (`/bet-*`)
- `.claude/agents/` — 3 subagents (reviewer, tester, security) using the Writer/Reviewer pattern
- `.claude/output-styles/betarena-professor.md` — native Professor Mode output style
- `.claude/skills/betarena-conventions/SKILL.md` — auto-triggered conventions guide (commit format, branch naming, Task runner rule, DoD)
- `.claude/hooks/` — shell + Node hooks (branch guard, post-edit lint, session context, block protected-branch commit, suggest refresh after pull)
- `.claude/settings.json` — shared team permissions and wires the hooks
- `CLAUDE.md`, `CONTRIBUTING.md` (root) — agent rules and team conventions
- `.planning/` added to `.gitignore`

All non-destructive: existing files are skipped unless you pass `--force`.

To pull in updates safely after a package upgrade:

```bash
npx claude-betarena update
```

Shows what's outdated/missing and asks per-file (or `[a]ll`) before touching anything. Prefer this over `--force`.

### 2. Onboard (one-time)

```
/bet-onboarding
```

This sets up:
- Your identity (name, email for commits/PRs)
- A full codebase audit (stack, architecture, conventions, structure, tests)
- Recommended MCP integrations (Jira, GitHub, Chrome DevTools, Playwright, Figma)

### 3. Start a feature

```
/bet-new-feature user authentication system
```

You enter a guided tunnel:
1. The agent asks clarifying questions
2. Writes a plan and asks for your review
3. Splits the plan into phases
4. Creates a tracking document for session resumption
5. Creates the GitFlow branch
6. Proposes next commands

### 4. Work phase by phase

```
/bet-plan-phase 1 discuss     # Detail the technical approach (use `discuss` flag for Q&A first)
/bet-execute 1                # Implement the code
/bet-commit                   # Commit (respects CONTRIBUTING.md)
/bet-next                     # Move to next phase
```

Repeat until all phases are done. The last phase is always **tests**.

### 5. Ship it

```
/bet-review                   # AI code review (fresh context)
/bet-doc                      # Update project documentation
/bet-pr                       # Create the Pull Request
```

---

## Commands

> **Don't remember a specific command?** Just type `/bet` — it's a smart router that detects your current state and proposes the right next action.

### Setup

| Command | Description |
|---------|-------------|
| `/bet-onboarding` | One-time project setup: identity, codebase audit, MCP integrations (Atlassian incl.) |
| `/bet-refresh` | Re-audit the codebase after a `git pull` or structural changes |

### Feature Lifecycle

| Command | Description |
|---------|-------------|
| `/bet` | **Smart router** — diagnoses state, proposes/runs the right next action |
| `/bet-new-feature [fix] <name>` | Start the guided tunnel ; `fix` flag creates a `fix/BET-XXX-*` branch instead of `feature/BET-XXX-*` |
| `/bet-plan-phase <N> [discuss] [prof]` | Detailed technical plan for a phase ; `discuss` flag for Q&A first |
| `/bet-execute <N> [prof]` | Implement the phase code |
| `/bet-next` | Advance to the next phase (DoD gate) |
| `/bet-pause` | Save a session handoff (HANDOFF.md) — re-read at next `/bet-progress` |
| `/bet-progress` | Resume a session with full contextual briefing |
| `/bet-switch [slug]` | Switch between parallel features |

### Git & Delivery

| Command | Description |
|---------|-------------|
| `/bet-commit` | Propose a commit following conventions |
| `/bet-pr` | Create a Pull Request |
| `/bet-doc` | Update project documentation |
| `/bet-review [security]` | AI code review with fresh context (Writer/Reviewer pattern) |

### Professor Mode

Type `/output-style betarena-professor` (native Claude Code command) to enable Professor Mode globally for the session — explanations on every non-trivial decision. Type `/output-style default` to disable. Or add `prof` as an argument to any `/bet-*` command for a one-shot pedagogical run (e.g. `/bet-execute 1 prof`).

---

## Hooks & Safety

BetArena v2 enforces rules at the system level via `.claude/settings.json` hooks — not just CLAUDE.md suggestions that the LLM can ignore.

| Hook | Trigger | What it does |
|------|---------|-------------|
| `pre-bash-guard.sh` | Before any Bash command | Blocks `git push origin main/develop`, `git reset --hard`, `rm -rf`, direct commits on protected branches |
| `post-edit-lint.sh` | After any file edit | Auto-detects and runs your linter (Prettier, ESLint, Biome) |
| `session-start.sh` | Session start | Injects current branch, git status, and active feature context |

These are deterministic — no matter what the LLM "decides", the hook blocks the action. The `settings.json` also includes permission deny rules for force pushes and recursive deletes.

---

## Subagents

Three specialized agents in `.claude/agents/` provide fresh-context analysis:

| Agent | Purpose |
|-------|---------|
| **reviewer** | Code review using the Writer/Reviewer pattern — reviews the diff without implementation bias |
| **tester** | Dedicated test writing — enforces happy path + edge case minimum |
| **security** | Security audit — scans for secrets, XSS, injection, insecure storage |

Use them via `/bet-review` (code review) or `/bet-review security` (security audit).

---

## Multi-Feature Support

Unlike v1 which blocked if a feature was in progress, v2 supports parallel features:

```
/bet-new-feature login-system      # Start feature A
# ... work on it ...
/bet-new-feature hotfix-crash      # Pause A, start B
/bet-switch login-system           # Switch back to A
/bet-progress                      # Shows all features, highlights active
```

Each developer's `.planning/STATE.md` tracks multiple features with one marked as `Active`.

---

## Professor Mode

Professor Mode turns the agent into a teaching partner. It explains the *why* behind every decision, breaks down concepts, and asks if you understood before moving on.

**Two ways to activate:**

```
/output-style betarena-professor   # Global — affects all commands until /output-style default
/bet-execute 1 prof                # Per-command — just for this one
```

Ideal for:
- Junior developers learning the codebase
- Understanding architectural decisions
- Code review and knowledge transfer

---

## The Tunnel — How It Works

```
/bet-new-feature
    |
    +-- Questions (scope, business logic, technical choices)
    +-- Plan (written, reviewed, approved by you)
    +-- Phase split (each phase independently testable)
    +-- Tracking doc (for session resumption)
    +-- Branch creation (GitFlow)
         |
         +-- Phase 1: Code
         |    +-- /bet-plan-phase 1 discuss   (optional)
         |    +-- /bet-plan-phase 1      (recommended)
         |    +-- /bet-execute 1
         |    +-- /bet-commit
         |
         +-- Phase 2: Code
         |    +-- ...
         |    +-- /bet-commit
         |
         +-- Phase N: Tests
         |    +-- /bet-execute N
         |    +-- /bet-commit
         |
         +-- Delivery
              +-- /bet-review
              +-- /bet-doc
              +-- /bet-pr
```

### Session resumption

```
/bet-progress
```

Reloads all context from tracking documents and phase summaries. Displays a full briefing of what's been done, where you are, and what to do next. Designed for picking up the next day without losing anything.

---

## Context Isolation

The key innovation borrowed from [GSD](https://github.com/gsd-build/get-shit-done) — each phase gets its own context documents instead of relying on conversation history:

```
.planning/
  STATE.md                          # Active feature, all features, mode
  IDENTITY.md                       # Name, email
  codebase/
    STACK.md                        # Tech stack and dependencies
    ARCHITECTURE.md                 # System design and layers
    CONVENTIONS.md                  # Coding patterns and standards
    STRUCTURE.md                    # Directory layout
    TESTING.md                      # Test framework and patterns
  <feature>/
    PLAN.md                         # Feature plan with all phases
    TRACKING.md                     # Progress + context briefing
    phase-01/
      CONTEXT.md                    # Decisions from /bet-plan-phase (avec flag discuss)
      SUMMARY.md                    # Recap after /bet-execute
    phase-02/
      CONTEXT.md
      SUMMARY.md
```

When executing Phase 3, the agent loads:
- `PLAN.md` (phase 3 only)
- `phase-03/CONTEXT.md` (if it exists)
- `phase-02/SUMMARY.md` (previous phase recap)
- `codebase/CONVENTIONS.md` (project patterns)

It does **not** load phase 1 details, full conversation history, or unrelated code. This keeps the context window at ~30% utilization, leaving room for actual implementation work.

Everything in `.planning/` is **gitignored** — these are agent-internal documents, never committed.

---

## Layer-Specific Rules

For multi-layer projects, add `CLAUDE.md` in subdirectories. Claude merges these automatically with root rules:

```
CLAUDE.md                           # Root — golden rules, conventions
src/screens/CLAUDE.md               # Screen-specific rules
src/api/CLAUDE.md                   # API layer rules
```

An example mobile CLAUDE.md is provided in `templates/examples/mobile-CLAUDE.md`.

---

## Atlassian (Jira + Confluence)

`/bet-onboarding` Phase 3.1 walks you through a **guided setup** that doesn't require you to touch your shell rc :

1. Asks for your Atlassian domain (default `betarena`)
2. Writes `.mcp.json` at the project root — **committed in the team repo** — pointing to a wrapper script
3. Walks you to the Atlassian token generation page
4. Asks for your email + the token, then **writes them into `.env` for you** (creating `.env` if needed, or **appending** to your existing `.env` without disturbing other variables)
5. Adds `.env` to `.gitignore`
6. Verifies `uvx` is installed (`brew install uv` if not)
7. Asks you to restart Claude Code so the MCP server picks up your credentials

**Sharing pattern** : `.mcp.json` and `.claude/scripts/start-atlassian.sh` are committed (the team owns the server config jointly). The credentials live in your local `.env` (gitignored, per-user). Nobody else ever sees your token.

If your token rotates : just edit `.env`, save, restart Claude Code. Done. No shell rc surgery.

Once configured, you get:

| What | Trigger |
|------|---------|
| **Jira ticket fetch** | `/bet-new-feature BET-123` pulls the ticket title, description, acceptance criteria, status |
| **Confluence spec auto-load** | If the Jira ticket has a linked Confluence page, `/bet-new-feature` summarizes it into `.planning/<feature>/SPEC-RECAP.md` |
| **Métier glossary lookup** | Skill `betarena-confluence` auto-loads the team glossary when domain terms (bet, stake, odds, parlay, etc.) need clarification |
| **ADR proposals** | `/bet-plan-phase (avec flag discuss)` and `/bet-plan-phase` can propose to create Architecture Decision Records on Confluence after explicit user approval |

The Atlassian MCP server uses [`mcp-atlassian`](https://github.com/sooperset/mcp-atlassian) via `uvx` — install [`uv`](https://docs.astral.sh/uv/getting-started/installation/) first (`brew install uv` on macOS).

---

## Git Conventions

BetArena enforces the conventions defined in `CONTRIBUTING.md`:

**Commits:** `<type>(<scope>): <description>` — types: `feat, fix, docs, style, refactor, test, chore` — scopes: `mobile, backend, shared, landing, ci, docs`
```
feat(backend): add bet resolution service
fix(mobile): resolve wallet balance refresh bug
test(shared): add unit tests for odds calculator
```

**PRs:** `[<SCOPE>] BET-XXX <Description>` — squash merge, CI verte requise, 1 approbation min
```
[BACKEND] BET-123 Add bet placement endpoint
[MOBILE] BET-456 Fix wallet balance refresh
```

**Branches:**
```
feature/BET-123-add-bet-placement     → merges to develop
fix/BET-789-wallet-balance-error      → merges to develop
develop                              → merges to main (release)
```

The agent **never commits without your approval** and **never pushes to protected branches** (enforced by hooks).

---

## Recommended MCP Integrations

Proposed during `/bet-onboarding`:

| MCP | Purpose |
|-----|---------|
| **Atlassian (Jira)** | Link features to tickets, track progress |
| **GitHub** | PR management, issue tracking |
| **Chrome DevTools** | Debug frontend, inspect DOM/network/console |
| **Playwright** | Automated E2E testing |
| **Figma** | Import designs and mockups as reference |

All optional — install what makes sense for your project.

---

## For Maintainers

### Template Sync

Files are maintained in `.claude/` (the "live" copy) and synced to `templates/` automatically:

```bash
npm run sync         # Manual sync
npm publish          # Auto-syncs via prepublishOnly
```

This means you only edit files in `.claude/` and `CLAUDE.md`/`CONTRIBUTING.md` at root. The sync script copies everything to `templates/`.

---

## Recommended Claude Code Config

BetArena targets Claude Code v2.1.111+ with Opus 4.7. The following user-level settings (`~/.claude/settings.json`) are recommended but optional:

```json
{
  "model": "opusplan",
  "effortLevel": "xhigh",
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "sonnet"
  }
}
```

**Why these defaults:**

| Setting | Effect |
|---------|--------|
| `model: opusplan` | Uses Opus 4.7 in plan mode (`/bet-plan-phase`, `/bet-plan-phase (avec flag discuss)`) and switches to Sonnet 4.6 for execution (`/bet-execute`). Best reasoning where it matters, lower cost during code generation. |
| `effortLevel: xhigh` | Default on Opus 4.7. Best balance of reasoning depth and token spend for agentic coding tasks. |
| `CLAUDE_CODE_SUBAGENT_MODEL: sonnet` | Sub-agents (`reviewer`, `tester`) inherit Sonnet by default — frontmatter `model:` overrides this per-agent (e.g., `security` keeps Opus). |

**1M context window** is included automatically on Max, Team, and Enterprise plans. To force it on Pro/API: `/model opus[1m]`. The phase-isolated `.planning/` strategy still helps focus the agent, but the 1M window means SUMMARY.md files no longer need to be aggressively trimmed.

> **Note:** Opus 4.7 always uses adaptive reasoning. `MAX_THINKING_TOKENS` and `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` have no effect on it — control reasoning depth via `effortLevel` or `/effort` instead.

---

## Requirements

- [Claude Code CLI](https://claude.ai/claude-code) v2.1.111+ (required for Opus 4.7)
- Git
- A project with `develop` and `main` branches (GitFlow)
- Optional: `gh` CLI for PR creation, Jira MCP for ticket integration
