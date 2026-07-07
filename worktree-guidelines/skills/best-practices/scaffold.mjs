#!/usr/bin/env node
// Scaffold a <name>-guidelines plugin into a marketplace and register it.
// This is the ONLY approved way to emit a guidelines plugin — never hand-write
// the files, and never drop a bare SKILL.md into a skills dir.
//
// Usage:
//   node scaffold.mjs --name react-guidelines --dest <marketplace-root> \
//     --description "<invoke-before-writing description>" --skill <path-to-SKILL.md-body>
//   Optional (only when <dest> has no marketplace.json yet):
//     --market-name <name> --owner <owner>
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new Error(`Expected a --flag at "${argv[i]}"`);
    a[argv[i].slice(2)] = argv[i + 1];
  }
  return a;
}

const a = parseArgs(process.argv.slice(2));
const missing = ['name', 'dest', 'description', 'skill'].filter((k) => !a[k]);
if (missing.length) {
  console.error(`Missing required flag(s): ${missing.map((m) => '--' + m).join(', ')}`);
  console.error('  --dest is the marketplace root the user pointed you at (ask them first).');
  process.exit(1);
}
if (!/-guidelines$/.test(a.name)) {
  console.error(`--name must end with "-guidelines" (got "${a.name}").`);
  process.exit(1);
}
if (!existsSync(a.skill)) {
  console.error(`--skill file not found: ${a.skill}`);
  process.exit(1);
}

const marketFile = join(a.dest, '.claude-plugin', 'marketplace.json');
let market;
if (existsSync(marketFile)) {
  market = JSON.parse(readFileSync(marketFile, 'utf8'));
} else {
  if (!a['market-name'] || !a.owner) {
    console.error(`No marketplace at ${marketFile}. To create one, also pass --market-name and --owner.`);
    process.exit(1);
  }
  market = { name: a['market-name'], owner: { name: a.owner }, plugins: [] };
}
market.plugins ??= [];

if (market.plugins.some((p) => p.name === a.name)) {
  console.error(`Plugin "${a.name}" already exists in ${marketFile}. Stop and ask the user: overwrite or rename?`);
  process.exit(2);
}

// Plugin files.
const pluginDir = join(a.dest, a.name);
mkdirSync(join(pluginDir, '.claude-plugin'), { recursive: true });
const skillDir = join(pluginDir, 'skills', a.name);
mkdirSync(skillDir, { recursive: true });

writeFileSync(
  join(pluginDir, '.claude-plugin', 'plugin.json'),
  JSON.stringify({ name: a.name, description: a.description, version: '1.0.0' }, null, 2) + '\n',
);
writeFileSync(join(skillDir, 'SKILL.md'), readFileSync(a.skill, 'utf8'));

// Register in the marketplace.
market.plugins.push({ name: a.name, source: `./${a.name}`, description: a.description });
mkdirSync(dirname(marketFile), { recursive: true });
writeFileSync(marketFile, JSON.stringify(market, null, 2) + '\n');

console.log(`Plugin created:   ${pluginDir}`);
console.log(`SKILL.md:         ${join(skillDir, 'SKILL.md')}`);
console.log(`Registered in:    ${marketFile}`);
