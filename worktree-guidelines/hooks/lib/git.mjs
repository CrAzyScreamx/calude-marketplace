// Shared git + review-marker helpers for worktree-guidelines hooks.
//
// Marker contract (single source of truth for every hook/agent/skill):
//   File .worktree-review-ok lives at the worktree root and holds ONE line:
//   the HEAD SHA that the reviewer approved. Review is valid only while
//   markerSha() === headSha(). Any new commit invalidates it (marker != HEAD).

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MARKER = '.worktree-review-ok';

// Run a git command, return trimmed stdout ('' on any failure).
export function git(args) {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

export function headSha() {
  return git('rev-parse HEAD');
}

// Worktree root; falls back to cwd if git call fails.
export function repoRoot() {
  return git('rev-parse --show-toplevel') || process.cwd();
}

// True if `ancestor` is an ancestor of `descendant` (i.e. already merged in).
export function isAncestor(ancestor, descendant) {
  try {
    execSync(`git merge-base --is-ancestor ${ancestor} ${descendant}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Working tree has no staged/unstaged/untracked changes.
export function isClean() {
  return git('status --porcelain') === '';
}

// Read the approved SHA from the marker, or '' if absent.
export function markerSha(root = repoRoot()) {
  const p = join(root, MARKER);
  return existsSync(p) ? readFileSync(p, 'utf8').trim() : '';
}

// Write the current HEAD SHA to the marker (reviewer calls this on pass).
export function writeMarker(root = repoRoot()) {
  const sha = headSha();
  writeFileSync(join(root, MARKER), sha + '\n');
  return sha;
}

// Read + parse the hook's JSON payload from stdin ({} if empty/invalid).
export async function readInput() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// PreToolUse decision emitters. Emitting nothing = allow (default), so allow()
// just exits; deny() blocks the tool with a reason Claude sees.
export function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

export function allow() {
  process.exit(0);
}

// True if a shell command creates a worktree. Splits on shell separators so a
// chained `foo && git worktree add …` is still caught; `worktree list/remove`
// and paths that merely contain the words are not.
export function isWorktreeAdd(command) {
  return command
    .split(/\|\||&&|[|;&\n]/)
    .some((seg) => /^\s*(?:\S*\/)?git\b[^'"]*?\bworktree\s+add\b/.test(seg));
}

// Inject guidance into the conversation without deciding the tool call.
export function addContext(text, event = 'PreToolUse') {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: event, additionalContext: text },
  }));
  process.exit(0);
}
