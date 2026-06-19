#!/usr/bin/env node
// BetArena hook — denies `git commit` on protected branches (main, develop).
// Triggered by Claude Code's PreToolUse on Bash.

import { execSync } from 'node:child_process';

const PROTECTED = new Set(['main', 'develop']);

let raw = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    // Malformed payload — let the action proceed (we never want to silently brick the agent).
    process.exit(0);
  }

  const cmd = (payload?.tool_input?.command ?? '').trim();

  // Only intercept `git commit ...`. Skip `git commit --dry-run`, `git rebase --continue`, etc.
  const isRealCommit = /(^|\s|;|&&|\|\|)git\s+commit(\s|$)/.test(cmd) && !/--dry-run/.test(cmd);
  if (!isRealCommit) process.exit(0);

  const cwd = payload?.cwd || process.cwd();

  let branch;
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf-8' }).trim();
  } catch {
    // Not in a git repo or git unavailable — let it through.
    process.exit(0);
  }

  if (!PROTECTED.has(branch)) process.exit(0);

  const reason =
    `BetArena Golden Rule: direct commits to '${branch}' are forbidden.\n` +
    `Create a feature/BET-XXX-* or fix/BET-XXX-* branch first (see CONTRIBUTING.md).\n` +
    `Quick fix: /bet-new-feature [fix] <name>  → then /bet-commit`;

  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
});
