#!/bin/bash
# SessionStart hook — injects git context and active feature at session start.
# No stdin. Outputs text visible in session context.

set -uo pipefail

echo "--- Session Context ---"

# Git branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "Branch: $BRANCH"

# Git status (short)
STATUS=$(git status --short 2>/dev/null)
if [ -n "$STATUS" ]; then
  CHANGED=$(echo "$STATUS" | wc -l | tr -d ' ')
  echo "Working tree: $CHANGED file(s) modified"
else
  echo "Working tree: clean"
fi

# Active feature from STATE.md
if [ -f ".planning/STATE.md" ]; then
  ACTIVE=$(grep -m1 '^Active:' .planning/STATE.md 2>/dev/null | sed 's/^Active:[[:space:]]*//')
  MODE=$(grep -m1 '^Mode:' .planning/STATE.md 2>/dev/null | sed 's/^Mode:[[:space:]]*//')
  if [ -n "$ACTIVE" ] && [ "$ACTIVE" != "none" ]; then
    # Read phase info for active feature
    PHASE=$(grep -A2 "### $ACTIVE" .planning/STATE.md 2>/dev/null | grep -m1 'Phase:' | sed 's/^Phase:[[:space:]]*//')
    echo "Active feature: $ACTIVE (Phase $PHASE)"
    echo "Mode: ${MODE:-Builder}"
    echo ""
    echo "Resume with: /bet-progress"
  else
    echo "No active feature."
    echo "Start one with: /bet-new-feature <name>"
  fi
else
  echo "No planning state found."
  echo "Run /bet-onboarding to set up the project."
fi

echo "--- End Context ---"
