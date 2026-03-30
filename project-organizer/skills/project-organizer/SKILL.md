---
name: project-organizer
description: Initialize, maintain, and query an Obsidian-style knowledge vault that documents a software project's structure, features, tools, and dependencies — all living inside the project directory itself. Use this skill whenever the user mentions "project vault", "initialize the vault", "document my project", "add this feature to the vault", "archive this feature", "what does this feature do", "set up project docs", or whenever you're about to start work on a project and no vault exists yet. Also trigger when a feature is completed or removed, to keep the vault up to date.
---

# Project Organizer

This skill manages a self-contained Obsidian vault that lives inside the project's directory. Its purpose is to give you — and any future AI session — a fast, reliable map of the project: what it does, how it's built, and where everything lives. Think of it as the project's long-term memory.

> **Recommended companion:** The [obsidian skill](https://github.com/kepano/obsidian-skills) adds Obsidian Markdown, CLI, and Canvas support. If installed, use it when writing vault files to get proper wikilinks, callouts, and frontmatter. If not installed, plain Markdown is fine — the vault will still work.

---

## Vault Location and Name

The vault lives at `<project-root>/<VaultName>/` where `VaultName` is either:
- Provided by the user, or
- Inferred from the project name (e.g. the repo name or the root directory name)

---

## Vault Structure

```
<VaultName>/
├── tools.md
├── archived/           ← removed features land here
└── <type>/
    └── <feature>.md
```

**`<type>`** is a broad layer of the project — for example: `frontend`, `backend`, `database`, `infrastructure`, `auth`, `shared`.

**`<feature>`** is a specific capability within that layer — for example: `dashboard`, `api`, `user-profile`, `migrations`.

If a feature is complex enough to have distinct sub-components, create a sub-folder:
```
backend/
└── api/
    ├── api.md          ← overview
    ├── auth-routes.md
    └── data-routes.md
```

---

## File Schemas

### `tools.md` — Project Overview

Keep this file short and high-level. Its job is to let anyone (human or AI) understand the project in under 30 seconds. If it's getting long, you're going into too much detail.

```markdown
---
title: <Project Name>
type: overview
---

# <Project Name>

<One sentence description>. <Second sentence — what makes it distinctive or what problem it solves>.

## Tools

**Languages:** <list>
**Runtime / Platform:** <e.g. Node 20, Python 3.11, browser>
**Key third-party dependencies:** <list the most important ones — frameworks, ORMs, auth libs, etc.>

## Purpose

<2–3 sentences on why this project exists and who uses it.>
```

Do not add architecture diagrams, long dependency trees, or setup instructions here. Those belong in feature files.

---

### `<feature>.md` — Feature Documentation

```markdown
---
title: <Feature Name>
type: feature
layer: <frontend|backend|database|...>
keywords: [<keyword1>, <keyword2>, ...]
---

# <Feature Name>

<One sentence description>. <Second sentence — what user need or system role this serves>.

## Dependencies

**Tools / services needed:** <e.g. Redis, Stripe API, WebSocket server>
**Dependent features:** [[<other-feature>]], [[<another-feature>]]  ← features that depend on THIS one
**Packages:** <npm/pip/etc. packages specific to this feature>

## Files

| File | Role | Likely to edit? |
|------|------|-----------------|
| `src/components/Dashboard.tsx` | Main dashboard component | Yes |
| `src/hooks/useDashboard.ts` | Data-fetching hook | Sometimes |
| `src/api/dashboard.ts` | API client for dashboard data | Rarely |

**Sections within files** (if a file has multiple concerns, call out the relevant part):
- `Dashboard.tsx` → `<ChartPanel>` component handles the visualization

## Understanding

<For each file above, one clear sentence explaining its role in this feature and how it fits into the broader structure. Focus on *why* it exists, not just what it does.>
```

The **keywords** field in frontmatter is important — it's how a future AI session will locate this file quickly without scanning the whole vault. Choose terms that describe the feature's domain, not just its name (e.g. `authentication`, `JWT`, `session`, `login` rather than just `auth-feature`).

---

## Scenario 1: New Project — Vault Doesn't Exist Yet

When you start a new session on a project that has no vault, do the following **before any other work begins**:

1. Check whether a vault exists: look for a directory containing a `tools.md` at the project root.
2. If no vault is found, ask the user:
   > "I don't see a project vault yet. Would you like me to set one up? It'll give future sessions a map of the project. Takes just a moment."
3. If the user agrees:
   a. Ask for the vault name (or suggest one from the project directory name).
   b. Create the vault structure (at minimum, `tools.md` and the first feature directories you can infer from the codebase).
   c. Add the following to the project's `CLAUDE.md` (create it if it doesn't exist), under a `## Project Vault` section:
      ```
      ## Project Vault
      Before looking for project context in source files, check the vault at `./<VaultName>/`.
      Start with `tools.md` for an overview, then navigate to the relevant `<type>/<feature>.md`.
      The vault is the fast path — use it before digging into source.
      ```
4. If the user says no, proceed with the session normally. Don't ask again in the same session.

---

## Scenario 2: Vault Exists — Keeping It Updated

The vault is only valuable if it stays accurate. Maintain it as part of normal work:

**When a feature is completed:**
After finishing implementation, create or update the relevant `<type>/<feature>.md`. Do this before closing the task — it takes very little time and prevents documentation drift.

**When a feature is removed:**
Move its file(s) to the `archived/` folder. Do not delete them — they may be useful for future reference (e.g. if the feature is revived, or if someone wants to understand a past decision).

```
archived/
└── <type>-<feature>.md   ← rename to avoid collisions
```

Add a short note at the top of the archived file:
```markdown
> [!note] Archived
> This feature was removed on <date>. Reason: <brief reason if known>.
```

**When a feature is significantly refactored:**
Update the affected file. Focus on what changed — the file list, the dependencies, the understanding section.

---

## Scenario 3: Ongoing Project — Vault Doesn't Exist, User Requests It

This is the most token-intensive scenario. Warn the user before starting:

> "Building the vault for an existing project means I'll need to scan the codebase and ask you a few questions. This will use more tokens than usual. Want to proceed?"

If they agree, follow this sequence:

### Step 1: Investigate the project

Read the following if they exist: `package.json` / `pyproject.toml` / `Cargo.toml` / `pom.xml` (or equivalent), `README.md`, `CLAUDE.md`, top-level directory structure. From this, extract:
- Programming language(s)
- Runtime/platform
- Key third-party dependencies
- Rough directory structure (frontend, backend, etc.)

If anything is unclear from the files, ask the user — but batch your questions rather than asking one at a time.

### Step 2: Confirm the basics with the user

Ask these four things together in a single message:

1. **Vault name** — "I'll name the vault `<inferred-name>` — does that work, or would you prefer something else?"
2. **Project purpose** — "In your words, what is this project for and who uses it?"
3. **Dependencies** — "Based on the config files I found, the main dependencies seem to be: `<list>`. Anything missing or wrong there?"
4. **Feature schema** — "Here's how I'd break down the project's features: `<list of type/feature pairs>`. Does this look right? Anything to add, remove, or rename?"

### Step 3: Deploy subagents for feature discovery (if you have subagents)

Assign one subagent per layer (frontend, backend, etc.) to read relevant source files and produce a summary per feature: what it does, what files are involved, what packages it uses, what it depends on. This parallelizes the slow part.

If subagents aren't available, do this inline — one layer at a time.

### Step 4: Build the vault

Using the confirmed answers from Step 2 and the subagent outputs from Step 3, create:
- `tools.md`
- One `<type>/<feature>.md` per feature

Then add the vault reference to `CLAUDE.md` as described in Scenario 1, step 3c.

---

## Using the Vault as a Navigation Tool

When starting any task on a project that has a vault:

1. Read `tools.md` first for orientation.
2. Identify which feature(s) are relevant to the task — use the feature names and keywords.
3. Read those feature files to understand the files involved before opening source code.

This is much faster than grepping or browsing source files cold. The vault is the map; source files are the territory.

---

## What the Vault Is NOT

- Not a changelog or commit history — that's what git is for.
- Not a setup guide — if you need one, put it in `README.md`.
- Not an exhaustive API reference — keep the feature files high-level enough that they stay current.
- Not a replacement for reading the code — it's a navigation aid, not a substitute.
