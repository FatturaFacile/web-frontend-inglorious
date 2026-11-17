# AGENTS.md

## Project & Stack Overview
- **Project**: Fattura Facile — Web Frontend (`web-frontend-inglorious`)
- **Domain**: Cross-border Italy–Switzerland (IT-CH) invoicing and management application
- **Runtime & Toolchain**: Node.js >= 26 (`v26.13.1`+), pnpm 12 (`pnpm@12.16.1`, pinned via `packageManager`)
- **Core Framework & Architecture**:
  - [Inglorious Forge](https://inglorious.dev) ecosystem (ECS-inspired: state lives in plain-data entities, behavior lives in types)
  - `@inglorious/store` (12.x): Redux-compatible entity-component-system store, immutable updates via `mutative`, event-driven via `api.notify("event", payload)`
  - `@inglorious/web` (6.x): lit-html rendering (`html` template tag), router with code-split lazy routes, declarative forms, sensors
  - `@inglorious/ui` (9.x): Accessible UI components (DataGrid, Drawer, Menu, Combobox, Toast) with Bootstrap theme and WCAG AA compliance
  - `@inglorious/i18n` (2.x): Store-driven multi-language catalogues loaded on demand (`it`, `en`, `de`, `fr`)
  - Icons: Tree-shaken SVG icon sets via Iconify (`@iconify-icons/fa7-*`, `@iconify-icons/material-symbols`)
  - Bundler & PWA: Vite 8, `vite-plugin-pwa` (Workbox)
  - Unit & Integration Testing: Vitest 5 with `jsdom`
- **Key Directory Layout**:
  - `src/main.ts`: Application bootstrap, styles, PWA registration
  - `src/start.ts`: Mounts the store and binds global request handling (also reused in tests)
  - `src/app.ts`: Root render: theme, session state, shell layout or public routes
  - `src/config.ts`: API endpoints (`/api/v1`, `/sanctum/csrf-cookie`) and default routes
  - `src/store/`: `createStore`, initial entities, middlewares, and lazy route table (`routes.ts`)
  - `src/pages/`: Routed views organized by feature (one chunk per page)
  - `src/types/`: Shared Inglorious types and factories (`createListPage`, server data grids, forms)
  - `src/layout/`: Shared presentation elements (headers, KPIs, tags, toolbars)
  - `src/api/`: Typed client modules on top of the fetch wrapper (`src/api/http.ts`)
  - `src/models/`: Domain TypeScript types (invoices, contacts, treasury, customs, etc.)
  - `src/forms/`: Form definitions, field validators, and backend error mappings
  - `src/guards/`: Composable route guards (e.g. `requireAuth`)
  - `src/i18n/`: Internationalization setup and translations (`it`, `en`, `de`, `fr`)
  - `src/styles/`: App themes extending Inglorious UI Bootstrap theme (`theme.css`, `app.css`)
  - `types/`: Global and ambient TypeScript definitions

## Coding & Quality Standards
- **Strict Typing**: TypeScript `strict: true`, zero `any` tolerance without explicit justification.
- **ECS Pattern Discipline**:
  - Entities are pure JSON-serializable plain data objects in the store.
  - Behavior lives exclusively in types (handler maps responding to events and optional `render` functions).
  - Cross-cutting concerns are dispatched via `api.notify("eventName", payload)`. No Angular-style injectable services, no RxJS.
- **Template Rendering**: Use `@inglorious/web` `html` tagged templates. Keep renders pure, fast, and accessible (WCAG AA).
- **Internationalization (i18n)**: Every user-facing label or text string must be localized across `it`, `en`, `de`, and `fr`. Never hardcode user-facing strings in templates.
- **Zero-Warning Tolerance**: Code must pass ESLint and TypeScript compilation without errors or warnings.
- **Dev Server Port Constraint**: Dev server runs on `http://localhost:4200` to match Laravel Sanctum stateful CORS and cookie domains.

## Exact Verification & Quality Gate Commands
Always verify changes using the exact commands from `package.json`:

- **Install Dependencies**:
  ```bash
  pnpm install
  ```
- **Code Formatting**:
  ```bash
  pnpm format
  ```
  *(Check without writing: `pnpm exec prettier --check .`)*
- **Static Analysis & Linting**:
  ```bash
  pnpm lint
  ```
- **Type Checking**:
  ```bash
  pnpm typecheck
  ```
  *(Executes `tsc -p tsconfig.app.json --noEmit`)*
- **Test Suite**:
  ```bash
  pnpm test
  ```
  *(Executes `vitest run`)*
- **Production Build**:
  ```bash
  pnpm build
  ```
- **Benchmarks**:
  ```bash
  pnpm bench:size
  ```
*(Note: On Windows PowerShell environments where script execution is restricted, run `pnpm.cmd <script>` instead of `pnpm <script>`)*

## Backend Integration & API Contract
- The frontend connects to the `web-api` backend (Laravel) via `/api/v1` and `/sanctum/csrf-cookie`.
- Authentication uses Laravel Sanctum first-party stateful session cookies (XSRF-TOKEN).
- Failing HTTP requests are converted by `src/api/http.ts` into `requestFail` events handled by the store. Never swallow backend errors with fake success states.
