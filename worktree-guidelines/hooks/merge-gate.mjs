// M2.4 merge gate: block `git merge` into main/master unless the reviewed SHA is HEAD.
import { readInput, markerSha, headSha, deny, allow } from './lib/git.mjs';

const input = await readInput();
const command = input.tool_input?.command ?? '';

// ponytail: naive regex detection of `git merge <...> main|master`. Evadable via
// aliases, `&&`/`;` chains, or non-git merges. Upgrade path: parse the full command
// (shell-quote/AST) or gate on a real merge hook if one ever ships.
const isMergeToMain = /\bgit\s+merge\b/.test(command) && /\b(main|master)\b/.test(command);
if (!isMergeToMain) allow();

if (markerSha() !== headSha()) {
  deny('Cannot merge into main: review marker missing or stale (marker SHA != HEAD). Run the reviewer / code-review skill to approve the current HEAD first.');
}
allow();
