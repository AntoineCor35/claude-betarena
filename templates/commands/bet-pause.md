Capture a session handoff before stopping. Writes a `HANDOFF.md` so the next `/bet-progress` reloads exactly where you mentally were — not just where the code is.

Usage: `/bet-pause`

## Why?

`/bet-progress` reconstructs the **objective** state (TRACKING.md, SUMMARY.md, git log). It cannot capture **subjective** state — the file you were in the middle of editing, the next micro-step you had in mind, the doubt you hadn't resolved yet. `/bet-pause` fills that gap.

## Setup

1. Read `.planning/STATE.md` — identify the current feature.
2. If no feature is in progress, tell the user:
   > "Aucune feature en cours — `/bet-pause` n'a pas de sens ici. Reprends avec `/bet-new-feature <name>` ou `/bet-progress`."
   > Stop.
3. Otherwise, continue.

## Q&A

Ask **5 questions max**, one at a time. Wait for each answer. Be concise — this is meant to take 2 minutes, not 20.

> **Pause de session — feature `<name>` (Phase <N>/<total>)**
>
> 1. **Où tu t'arrêtes ?** Quel(s) fichier(s) tu étais en train de toucher, et à peu près à quel endroit ? (ex: `src/backend/services/bet.service.ts`, fonction `resolveBet`, ligne ~120)

> 2. **Prochaine micro-étape ?** En 1-2 phrases, qu'est-ce que tu allais faire en premier en revenant ?

> 3. **Blockers ou doutes ouverts ?** Une décision pas tranchée, une info manquante, un test qui échouait sans que tu saches pourquoi ? (réponds "aucun" si tout est clair)

> 4. **Notes mentales en vrac ?** "Penser à...", "essayer aussi...", "demander à X..." — tout ce qui t'aiderait à reprendre vite. (réponds "aucune" si rien)

> 5. **Tu veux capturer l'état git ?** (yes / no — par défaut yes : je lance `git status` et `git log -3` et j'inclus le résultat)

## Capture

Run :
- `git branch --show-current`
- `git status --short`
- `git log -3 --oneline`
- `git diff --stat` (uncommitted changes summary)

## Write

Overwrite (or create) `.planning/<feature>/HANDOFF.md` :

```markdown
# Handoff — <feature> — <YYYY-MM-DD HH:MM>

## Où je m'arrête
<answer to Q1>

## Prochaine micro-étape
<answer to Q2>

## Blockers / doutes ouverts
<answer to Q3>

## Notes mentales
<answer to Q4>

## État git au moment de la pause
- Branch : <branch>
- Phase  : <N>/<total> — <phase title>
- Commits ahead of develop : <N>
- Files modified (uncommitted) :
  <git status --short output>
- Recent commits :
  <git log -3 --oneline output>
- Diff summary :
  <git diff --stat output>
```

If the file already exists, **overwrite** it (one active handoff at a time — earlier handoffs are not history).

## Confirm

Display :

```
Handoff sauvegardé dans .planning/<feature>/HANDOFF.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quand tu reviens : tape /bet-progress, je remettrai ce contexte
en première section du briefing avant le reste.

Tu peux fermer Claude Code — bonne pause !
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Rules

- **Never** ask all 5 questions in one block — one at a time, wait for each answer.
- **Never** auto-commit anything during pause. The user may have intentional uncommitted work.
- **Never** delete or rename existing files in `.planning/<feature>/` other than overwriting `HANDOFF.md`.
- If the user says "skip" or just hits enter, write `<not specified>` for that field rather than blocking the flow.
