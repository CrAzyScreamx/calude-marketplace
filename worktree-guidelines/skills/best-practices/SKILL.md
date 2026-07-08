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
- **ci-cd** — pipeline/automation config (GitHub Actions, GitLab CI, …). Name it `cicd-guidelines`.

A mixed feature (frontend + backend + Docker + CI) = build one plugin per category.

## 2. Collect the stack — branch by category
Always collect: language, framework, runtime, test tool, lint/format/type tooling. If the user is unsure, propose the ecosystem standard and confirm.

Then **read the reference file for the category you classified in step 1** and ask its questions — do not inline them here:
- frontend → `references/frontend.md`
- backend → `references/backend.md`
- containerization → `references/containerization.md`
- ci-cd → `references/ci-cd.md`

Each reference file carries the category's naming rule, questions, and tooling.

## 3. Encode architecture rules
Adapt to the stack's idiom:
- Files stay small (≤ ~500 lines); split when they grow past that.
- Comments minimal — explain *why*, never *what*.
- Decompose into small, single-purpose functions/components.
- Logical, purpose-driven directory tree; no needless files.
- Clear naming per idiom (snake_case, camelCase, PascalCase).
- Fold in the category answers from step 2 as concrete rules.

**Adding an extension to a guideline** (any new rule/practice, whether building it now or extending an existing one): before writing it, ask the user which mode it takes —
- **Always-follow** → bake the rule directly into the SKILL.md body so the coder applies it on every run.
- **Conditional reference** → the rule only applies in a specific situation. Record the trigger condition + the rule, and phrase it as "when `<situation>`, do `<rule>`" so it's referenced only when that situation occurs.

Default to asking per extension; don't assume. If the user says a class of extensions is always one mode, follow that without re-asking.

## 4. Encode the tooling
Pin the exact lint/format/type commands the category's reference file names (step 2), plus any ecosystem standard for the specific language in play. Encode the commands verbatim so the coder runs them.

## 5. Point at live docs
Instruct the generated skill to use the **Context7 MCP** for current, version-accurate docs of the libraries/frameworks in the stack — never rely on training data for API syntax, config, or migrations.

## 6. Write the SKILL.md body to a temp file
Write the terse, imperative guideline rules (lean — no prose padding) to a temp
file, e.g. `<scratchpad>/<skill-name>.SKILL.md`. Include the full frontmatter
(`name: <skill-name>-guidelines`, and a `description` that tells Claude to invoke
it before writing this stack). This temp file is the INPUT to the scaffold script
— do NOT write it into any skills directory yourself.

The **plugin name and skill name are separate**: the skill name must end in
`-guidelines` (the coder/hooks resolve the guideline by that suffix); the plugin
name is a plain package name (e.g. `react-frontend`) — pick a sensible one and
confirm with the user.

## 7. Ask placement, then run the scaffold script — the ONLY approved packaging
First ask the user: **is there a remote marketplace you work with that you want
this saved in?** (so they can push it and use the guideline anywhere).
- **Yes** → they give its local path → that path is `--dest`.
- **No** → save locally: `--dest` is this marketplace's root.

Then package + register in one deterministic step by RUNNING the script (never
hand-write plugin files, never drop a bare SKILL.md):
```
node "${CLAUDE_PLUGIN_ROOT}/skills/best-practices/scaffold.mjs" \
  --plugin <plugin-name> --skill <skill-name>-guidelines \
  --dest <marketplace-root> \
  --description "<invoke-before-writing description>" --body <temp-SKILL.md>
```
The script creates `<dest>/<plugin-name>/` with `plugin.json` +
`skills/<skill-name>-guidelines/SKILL.md`, and appends the entry to
`<dest>/.claude-plugin/marketplace.json`. If that marketplace file doesn't exist
yet, add `--market-name <name> --owner <owner>` (ask the user) and the script
creates it. The script refuses to overwrite an existing plugin of the same name —
if it exits with that error, ask the user whether to overwrite or rename. A run
that ends without this script having succeeded is a FAILED run.

## 8. Hand off
- A freshly-written plugin is NOT installed as a loadable skill this session. Report the exact SKILL.md path and **read it back by path**; the coder loads the guidelines by reading that file until the plugin is installed in a later session.
- Then code through the loaded guidelines.
