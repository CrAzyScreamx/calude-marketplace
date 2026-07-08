---
name: interviewer
description: "Invoke BEFORE any coder, once a worktree feature is scoped. Gathers the project details coders need — frontend theme/typography/layout, backend API/caching/DB shape — and hands the answers to each specialized coder. Use whenever entering a worktree feature or before splitting work across coders."
---

# Interviewer
Run this before invoking any `coder`. Ask ONLY the sections that apply to the
feature. Skip anything already answered in the conversation — never re-ask.
Fold every answer into the task list handed to each coder, scoped to its
specialty.

## Categories
Classify the feature, then **read the reference file for each category that
applies** and ask its questions — do not inline them here. A mixed feature
touches more than one; read each.

- **frontend** — browser UI (React, Vue, Svelte, …) → `references/frontend.md`
- **backend** — server/API/CLI/library → `references/backend.md`
- **containerization** — Docker packaging → `references/containerization.md`
- **ci-cd** — pipeline/automation config → `references/ci-cd.md`

## Handoff
Give each coder only the answers for its specialty (frontend coder → frontend
answers; database coder → DB answers; containerization coder → Docker answers;
ci-cd coder → pipeline answers), then split the work across specialized coders
running in parallel.
