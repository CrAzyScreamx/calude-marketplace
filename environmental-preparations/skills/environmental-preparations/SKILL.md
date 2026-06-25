---
name: environmental-preparations
description: Running log of the user's environment preferences and configuration changes — CLAUDE.md rules, settings, and conventions. Use to recall how the user likes their environment set up, and append a dated entry whenever you make an environment change (anything that isn't building a skill).
---

# Purpose
Claude has no memory across sessions. This skill is the durable record of how the user likes the environment configured. Read it when preparing a project's environment; append to it whenever an environment change is made (CLAUDE.md edits, settings, conventions — anything that isn't a skill build).

# How to log
Append a new entry under **Change log**, newest first: a dated heading, what changed, and where it applies.

# Change log

## 2026-06-22 — LLM token/cost discipline as a standing CLAUDE.md rule
- **What**: Added an "LLM token/cost discipline" rule to global `~/.claude/CLAUDE.md`: terse instructions, StructuredOutput over inline schemas, TOON over JSON for payloads, drop empty/no-finding sections, target <15k input tokens — applied when first writing any LLM agent prompt.
- **Where**: `C:\Users\Amit\.claude\CLAUDE.md` (Working conventions section).
- **Why**: Cost minimization (~$0.2/run, "instructions too long") is a standing constraint for the user, but every new agent/prompt was built verbose and then re-trimmed on request. The rule makes prompts born lean.

## 2026-06-22 — Standing conventions into global CLAUDE.md (fix skill auto-trigger friction)
- **What**: Added a "Working conventions (apply unconditionally)" section to the global `~/.claude/CLAUDE.md`: (1) the plan.md/tasks.md planning workflow, and (2) always follow `python-guidelines` before writing Python.
- **Where**: `C:\Users\Amit\.claude\CLAUDE.md`.
- **Why**: Skills don't always auto-fire, so the user kept re-asking "did you use the skill?" and re-explaining the same conventions each session. CLAUDE.md rules apply unconditionally on every machine that syncs it, so the two most-repeated conventions no longer depend on skill triggering. The `project-planning` and `python-guidelines` skill descriptions are already trigger-tuned; the global rules are the durable backstop.

## 2026-06-22 — Project planning convention as a project-root CLAUDE.md rule
- **What**: Added a "Project planning" snippet to drop into each project's root `CLAUDE.md`, declaring `plan.md` as the source of truth and `tasks.md` as the derived execution breakdown (Milestones, sub-tasks, status table), and instructing session-start to resume at the next Pending/In Progress task.
- **Where**: The snippet lives in the `project-planning` skill ("Project-root CLAUDE.md rule" section), which offers to add it to a project root on first setup.
- **Why**: The user re-explained this start-of-project ritual nearly every session; encoding it removes the need to re-describe it.
