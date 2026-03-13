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

BetArena solves this with **file-based state management** and **phase-isolated context**. Each phase of your feature gets its own context documents. The agent loads only what it needs, keeping the context window lean and focused.

---

## Quick Start

### 1. Install

Run this in your project root:

```bash
npx claude-betarena
```

This copies the slash commands, `CLAUDE.md`, `CONTRIBUTING.md`, and sets up `.gitignore` — all non-destructive (existing files are skipped unless you use `--force`).

To overwrite existing files:

```bash
npx claude-betarena --force
```

The `.claude/commands/` directory is automatically detected by Claude Code.

### 2. Onboard (one-time)

```
/bet-onboarding
```

This sets up:
- Your identity (name, email for commits/PRs)
- A full codebase audit (stack, architecture, conventions, structure, tests)
- Recommended MCP integrations (Jira, GitHub, Chrome DevTools, Playwright, Figma)
- Optional post-pull hook to keep the audit up to date

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
/bet-discuss-phase 1          # Optional — refine context through Q&A
/bet-plan-phase 1             # Detail the technical approach
/bet-execute 1                # Implement the code
/bet-commit                   # Commit (respects CONTRIBUTING.md)
/bet-next                     # Move to next phase
```

Repeat until all phases are done. The last phase is always **tests**.

### 5. Ship it

```
/bet-doc                      # Update project documentation
/bet-pr                       # Create the Pull Request
```

---

## Commands

### Setup

| Command | Description |
|---------|-------------|
| `/bet-onboarding` | One-time project setup: identity, codebase audit, MCP integrations |
| `/bet-refresh` | Re-audit the codebase after a `git pull` or structural changes |

### Feature Lifecycle

| Command | Description |
|---------|-------------|
| `/bet-new-feature <name>` | Start the guided feature tunnel |
| `/bet-discuss-phase <N> [prof]` | Q&A to refine phase context *(optional)* |
| `/bet-plan-phase <N> [prof]` | Create detailed technical plan for a phase |
| `/bet-execute <N> [prof]` | Implement the phase code |
| `/bet-next` | Advance to the next phase |
| `/bet-progress` | Resume a session with full contextual briefing |

### Git & Delivery

| Command | Description |
|---------|-------------|
| `/bet-commit` | Propose a commit following conventions |
| `/bet-pr` | Create a Pull Request |
| `/bet-branch` | Create a GitFlow branch manually |
| `/bet-doc` | Update project documentation |

### Modes

| Command | Description |
|---------|-------------|
| `/bet-prof on/off` | Toggle Professor Mode globally |
| `/bet-docker` | Docker management *(placeholder — coming soon)* |

---

## Professor Mode

Professor Mode turns the agent into a teaching partner. It explains the *why* behind every decision, breaks down concepts, and asks if you understood before moving on.

**Two ways to activate:**

```
/bet-prof on                   # Global — affects all commands
/bet-execute 1 prof            # Per-command — just for this one
```

Ideal for:
- Junior developers learning the codebase
- Understanding architectural decisions
- Code review and knowledge transfer

---

## The Tunnel — How It Works

```
/bet-new-feature
    │
    ├── Questions (scope, business logic, technical choices)
    ├── Plan (written, reviewed, approved by you)
    ├── Phase split (each phase independently testable)
    ├── Tracking doc (for session resumption)
    └── Branch creation (GitFlow)
         │
         ├── Phase 1: Code
         │    ├── /bet-discuss-phase 1   (optional)
         │    ├── /bet-plan-phase 1      (recommended)
         │    ├── /bet-execute 1
         │    └── /bet-commit
         │
         ├── Phase 2: Code
         │    ├── ...
         │    └── /bet-commit
         │
         ├── Phase N: Tests
         │    ├── /bet-execute N
         │    └── /bet-commit
         │
         └── Delivery
              ├── /bet-doc
              └── /bet-pr
```

### Feature gate

`/bet-new-feature` **blocks** if a feature is already in progress. You must finish or close the current one first. This prevents losing track of work.

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
  STATE.md                          # Current feature, phase, mode
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
      CONTEXT.md                    # Decisions from /bet-discuss-phase
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

## Jira Integration

If the Atlassian MCP is installed during onboarding:

- `/bet-new-feature` automatically searches for matching Jira tickets
- You can reference a ticket ID directly: `/bet-new-feature PROJ-123`
- Or describe the feature and let the agent find the matching ticket
- If no ticket exists, it proposes creating one
- The ticket ID is tracked throughout the feature lifecycle and linked in the PR

---

## Git Conventions

BetArena enforces the conventions defined in `CONTRIBUTING.md`:

**Commits:** `<type>(<scope>): <description>`
```
feat(front): add user login page
fix(back): resolve null pointer on bet creation
test(back): add unit tests for auth service
```

**PRs:** `[<SCOPE>] <Description>`
```
[FRONT] Add user authentication system
[BACK] Fix bet creation pipeline
```

**Branches:**
```
feature/user-auth      → merges to develop
hotfix/login-crash     → merges to main
```

The agent **never commits without your approval** and **never pushes to protected branches**.

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

## Requirements

- [Claude Code CLI](https://claude.ai/claude-code)
- Git
- A project with `develop` and `main` branches (GitFlow)
- Optional: `gh` CLI for PR creation, Jira MCP for ticket integration
