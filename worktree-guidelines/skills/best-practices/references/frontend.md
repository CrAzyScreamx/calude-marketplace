# frontend — category questions

Name it after the framework: `<framework>-guidelines`.

Ask:
- **Style guide / components**: where components live, naming, and structure inside the per-project layout (e.g. `components/`, atomic vs feature folders).
- **Design Sync**: offer to keep the component library in sync with a Claude Design project via the `DesignSync` tool / `/design-sync` skill. If yes, record it as a step in the generated skill.
- **External libraries** to bake into best practices (UI kit, state, data-fetching, forms, routing).
- **Environment**: bundler / dev server (Vite, etc.), package manager, TS config.

**Design skill**: the generated skill MUST instruct the coder to also load the `frontend-design` skill and design against it, and to gather the design brief before coding (reference image, navbar placement, default page, logo, project idea, plus brand colors / theme / target device as relevant).

Tooling: JS/TS → `eslint` + `prettier` + `tsc`.
