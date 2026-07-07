---
name: best-practices
description: "Use when no `<lang>-guidelines` skill exists for the language/stack being written; builds one (packaged as a plugin) before coding. Invoke this FIRST, then follow the generated skill."
---

# Important
When no `<lang>-guidelines` skill exists for the stack in play, this skill BUILDS one — packaged as a standalone **plugin** — before any code is written. Do not start coding until the plugin exists and its SKILL.md has been loaded.

The generated skill MUST keep the `-guidelines` suffix (e.g. `react-guidelines`, `fastapi-guidelines`, `containerization-guidelines`). The coder and hooks resolve it by that suffix — do not rename the contract.

# Output contract — non-negotiable
You are NOT done when the SKILL.md is written. Both of these MUST happen, in order:
1. **Package as a plugin (step 6).** NEVER write a bare `SKILL.md` into a skills directory — especially not `~/.claude/skills/`. The output is a plugin folder (`<name>-guidelines/.claude-plugin/plugin.json` + `skills/<name>-guidelines/SKILL.md`). A lone SKILL.md is a failed run.
2. **Ask the placement question (step 7)** and register the plugin in a marketplace's `plugins[]`. You may NOT end the run without asking whether to save it in a remote marketplace or locally, and then writing the marketplace entry.

If you catch yourself about to hand off after only writing a SKILL.md, stop — you skipped steps 6–7.

# Workflow

## 1. Classify & confirm
Decide which category is being built and confirm with the user:
- **frontend** — browser UI (React, Vue, Svelte, …). Name it after the framework: `<framework>-guidelines`.
- **backend** — server/API/CLI/library (Python, Go, Node API, …). Name it `<framework-or-lang>-guidelines`.
- **containerization** — Docker packaging. Name it `containerization-guidelines`.

A mixed feature (frontend + backend + Docker) = build one plugin per category.

## 2. Collect the stack — branch by category
Always collect: language, framework, runtime, test tool, lint/format/type tooling. If the user is unsure, propose the ecosystem standard (see Tooling) and confirm. Then ask the category-specific questions:

### frontend
- **Style guide / components**: where components live, naming, and structure inside the per-project layout (e.g. `components/`, atomic vs feature folders).
- **Design Sync**: offer to keep the component library in sync with a Claude Design project via the `DesignSync` tool / `/design-sync` skill. If yes, record it as a step in the generated skill.
- **External libraries** to bake into best practices (UI kit, state, data-fetching, forms, routing).
- **Environment**: bundler / dev server (Vite, etc.), package manager, TS config.

### backend
- **External libraries** to use (framework, ORM/driver, validation, auth, HTTP client).
- **Exact tech stack** for the language (e.g. FastAPI + SQLAlchemy + Pydantic).
- **Environment**: how the project is set up per language — e.g. Python → `pyproject.toml`, `requirements.txt`, `venv`, `uvicorn`; Node → `package.json`, scripts; Go → modules.

### containerization
- **Dockerfile**: base image, multi-stage build, non-root user, layer-cache ordering, healthcheck, entrypoint.
- **docker-compose.yml**: services, networks, volumes, env files, `depends_on`/healthchecks, dev vs prod overrides.

## 3. Encode architecture rules
Adapt to the stack's idiom:
- Files stay small (≤ ~500 lines); split when they grow past that.
- Comments minimal — explain *why*, never *what*.
- Decompose into small, single-purpose functions/components.
- Logical, purpose-driven directory tree; no needless files.
- Clear naming per idiom (snake_case, camelCase, PascalCase).
- Fold in the category answers from step 2 as concrete rules.

## 4. Encode the tooling
Pin the ecosystem-standard lint/format/type tools and the exact commands:
- Python → `ruff` (lint + format) + `pyright` (types)
- JS/TS → `eslint` + `prettier` + `tsc`
- Go → `gofmt` + `golangci-lint`
- Rust → `rustfmt` + `clippy`
- Other → the ecosystem-standard equivalents.
- **containerization** has no type step — pin the lint/validate equivalents instead (`hadolint`, `docker build`, `docker compose config`).

## 5. Point at live docs
Instruct the generated skill to use the **Context7 MCP** for current, version-accurate docs of the libraries/frameworks in the stack — never rely on training data for API syntax, config, or migrations.

## 6. Package as a plugin
Write the guidelines as a plugin, not a bare SKILL.md:
```
<name>-guidelines/
  .claude-plugin/plugin.json        # { name, description, version: "1.0.0" }
  skills/<name>-guidelines/SKILL.md  # frontmatter: description tells Claude to invoke it before writing this stack
```
Keep SKILL.md lean and imperative — terse rules, no prose padding.

## 7. Place the plugin
After the build, ask the user: **is there a remote marketplace you work with that you want this saved in?** (so they can push it and use the guideline anywhere).
- **Yes** → ask them to point to that marketplace's local path, and save the plugin there.
  - If `<path>/.claude-plugin/marketplace.json` exists → create the plugin dir under `<path>` and **append** to its `plugins[]`.
  - If it does NOT exist → create the marketplace there first (`.claude-plugin/marketplace.json` with `name`, `owner`, empty `plugins[]` — ask for name/owner), then add the plugin.
- **No** → save it locally: create the plugin dir at this marketplace's root and append an entry to `./.claude-plugin/marketplace.json` `plugins[]`.
- Every entry is `{ name, source: ./<name>-guidelines, description }`. **Append, never overwrite** the marketplace file. If a plugin with that name already exists in `plugins[]`, stop and ask whether to overwrite or rename — do not duplicate the entry.

## 8. Hand off
- A freshly-written plugin is NOT installed as a loadable skill this session. Report the exact SKILL.md path and **read it back by path**; the coder loads the guidelines by reading that file until the plugin is installed in a later session.
- Then code through the loaded guidelines.
