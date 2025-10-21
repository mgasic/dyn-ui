# Dyn UI performance guardrails

This document captures the workflows and tooling that keep component performance within acceptable budgets. All commands assume you are at the repository root.

## Automated runtime measurements

The `scripts/perf/` toolchain runs headless React Profiler sessions in JSDOM and captures serialized markup snapshots for regression review.

### Local execution

```bash
pnpm run perf:check
```

The command runs two stages:

1. `perf:measure` – executes `scripts/perf/run-react-profiler.ts` to render the components declared in `scripts/perf/targets.ts`. Each component is rendered multiple times inside `React.Profiler`, and we persist aggregate timing statistics to `reports/perf/profiler/react-profiler.json` plus a Markdown summary.
2. `perf:snapshots` – executes `scripts/perf/generate-snapshots.ts` to produce deterministic HTML dumps for every target. Snapshots land in `reports/perf/snapshots/*.snap.html`, with metadata in `reports/perf/snapshots/snapshots.json`.

You can add additional components by editing `scripts/perf/targets.ts`. Provide the module path, export name, props, and optional wrapper for providers.

### CI integration

Quality Gate **G** in `.github/workflows/quality-gates.yml` runs `pnpm run perf:check` on every pull request. The workflow uploads the contents of `reports/perf/` so you can download profiler numbers and snapshot artifacts from the Actions run summary.

## Bundle performance budgets

We enforce explicit size thresholds during bundling:

- `packages/dyn-ui-react/vite.bundle-ci.config.ts` wires the custom Rollup plugin defined in `packages/dyn-ui-react/scripts/performanceBudgetPlugin.ts`.
- Budgets currently allow up to **30 KB gzipped** (**25 KB brotli**) for the ES module (`dyn-ui-ci.es.js`) and **35 KB gzipped** (**30 KB brotli**) for the CommonJS build (`dyn-ui-ci.cjs.js`).
- The plugin writes `reports/bundle/performance-budget.json` and fails the build if a file exceeds its limit.

The `pnpm run bundle:check` command (quality Gate **F**) still executes the broader bundle check script in `scripts/check-bundle-budgets.ts`. Together, the plugin and the script provide fast feedback both during development and in CI.

To adjust budgets, edit the values inside `performanceBudgetPlugin` usage in the Vite bundle CI config and the `budgets` array in `scripts/check-bundle-budgets.ts`.

## Visual and external monitoring

- **Chromatic**: Storybook visual baselines remain the first line of defense. Continue to publish builds through `chromatic.config.js`; Chromatic dashboards should be configured to receive the uploaded builds from your existing automation.
- **Calibre (or equivalent RUM tooling)**: Use Calibre synthetic tests to track aggregate performance for critical Storybook stories or deployed documentation. Schedule daily runs and pin the dashboards in your team workspace so regressions surface quickly.

## Runbook

1. **Before merging**: Review the Gate G artifacts for meaningful changes in render duration or markup diffs. Investigate any regression that exceeds ±10% compared with the previous baseline.
2. **Updating dashboards**: When adding new components or stories, tag them inside Chromatic and Calibre so they participate in automated monitoring.
3. **Incident response**:
   - If Gate G fails, download the profiler JSON and snapshot HTML to understand which component regressed.
   - Validate whether bundle budgets were exceeded (Gate F). If both fail, prioritize bundle optimizations before micro-optimizing renders.
   - Document remediation notes in the pull request and update this file if new procedures emerge.

Following this workflow keeps Dyn UI performant while providing the observability hooks needed by design system consumers.
