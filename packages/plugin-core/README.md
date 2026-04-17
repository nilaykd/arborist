# Arborist

**A maintained fork of the Dendron note-taking extension for Visual Studio Code.**

Arborist is an independently-maintained, modernized fork of [Dendron](https://github.com/dendronhq/dendron), a hierarchical note-taking tool whose official development was discontinued in 2023. This fork exists so existing Dendron users — and anyone drawn to the hierarchical note model — can keep using it on current versions of VS Code with up-to-date dependencies and security patches.

Arborist is not affiliated with, endorsed by, or sponsored by the original Dendron team. It is redistributed under the same Apache 2.0 License as the upstream project.

---

## Why this fork exists

Dendron was a well-designed knowledge management tool built around hierarchical markdown notes. When its development stopped, the extension began breaking on newer VS Code versions, accumulated unresolved security advisories in its dependencies, and could no longer be installed cleanly on modern Node toolchains.

Arborist addresses those specific problems:

- **Restored compatibility** with VS Code 1.85+ (upstream targeted 1.77)
- **Modernized build pipeline** — Webpack 5, TypeScript 5, React 18, Node 20
- **Security patches** — reduced from 22 critical + many high CVEs in the dependency tree to 0 critical
- **Replaced deprecated tooling** — `node-sass` → `dart-sass`, Prisma 4 → 5, Lerna 3 → 8
- **Webview runtime fixes** — CSP updates, preview panel lifecycle bug fixes
- **GitHub Codespaces support** — works in both the desktop editor and browser-based Codespace environments

The **feature surface is intentionally identical** to upstream Dendron. This is a maintenance fork, not a redesign.

## Who this is for

- **Existing Dendron users** whose workspaces stopped working after VS Code or Node upgrades
- **Individuals evaluating hierarchical PKM workflows** who want a supported, current version
- Anyone who wants to inspect or extend the Dendron codebase on a fresh toolchain

If you are a new user with no attachment to the Dendron model, there are other modern note-taking extensions you may want to evaluate first. Arborist optimizes for continuity with the existing Dendron experience, not for being the best possible note extension from a blank slate.

## Differences from upstream Dendron

| Area | Upstream Dendron (discontinued) | Arborist |
|------|-------------------------------|----------------|
| VS Code engine | ^1.77.0 | ^1.85.0 |
| TypeScript | 4.6 | 5.4 |
| Webpack | 4 | 5 |
| React (webviews) | 17 | 18 |
| Prisma | 4 | 5 |
| Sass compiler | node-sass | dart-sass |
| Lerna | 3 | 8 |
| Critical CVEs in deps | 22 | 0 |
| Maintained | No (since 2023) | Yes |
| Publisher | `dendron.dendron` | `nilaykd.arborist` |
| Repository | `dendronhq/dendron` | `nilaykd/arborist` |

## Installation

```
ext install nilaykd.arborist
```

Or search for "Arborist" in the VS Code Extensions panel.

## Migration from Dendron

If you already use Dendron, your existing workspace will work with Arborist without changes:

1. Uninstall the original Dendron extension
2. Install Arborist
3. Open your existing Dendron workspace — notes, schemas, and config are fully compatible

Arborist reads and writes the same on-disk format as upstream Dendron. You can switch back and forth without data conversion.

## License & attribution

Arborist is distributed under the **Apache License 2.0**, the same license as upstream Dendron. The fork is made pursuant to the rights granted by that license (see Section 4 regarding redistribution).

Upstream Dendron copyright remains with the original authors and contributors, attributed in the LICENSE file and preserved throughout the source tree. All modifications introduced by the Arborist fork are identified in the git history at https://github.com/nilaykd/arborist.

This fork is a volunteer effort by Nilay Doshi with no commercial relationship to the original Dendron project or its maintainers.

## Reporting issues

Issues with the fork itself (regressions, newly-introduced bugs, compatibility problems) should be filed at:
https://github.com/nilaykd/arborist/issues

Issues present in upstream Dendron that we have not explicitly addressed may also exist here. In that case, please open an issue on the Arborist repository with the prefix `[inherited]` — we will evaluate whether it falls within the maintenance scope of this fork.

## Contributing

This is a single-maintainer fork with a narrow maintenance scope: **keep Dendron working on modern VS Code**. Pull requests that fix regressions, update dependencies, or resolve security issues are welcome. Feature additions are generally out of scope — if you want to extend the hierarchical-notes model, consider contributing to a more active project.

## Trademarks

"Dendron" is a name used by the original project. Arborist does not use the Dendron name in its extension title, publisher, icon, or marketing. References to Dendron in this README are factual statements of the fork relationship and attribution, as required by the Apache 2.0 license.
