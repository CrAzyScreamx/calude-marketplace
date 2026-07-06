---
name: code-review
description: "Run before merging worktree changes; loads the language skill, runs lint/type-check, checks the diff, and writes the review marker on pass."
---

# Important
This is the review gate for worktree changes. Exit and merge-into-main stay BLOCKED until this skill writes the pass marker. Only write the marker when everything is clean.

# Marker contract (shared — do not redefine)
`.worktree-review-ok` at the worktree root holds ONE line: the HEAD SHA the reviewer approved. The review is valid only while its contents equal `git rev-parse HEAD`. Any later commit invalidates it. The merge and exit gates read this file.

# Workflow

## 1. Load the language skill
- Load the project's `<lang>-guidelines` skill for the stack in play.
- If none exists, invoke the `best-practices` builder skill to create it first, then load it.

## 2. Lint & type-check
- Run the stack's lint + type-check commands (as pinned in the guidelines skill).
- Fix failures, or report them clearly if they can't be fixed. Do not proceed to the marker with failures outstanding.

## 3. Review the diff
Check `git diff` against the guidelines for:
- Code duplication.
- Unused imports and dead code.
- Naming and structure that don't align with the guidelines.
- Oversized files or functions.

## 4. Fix in parallel
- Map the changed features.
- For non-trivial fixes, mobilize sub-agents (Agent tool) to fix issues in parallel.
- Re-run lint + type-check after fixes and re-check the diff.

## 5. Write the marker — ON PASS ONLY
- Only when lint passes, types pass, and every issue is resolved: write the current `git rev-parse HEAD` SHA as a single plain-text line into `.worktree-review-ok` at the worktree root.
- Write it as UTF-8 (not UTF-16) — avoid a PowerShell `>` redirect, which adds a BOM the gate can't read; use the Write tool or `Set-Content -Encoding utf8`. This unlocks the merge and exit gates.
- Do NOT write the marker if anything is unresolved. Any commit made after writing it invalidates the review (marker must equal HEAD) — re-run this skill.
