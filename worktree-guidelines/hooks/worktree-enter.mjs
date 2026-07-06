// M2.2 entry steering: inject guidance when Claude enters a worktree.
import { readInput, addContext } from './lib/git.mjs';

await readInput();

addContext([
  'You have entered a git worktree for a feature. Before touching code:',
  '1. Build a todo list capturing the feature work end to end.',
  '2. Route all implementation through the `coder` agent, not inline edits.',
  '3. Load the project\'s `<lang>-guidelines` skill for the stack in use; if none',
  '   exists, invoke the `best-practices` builder skill to create one first.',
  '4. Remember: exiting and merging this worktree are review-gated — get a passing',
  '   review (which writes the .worktree-review-ok marker) before you try to exit or merge.',
].join('\n'));
