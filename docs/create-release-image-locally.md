# Local Release Image Build

These steps mirror the `.github/workflows/create-release-image.yml` workflow so you can generate the VSIX artifact locally without waiting for CI.

## Prerequisites
- Node.js 16.x and the accompanying npm and Yarn CLIs (`node --version`, `npm --version`, `yarn --version`)
- Repo dependencies installed via `yarn setup`
- Access to the secrets required by the workflow: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `SENTRY_AUTH_TOKEN`
- A local Verdaccio (or compatible) registry listening on `http://localhost:4873` if you plan to mimic the workflow’s registry overrides

## Steps
1. _(Optional but keeps parity with CI)_ Configure the Git identity that the workflow uses:
   ```bash
   git config user.name "github-actions"
   git config user.email "github-actions@github.com"
   ```
2. Use Node.js 16.x (for example with `nvm use 16`) and rerun `yarn setup` to ensure all packages are built with the expected toolchain.
3. Point both Yarn and npm to the local registry the workflow expects:
   ```bash
   yarn config set registry http://localhost:4873
   npm set registry http://localhost:4873/
   ```
   > When you finish the build, restore your global registries with `yarn config delete registry` and `npm config delete registry`.
4. Export the environment variables that the workflow wires up. The release version bump is computed directly from `packages/plugin-core/package.json`.
   ```bash
   export DENDRON_RELEASE_VERSION=$(cat ./packages/plugin-core/package.json | jq '.version' -r | awk -F. -v OFS=. 'NF>1{$(NF-1)=sprintf("%0*d", length($(NF-1)), ($(NF-1)+1)); $NF=0; print}')
   export GOOGLE_OAUTH_CLIENT_SECRET=... # provide the real secret
   export GOOGLE_OAUTH_CLIENT_ID=...     # provide the real client ID
   export SENTRY_AUTH_TOKEN=...          # provide the real auth token
   export NODE_OPTIONS=--max_old_space_size=4096
   ```
5. Build the release image VSIX exactly as CI does:
   ```bash
   yarn build:minor:local:ci
   ```
6. Verify that the build produced a single VSIX under `packages/plugin-core/`:
   ```bash
   ls packages/plugin-core/*.vsix
   ```
   The filename should follow the pattern `dendron-<version>.vsix`. If multiple files exist, delete the extras before re-running the command.
7. (Optional) Share the artifact. In CI the workflow uploads it via `actions/upload-artifact`; locally you can distribute the VSIX directly or compress it before handing it off.

Following these steps yields the same artifact as the `Create Release Image` workflow, enabling you to test or ship the build without waiting on GitHub Actions.
