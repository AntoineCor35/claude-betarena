#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, chmodSync, statSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

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
  return new Promise((res) => {
    rl.question(`${CYAN}  ?${RESET} ${question} `, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function sameContent(a, b) {
  if (!existsSync(a) || !existsSync(b)) return false;
  return readFileSync(a, 'utf-8') === readFileSync(b, 'utf-8');
}

function makeExecutable(path) {
  try { chmodSync(path, 0o755); } catch { /* best effort */ }
}

function detectClaude() {
  try {
    execSync('claude --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function isGitRepo(dir) {
  // .git can be a directory (normal repo) or a file (worktree). Either counts.
  return existsSync(join(dir, '.git'));
}

function addToGitignore(projectDir) {
  const gitignorePath = join(projectDir, '.gitignore');
  const entries = ['.planning/', '.claude/settings.local.json'];

  if (existsSync(gitignorePath)) {
    let content = readFileSync(gitignorePath, 'utf-8');
    const added = [];
    for (const entry of entries) {
      if (!content.includes(entry)) added.push(entry);
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

function showHelp() {
  log();
  log(`${BOLD}claude-betarena${RESET} — Install/update the BetArena workflow for Claude Code`);
  log();
  log(`${BOLD}Usage:${RESET}`);
  log(`  npx claude-betarena              Install in the current directory (skips existing files)`);
  log(`  npx claude-betarena --force      Overwrite ALL existing files without asking`);
  log(`  npx claude-betarena update       Show diffs and update outdated files (per-file consent)`);
  log(`  npx claude-betarena --help       Show this help`);
  log();
  log(`${BOLD}What gets installed:${RESET}`);
  log(`  1. Slash commands       → .claude/commands/        (16 /bet-* commands)`);
  log(`  2. Subagents            → .claude/agents/          (reviewer, tester, security)`);
  log(`  3. Output styles        → .claude/output-styles/   (betarena-professor)`);
  log(`  4. Skills               → .claude/skills/          (betarena-conventions)`);
  log(`  5. Hooks                → .claude/hooks/           (shell + Node)`);
  log(`  6. Settings + hooks     → .claude/settings.json    (asks before overwrite)`);
  log(`  7. CLAUDE.md            → project root             (asks before overwrite)`);
  log(`  8. CONTRIBUTING.md      → project root             (only if missing)`);
  log(`  9. .gitignore           → adds .planning/ and .claude/settings.local.json`);
  log();
  log(`${BOLD}After install:${RESET}`);
  log(`  Run ${CYAN}claude${RESET} in the project, then ${CYAN}/bet-onboarding${RESET}.`);
  log();
}

// Iterate every flat-bucket file under templates/ that should land under .claude/
function* iterFlatAssets() {
  const buckets = [
    { src: 'commands',      dest: '.claude/commands',      filter: (f) => f.endsWith('.md') },
    { src: 'agents',        dest: '.claude/agents',        filter: (f) => f.endsWith('.md') },
    { src: 'output-styles', dest: '.claude/output-styles', filter: (f) => f.endsWith('.md') },
    { src: 'hooks',         dest: '.claude/hooks',         filter: (f) => f.endsWith('.sh') || f.endsWith('.mjs') },
  ];
  for (const b of buckets) {
    const srcDir = join(TEMPLATES, b.src);
    if (!existsSync(srcDir)) continue;
    for (const f of readdirSync(srcDir)) {
      if (!b.filter(f)) continue;
      const srcFile = join(srcDir, f);
      if (!statSync(srcFile).isFile()) continue;
      yield { srcFile, destFile: join(b.dest, f), bucket: b.src };
    }
  }
}

// Skills are nested: templates/skills/<name>/SKILL.md (+ optional sub-files)
function* iterSkills() {
  const skillsRoot = join(TEMPLATES, 'skills');
  if (!existsSync(skillsRoot)) return;
  function* walk(dir, relParts) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) yield* walk(full, [...relParts, entry]);
      else if (st.isFile()) yield { full, rel: [...relParts, entry] };
    }
  }
  for (const { full, rel } of walk(skillsRoot, [])) {
    yield { srcFile: full, destFile: join('.claude/skills', ...rel), bucket: 'skills' };
  }
}

function* iterClaudeAssets() {
  yield* iterFlatAssets();
  yield* iterSkills();
}

async function runInit(force) {
  const projectDir = process.cwd();

  log();
  log(`${BOLD}━━━ BetArena Workflow Installer v2 ━━━${RESET}`);
  log();
  info(`Installing in: ${DIM}${projectDir}${RESET}`);

  if (!isGitRepo(projectDir)) {
    warn('This directory is not a git repository. The workflow assumes git (commits, branches, PRs).');
    warn(`Run ${BOLD}git init${RESET} now if this is intentional, or re-run claude-betarena from your repo root.`);
  }
  log();

  // 1. .claude assets (commands, agents, output-styles, skills, hooks)
  log(`${BOLD}Slash commands, subagents, output styles, skills, hooks${RESET}`);
  let installed = 0, skipped = 0;
  for (const { srcFile, destFile, bucket } of iterClaudeAssets()) {
    const dest = join(projectDir, destFile);
    ensureDir(dirname(dest));
    if (existsSync(dest) && !force) {
      skip(`${destFile}`);
      skipped++;
    } else {
      copyFileSync(srcFile, dest);
      if (bucket === 'hooks') makeExecutable(dest);
      success(`${destFile}`);
      installed++;
    }
  }
  log(`  ${DIM}${installed} installed, ${skipped} skipped${RESET}`);
  log();

  // 2. settings.json — prompt before overwrite (it likely has user hooks merged in)
  log(`${BOLD}Settings${RESET}`);
  const settingsSrc = join(TEMPLATES, 'settings.json');
  const settingsDest = join(projectDir, '.claude', 'settings.json');
  ensureDir(dirname(settingsDest));
  if (existsSync(settingsSrc)) {
    if (existsSync(settingsDest) && !force) {
      const answer = await ask('settings.json already exists. Overwrite? (yes/no)');
      if (answer === 'yes' || answer === 'y') {
        copyFileSync(settingsSrc, settingsDest);
        success('settings.json overwritten (PreToolUse / PostToolUse / SessionStart hooks wired)');
      } else {
        skip('settings.json kept as-is. To pull in updated hooks, run `npx claude-betarena update`.');
      }
    } else {
      copyFileSync(settingsSrc, settingsDest);
      success('settings.json created (PreToolUse / PostToolUse / SessionStart hooks wired)');
    }
  }
  log();

  // 3. CLAUDE.md
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

  // 4. CONTRIBUTING.md
  const contributingSrc = join(TEMPLATES, 'CONTRIBUTING.md');
  const contributingDest = join(projectDir, 'CONTRIBUTING.md');
  if (existsSync(contributingDest) && !force) {
    skip('CONTRIBUTING.md already exists — kept as-is');
  } else {
    copyFileSync(contributingSrc, contributingDest);
    success('CONTRIBUTING.md created');
  }

  // 5. .gitignore
  addToGitignore(projectDir);
  log();

  // Summary
  log(`${BOLD}${GREEN}Installation complete!${RESET}`);
  log();

  const claudeReady = detectClaude();

  log(`${BOLD}Next steps:${RESET}`);
  if (claudeReady) {
    log(`  1. Run ${CYAN}claude${RESET} in this directory to start Claude Code`);
  } else {
    log(`  1. Install Claude Code first: ${CYAN}npm install -g @anthropic-ai/claude-code${RESET}`);
    log(`     Then run ${CYAN}claude${RESET} in this directory to start it`);
  }
  log(`  2. ${YELLOW}First launch:${RESET} Claude Code will ask you to approve the hooks in`);
  log(`     ${DIM}.claude/settings.json${RESET}. ${BOLD}Accept them${RESET} — they enforce the BetArena Golden Rules`);
  log(`     (block direct commits to main/develop, auto-lint, suggest /bet-refresh after pull, etc.).`);
  log(`  3. Run ${CYAN}/bet-onboarding${RESET} to set up your identity and audit the codebase`);
  log(`  4. Run ${CYAN}/bet-new-feature <name>${RESET} to start your first feature`);
  log();
  log(`  Tip: ${CYAN}/output-style betarena-professor${RESET} for Professor Mode globally,`);
  log(`       or add ${CYAN}prof${RESET} to any /bet-* command for one-shot pedagogy.`);
  log();
  log(`  ${DIM}Requires Node.js (installed: ${process.versions.node}, minimum: 16)${RESET}`);
  log();
}

async function runUpdate() {
  const projectDir = process.cwd();
  log();
  log(`${BOLD}━━━ BetArena Workflow Updater ━━━${RESET}`);
  log();
  info(`Scanning: ${DIM}${projectDir}${RESET}`);
  log();

  // Build candidates: files that exist locally and differ, OR don't exist locally yet.
  const candidates = [];
  for (const { srcFile, destFile, bucket } of iterClaudeAssets()) {
    const dest = join(projectDir, destFile);
    if (!existsSync(dest)) {
      candidates.push({ srcFile, dest, destFile, bucket, kind: 'new' });
    } else if (!sameContent(srcFile, dest)) {
      candidates.push({ srcFile, dest, destFile, bucket, kind: 'changed' });
    }
  }

  // Root files (CLAUDE.md, CONTRIBUTING.md) and settings.json — also surfaced.
  const rootCandidates = [
    { name: 'CLAUDE.md', src: join(TEMPLATES, 'CLAUDE.md'), bucket: 'root' },
    { name: 'CONTRIBUTING.md', src: join(TEMPLATES, 'CONTRIBUTING.md'), bucket: 'root' },
    { name: '.claude/settings.json', src: join(TEMPLATES, 'settings.json'), bucket: 'settings' },
  ];
  for (const r of rootCandidates) {
    if (!existsSync(r.src)) continue;
    const dest = join(projectDir, r.name);
    if (!existsSync(dest)) {
      candidates.push({ srcFile: r.src, dest, destFile: r.name, bucket: r.bucket, kind: 'new' });
    } else if (!sameContent(r.src, dest)) {
      candidates.push({ srcFile: r.src, dest, destFile: r.name, bucket: r.bucket, kind: 'changed' });
    }
  }

  if (candidates.length === 0) {
    success('Everything is up to date.');
    log();
    return;
  }

  log(`${BOLD}Outdated or missing files (${candidates.length}):${RESET}`);
  for (const c of candidates) {
    const tag = c.kind === 'new' ? `${YELLOW}new${RESET}    ` : `${CYAN}changed${RESET}`;
    log(`  ${tag}  ${c.destFile}`);
  }
  log();

  const choice = await ask('Update [a]ll, [s]elect file by file, or [c]ancel?');
  if (choice === 'c' || choice === 'cancel' || choice === '') {
    skip('Update cancelled.');
    return;
  }

  const apply = (c) => {
    ensureDir(dirname(c.dest));
    copyFileSync(c.srcFile, c.dest);
    if (c.bucket === 'hooks') makeExecutable(c.dest);
  };

  if (choice === 'a' || choice === 'all') {
    for (const c of candidates) {
      apply(c);
      success(`updated ${c.destFile}`);
    }
    log();
    log(`${BOLD}${GREEN}Update complete.${RESET}`);
    log();
    return;
  }

  // Per-file consent
  for (const c of candidates) {
    const verb = c.kind === 'new' ? 'install' : 'update';
    const ans = await ask(`${verb} ${c.destFile}? (y/n)`);
    if (ans === 'y' || ans === 'yes') {
      apply(c);
      success(`${verb}d ${c.destFile}`);
    } else {
      skip(`kept ${c.destFile}`);
    }
  }
  log();
  log(`${BOLD}${GREEN}Done.${RESET}`);
  log();
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  if (command === 'update') {
    await runUpdate();
    return;
  }

  // Default: init mode (with optional --force)
  const force = args.includes('--force');
  await runInit(force);
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
