---
description: Refresh the codebase audit after a git pull or structural change
allowed-tools: Read, Write, Glob, Grep, Bash(git status*), Bash(git log*)
disable-model-invocation: true
---

Refresh the codebase audit. Run this after a `git pull` or when the project structure has changed.

## Instructions

1. Check that `.planning/codebase/` exists. If not, suggest `/bet-onboarding` instead.

2. Re-run the codebase analysis (same as onboarding Phase 2):

   - **STACK.md** — Scan dependency files, configs, CI. Update with any new dependencies or version changes.
   - **ARCHITECTURE.md** — Re-trace project structure. Flag new directories, entry points, or pattern changes.
   - **CONVENTIONS.md** — Re-check linting configs and code patterns.
   - **STRUCTURE.md** — Regenerate directory tree.
   - **TESTING.md** — Re-check test setup and patterns.

3. For each file, compare with the existing version:
   - If no changes → skip silently.
   - If changes detected → update the file and list what changed.

4. Display a summary:

```
Codebase refresh complete
━━━━━━━━━━━━━━━━━━━━━━━━━
Updated:
  - STACK.md      → <what changed or "no changes">
  - ARCHITECTURE.md → <what changed or "no changes">
  - CONVENTIONS.md  → <what changed or "no changes">
  - STRUCTURE.md    → <what changed or "no changes">
  - TESTING.md      → <what changed or "no changes">

Last refresh: <today>
━━━━━━━━━━━━━━━━━━━━━━━━━
```

5. If a feature is in progress (check STATE.md), warn if any changes affect files listed in the current phase's plan:
   > "⚠ Files in your current phase were changed upstream: <list>. Review before continuing."
