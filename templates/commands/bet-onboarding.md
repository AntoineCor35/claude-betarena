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
 1. Atlassian (Jira + Confluence) → Tickets, specs, ADRs, glossaire métier
 2. GitHub                        → PR management, issue tracking from Claude
 3. Chrome DevTools               → Debug frontend, inspect DOM, network, console
 4. Playwright                    → Automated E2E testing
 5. Figma                         → Import designs and mockups as reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Which ones would you like to install? (e.g., "1, 2, 3" or "all" or "none")
```

For each selected MCP, follow the matching subsection below.

### 3.1 — Atlassian (Jira + Confluence) — guided setup with .env

If the user selects Atlassian, run this **guided didactic flow**.

**Pattern :**
- `.mcp.json` and `.claude/scripts/start-atlassian.sh` are **committed in the team repo** (no secrets, just shared config).
- Each developer's credentials live in a local `.env` file (gitignored). The wrapper script loads `.env` before launching the MCP server.
- The user **never has to touch their shell rc** — the agent writes everything for them.

#### Step 0 — Explain the pattern

Before any prompt, explain plainly :

> **Setup MCP Atlassian — partagé en équipe, secrets locaux**
>
> Voici comment on procède :
>
> 1. Je crée `.mcp.json` à la racine — décrit le serveur Atlassian. **Committé** dans le repo, partagé avec ton équipe.
> 2. Je crée `.claude/scripts/start-atlassian.sh` — petit wrapper qui charge `.env` avant de lancer le serveur. **Committé** aussi.
> 3. Je crée (ou enrichis) `.env` à la racine avec **tes** credentials Atlassian. **Gitignored** — tes secrets restent sur ta machine.
> 4. Au redémarrage de Claude Code, le wrapper charge `.env`, le serveur démarre avec tes credentials.
>
> Tu n'auras **pas à toucher ton `.zshrc` / `.bashrc`**. Si ton token change un jour : édite `.env`, relance Claude Code, c'est tout.
>
> Prêt ? On y va. (yes / no)

If the user declines, point them to the manual fallback (3.1.bis).

#### Step 1 — Atlassian domain

> **1/3 — Quel est le domaine de ton workspace Atlassian ?**
>
> C'est la partie avant `.atlassian.net`. Pour BetArena c'est `betarena`. Tape entrée pour valider la valeur par défaut.
>
> Domaine [betarena] :

Capture the answer (default `betarena` if empty).

#### Step 2 — Write `.mcp.json` (committed, no secrets)

Write this file at the project root. **Do NOT add it to `.gitignore`** — it must be committable :

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "sh",
      "args": [".claude/scripts/start-atlassian.sh"]
    }
  }
}
```

The wrapper script (`.claude/scripts/start-atlassian.sh`) is shipped by `npx claude-betarena` and is also committed. It reads `.env` from the project root, sets the `JIRA_*` and `CONFLUENCE_*` env vars expected by `mcp-atlassian`, and execs the MCP server.

Confirm to the user :

> ✓ `.mcp.json` créé. Tu peux le committer (rien de sensible dedans).

#### Step 3 — Generate the API token

> **2/3 — Génère ton token API Atlassian**
>
> Va sur cette page :
>
> ```
> https://id.atlassian.com/manage-profile/security/api-tokens
> ```
>
> 1. Clique **"Create API token (legacy)"**
> 2. Donne-lui un label parlant — par exemple `Claude Code BetArena`
> 3. Clique **Create**, puis **Copy** — ⚠ **tu ne pourras plus le voir ensuite**, donc colle-le ici tout de suite.
>
> Quel est ton email Atlassian ? (celui que tu utilises pour te connecter à atlassian.net)

Capture the email. Then :

> Et le token API que tu viens de copier ?

Capture the token. **Do NOT echo it back** in subsequent messages.

#### Step 4 — Update or create `.env` (the smart part)

This is where the agent **does the work for the user**.

Read `.env` at the project root if it exists. Three cases :

**Case A — `.env` doesn't exist**
Create it with just the Atlassian block :

```
# Atlassian (Jira + Confluence) — used by .claude/scripts/start-atlassian.sh
ATLASSIAN_EMAIL="<email>"
ATLASSIAN_API_TOKEN="<token>"
JIRA_URL="https://<domain>.atlassian.net"
CONFLUENCE_URL="https://<domain>.atlassian.net/wiki"
```

**Case B — `.env` exists, no Atlassian vars in it**
**Append** the Atlassian block at the end (preserve everything that was there — Postgres, API ports, GROK_KEY, whatever) :

```
# ... existing content stays untouched ...

# Atlassian (Jira + Confluence) — used by .claude/scripts/start-atlassian.sh
ATLASSIAN_EMAIL="<email>"
ATLASSIAN_API_TOKEN="<token>"
JIRA_URL="https://<domain>.atlassian.net"
CONFLUENCE_URL="https://<domain>.atlassian.net/wiki"
```

**Case C — `.env` already has `ATLASSIAN_*` keys**
Ask the user before overwriting :

> ⚠ Ton `.env` contient déjà des variables Atlassian. Tu veux les écraser avec les nouvelles valeurs ? (yes / no)

If yes, replace the values for `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`, `JIRA_URL`, `CONFLUENCE_URL` only — leave everything else untouched. If no, skip and tell them they can edit `.env` manually.

**Then add `.env` to `.gitignore`** (only if not already there). Use a clear comment block :

```
# Local secrets — never committed
.env
```

If `.env` is already in `.gitignore` (BetArena monorepo template usually has it), don't duplicate.

Confirm to the user :

> ✓ `.env` mis à jour avec tes credentials Atlassian (et déjà gitignored).

#### Step 5 — Install `uv` if needed

`mcp-atlassian` is a Python MCP server run via `uvx` (from [astral.sh/uv](https://docs.astral.sh/uv/)). Check if `uvx` is available :

- Run `which uvx` (Bash tool). If it returns a path → already installed, skip ahead.
- If not found, instruct the user :
  > **`uvx` n'est pas installé.** C'est l'outil qui exécute le serveur MCP Atlassian.
  >
  > **macOS** : `brew install uv`
  > **Linux/WSL** : `curl -LsSf https://astral.sh/uv/install.sh | sh`
  >
  > Voir [docs.astral.sh/uv/getting-started/installation](https://docs.astral.sh/uv/getting-started/installation/).
  >
  > Une fois installé, vérifie avec : `uvx --version`

Wait for the user to confirm.

#### Step 6 — Restart Claude Code

> **3/3 — Redémarre Claude Code**
>
> Les serveurs MCP sont chargés au lancement de Claude Code, donc il faut le relancer pour que le serveur Atlassian démarre.
>
> 1. Quitte Claude Code (`Ctrl+D` ou `/exit`)
> 2. Relance : `claude`
> 3. Au démarrage, Claude Code te demandera d'**approuver le serveur Atlassian** — accepte.
>
> ✓ Tu auras ensuite accès à Jira et Confluence depuis n'importe quelle commande BetArena. Le ticket et la spec liée seront automatiquement chargés par `/bet-new-feature BA-XXX`.

#### Final actions

- Set `Jira: enabled` in `.planning/STATE.md` so future commands know they can call Jira/Confluence.
- Do **NOT** add `.mcp.json` or `.claude/scripts/start-atlassian.sh` to `.gitignore` — both are committable.
- Verify `.env` **is** in `.gitignore`.

### 3.1.bis — Atlassian manual fallback

If the user declined the guided setup, show this short version :

> **Setup manuel** (pas guidé) :
>
> 1. Crée `.mcp.json` à la racine :
>    ```json
>    { "mcpServers": { "atlassian": { "command": "sh", "args": [".claude/scripts/start-atlassian.sh"] } } }
>    ```
>    (Le wrapper `start-atlassian.sh` est déjà installé par `npx claude-betarena` dans `.claude/scripts/`.)
> 2. Génère un token : https://id.atlassian.com/manage-profile/security/api-tokens
> 3. Crée (ou enrichis) `.env` à la racine avec :
>    ```
>    ATLASSIAN_EMAIL="ton.email@..."
>    ATLASSIAN_API_TOKEN="ATATT3..."
>    JIRA_URL="https://<DOMAIN>.atlassian.net"
>    CONFLUENCE_URL="https://<DOMAIN>.atlassian.net/wiki"
>    ```
> 4. Vérifie que `.env` est bien dans `.gitignore`.
> 5. Vérifie que `uvx` est installé (`brew install uv` sinon).
> 6. Restart Claude Code et accepte le serveur.
> 5. Installe `uv` si besoin : `brew install uv`
> 6. Restart Claude Code et accepte le serveur

### 3.2 — Other MCPs

For GitHub / Chrome DevTools / Playwright / Figma, **do NOT install automatically** — show the official install commands/instructions and let the user run them. Each has its own auth flow that's better handled by the user directly.

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
