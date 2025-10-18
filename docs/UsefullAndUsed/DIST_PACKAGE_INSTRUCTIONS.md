# Dist package generation and publish instructions

Summary

- We keep a source `package.json` in the package root used for local dev.
- We keep a `package_dis.json` that defines the production fields (entry points like `main`, `module`, `types`, `exports`, and `files`).
- A small script `scripts/generate-dist-package.js` merges `package.json` and `package_dis.json` and writes `dist/package.json`.
- CI / publish should publish from `dist/` so consumers get the built artifacts.

Why

- Tools like Vite/Rollup can resolve local packages directly from `src` during development if `package.json` points to `src`.
- For publish we must provide built artifacts (`dist/*`) and proper entry points so downstream consumers (and npm) get the right files.
- Generating `dist/package.json` avoids manually editing the source `package.json` and keeps publish reproducible.

Files added

- `packages/dyn-ui-react/package_dis.json` — production entry points override
- `packages/dyn-ui-react/scripts/generate-dist-package.js` — merges and writes `dist/package.json`
- `packages/dyn-ui-react/DIST_PACKAGE_INSTRUCTIONS.md` — this file

Quick commands (PowerShell)

- Install deps once:
  pnpm install

- Development (use source entry points)
  pnpm run dev
  (or in monorepo root: pnpm run dev to start turbo workflows)

- Generate dist/package.json and build package locally
  cd packages\dyn-ui-react; pnpm run prepare-dist-pkg; pnpm run build

- Build package then build an app that depends on it (explicit sequence)
  pnpm -w -F @dyn-ui/react run prepare-dist-pkg; pnpm -w -F @dyn-ui/react run build; pnpm -w -F react-demo run build

- Publish from dist/ (example manual publish)
  cd packages\dyn-ui-react\dist
  npm publish --access public

CI / Automated publish recommendations

1. In CI: install deps and run build for the package, producing `dist/`.
2. Run the `prepare-dist-pkg` script to generate `dist/package.json`.
3. Publish from the `dist/` folder (or package the dist folder only).

Example CI steps (PowerShell / script)

- pnpm install
- pnpm -w -F @dyn-ui/react run build
- pnpm -w -F @dyn-ui/react run prepare-dist-pkg
- cd packages\dyn-ui-react\dist
- npm publish --access public

Notes and customizations

- The merge strategy used by the script takes the original `package.json` and overrides fields with `package_dis.json`. If you prefer a strict whitelist (only name/version/main/module/types/exports/files/dependencies), update the script accordingly.
- If you use `vite-plugin-dts` or `tsc --emitDeclarationOnly` to generate `.d.ts`, ensure the types file path in `package_dis.json` matches the output.
- The `prepublishOnly` script in `packages/dyn-ui-react/package.json` runs `prepare-dist-pkg` and then `build`. This makes `pnpm publish` from that package run build first.

If you want, I can:

- switch the script to generate a whitelist-only package.json,
- add validation to ensure `dist/index.js` and `dist/index.d.ts` exist before writing the package,
- or wire turbo so apps dependOn the package build step automatically.
