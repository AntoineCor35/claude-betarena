#!/usr/bin/env node

/**
 * Sync script — copies live .claude/ files and root docs into templates/
 * Run manually with `npm run sync` or automatically via `prepublishOnly`.
 * This eliminates the need to maintain two copies of every file.
 */

import { copyFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const TEMPLATES = join(ROOT, 'templates');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

function success(msg) { console.log(`${GREEN}  ✓${RESET} ${msg}`); }
function info(msg) { console.log(`${CYAN}  →${RESET} ${msg}`); }

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function syncDir(srcDir, destDir, ext = null) {
  if (!existsSync(srcDir)) return 0;
  ensureDir(destDir);
  const files = readdirSync(srcDir).filter(f => ext ? f.endsWith(ext) : true);
  for (const file of files) {
    copyFileSync(join(srcDir, file), join(destDir, file));
    success(`${file}`);
  }
  return files.length;
}

console.log(`\n${CYAN}Syncing .claude/ → templates/${RESET}\n`);

let total = 0;

// Commands
info('Commands');
total += syncDir(join(ROOT, '.claude', 'commands'), join(TEMPLATES, 'commands'), '.md');

// Agents
info('Agents');
total += syncDir(join(ROOT, '.claude', 'agents'), join(TEMPLATES, 'agents'), '.md');

// Hooks
info('Hooks');
total += syncDir(join(ROOT, '.claude', 'hooks'), join(TEMPLATES, 'hooks'), '.sh');

// Settings
info('Settings');
const settingsSrc = join(ROOT, '.claude', 'settings.json');
if (existsSync(settingsSrc)) {
  ensureDir(TEMPLATES);
  copyFileSync(settingsSrc, join(TEMPLATES, 'settings.json'));
  success('settings.json');
  total++;
}

// Root docs
info('Root docs');
for (const file of ['CLAUDE.md', 'CONTRIBUTING.md']) {
  const src = join(ROOT, file);
  if (existsSync(src)) {
    copyFileSync(src, join(TEMPLATES, file));
    success(file);
    total++;
  }
}

console.log(`\n${GREEN}Synced ${total} files.${RESET}\n`);
