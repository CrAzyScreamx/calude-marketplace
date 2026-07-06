// M2.3 exit gate: block ExitWorktree unless HEAD is merged into main and tree is clean.
import { readInput, git, headSha, isAncestor, isClean, deny, allow } from './lib/git.mjs';

await readInput();

// Resolve the integration branch; nothing to gate against if neither exists.
const target = git('rev-parse --verify main') ? 'main'
  : git('rev-parse --verify master') ? 'master'
  : '';
if (!target) allow();

const merged = isAncestor(headSha(), target);
const clean = isClean();

if (!merged) {
  deny(`Cannot exit worktree: HEAD is not merged into ${target}. Get a passing review, then merge this branch into ${target} before exiting.`);
}
if (!clean) {
  deny('Cannot exit worktree: the working tree has uncommitted changes. Commit or stash them, then exit.');
}
allow();
