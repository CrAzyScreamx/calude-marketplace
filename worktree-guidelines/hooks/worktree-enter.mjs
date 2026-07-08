// M2.2 entry steering: inject guidance when Claude enters a worktree.
import { readInput, addContext } from './lib/git.mjs';

await readInput();

addContext([
  'You have entered a git worktree for a feature. As orchestrator, before any code:',
  '1. Build a todo list capturing the feature work end to end.',
  '2. Run the `interviewer` skill to gather project details BEFORE invoking any',
  '   coder — frontend: component theme, typography, light/dark, navbar placement;',
  '   backend: API endpoints/routers/deps, caching, DB, auth. Fold its answers',
  '   into the todo list.',
  '3. Split the work across SPECIALIZED coders (e.g. a backend-API coder + a',
  '   database coder) and invoke them in PARALLEL — one `coder` agent per',
  '   specialty, each handed only the interview answers for its specialty.',
  '4. Route all implementation through the `coder` agent, never inline edits.',
  '5. If a coder STOPS because no `<lang>-guidelines` skill exists for its stack,',
  '   notify the user and ask whether to build one. If yes, invoke the',
  '   `best-practices` skill; when it finishes, ask the user to reload plugins,',
  '   then re-invoke the coder to resume.',
  '6. Use the Context7 MCP for current, version-accurate library/framework docs.',
].join('\n'));
