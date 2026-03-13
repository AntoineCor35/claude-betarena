One-time project onboarding. Sets up identity, audits the codebase, and proposes useful MCP integrations.

## Guard

1. Check if `.planning/IDENTITY.md` exists.
   - **If yes:** Tell the user onboarding was already done. Show a summary of the identity and codebase audit date. Ask if they want to re-run specific parts (identity, audit, MCPs).
   - **If no:** Continue.

## Phase 1 — Identity

Ask the user:
- First name
- Last name
- Email (for git commits and PRs)

Save to `.planning/IDENTITY.md`:

```markdown
# Identity

First name: <value>
Last name: <value>
Email: <value>
Onboarded: <today's date>
```

## Phase 2 — Codebase Audit

Read the project root and analyze:

1. **STACK.md** — Scan `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `docker-compose.yml`, `Makefile`, CI configs, etc. Document:
   - Languages and versions
   - Frameworks and libraries
   - Build tools, bundlers, task runners
   - Dev dependencies (linting, formatting, testing)
   - Environment config patterns (.env, config files)

2. **ARCHITECTURE.md** — Trace the project structure:
   - Entry points
   - Layer organization (routes, controllers, services, models, etc.)
   - Data flow between components
   - Key patterns used (MVC, hexagonal, event-driven, etc.)

3. **CONVENTIONS.md** — Extract from code and config:
   - Naming patterns (files, variables, functions)
   - Import style, module organization
   - Error handling patterns
   - Linting/formatting rules from config files

4. **STRUCTURE.md** — Directory tree (excluding node_modules, .git, build artifacts):
   - Top-level directories and their roles
   - Key files and their purpose

5. **TESTING.md** — Analyze test setup:
   - Test framework and runner
   - Test file naming and location patterns
   - Fixtures, mocks, helpers
   - Coverage config if any

If anything is unclear or missing, **ask the user** (2-5 questions max). Wait for answers before finalizing.

Save all files to `.planning/codebase/`.

## Phase 3 — MCP Integrations

Present the available MCPs and explain what each brings:

```
Recommended MCP integrations:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1. Atlassian (Jira)    → Link features to tickets, track progress
 2. GitHub              → PR management, issue tracking from Claude
 3. Chrome DevTools     → Debug frontend, inspect DOM, network, console
 4. Playwright          → Automated E2E testing
 5. Figma               → Import designs and mockups as reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Which ones would you like to install? (e.g., "1, 2, 3" or "all" or "none")
```

For each selected MCP, provide the installation command/instructions. Do NOT install automatically — show the commands and let the user run them.

If Atlassian/Jira is selected, note in STATE.md: `Jira: enabled` so future commands know to look for tickets.

## Phase 4 — Hook Setup

Explain the post-pull refresh hook:

> "I recommend setting up a hook so the codebase audit refreshes automatically after `git pull`. This keeps my context up to date when your teammates push changes."
> "Want me to set this up? (yes / no)"

If yes, configure a Claude Code hook (in `.claude/settings.json` or equivalent) that triggers `/bet-refresh` after git pull operations.

## Phase 5 — Initialize State

Create `.planning/STATE.md`:

```markdown
# Project State

Mode: Builder
Feature: none
Phase: —
Jira: <enabled|disabled>
Last onboarding: <today's date>

## In progress
_No feature in progress._

## Completed features
_None yet._
```

## Finish

Display:

```
Onboarding complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identity   : <First> <Last> (<email>)
Codebase   : Audited — <N> files analyzed
MCPs       : <list of installed>
Hook       : <active | not set>

Next step  : /bet-new-feature <feature name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
