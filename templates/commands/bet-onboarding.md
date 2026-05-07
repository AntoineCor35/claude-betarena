---
description: One-time project onboarding — identity, codebase audit, MCP setup
allowed-tools: Read, Write, Glob, Grep, Bash
disable-model-invocation: true
---

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

1. **STACK.md** — Scan `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `docker-compose*.yml`, `Taskfile.yml`/`Taskfile.dist.yml`, `Makefile`, CI configs, etc. Document:
   - Languages and versions (Node, Python, etc.)
   - Frameworks and libraries
   - **Task runner** — if `Taskfile.yml` is present, this is the **mandatory** entry point for lint/build/test/dev commands. Run `task --list` and capture the available commands. Note them in STACK.md.
   - Build tools, bundlers
   - Dev dependencies (linting, formatting, testing)
   - Environment config patterns (.env, config files)
   - **Documentation index** — if a `docs/` directory exists, list its files (e.g. `getting-started.md`, `taskfile.md`, `docker.md`, `quality-plan.md`) so future commands know where to look.

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

## Phase 4 — Hooks (verify, don't duplicate)

The `claude-betarena` installer ships **two hooks** wired in `.claude/settings.json` :

- `block-protected-branch.mjs` — `PreToolUse` Bash : refuses `git commit` directly on `main` or `develop`.
- `suggest-refresh-after-pull.mjs` — `PostToolUse` Bash : after a successful `git pull`, suggests `/bet-refresh` so the codebase audit can be regenerated.

### Step 4.1 — Verify the hooks are active

1. Read `.claude/settings.json` (project root). If it does **not** exist or does **not** reference both hook scripts, warn:
   > "Les hooks BetArena ne sont pas câblés. Lance `npx claude-betarena update` pour les remettre en place."
2. List the hooks already declared in `.claude/settings.json` to the user, plain language:
   > "Hooks actifs :
   >   • Refuser les commits directs sur main/develop
   >   • Suggérer /bet-refresh après un git pull qui change le code"
3. Remind them about the **first-launch approval** :
   > "Claude Code te demandera d'approuver ces hooks au premier démarrage. Si tu as cliqué *deny*, relance Claude Code et accepte cette fois — sinon les garde-fous sont muets."

### Step 4.2 — Optional extra hooks

Ask:
> "Tu veux ajouter un hook personnalisé ? (par exemple : notifier Slack à chaque PR, lancer un check ad-hoc avant push). Sinon on continue. (oui / non)"

If yes, ask what behavior they want and propose a snippet to add to `.claude/settings.json`. **Never** overwrite the existing hooks — append to them.

If no, continue.

## Phase 5 — Initialize State

Create `.planning/STATE.md`:

```markdown
# Project State

Active: none
Jira: <enabled|disabled>
Last onboarding: <today's date>

## Features
_No feature in progress._

## Completed features
_None yet._
```

> Note: Professor Mode is no longer tracked here — it lives as a native Claude Code output style (`/output-style betarena-professor`). See `/bet-prof` for details.

## Phase 6 — Découverte des super-pouvoirs

Avant de finir, présente brièvement les 3 artefacts installés que l'utilisateur ne connaît probablement pas :

```
Tes super-pouvoirs BetArena
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Output style "betarena-professor"
   → /output-style betarena-professor active le mode pédagogue global.
   → Ou ajoute "prof" à n'importe quelle commande pour un usage ponctuel
     (ex: /bet-execute 1 prof).

2. Skill "betarena-conventions"
   → Auto-chargé quand je m'apprête à commit, push, créer une PR, ou créer
     une branche. Pas besoin de me rappeler les règles, je les connais.

3. Hooks (déjà actifs après ton approbation au premier launch)
   → block-protected-branch : impossible de committer sur main/develop
     même par accident.
   → suggest-refresh-after-pull : après un git pull qui change le code,
     je te rappellerai /bet-refresh.

Pause/reprise de session :
   → /bet-pause   en fin de session pour capturer où tu t'arrêtes.
   → /bet-progress en début de session pour reprendre là où tu étais.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Demande : "Des questions sur ces outils ? (oui / non)"

Si l'utilisateur a des questions, réponds-y. Sinon, passe au Finish.

## Finish

Display:

```
Onboarding complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identity   : <First> <Last> (<email>)
Codebase   : Audited — <N> files analyzed
MCPs       : <list of installed>
Hooks      : <list of active hooks>

Next step  : /bet-new-feature <feature name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
