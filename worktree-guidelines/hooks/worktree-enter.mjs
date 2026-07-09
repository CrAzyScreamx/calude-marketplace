// M2.2 entry steering: inject guidance when Claude enters a worktree.
import { readInput, addContext } from './lib/git.mjs';

await readInput();

addContext([
  'You have entered a git worktree for a feature. Do NOT run the feature work',
  'yourself. Invoke the `worktree-manager` agent and hand it the feature scope.',
  'It owns the whole pipeline: interview → task split → parallel coders →',
  'type-check → review → loop until PASS.',
  '',
  'Your only jobs while it runs: relay questions it raises to the user (e.g.',
  'whether to build a missing `<lang>-guidelines` skill via `best-practices`,',
  'and the plugin reload afterwards), and report its result when it returns.',
].join('\n'));
