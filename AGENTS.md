# Repository Guidelines

## Project Structure & Module Organization
This monorepo is managed with Yarn workspaces and Lerna. Core runtime packages live under `packages/` (for example `packages/engine-server`, `packages/plugin-core`, `packages/dendron-cli`). Bootstrap tooling and build scripts are under `bootstrap/`, shared documentation lives in `docs/`, and sample workspaces or fixtures are in `test-workspace/` and `dev/`. Generated artifacts (logs, reports, verdaccio data) should stay in their existing folders (`logs/`, `reports/`, `vendor/`) and remain untracked. When adding a new module, co-locate its tests inside the same package to keep ownership clear.

## Build, Test, and Development Commands
- `yarn setup`: installs dependencies, bootstraps packages, and ensures the CLI binaries are executable.
- `yarn bootstrap:init`: reruns the workspace bootstrap/build cycle when dependencies change.
- `yarn build:patch:local` (or `minor`/`prerelease` variants): builds the full extension + CLI bundle targeting the specified release tier.
- `yarn test` / `yarn test:cli`: runs all Jest projects or the non-plugin CLI suite with reduced log noise.
- `yarn lint` and `yarn format`: apply the shared ESLint (TS/React/Airbnb) rules and Prettier formatting; run them before submitting a PR.

## Coding Style & Naming Conventions
TypeScript is the default; prefer ES modules and async/await. Prettier enforces two-space indentation and double quotes. Follow ESLint’s import ordering and React hooks rules. Name files with kebab-case for configs (`genScripts.js`) and PascalCase for React components. Exported symbols should be descriptive (`EngineServerBootstrapper` vs `Helper`). Avoid `default` exports except in Next.js pages.

## Testing Guidelines
Jest drives all unit and integration tests; most files end in `*.spec.ts` and live either beside the code or under `src/__tests__`. When adding engine-level coverage, reuse helpers from `packages/engine-test-utils`. For plugin/browser work, leverage the suites under `packages/plugin-core/src/test`. New features should include regression tests and, when feasible, snapshot updates via `yarn test:cli -u`. Keep flake-prone tests skipped locally but document why in the spec.

## Commit & Pull Request Guidelines
History follows Conventional Commit verbs (`feat:`, `fix:`, `chore:`) as seen in `git log`. Scope tags (`feat(engine-server): ...`) help release notes, so include them when touching a single package. Pull requests must paste the appropriate checklist from the community or extended gist linked in `pull_request_template.md`, mention related issues, and include screenshots or CLI transcripts for user-visible changes. Keep PRs focused; split large refactors into preparatory commits when possible.

## Security & Configuration Notes
Never commit secrets or local overrides from `local/`, `.env*`, or Verdaccio state. Use `setup.sh` or `bootstrap/scripts/genMeta.js` to refresh metadata instead of editing generated JSON manually. When touching release automation, run builds inside a clean shell (`yarn build:patch:local`) to avoid leaking host-specific paths.***
