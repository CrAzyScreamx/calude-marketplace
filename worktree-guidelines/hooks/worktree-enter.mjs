// Entry steering: inject guidance when Claude enters a worktree.
import { readInput, addContext } from './lib/git.mjs';

await readInput();

addContext([
  'You have entered a git worktree for a feature. Do NOT run the feature work',
  'yourself. First run the `feature-interviewer` skill to gather project details',
  'from the user, then invoke the `worktree-manager` agent, handing it the feature',
  'scope and the interview answers. The manager owns delegation: task split →',
  'parallel `worktree-coder`s → `worktree-type-checker` → `worktree-reviewer`,',
  'looping until the review passes.',
  '',
  'While it runs, you — not the manager — handle everything user-facing: if it',
  'reports `No guideline for <stack>.`, ask the user whether to build one via the',
  '`guideline-builder` skill, then re-invoke the manager. Report its result when it',
  'returns.',
].join('\n'));
