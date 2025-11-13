# Build Instructions

These notes document the exact steps used to produce `packages/plugin-core/dendron-0.124.0-dev.vsix`. They purposely avoid touching `~/.dendron/...` so the process works inside a sandboxed workspace.

## Prerequisites
- Node 16+ with Yarn 1.x available (`corepack enable` takes care of this in the repo).
- `vsce` on your PATH (`npm i -g @vscode/vsce` or `npx vsce …`).
- `rsync`, `python3`, and standard GNU utilities (already present on macOS/Linux dev shells).

## Build & Package Steps
1. **Compile TypeScript outputs**
   ```bash
   yarn --cwd packages/plugin-core compile
   ```
   This runs `tsc` against `tsconfig.build.json` and refreshes `out/`.

2. **Inject OAuth placeholders**  
   ```bash
   (cd packages/plugin-core && ./scripts/varSub.sh)
   ```
   The script substitutes the Google OAuth placeholders inside `dist/extension.js`.

3. **Bundle the web extension assets**
   ```bash
   yarn --cwd packages/plugin-core package-web
   ```
   Runs `webpack.webext.js` to regenerate `dist/extension.js` and related web bundles.

4. **Prepare a clean packaging workspace**  
   VSCE rejects scoped private names, so copy the package to a temp folder and rewrite its manifest:
   ```bash
   mkdir -p tmp && rsync -a packages/plugin-core/ tmp/plugin-vsix --exclude '.git'
   python - <<'PY'
   import json, pathlib
   path = pathlib.Path("tmp/plugin-vsix/package.json")
   data = json.loads(path.read_text())
   data["name"] = "dendron"
   if data.get("main") == "./out/src/extension.js":
       data["main"] = "./dist/extension.js"
   data["repository"] = {"url": "https://github.com/dendronhq/dendron.git", "type": "git"}
   path.write_text(json.dumps(data, indent=2) + "\n")
   PY
   ```
   (Alternatively, run `packages/plugin-core/scripts/prep.sh`, but the manual edit avoids deleting the root `package.json`.)

5. **Create the VSIX**
   ```bash
   (cd tmp/plugin-vsix && npx vsce package --yarn --no-dependencies --out dendron-0.124.0-dev.vsix)
   ```
   `vsce` will execute the `vscode:prepublish` hook, which reruns `npm run package-web`. Expect a warning about the `*` activation event; it is benign.

6. **Move the artifact back into the repo**
   ```bash
   mv tmp/plugin-vsix/dendron-0.124.0-dev.vsix packages/plugin-core/
   rm -rf tmp/plugin-vsix
   ```

Following these steps yields the signed bundle at `packages/plugin-core/dendron-0.124.0-dev.vsix` (~9 MB). Install it locally via `code --install-extension packages/plugin-core/dendron-0.124.0-dev.vsix`.
