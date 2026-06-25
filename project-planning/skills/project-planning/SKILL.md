---
name: project-planning
description: Read a project's plan.md and build or update a tasks.md broken into Milestones and sub-tasks, with per-task descriptions and a status tracking table, splitting tasks that are too large and marking progress. Use at the start of a project or session ("read the plan", "build a tasks file", "continue where we left off"), whenever a plan.md exists and tasks need to be derived or refreshed, or when the user asks to track/update project progress.
---

# Trigger conditions
- User asks to read `plan.md` / "understand the project" and produce a task breakdown.
- User says "continue where we left off" or starts a new session on an existing project.
- User asks to build, update, or sync `tasks.md`.
- A `plan.md` exists in the working directory and no current `tasks.md` reflects it.

# Source of truth
- `plan.md` = the plan (what we're building and why). The user owns it.
- `tasks.md` = the execution breakdown derived from `plan.md`. This skill owns it.
- If `plan.md` is missing, ask the user for it (or a one-line goal) before generating tasks. Do not invent a plan.

# Workflow

## 1. Read the plan
- Read `plan.md` in the working directory. Read the whole thing.
- If `tasks.md` already exists, read it too — preserve completed status and existing IDs; only add/adjust what the plan now requires.

## 2. Build tasks.md
Group work into **Milestones** (major phases). Under each Milestone list **sub-tasks**.
- Each task gets a stable ID (`M1.1`, `M1.2`, `M2.1`, …), a short title, and a one-line description.
- If a task is too large to do in one focused pass, split it into smaller sub-tasks. A task whose description needs the word "and" twice is usually two tasks.
- Order tasks so dependencies come first.

## 3. Status tracking table
Put a single tracking table near the top of `tasks.md` as the at-a-glance view. Status values: `Pending` / `In Progress` / `Done` / `Blocked`.

## 4. Mark progress
- When work completes, update both the table and the task's checkbox.
- On "continue where we left off", read `tasks.md`, report the next `Pending`/`In Progress` task, and resume there.
- Keep the table and the per-Milestone checkboxes in sync — they must never disagree.

# tasks.md template

```markdown
# Tasks

> Derived from plan.md. Status legend: Pending · In Progress · Done · Blocked

## Status Tracker

| ID   | Task                          | Milestone        | Status      |
|------|-------------------------------|------------------|-------------|
| M1.1 | Scaffold project structure    | M1: Foundation   | Done        |
| M1.2 | Set up config loading         | M1: Foundation   | In Progress |
| M2.1 | Implement core parser         | M2: Core         | Pending     |

## M1: Foundation
- [x] **M1.1 — Scaffold project structure**: create directories, base files, entry point.
- [ ] **M1.2 — Set up config loading**: read settings from env/file with defaults.

## M2: Core
- [ ] **M2.1 — Implement core parser**: turn raw input into the internal model.
```

# Project-root CLAUDE.md rule
The first time you set up a project with this skill, offer to drop this snippet into the project root's `CLAUDE.md` (create the file if absent, append if present). It makes `plan.md`/`tasks.md` the source of truth so "continue where we left off" needs no re-explaining:

```markdown
## Project planning
- `plan.md` is the source of truth for what we're building and why.
- `tasks.md` is the execution breakdown (Milestones, sub-tasks, status table) derived from `plan.md`.
- At session start, read both and resume at the next Pending/In Progress task. Keep the status table and checkboxes in sync as work completes.
```

# Notes
- Keep descriptions to one line; the plan holds the detail.
- Don't duplicate plan.md content into tasks.md — tasks.md is the actionable slice.
- Pairs with session-manager (`/start-session`, `/summarize-session`): this skill produces the `tasks.md` those commands read.
