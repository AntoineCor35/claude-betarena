#!/bin/bash
# Pre-Bash guard hook — blocks dangerous commands deterministically.
# Receives JSON on stdin: {"tool_name": "Bash", "tool_input": {"command": "..."}}
# Outputs JSON to block, or nothing to allow.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"command"[[:space:]]*:[[:space:]]*"//;s/"$//')

# Unescape basic JSON escapes
COMMAND=$(echo "$COMMAND" | sed 's/\\n/ /g; s/\\t/ /g; s/\\"/"/g; s/\\\\/\\/g')

block() {
  echo "{\"decision\": \"block\", \"reason\": \"$1\"}"
  exit 0
}

# --- Protected branch pushes ---
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*\b(main|develop)\b'; then
  block "Direct push to main/develop is blocked. Use feature branches and PRs. See CONTRIBUTING.md."
fi

# --- Force push ---
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--force'; then
  block "Force push is blocked. This can destroy remote history."
fi

# --- Destructive git commands ---
if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
  block "git reset --hard is blocked. This discards all uncommitted changes irreversibly."
fi

if echo "$COMMAND" | grep -qE 'git\s+clean\s+-[a-zA-Z]*f'; then
  block "git clean -f is blocked. This deletes untracked files irreversibly."
fi

# --- Destructive filesystem commands ---
if echo "$COMMAND" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--recursive)\s+(/|\.\.|\.\s|~)'; then
  block "Recursive delete on root/parent/home directory is blocked."
fi

if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+\.$'; then
  block "rm -rf . is blocked. This would delete the entire project."
fi

# --- Direct commit to protected branches ---
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "develop" ]; then
  if echo "$COMMAND" | grep -qE 'git\s+commit\b'; then
    block "Direct commit on $CURRENT_BRANCH is blocked. Create a feature or hotfix branch first."
  fi
fi

# Allow by default (output nothing)
