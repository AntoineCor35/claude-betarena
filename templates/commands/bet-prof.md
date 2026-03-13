Toggle Professor Mode globally. Usage: `/bet-prof on` or `/bet-prof off`

Note: Professor Mode can also be activated per-command by adding `prof` to any command's arguments (e.g., `/bet-execute 1 prof`). This global toggle sets the default for ALL commands.

## Instructions

1. Read `.planning/STATE.md`.
2. Check the argument: `$ARGUMENTS` should be `on` or `off`.
3. Update the `Mode` line in `.planning/STATE.md`:
   - `on` → `Mode: Professor`
   - `off` → `Mode: Builder`
4. Confirm to the user:

**If switching ON:**
> **Professor Mode activated.**
> I'll now explain the *why* behind every decision, not just the *what*. I'll pause to make sure concepts are clear before moving on.
> Switch back with `/bet-prof off` whenever you want to pick up the pace.
> You can also use `prof` per-command: `/bet-execute 1 prof`

**If switching OFF:**
> **Builder Mode activated.**
> Back to focused execution. I'll explain when it matters, but won't slow down the flow.
> Switch back with `/bet-prof on` or add `prof` to any command.

5. If `$ARGUMENTS` is neither `on` nor `off`, show the current mode and usage hint.
