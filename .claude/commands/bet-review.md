Trigger an AI code review of the current branch using a fresh-context reviewer agent.

Usage: `/bet-review` or `/bet-review security`

## Step 1 — Determine review type

Check the argument:
- No argument or `code` → code review (uses `reviewer` agent)
- `security` → security audit (uses `security` agent)

## Step 2 — Pre-flight checks

1. Check that we're on a feature or hotfix branch (not main/develop).
2. Run `git diff develop...HEAD --stat` (or `main...HEAD` for hotfix) to see what changed.
3. If no diff, tell the user there's nothing to review.

## Step 3 — Invoke the agent

Use the Agent tool to invoke the appropriate agent (`reviewer` or `security`).

Pass as context:
- The branch name
- The base branch (develop or main)
- The diff stat summary

The agent will independently load CONTRIBUTING.md, CONVENTIONS.md, and the full diff.

## Step 4 — Present the report

Display the agent's review report to the user.

Ask:
> "Want to discuss any point, or should I address specific issues?"

## Notes

- The reviewer agent uses a **fresh context** (Writer/Reviewer pattern). It has NOT seen the implementation process and reviews without bias.
- For a quick self-review before PR, use `/bet-review`.
- For security-sensitive features, use `/bet-review security`.
