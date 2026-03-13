#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, chmodSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES = resolve(__dirname, '..', 'templates');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';

function log(msg = '') { console.log(msg); }
function success(msg) { console.log(`${GREEN}  ✓${RESET} ${msg}`); }
function skip(msg) { console.log(`${YELLOW}  ⊘${RESET} ${msg}`); }
function warn(msg) { console.log(`${YELLOW}  ⚠${RESET} ${msg}`); }
function info(msg) { console.log(`${CYAN}  →${RESET} ${msg}`); }
function error(msg) { console.log(`${RED}  ✗${RESET} ${msg}`); }

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${CYAN}  ?${RESET} ${question} `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function installDir(srcDir, destDir, ext, label, force) {
  if (!existsSync(srcDir)) return { installed: 0, skipped: 0 };
  ensureDir(destDir);
  const files = readdirSync(srcDir).filter(f => f.endsWith(ext));
  let installed = 0;
  let skipped = 0;

  for (const file of files) {
    const dest = join(destDir, file);
    const name = file.replace(ext, '').replace('bet-', '/bet-');

    if (existsSync(dest) && !force) {
      skip(`${name} already exists`);
      skipped++;
    } else {
      copyFileSync(join(srcDir, file), dest);
      if (ext === '.sh') chmodSync(dest, 0o755);
      success(`${name}`);
      installed++;
    }
  }

  return { installed, skipped };
}

function addToGitignore(projectDir) {
  const gitignorePath = join(projectDir, '.gitignore');
  const entries = ['.planning/', '.claude/settings.local.json'];

  if (existsSync(gitignorePath)) {
    let content = readFileSync(gitignorePath, 'utf-8');
    let added = [];

    for (const entry of entries) {
      if (!content.includes(entry)) {
        added.push(entry);
      }
    }

    if (added.length > 0) {
      content = content.trimEnd() + '\n\n# BetArena (agent-internal)\n' + added.join('\n') + '\n';
      writeFileSync(gitignorePath, content);
      success(`Added to .gitignore: ${added.join(', ')}`);
    } else {
      skip('.gitignore already up to date');
    }
  } else {
    writeFileSync(gitignorePath, '# BetArena (agent-internal)\n.planning/\n.claude/settings.local.json\n');
    success('.gitignore created');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'init';

  if (command === '--help' || command === '-h') {
    log();
    log(`${BOLD}claude-betarena${RESET} — Install the BetArena workflow for Claude Code`);
    log();
    log(`${BOLD}Usage:${RESET}`);
    log(`  npx claude-betarena              Install in the current directory`);
    log(`  npx claude-betarena --force      Overwrite existing files`);
    log(`  npx claude-betarena --help       Show this help`);
    log();
    log(`${BOLD}What it does:${RESET}`);
    log(`  1. Copies slash commands to .claude/commands/`);
    log(`  2. Copies subagents to .claude/agents/`);
    log(`  3. Copies hook scripts to .claude/hooks/`);
    log(`  4. Creates .claude/settings.json (shared team config)`);
    log(`  5. Creates CLAUDE.md with agent rules (if missing)`);
    log(`  6. Creates CONTRIBUTING.md with conventions (if missing)`);
    log(`  7. Adds .planning/ and .claude/settings.local.json to .gitignore`);
    log();
    log(`${BOLD}After install:${RESET}`);
    log(`  Open Claude Code and run /bet-onboarding`);
    log();
    return;
  }

  const force = args.includes('--force');
  const projectDir = process.cwd();

  log();
  log(`${BOLD}━━━ BetArena Workflow Installer v2 ━━━${RESET}`);
  log();
  info(`Installing in: ${DIM}${projectDir}${RESET}`);
  log();

  // 1. Commands
  log(`${BOLD}Commands${RESET}`);
  const cmdResult = installDir(
    join(TEMPLATES, 'commands'),
    join(projectDir, '.claude', 'commands'),
    '.md', 'commands', force
  );
  log(`  ${DIM}${cmdResult.installed} installed, ${cmdResult.skipped} skipped${RESET}`);
  log();

  // 2. Agents
  log(`${BOLD}Agents${RESET}`);
  const agentResult = installDir(
    join(TEMPLATES, 'agents'),
    join(projectDir, '.claude', 'agents'),
    '.md', 'agents', force
  );
  log(`  ${DIM}${agentResult.installed} installed, ${agentResult.skipped} skipped${RESET}`);
  log();

  // 3. Hooks
  log(`${BOLD}Hooks${RESET}`);
  const hookResult = installDir(
    join(TEMPLATES, 'hooks'),
    join(projectDir, '.claude', 'hooks'),
    '.sh', 'hooks', force
  );
  log(`  ${DIM}${hookResult.installed} installed, ${hookResult.skipped} skipped${RESET}`);
  log();

  // 4. Settings
  log(`${BOLD}Settings${RESET}`);
  const settingsSrc = join(TEMPLATES, 'settings.json');
  const settingsDest = join(projectDir, '.claude', 'settings.json');

  if (existsSync(settingsSrc)) {
    if (existsSync(settingsDest) && !force) {
      const answer = await ask('settings.json already exists. Overwrite? (yes/no)');
      if (answer === 'yes' || answer === 'y') {
        copyFileSync(settingsSrc, settingsDest);
        success('settings.json overwritten');
      } else {
        skip('settings.json kept as-is');
      }
    } else {
      ensureDir(join(projectDir, '.claude'));
      copyFileSync(settingsSrc, settingsDest);
      success('settings.json created');
    }
  }
  log();

  // 5. CLAUDE.md
  log(`${BOLD}Configuration${RESET}`);
  const claudeMdSrc = join(TEMPLATES, 'CLAUDE.md');
  const claudeMdDest = join(projectDir, 'CLAUDE.md');

  if (existsSync(claudeMdDest) && !force) {
    const answer = await ask('CLAUDE.md already exists. Overwrite? (yes/no)');
    if (answer === 'yes' || answer === 'y') {
      copyFileSync(claudeMdSrc, claudeMdDest);
      success('CLAUDE.md overwritten');
    } else {
      skip('CLAUDE.md kept as-is');
    }
  } else {
    copyFileSync(claudeMdSrc, claudeMdDest);
    success('CLAUDE.md created');
  }

  // 6. CONTRIBUTING.md
  const contributingSrc = join(TEMPLATES, 'CONTRIBUTING.md');
  const contributingDest = join(projectDir, 'CONTRIBUTING.md');

  if (existsSync(contributingDest) && !force) {
    skip('CONTRIBUTING.md already exists — kept as-is');
  } else {
    copyFileSync(contributingSrc, contributingDest);
    success('CONTRIBUTING.md created');
  }

  // 7. .gitignore
  addToGitignore(projectDir);
  log();

  // 8. Summary
  log(`${BOLD}${GREEN}Installation complete!${RESET}`);
  log();
  log(`${BOLD}What was installed:${RESET}`);
  log(`  ${CYAN}Commands${RESET}   ${cmdResult.installed} slash commands in .claude/commands/`);
  log(`  ${CYAN}Agents${RESET}     ${agentResult.installed} subagents in .claude/agents/ (reviewer, tester, security)`);
  log(`  ${CYAN}Hooks${RESET}      ${hookResult.installed} hook scripts in .claude/hooks/ (branch protection, auto-lint, session context)`);
  log(`  ${CYAN}Settings${RESET}   .claude/settings.json (shared team permissions & hooks)`);
  log();
  log(`${BOLD}Next steps:${RESET}`);
  log(`  1. Open Claude Code in this project`);
  log(`  2. Run ${CYAN}/bet-onboarding${RESET} to set up your identity and audit the codebase`);
  log(`  3. Run ${CYAN}/bet-new-feature <name>${RESET} to start your first feature`);
  log();
  log(`${DIM}All commands: /bet-onboarding, /bet-new-feature, /bet-discuss-phase,`);
  log(`/bet-plan-phase, /bet-execute, /bet-commit, /bet-next, /bet-progress,`);
  log(`/bet-pr, /bet-doc, /bet-prof, /bet-branch, /bet-refresh, /bet-review,`);
  log(`/bet-switch, /bet-docker${RESET}`);
  log();
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
