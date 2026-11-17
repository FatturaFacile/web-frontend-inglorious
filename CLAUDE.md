@AGENTS.md

# Claude Code Execution Instructions
- **Project Reference**: Always consult and follow the standards outlined in `AGENTS.md`.
- **Worktree & Branch Discipline**: Perform modifications in isolated feature branches or git worktrees. Keep commits atomic and use Conventional Commits.
- **Verification Gates**: Before reporting any task complete, run:
  1. `pnpm lint` (or `pnpm.cmd lint`)
  2. `pnpm typecheck` (or `pnpm.cmd typecheck`)
  3. `pnpm test` (or `pnpm.cmd test`)
  4. `pnpm build` (or `pnpm.cmd build`)
- **Coding Style**: Respect the Inglorious ECS architecture (entities hold state, types hold behavior/handlers, events communicate across boundaries). Never introduce stateful classes or DI services.
