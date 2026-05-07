# BetArena — Agent Rules

> Conventions complètes : voir `CONTRIBUTING.md`. Méthodologie projet (Scrum, DoD, CI/CD) : voir le **Plan Qualité** (`docs/quality-plan.md`).

## Golden Rules

1. **Never commit directly to `main` or `develop`.** Toute modification passe par une branche dédiée et une PR.
2. **Never commit without user approval.** Toujours proposer le message d'abord, attendre validation explicite.
3. **Follow the simplified Git Flow.** `feature/BA-XXX-*` et `fix/BA-XXX-*` → `develop`. `develop` → `main` (release).
4. **Always plan before coding.** Toute feature non triviale passe par le tunnel `/bet-new-feature`.
5. **TypeScript strict + lint vert.** Aucun commit avec ESLint/Prettier en erreur. La CI doit passer avant tout merge.
6. **Definition of Done.** Une phase n'est "done" que si elle satisfait la DoD du Plan Qualité (tests unit + intégration sur logique critique, acceptance criteria couverts, ticket Jira à jour).

## Workflow — The Tunnel

Chaque feature suit un tunnel guidé. L'agent **ne saute jamais d'étape** et **propose toujours la commande suivante**.

```
/bet-onboarding (one-time)
    └→ Identité, audit codebase, MCP setup

/bet-new-feature <name>
    └→ Lookup Jira (BA-XXX) → Questions → Plan → Review → Phases → Tracking → Branch
    └→ Branche : feature/BA-XXX-<kebab-name>
    └→ Propose : /bet-discuss-phase, /bet-plan-phase, /bet-execute

Per phase:
    /bet-discuss-phase <N> [prof]   → Q&A pour affiner le contexte (optionnel)
    /bet-plan-phase <N> [prof]      → Détail du plan technique (recommandé)
    /bet-execute <N> [prof]         → Implémentation
    /bet-commit                     → Commit (après chaque phase)
    /bet-next                       → Avance à la phase suivante (gate DoD)

Last phase = tests:
    /bet-execute <last> [prof]      → Q&A stratégie test → écrit + lance les tests

End of feature:
    /bet-commit → /bet-doc → /bet-pr (gate DoD complet)

Pause / reprise / multi-feature :
    /bet-pause                      → Capture où tu t'arrêtes (HANDOFF.md)
    /bet-progress                   → Briefing complet + handoff précédent (s'il existe)
    /bet-switch <slug>              → Basculer entre features actives en parallèle
```

## Context Isolation

Chaque phase a son contexte isolé. Les commandes ne chargent **que** ce qui est nécessaire :

- **Phase context** : `.planning/<feature>/phase-<NN>/CONTEXT.md`
- **Phase summary** : `.planning/<feature>/phase-<NN>/SUMMARY.md`
- **Codebase audit** : `.planning/codebase/*.md`
- **Feature plan** : `.planning/<feature>/PLAN.md`
- **Tracking** : `.planning/<feature>/TRACKING.md`

Les `SUMMARY.md` des phases précédentes assurent la continuité **sans** recharger l'historique conversationnel complet.

## Commands Reference

| Command | Purpose |
|---------|---------|
| `/bet-onboarding` | Setup unique : identité, audit, MCPs |
| `/bet-new-feature <name>` | Démarre le tunnel feature |
| `/bet-discuss-phase <N> [prof]` | Q&A pour affiner le contexte d'une phase (optionnel) |
| `/bet-plan-phase <N> [prof]` | Plan technique détaillé d'une phase |
| `/bet-execute <N> [prof]` | Implémente une phase |
| `/bet-commit` | Propose un commit (format CONTRIBUTING.md) |
| `/bet-next` | Avance à la phase suivante (gate DoD) |
| `/bet-progress` | Reprise de session avec briefing complet (recharge le HANDOFF.md s'il existe) |
| `/bet-pause` | Capture où tu t'arrêtes en fin de session (Q&A → HANDOFF.md) |
| `/bet-switch [slug]` | Basculer entre features parallèles |
| `/bet-pr` | Crée la Pull Request (gate DoD complet) |
| `/bet-doc` | Met à jour la documentation |
| `/bet-review [security]` | AI code review en contexte frais (subagent reviewer/security) |
| `/bet-prof on/off` | Toggle Professor Mode global |
| `/bet-branch` | Crée une branche Git Flow manuellement |
| `/bet-refresh` | Re-audit codebase après pull |

## Conventions de commit & PR

**Source de vérité** : `CONTRIBUTING.md`. L'agent doit lire ce fichier avant chaque commit et chaque PR.

**Résumé minimal** :
- Commits : `<type>(<scope>): <description>` — types : `feat, fix, docs, style, refactor, test, chore` — scopes : `mobile, backend, shared, landing, ci, docs`
- PRs : `[<SCOPE>] BA-XXX <Description>` — squash merge — CI verte obligatoire — 1 approbation min — PRs vers `main` : Antoine Cormier + Maxence Guidez

**Branches** : `feature/BA-XXX-<kebab-name>` et `fix/BA-XXX-<kebab-name>` → `develop` (toutes via PR).

## Code

- **TypeScript strict** sur tout le monorepo (mobile, backend, shared)
- **ESLint + Prettier** : configs partagées, formatage automatique au save
- **Imports** : alias TS (`@shared/`, `@services/`) — pas de chemins relatifs profonds
- **Nommage** : `camelCase` (var/fn), `PascalCase` (composants/types), `UPPER_SNAKE_CASE` (constantes)
- **Commentaires** : seulement pour la logique non évidente. Pas de commentaires triviaux.

## Task runner — obligatoire

Le projet utilise **Task** ([taskfile.dev](https://taskfile.dev)) comme task runner unique. **Tous** les ordres de lint/build/dev/format passent par `task <area>:<action>`. Ne jamais inventer ou utiliser `npm run <script>` directement quand un wrapper Task existe.

| Action | Commande |
|--------|----------|
| Setup initial | `task setup` |
| Démarrer la stack dev (Docker) | `task dev:up` |
| Logs d'un service | `task dev:logs -- <service>` |
| Lint frontend | `task front:lint` (ou `task front:format-lint`) |
| Lint backend | (pas de `back:lint` — `task back:build` agit comme gate via `tsc`) |
| Lint mobile | `task mobile:lint` |
| Démarrer mobile (Expo) | `task mobile:start` |
| Liste complète | `task --list` |

**Tests** : il n'existe **pas** de commande `task test` au moment de la rédaction de ce CLAUDE.md. L'agent doit lancer Jest via les workspaces npm (ex. `npm --workspace=src/backend test`). Si une commande `task test*` apparaît plus tard, l'utiliser en priorité.

## Documentation projet

| Fichier | Contenu |
|---------|---------|
| `docs/getting-started.md` | Setup poste neuf (Node 24, npm 11.13, Task, Docker) |
| `docs/taskfile.md` | Référence des commandes Task |
| `docs/docker.md` | Architecture Docker (compose dev/prod, volumes, hot-reload) |
| `docs/quality-plan.md` | Plan qualité (Scrum, DoD, CI/CD, stratégie de test) |
| `CONTRIBUTING.md` | Conventions commits/PRs/branches/code |
| `README.md` | Vision projet |

`/bet-doc` met à jour le bon fichier selon la nature du changement.

## Langue

| Contexte | Langue |
|----------|--------|
| Code (variables, fonctions, commentaires, commits) | **Anglais** |
| Conversation avec l'utilisateur | **Français** (sauf demande contraire) |
| Documentation projet, livrables Epitech | **Français** |
| Documents techniques | **Français**, termes techniques en anglais quand approprié |

## Layer-Specific Rules

Pour les projets multi-couches, ajouter un `CLAUDE.md` dans chaque sous-dossier pertinent (ex. `src/screens/CLAUDE.md`, `src/api/CLAUDE.md`). Claude Code fusionne automatiquement ces règles avec celles de la racine. Voir `templates/examples/mobile-CLAUDE.md` pour un template prêt à recopier.

## Professor Mode

Le mode pédagogue est implémenté comme un **output style natif** Claude Code (`.claude/output-styles/betarena-professor.md` après `npx claude-betarena`).

Deux activations :
- **Global (session)** : `/output-style betarena-professor` (ou via `/bet-prof on` qui rappelle la commande). Désactivation : `/output-style default` ou `/bet-prof off`.
- **Per-command (ponctuel)** : ajouter `prof` en argument — ex. `/bet-execute 1 prof` — applique le mode pédagogue pour cette invocation uniquement, sans toucher à l'output style global.

En Professor Mode, l'agent explique le *why* derrière chaque décision non triviale, cite des fichiers du codebase comme analogues, fait des pauses aux points clés, et termine les unités de travail par un mini-recap "ce qu'on a appris".

> Le `Mode:` field qui pouvait être présent dans d'anciens `.planning/STATE.md` est désormais ignoré.

## Tests (rappel — voir Plan Qualité §6)

| Niveau | Outil | Quand | Couverture cible |
|--------|-------|-------|------------------|
| Unitaires (logique métier) | Jest | À chaque commit (CI) | **70 %** sur la logique métier |
| Intégration (endpoints) | Jest + Supertest | À chaque PR (CI) | Tous les endpoints critiques |
| Manuels (parcours) | Manuel | Fin de sprint | Parcours critiques |

La **dernière phase** d'une feature est dédiée aux tests. Avant de l'écrire, l'agent fait un Q&A pour cadrer : niveau (unit/intégration), couverture, edge cases du Plan Qualité.

## Definition of Done — Story (rappel — voir Plan Qualité §9.1)

Une story est *Done* lorsque :
- [ ] Code mergé sur `develop` via PR approuvée (1 approbation min)
- [ ] CI verte (lint + tests)
- [ ] Tests unitaires : cas nominaux + cas d'erreur
- [ ] Tests d'intégration : endpoints concernés (si backend)
- [ ] Ticket Jira en statut "Done"
- [ ] Fonctionnalité testable sur simulateur/device
- [ ] Acceptance criteria du PRD/ticket respectés

L'agent vérifie cette checklist via `/bet-next` (entre phases) et `/bet-pr` (avant la PR).

## Hooks & Safety — system-level guards

Les hooks dans `.claude/settings.json` sont **déterministes** : peu importe ce que le LLM "décide", le hook bloque ou commente l'action côté harness. Ils sont à approuver au premier lancement de Claude Code.

| Hook | Trigger | Rôle |
|------|---------|------|
| `pre-bash-guard.sh` | `PreToolUse` Bash | Bloque `git push origin main/develop`, `git reset --hard`, `rm -rf`, force push |
| `block-protected-branch.mjs` | `PreToolUse` Bash | Refuse `git commit` direct sur `main`/`develop` |
| `post-edit-lint.sh` | `PostToolUse` Write/Edit | Auto-détecte et lance le linter (Prettier/ESLint/Biome) |
| `suggest-refresh-after-pull.mjs` | `PostToolUse` Bash | Après un `git pull` non vide, suggère `/bet-refresh` |
| `session-start.sh` | `SessionStart` | Injecte branche, git status et feature active dans le contexte |

> Les hooks **bloquent** ou **commentent** des actions de l'agent — ils n'agissent jamais en autonomie. L'utilisateur reste maître.

## Subagents

Trois agents spécialisés dans `.claude/agents/` exécutent en contexte frais :

| Agent | Rôle | Modèle |
|-------|------|--------|
| `reviewer` | Code review (pattern Writer/Reviewer — review du diff sans biais d'implémentation) | Sonnet |
| `tester` | Écriture de tests (happy path + edge case minimum) | Sonnet |
| `security` | Audit sécurité (secrets, XSS, injection, stockage non sécurisé) | Opus |

Invocables via `/bet-review` (review code) ou `/bet-review security` (audit sécurité).

## Atlassian (Jira + Confluence)

Le MCP `mcp-atlassian` est configuré au premier lancement de `/bet-onboarding` Phase 3.1 — flow guidé pédagogique. **Aucune modification du shell rc n'est nécessaire** : l'agent écrit lui-même les credentials dans un fichier `.env` local (gitignored).

**Pattern de partage** :
- `.mcp.json` (committé) référence un wrapper shell `.claude/scripts/start-atlassian.sh` (committé aussi).
- Le wrapper charge `.env` à la racine et lance `uvx mcp-atlassian` avec les bonnes variables.
- `.env` (gitignored) contient `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`, `JIRA_URL`, `CONFLUENCE_URL` — **par utilisateur**.
- L'agent **ajoute** au `.env` existant (préserve `POSTGRES_*`, `API_PORT`, etc.) et propose d'écraser uniquement si des vars Atlassian existent déjà.

Une fois actif :
- `/bet-new-feature BA-XXX` fetche le ticket Jira **et** la spec Confluence liée (best-effort) → résumé dans `.planning/<feature>/SPEC-RECAP.md`
- Le skill `betarena-confluence` (`.claude/skills/betarena-confluence/SKILL.md`) s'auto-charge quand l'agent travaille sur un ticket, cherche la spec, ou résout un terme métier (consulte le glossaire Confluence)
- `/bet-discuss-phase` et `/bet-plan-phase` peuvent proposer la création d'ADR (Architecture Decision Records) sur Confluence après accord explicite de l'utilisateur

> Le serveur MCP utilise `uvx mcp-atlassian` ; installe `uv` au préalable (`brew install uv` sur macOS).

## Recommended Model Config

`model: opusplan` (Opus 4.7 en plan, Sonnet 4.6 en execute) avec `effortLevel: xhigh`. Les sub-agents déclarent leur propre modèle via frontmatter. Opus 4.7 utilise toujours le raisonnement adaptatif — contrôle la profondeur via `effortLevel` ou `/effort`, **pas** `MAX_THINKING_TOKENS` (déprécié). Minimum Claude Code : `2.1.111`.

## State Tracking

| Fichier | Rôle |
|---------|------|
| `.planning/STATE.md` | Feature(s) courante(s), phase, feature `Active` |
| `.planning/IDENTITY.md` | Nom, email (commits/PRs) |
| `.planning/codebase/*.md` | Audit projet (STACK, ARCHITECTURE, CONVENTIONS, STRUCTURE, TESTING) |
| `.planning/<feature>/PLAN.md` | Plan feature avec phases |
| `.planning/<feature>/TRACKING.md` | Progrès phases + briefing context |
| `.planning/<feature>/phase-<NN>/CONTEXT.md` | Décisions par phase |
| `.planning/<feature>/phase-<NN>/SUMMARY.md` | Recap post-execute |
| `.planning/<feature>/HANDOFF.md` | Handoff de session écrit par `/bet-pause`, lu par `/bet-progress` (overwrite à chaque pause) |

`.planning/` est **gitignoré**. Ne jamais le committer.

## Jira Integration

Si Atlassian MCP installé (`Jira: enabled` dans STATE.md) :
- `/bet-new-feature` cherche un ticket existant ou propose d'en créer un
- L'utilisateur peut référencer un ticket : `/bet-new-feature BA-123` ou décrire la feature pour auto-match
- Le ticket ID alimente le nom de branche (`feature/BA-XXX-...`), le titre de PR, et le tracking

## Garde-fous & assets installés

Le package `claude-betarena` installe, en plus des commandes :

| Asset | Chemin | Rôle |
|-------|--------|------|
| Output style | `.claude/output-styles/betarena-professor.md` | Mode pédagogue activable via `/output-style betarena-professor` |
| Skill | `.claude/skills/betarena-conventions/SKILL.md` | Auto-chargé quand l'agent va commit/PR/branch — rappelle les conventions sans relire les docs |
| Skill | `.claude/skills/betarena-confluence/SKILL.md` | Auto-chargé quand l'agent travaille sur un ticket Jira / spec / glossaire métier — interagit avec le MCP Atlassian |
| Subagents | `.claude/agents/{reviewer,tester,security}.md` | Review code / écriture tests / audit sécurité en contexte frais |
| Hooks | `.claude/hooks/*` | Garde-fous système : branch-guard, post-edit-lint, session-start, block-protected-branch, suggest-refresh-after-pull |
| Config | `.claude/settings.json` | Câble les hooks et permissions partagées |
| MCP Atlassian config | `.mcp.json` (**committé**) + `.claude/scripts/start-atlassian.sh` (**committé**) | Wrapper shell qui charge `.env` et lance `uvx mcp-atlassian`. Généré par `/bet-onboarding` Phase 3.1 |
| MCP Atlassian secrets | `.env` (**gitignored**) | Per-user : `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`, `JIRA_URL`, `CONFLUENCE_URL`. L'agent l'ajoute proprement (sans écraser les autres variables existantes) |

## Mise à jour du package installé

```bash
npx claude-betarena update
```

Affiche la liste des fichiers modifiés/manquants côté projet vs templates, puis propose `[a]ll`, `[s]elect par fichier`, ou `[c]ancel`. Plus sûr que `npx claude-betarena --force` qui écrase tout sans demander.
