#!/bin/bash
# Post-Edit/Write lint hook — auto-runs the project's linter/formatter after file changes.
# Receives JSON on stdin: {"tool_name": "Edit|Write", "tool_input": {"file_path": "..."}, ...}
# Outputs text appended to tool result (lint warnings/errors).

set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

# Skip if no file path found or file doesn't exist
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Only lint source files
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.css|*.scss)
    ;;
  *)
    exit 0
    ;;
esac

# Try formatters/linters in priority order
if [ -f "node_modules/.bin/prettier" ]; then
  OUTPUT=$(npx prettier --check "$FILE_PATH" 2>&1) || true
  if echo "$OUTPUT" | grep -q "would be reformatted\|formatting issues"; then
    npx prettier --write "$FILE_PATH" 2>/dev/null
    echo "[lint] Prettier: formatted $FILE_PATH"
  fi
elif [ -f "node_modules/.bin/biome" ]; then
  OUTPUT=$(npx biome check "$FILE_PATH" 2>&1) || true
  if [ -n "$OUTPUT" ]; then
    npx biome check --write "$FILE_PATH" 2>/dev/null
    echo "[lint] Biome: formatted $FILE_PATH"
  fi
fi

# Run ESLint for errors (separate from formatting)
if [ -f "node_modules/.bin/eslint" ]; then
  LINT_OUTPUT=$(npx eslint --no-error-on-unmatched-pattern --format compact "$FILE_PATH" 2>&1) || true
  if echo "$LINT_OUTPUT" | grep -qE '(Error|Warning)'; then
    echo "[lint] ESLint issues in $FILE_PATH:"
    echo "$LINT_OUTPUT" | grep -E '(Error|Warning)' | head -10
  fi
fi
