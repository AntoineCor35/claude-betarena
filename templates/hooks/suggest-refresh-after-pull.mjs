#!/usr/bin/env node
// BetArena hook — after a successful `git pull`, suggests /bet-refresh to keep the codebase audit current.
// Triggered by Claude Code's PostToolUse on Bash.

let raw = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const cmd = (payload?.tool_input?.command ?? '').trim();

  // Match `git pull` (with or without args). Skip `git pull --dry-run`.
  const isPull = /(^|\s|;|&&|\|\|)git\s+pull(\s|$)/.test(cmd) && !/--dry-run/.test(cmd);
  if (!isPull) process.exit(0);

  // Only emit the hint if the pull seems to have actually changed something.
  // The tool result text is in payload.tool_response.output (string). If it contains
  // "Already up to date." we stay silent.
  const output = payload?.tool_response?.output ?? payload?.tool_response?.stdout ?? '';
  if (typeof output === 'string' && /Already up to date\.?/i.test(output)) {
    process.exit(0);
  }

  const message =
    'Le codebase a peut-être changé suite au git pull. ' +
    'Si .planning/codebase/ semble obsolète (nouveau service, nouveau task, dépendance ajoutée), suggère à l\'utilisateur /bet-refresh pour rafraîchir l\'audit.';

  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: message,
    },
  }));
  process.exit(0);
});
