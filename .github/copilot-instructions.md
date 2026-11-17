# GitHub Copilot Instructions

See [AGENTS.md](../AGENTS.md) for full project architecture and conventions.

## Core Architectural & Quality Constraints
- **Stack**: TypeScript (strict), Node >= 26, pnpm 12, Vite 8, Vitest.
- **Framework**: Inglorious Forge (`@inglorious/store`, `@inglorious/web`, `@inglorious/ui`, `@inglorious/i18n`).
- **State & Logic**: Entity-Component-System (ECS) pattern.
  - Entities are pure JSON objects stored in the store.
  - Behavior belongs in type objects containing event handlers and optional `render` functions returning lit-html `html` templates.
  - Events are broadcast via `api.notify("eventName", payload)`. Avoid classes, Angular-style services, or RxJS.
- **Localization**: All UI copy must use `@inglorious/i18n` with entries across `it`, `en`, `de`, and `fr`.
- **Quality Gates**:
  - Lint: `pnpm lint`
  - Types: `pnpm typecheck`
  - Tests: `pnpm test`
  - Build: `pnpm build`
