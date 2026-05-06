---
description: Wrapper around /output-style betarena-professor — switches into Professor Mode (or back) with usage hints
argument-hint: "on | off"
disable-model-invocation: true
---

Switch into BetArena Professor Mode (or back out) — wrapper around Claude Code's native output styles.

Usage: `/bet-prof on` or `/bet-prof off`

> **Note:** since the migration to native output styles, this command is mostly a friendly redirect. The actual switch is performed by Claude Code's built-in `/output-style`.
>
> The per-command `prof` flag still works (e.g. `/bet-execute 1 prof`) — it applies professor behavior just for that single invocation, without changing the global session output style.

## Instructions

1. Parse `$ARGUMENTS` — must be `on` or `off`.
2. Branch:

### If `on`

Tell the user:

> **Pour activer le BetArena Professor Mode globalement :**
>
> ```
> /output-style betarena-professor
> ```
>
> Une fois activé, j'explique le *why* derrière chaque décision non triviale avant d'agir, et je fais des pauses aux points clés pour vérifier que tout est clair. Pour revenir au mode standard, lance `/output-style default` (ou `/bet-prof off`).
>
> **Tip :** si tu ne veux le mode pédagogue que pour une seule commande, ajoute simplement `prof` à ses arguments — ex. `/bet-execute 1 prof` ou `/bet-plan-phase 2 prof`. Pas besoin de changer l'output style global.

### If `off`

Tell the user:

> **Pour revenir au mode standard :**
>
> ```
> /output-style default
> ```
>
> Le mode `prof` per-command (ex. `/bet-execute 1 prof`) reste utilisable indépendamment.

### If neither `on` nor `off`

Show usage hint:

> Usage: `/bet-prof on` ou `/bet-prof off`.
>
> Pour switcher l'output style directement : `/output-style betarena-professor` ou `/output-style default`.
> Pour activer ponctuellement sur une commande : ajouter `prof` à ses arguments.

## Why a redirect?

Earlier versions of BetArena tracked Professor Mode via a `Mode:` field in `.planning/STATE.md`. That required every command to re-read the state file, which wasted context tokens. Native output styles handle the switch at the harness level — no re-reading needed, and the mode persists across the session naturally.

If you find a leftover `Mode:` field in an old `.planning/STATE.md`, it's harmless — current commands ignore it.
