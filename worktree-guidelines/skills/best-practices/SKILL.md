---
name: best-practices
description: "Use when no `<lang>-guidelines` skill exists for the language being written; builds one before coding. Invoke this FIRST, then follow the generated skill."
---

# Important
When there is no `<lang>-guidelines` skill for the language in play, this skill BUILDS one before any code is written. Do not start coding until the generated skill exists.

# Workflow

## 1. Confirm & collect the stack
- Ask the user to confirm building a `<lang>-guidelines` skill for the language in play.
- Collect the stack: language, framework, runtime, test tool, and lint/format/type tooling.
- If the user is unsure of tooling, propose the ecosystem standard (see Tooling below) and confirm.

## 2. Generate the skill
- Write the new skill to `<lang>-guidelines/SKILL.md` with YAML frontmatter: a `description` telling Claude to invoke it before writing that language.
- Keep it lean and imperative — terse rules, no prose padding.
- Capture these architecture rules, adapted to the language's conventions:
  - Files stay small (≤ ~500 lines); split when they grow past that.
  - Comments are minimal — explain *why*, never *what*; skip the self-explanatory.
  - Decompose into small, single-purpose functions; break up anything complex.
  - Directory tree is logical and purpose-driven; no needless files or dirs.
  - Clear naming conventions for files, functions, classes, and variables per that language's idiom (e.g. snake_case, camelCase, PascalCase where appropriate).

## 3. Encode the tooling
Pin the ecosystem-standard lint/format/type tools and the exact commands to run them:
- Python → `ruff` (lint + format) + `pyright` (types)
- JS/TS → `eslint` + `prettier` + `tsc`
- Go → `gofmt` + `golangci-lint`
- Rust → `rustfmt` + `clippy`
- Other → the ecosystem-standard equivalents.

## 4. Point at live docs
- Instruct the generated skill to use the **Context7 MCP** to fetch current, version-accurate docs for the libraries and frameworks in the stack — do not rely on training data for API syntax, config, or migrations.

## 5. Hand off
- Once written, load the new `<lang>-guidelines` skill and code through it.
