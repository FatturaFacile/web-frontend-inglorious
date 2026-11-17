# JetBrains Junie & AI Assistant Guidelines

Refer to [AGENTS.md](../AGENTS.md) as the canonical project definition and coding standard.

## Technical Stack & Principles
- **Ecosystem**: Inglorious Web (`@inglorious/store`, `@inglorious/web`, `@inglorious/ui`, `@inglorious/i18n`) on TypeScript 6 / Node 26 / pnpm 12.
- **Design Pattern**: Entity-Component-System (plain data entities, types with event handlers and lit-html render functions).
- **No Class Services / DI**: Use `api.notify(...)` and store reducers/middlewares instead of stateful service singletons.

## Quality Gate Commands
- Run linting: `pnpm lint` (or `pnpm.cmd lint`)
- Run typecheck: `pnpm typecheck` (or `pnpm.cmd typecheck`)
- Run tests: `pnpm test` (or `pnpm.cmd test`)
- Run build: `pnpm build` (or `pnpm.cmd build`)
