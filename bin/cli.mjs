#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync } from 'fs';
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

function copyIfMissing(src, dest, label) {
  if (existsSync(dest)) {
    skip(`${label} already exists — skipped`);
    return false;
  }
  copyFileSync(src, dest);
  success(`${label} created`);
  return true;
}

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function addToGitignore(projectDir) {
  const gitignorePath = join(projectDir, '.gitignore');
  const entry = '.planning/';

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf-8');
    if (content.includes(entry)) {
      skip('.planning/ already in .gitignore');
      return;
    }
    writeFileSync(gitignorePath, content.trimEnd() + '\n\n# BetArena planning files (agent-internal)\n.planning/\n');
    success('.planning/ added to .gitignore');
  } else {
    writeFileSync(gitignorePath, '# BetArena planning files (agent-internal)\n.planning/\n');
    success('.gitignore created with .planning/');
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
    log(`  npx claude-betarena --force      Overwrite existing command files`);
    log(`  npx claude-betarena --help       Show this help`);
    log();
    log(`${BOLD}What it does:${RESET}`);
    log(`  1. Copies slash commands to .claude/commands/`);
    log(`  2. Creates CLAUDE.md with agent rules (if missing)`);
    log(`  3. Creates CONTRIBUTING.md with conventions (if missing)`);
    log(`  4. Adds .planning/ to .gitignore`);
    log();
    log(`${BOLD}After install:${RESET}`);
    log(`  Open Claude Code and run /bet-onboarding`);
    log();
    return;
  }

  const force = args.includes('--force');
  const projectDir = process.cwd();

  log();
  log(`${BOLD}━━━ BetArena Workflow Installer ━━━${RESET}`);
  log();
  info(`Installing in: ${DIM}${projectDir}${RESET}`);
  log();

  // 1. Commands
  log(`${BOLD}Commands${RESET}`);
  const commandsDir = join(projectDir, '.claude', 'commands');
  ensureDir(commandsDir);

  const templateCommands = readdirSync(join(TEMPLATES, 'commands')).filter(f => f.endsWith('.md'));
  let installed = 0;
  let skipped = 0;

  for (const file of templateCommands) {
    const dest = join(commandsDir, file);
    const label = file.replace('.md', '').replace('bet-', '/bet-');

    if (existsSync(dest) && !force) {
      skip(`${label} already exists`);
      skipped++;
    } else {
      copyFileSync(join(TEMPLATES, 'commands', file), dest);
      success(`${label}`);
      installed++;
    }
  }

  log(`  ${DIM}${installed} installed, ${skipped} skipped${RESET}`);
  log();

  // 2. CLAUDE.md
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

  // 3. CONTRIBUTING.md
  const contributingSrc = join(TEMPLATES, 'CONTRIBUTING.md');
  const contributingDest = join(projectDir, 'CONTRIBUTING.md');

  if (existsSync(contributingDest) && !force) {
    skip('CONTRIBUTING.md already exists — kept as-is');
  } else {
    copyFileSync(contributingSrc, contributingDest);
    success('CONTRIBUTING.md created');
  }

  // 4. .gitignore
  addToGitignore(projectDir);
  log();

  // 5. Summary
  log(`${BOLD}${GREEN}Installation complete!${RESET}`);
  log();
  log(`${BOLD}Next steps:${RESET}`);
  log(`  1. Open Claude Code in this project`);
  log(`  2. Run ${CYAN}/bet-onboarding${RESET} to set up your identity and audit the codebase`);
  log(`  3. Run ${CYAN}/bet-new-feature <name>${RESET} to start your first feature`);
  log();
  log(`${DIM}All commands: /bet-onboarding, /bet-new-feature, /bet-discuss-phase,`);
  log(`/bet-plan-phase, /bet-execute, /bet-commit, /bet-next, /bet-progress,`);
  log(`/bet-pr, /bet-doc, /bet-prof, /bet-branch, /bet-refresh, /bet-docker${RESET}`);
  log();
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
