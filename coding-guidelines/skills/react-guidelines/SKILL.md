---
name: react-guidelines
description: Invoke BEFORE writing any React/TypeScript frontend code in this project (components, hooks, routes, forms, MUI UI, Vite config). Encodes the required stack, architecture, and tooling rules.
---

# React Frontend Guidelines

Stack: **TypeScript + React + Vite + pnpm**. Routing **React Router**, forms **React Hook Form + Zod**, UI **MUI (@mui/material)**, tests **Vitest + React Testing Library**.

Use **Context7 MCP** for current, version-accurate docs of React, MUI, React Router, React Hook Form, Zod, Vite before using their APIs — never rely on training data for syntax/config/migrations.

## Architecture
- Files ≤ ~500 lines. Split when larger.
- One component per file; PascalCase file = PascalCase component. Hooks `useX.ts`.
- Feature-first tree: `src/features/<feature>/{components,hooks,api,types}`. Shared UI in `src/components/`, shared hooks in `src/hooks/`, shared utils in `src/lib/`.
- Small single-purpose components and hooks. Extract logic out of JSX into hooks.
- Function components + hooks only. No class components.
- Comments explain **why**, never **what**. Minimal.
- No needless files/barrels/abstractions. No interface with one impl, no wrapper over a lib for its own sake.

## TypeScript
- `strict: true`. No `any` — use `unknown` + narrowing. No non-null `!` at trust boundaries.
- Type props with a `type` (not `interface`) unless extending. Derive form types from Zod schema via `z.infer`.
- Prefer discriminated unions over optional-flag soup.

## React
- Keys: stable ids, never array index for dynamic lists.
- Effects only for external sync (subscriptions, DOM, non-React). Derive state during render; don't mirror props into state.
- Memoize (`useMemo`/`useCallback`/`memo`) only when a measured need exists, not by default.
- Colocate state as low as possible; lift only when shared.
- Data fetching in hooks/`api` modules, not inline in components.

## MUI
- Theme via a single `ThemeProvider` + `createTheme`; no ad-hoc inline color hexes — pull from theme tokens (`theme.palette`, `theme.spacing`).
- Style with the `sx` prop or `styled()`; avoid raw inline `style={}`.
- Use MUI layout primitives (`Box`, `Stack`, `Grid`) over hand-rolled flex divs.
- Compose MUI components; don't reimplement inputs/dialogs/menus MUI already ships.

## Forms
- React Hook Form + `zodResolver`. One Zod schema per form = source of truth for validation + types.
- Validate at the boundary (submit + field). Surface errors from `formState.errors`.

## Routing
- React Router data APIs (`createBrowserRouter`, loaders/actions) where they fit. Lazy-load route elements with `React.lazy`.

## Accessibility
- Semantic elements / correct MUI component roles. Label every input. Keyboard-operable interactive elements. Don't strip focus outlines.

## Tooling — run before done
- Lint: `pnpm eslint . --max-warnings=0`
- Format: `pnpm prettier --write .`
- Types: `pnpm tsc --noEmit`
- Test: `pnpm vitest run`
Test user-visible behavior with RTL queries (`getByRole`/`getByLabelText`), not implementation details. Cover non-trivial logic; skip trivial render-only snapshots.

## Design Sync
When adding/updating shared components, keep the component library in sync with the Claude Design project: run the `/design-sync` skill (DesignSync tool) so components match the design source of truth.
