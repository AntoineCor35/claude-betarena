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

### 3.1 — Atlassian (Jira + Confluence) — guided setup

If the user selects Atlassian, run this **guided didactic flow**. The pattern : `.mcp.json` is **committed in the team repo** (server config shared), but each teammate stores their **own credentials in environment variables** of their shell (never in the repo). This way :

- `.mcp.json` lives in Git → if Yannis bumps the MCP server version, everyone gets it on next pull.
- Each developer's email + API token stay private, on their machine only.

#### Step 0 — Tell the user what's about to happen

Before any prompt, explain plainly :

> **Setup MCP Atlassian — pattern partagé**
>
> Voici comment on procède :
>
> 1. Je vais créer un fichier `.mcp.json` à la racine du projet — il décrit comment Claude Code se connecte à Atlassian. **Ce fichier est committé** dans le repo, partagé avec ton équipe.
> 2. Le `.mcp.json` ne contient **pas** ton token. Il référence deux variables d'environnement : `ATLASSIAN_EMAIL` et `ATLASSIAN_API_TOKEN`.
> 3. Toi, tu vas mettre **tes** credentials dans **ton** shell (zsh/bash). Tes coéquipiers feront pareil avec **les leurs**. Personne n'a accès au token de personne.
> 4. Au redémarrage de Claude Code, le serveur Atlassian récupère automatiquement les variables et utilise tes credentials.
>
> Prêt ? On y va. (yes / no)

If the user declines, just point them to the manual fallback (3.1.bis).

#### Step 1 — Atlassian domain

> **1/4 — Quel est le domaine de ton workspace Atlassian ?**
>
> C'est la partie avant `.atlassian.net`. Pour BetArena c'est `betarena`. Tape entrée pour valider la valeur par défaut.
>
> Domaine [betarena] :

Capture the answer (default `betarena` if empty).

#### Step 2 — Write `.mcp.json` (no secrets in it)

Write this file at the project root. **Do NOT add it to `.gitignore`** — it must be committable :

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "uvx",
      "args": ["mcp-atlassian"],
      "env": {
        "JIRA_URL": "https://<DOMAIN>.atlassian.net",
        "JIRA_USERNAME": "${ATLASSIAN_EMAIL}",
        "JIRA_API_TOKEN": "${ATLASSIAN_API_TOKEN}",
        "CONFLUENCE_URL": "https://<DOMAIN>.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "${ATLASSIAN_EMAIL}",
        "CONFLUENCE_API_TOKEN": "${ATLASSIAN_API_TOKEN}"
      }
    }
  }
}
```

Replace `<DOMAIN>` with the user's answer. Leave `${ATLASSIAN_EMAIL}` and `${ATLASSIAN_API_TOKEN}` literal — Claude Code expands these from the OS environment at startup.

Confirm to the user :

> ✓ `.mcp.json` créé. Tu peux le committer (rien de sensible dedans).

#### Step 3 — Generate the API token

> **2/4 — Génère ton token API Atlassian**
>
> Va sur cette page :
>
> ```
> https://id.atlassian.com/manage-profile/security/api-tokens
> ```
>
> 1. Clique **"Create API token (legacy)"**
> 2. Donne-lui un label parlant — par exemple `Claude Code BetArena`
> 3. Clique **Create**, puis **Copy** — ⚠ **tu ne pourras plus le voir ensuite**, donc copie-le quelque part en attendant l'étape suivante.
>
> Token copié ? (yes / pas encore)

Wait for "yes" before continuing. If the user struggles, walk them through it.

#### Step 4 — Detect shell and explain where to add the env vars

Detect the user's shell — run `echo $SHELL` (via Bash tool) and parse :
- `/bin/zsh` → file is `~/.zshrc`
- `/bin/bash` → file is `~/.bashrc` (Linux/WSL) or `~/.bash_profile` (older macOS)
- `/usr/bin/fish` → file is `~/.config/fish/config.fish` (different syntax — use `set -x` instead of `export`)
- Anything else → ask the user

Then tell them, **clearly and step-by-step** :

> **3/4 — Ajoute tes credentials à ton shell**
>
> Ton shell est : **`<DETECTED_SHELL>`**
> Le fichier à modifier est : **`<DETECTED_RC_FILE>`**
>
> **Ouvre ce fichier** avec ton éditeur favori (VS Code : `code <FILE>`, ou directement `nano <FILE>`).
>
> **Ajoute ces 2 lignes à la fin du fichier** (remplace les valeurs entre guillemets) :
>
> ```bash
> export ATLASSIAN_EMAIL="ton.email@etu.epitech.eu"
> export ATLASSIAN_API_TOKEN="ATATT3xFfGF0..."   # le token copié à l'étape 2
> ```
>
> Sauvegarde le fichier.
>
> **Recharge ton shell** (sans fermer le terminal) :
>
> ```bash
> source <DETECTED_RC_FILE>
> ```
>
> **Vérifie que les variables sont bien définies** :
>
> ```bash
> echo $ATLASSIAN_EMAIL
> echo $ATLASSIAN_API_TOKEN
> ```
>
> Les deux commandes doivent afficher tes valeurs (et **pas** une ligne vide).

For fish shell, adapt the syntax :
```fish
set -x ATLASSIAN_EMAIL "ton.email@etu.epitech.eu"
set -x ATLASSIAN_API_TOKEN "ATATT3xFfGF0..."
```

Wait for the user to confirm : "fait" / "ok" / equivalent.

#### Step 5 — Install `uv` if needed

`mcp-atlassian` is a Python MCP server run via `uvx` (from [astral.sh/uv](https://docs.astral.sh/uv/)). Check if `uvx` is available :

- Run `which uvx` (Bash tool). If it returns a path → already installed, skip ahead.
- If not found, instruct the user :
  > **`uvx` n'est pas installé.** C'est l'outil qui exécute le serveur MCP Atlassian.
  >
  > **macOS** :
  > ```bash
  > brew install uv
  > ```
  > **Linux/WSL** :
  > ```bash
  > curl -LsSf https://astral.sh/uv/install.sh | sh
  > ```
  > Voir [docs.astral.sh/uv/getting-started/installation](https://docs.astral.sh/uv/getting-started/installation/) pour les autres systèmes.
  >
  > Une fois installé, vérifie avec : `uvx --version`

Wait for the user to confirm.

#### Step 6 — Restart Claude Code

> **4/4 — Redémarre Claude Code**
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
- Do **NOT** add `.mcp.json` to `.gitignore` — it should be committed by the user with their next commit.

### 3.1.bis — Atlassian manual fallback

If the user declined the guided setup, show this short version :

> **Setup manuel** (pas guidé) :
>
> 1. Crée `.mcp.json` à la racine avec ce contenu (remplace `<DOMAIN>`) :
>    ```json
>    { "mcpServers": { "atlassian": { "command": "uvx", "args": ["mcp-atlassian"],
>      "env": {
>        "JIRA_URL": "https://<DOMAIN>.atlassian.net",
>        "JIRA_USERNAME": "${ATLASSIAN_EMAIL}",
>        "JIRA_API_TOKEN": "${ATLASSIAN_API_TOKEN}",
>        "CONFLUENCE_URL": "https://<DOMAIN>.atlassian.net/wiki",
>        "CONFLUENCE_USERNAME": "${ATLASSIAN_EMAIL}",
>        "CONFLUENCE_API_TOKEN": "${ATLASSIAN_API_TOKEN}"
>      } } } }
>    ```
> 2. Génère un token : https://id.atlassian.com/manage-profile/security/api-tokens
> 3. Ajoute à ton shell rc : `export ATLASSIAN_EMAIL=...` + `export ATLASSIAN_API_TOKEN=...`
> 4. `source` ton shell rc
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
