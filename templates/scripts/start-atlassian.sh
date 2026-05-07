#!/bin/sh
# BetArena — wrapper that loads the project .env (if present) before starting
# the Atlassian MCP server. Allows credentials to live in a per-user .env file
# instead of polluting the user's shell rc.
#
# This script is referenced by .mcp.json (`command: sh, args: [".claude/scripts/start-atlassian.sh"]`).

# Load .env from the project root if it exists. CLAUDE_PROJECT_DIR is set by
# Claude Code; we fall back to the current working directory otherwise.
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"

if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$PROJECT_ROOT/.env"
  set +a
fi

# Validate required credentials are present.
if [ -z "$ATLASSIAN_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ]; then
  echo "[BetArena] ATLASSIAN_EMAIL and ATLASSIAN_API_TOKEN must be set." >&2
  echo "[BetArena] Run /bet-onboarding (Phase 3.1) to configure Atlassian, or edit .env manually." >&2
  exit 1
fi

# Defaults for tenant URLs (overridable from .env).
: "${JIRA_URL:=https://betarena.atlassian.net}"
: "${CONFLUENCE_URL:=https://betarena.atlassian.net/wiki}"

# Map BetArena env names to mcp-atlassian's expected names.
export JIRA_URL
export JIRA_USERNAME="$ATLASSIAN_EMAIL"
export JIRA_API_TOKEN="$ATLASSIAN_API_TOKEN"
export CONFLUENCE_URL
export CONFLUENCE_USERNAME="$ATLASSIAN_EMAIL"
export CONFLUENCE_API_TOKEN="$ATLASSIAN_API_TOKEN"

exec uvx mcp-atlassian
