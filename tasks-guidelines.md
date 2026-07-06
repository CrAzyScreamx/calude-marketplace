# Tasks — worktree-guidelines plugin

> Derived from plan `inherited-waddling-rossum.md`. Status legend: Pending · In Progress · Done · Blocked

## Status Tracker

| ID   | Task                                  | Milestone            | Status  |
|------|---------------------------------------|----------------------|---------|
| M1.1 | Scaffold plugin dirs + plugin.json    | M1: Scaffold         | Done    |
| M1.2 | Strong plugin description wording     | M1: Scaffold         | Done    |
| M2.1 | Shared git/marker lib (lib/git.mjs)   | M2: Hooks            | Done    |
| M2.2 | Entry-steering hook                   | M2: Hooks            | Done    |
| M2.3 | Exit-gate hook                        | M2: Hooks            | Done    |
| M2.4 | Merge-gate hook                       | M2: Hooks            | Done    |
| M2.5 | hooks.json wiring                     | M2: Hooks            | Done    |
| M3.1 | coder agent (sonnet)                  | M3: Agents           | Done    |
| M3.2 | reviewer agent (opus)                 | M3: Agents           | Done    |
| M4.1 | best-practices builder skill          | M4: Skills           | Done    |
| M4.2 | code-review skill                     | M4: Skills           | Done    |
| M5.1 | Retire programming-guidelines         | M5: Wire & retire    | Done    |
| M5.2 | Register plugin in marketplace.json   | M5: Wire & retire    | Done    |
| M6.1 | Verify hooks + review→merge→exit flow | M6: Verify           | Done    |
| M6.2 | Verify builder on a fresh language    | M6: Verify           | Done    |

## M1: Scaffold
- [x] **M1.1 — Scaffold plugin dirs + plugin.json**: create `worktree-guidelines/` with `.claude-plugin/plugin.json` (name, description, version — 3 fields), plus empty `hooks/`, `agents/`, `skills/`.
- [x] **M1.2 — Strong plugin description wording**: author plugin.json description with imperative "MUST use" trigger language per the discoverability section.

## M2: Hooks
- [x] **M2.1 — Shared git/marker lib**: `hooks/lib/git.mjs` with exec/git helpers, `is-ancestor`, clean-tree check, marker read/write (`.worktree-review-ok` = HEAD SHA). Self-check `git.test.mjs` passes.
- [x] **M2.2 — Entry-steering hook**: `worktree-enter.mjs` emits `additionalContext` (create todos, invoke coder, load/build `<lang>-guidelines`).
- [x] **M2.3 — Exit-gate hook**: `exit-gate.mjs` denies `ExitWorktree` unless HEAD merged into main and tree clean (main→master→allow fallback).
- [x] **M2.4 — Merge-gate hook**: `merge-gate.mjs` denies Bash `git merge` into main unless marker SHA == HEAD; `ponytail:` comment names the evasion ceiling.
- [x] **M2.5 — hooks.json wiring**: PreToolUse(EnterWorktree, ExitWorktree, Bash) with `command`+`commandWindows` variants, node-guarded fail-open. WorktreeCreate omitted — that event expects a path on stdout, so context injection uses the confirmed EnterWorktree tool instead.

## M3: Agents
- [x] **M3.1 — coder agent**: `agents/coder.md`, `model: sonnet`, MUST-load-language-skill / trigger-builder description.
- [x] **M3.2 — reviewer agent**: `agents/reviewer.md`, `model: opus`, runs code-review skill and writes the marker on pass; frontmatter matches real docker-sentinel agent format.

## M4: Skills
- [x] **M4.1 — best-practices builder skill**: `skills/best-practices/SKILL.md`; asks to build a `<lang>-guidelines` skill, collects stack, generates skill with architecture (≤500 lines, minimal comments, function decomposition), tooling (Python → ruff+pyright, equivalents elsewhere), Context7 guidance. Terse.
- [x] **M4.2 — code-review skill**: `skills/code-review/SKILL.md`; load language skill, run lint/type-check, check duplication/unused-imports/alignment, map features + mobilize sub-agents to fix, write marker on pass.

## M5: Wire & retire
- [x] **M5.1 — Retire programming-guidelines**: marketplace entry removed; directory deleted (recoverable from git history). Global CLAUDE.md Python rule redirected to the `<lang>-guidelines` / `best-practices` builder model.
- [x] **M5.2 — Register plugin**: add `worktree-guidelines` entry to `.claude-plugin/marketplace.json`.

## M6: Verify
- [x] **M6.1 — Verify enforcement flow**: exercised in a throwaway git repo — entry-steering emits context; ExitWorktree denied unmerged & denied on dirty tree, allowed when merged+clean; merge denied without marker, denied on stale marker (new commit), allowed when marker==HEAD; non-merge Bash allowed; reviewer `writeMarker()` writes HEAD SHA. All hook JSON valid. 9/9 gate checks pass.
- [x] **M6.2 — Verify builder**: `best-practices` SKILL step 1 offers to build `<lang>-guidelines` and collects the stack; Go tooling pinned (`gofmt` + `golangci-lint`), "Other → ecosystem-standard equivalents" covers any fresh language.
