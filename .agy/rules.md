# Antigravity Rules
See [AGENTS.md](../AGENTS.md) for full project architecture, ECS rules, and quality gates.

## Key Directives
- **Architecture**: Inglorious ECS (`@inglorious/store`, `@inglorious/web`, `@inglorious/ui`). Plain entities + behavior in types.
- **Verification Commands**:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
- Always maintain WCAG AA accessibility, strict TypeScript typing, and 4-language i18n support (`it`, `en`, `de`, `fr`).
