---
description: Intelligent router — detects current state and recommends/runs the next BetArena action. Default entry point if you don't remember the specific /bet-* command.
argument-hint: "[verb] (optional — e.g. 'execute', 'commit', 'next')"
disable-model-invocation: true
---

Smart entry point for the BetArena workflow. Inspect the current state and either route to the right `/bet-*` command, or present a contextual menu of next actions.

## Usage

```
/bet                  # diagnose state and propose the next action
/bet <verb>           # route directly to that action (skips the menu)
```

Recognized verbs: `new`, `execute`, `commit`, `next`, `progress`, `pause`, `plan`, `pr`, `doc`, `switch`, `refresh`, `review`, `onboard`.

## Instructions

### Step 1 — Read state

Read in this order, **only what exists** (silent if missing) :

1. `.planning/STATE.md`
2. `.planning/<active-feature>/TRACKING.md` (if `Active:` field set)
3. `.planning/<active-feature>/PLAN.md`
4. `.planning/<active-feature>/HANDOFF.md` (if present — handoff from a previous session)
5. `git branch --show-current`, `git status --short`, `git log --oneline -3`

### Step 2 — Diagnose

Based on what you found, decide the **next logical action**. Use this decision table :

| Observed state | Recommend |
|----------------|-----------|
| No `.planning/` directory at all | `/bet-onboarding` |
| `.planning/STATE.md` exists, no active feature | `/bet-new-feature <name>` or `/bet-progress` if there are paused features |
| `HANDOFF.md` exists (recent pause) | `/bet-progress` first — re-read handoff, then act on Q4 ("next micro-step") |
| Active feature, current phase NOT planned (no detailed steps in PLAN.md) | `/bet-plan-phase <N>` |
| Active feature, phase planned NOT executed (no SUMMARY.md) | `/bet-execute <N>` |
| Phase executed, uncommitted changes (`git status` not clean) | `/bet-commit` |
| Phase executed, committed (clean tree, phase done in TRACKING) | `/bet-next` |
| All phases done, no PR yet | `/bet-doc` then `/bet-pr` |
| Working on a branch not matching the active feature | `/bet-switch <slug>` to align |

### Step 3 — Present the choice

If `$ARGUMENTS` contains a verb, **invoke the matching command directly** (without showing the menu). Mapping :

- `new` → `/bet-new-feature` (prompt for name)
- `execute` → `/bet-execute <current-phase>`
- `commit` → `/bet-commit`
- `next` → `/bet-next`
- `progress` → `/bet-progress`
- `pause` → `/bet-pause`
- `plan` → `/bet-plan-phase <current-phase>`
- `pr` → `/bet-pr`
- `doc` → `/bet-doc`
- `switch` → `/bet-switch`
- `refresh` → `/bet-refresh`
- `review` → `/bet-review`
- `onboard` → `/bet-onboarding`

Unknown verb → display the menu and ignore the argument.

If no argument, display a concise menu :

```
État
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature actif    : <name>                   (or "—" if none)
Phase            : <N>/<total> — "<title>"  (or "—")
Branche git      : <branch>
Git              : <clean | N modifs non commitées>
Handoff précédent: <date> ✓                 (only if HANDOFF.md exists)

Recommandation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ <RECOMMENDED ACTION — derived from the table above>

Actions disponibles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. <recommended verb>     — <short description>
  2. <alternative verb>     — <short description>
  3. <alternative verb>     — <short description>
  ...
  q. quitter sans agir

Que veux-tu faire ? (numéro / verbe / q)
```

Don't list **every** command — surface the 3-5 that make sense given the state. The user can always invoke a specific `/bet-*` if they prefer.

### Step 4 — Execute

When the user picks an option (number or verb), invoke the corresponding `/bet-*` command. **Do NOT execute the underlying logic inline** — delegate to the dedicated command file so its own pre-flight checks and gates apply.

If the user picks `q` (or "quit" / "annule"), simply confirm "Pas d'action — à toi de jouer" and stop.

## Special cases

- **No `.planning/` at all** : skip the menu and run `/bet-onboarding` directly with a one-liner explanation : "Pas de `.planning/` détecté — démarrage de l'onboarding."
- **Multiple paused features** : the menu's first option proposes `/bet-switch` to pick one, then re-runs `/bet`.
- **Uncommitted changes on a branch that doesn't match the active feature** : warn explicitly, propose `/bet-commit` (on current branch) or `/bet-switch` (re-align).

## Why this command exists

The full `/bet-*` family has 13+ commands. New developers struggle to remember which to use when. `/bet` (no argument) is the **single entry point** they need to memorize — it teaches them the right next step by example until the verbs become natural.
