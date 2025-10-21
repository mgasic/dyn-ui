# Release process

The release process defines how Dyn UI increments versions, validates quality, and shares accountability across the team. The checklist below is linked directly to the QA gate workflow defined in `.github/workflows/quality-gates.yml` so that every release is backed by automated evidence.

## Definition of Done

1. ✅ A Changeset entry exists for every user-facing change, capturing the package scope and release notes.
2. ✅ All QA gates in [`quality-gates.yml`](../.github/workflows/quality-gates.yml) complete successfully with green status checks.
3. ✅ Metrics collection succeeds (`pnpm run metrics:collect`) and the resulting artifacts are stored under `reports/metrics`.
4. ✅ Documentation for new or modified components is updated (Storybook stories or guides).
5. ✅ Release notes and changelog updates are generated via `pnpm run changelog:generate` and attached to the release PR.

## Ownership (RACI)

| Task | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
| --- | --- | --- | --- | --- |
| Create Changeset entries | Feature author | Maintainer on duty | Component owners | QA, stakeholders |
| Run QA gate workflow | Automation | Maintainer on duty | QA engineer | Product, stakeholders |
| Review & approve release PR | Maintainer on duty | Release manager | QA engineer, component owners | Product |
| Publish packages | Release manager | Release manager | DevOps | Entire team |
| Deploy Storybook | Release manager | Release manager | Design system lead | Product, stakeholders |
| Gather metrics & archive | Automation | Maintainer on duty | QA engineer | Entire team |

## Release steps

1. **Plan**
   - Groom Changeset requirements while grooming user stories.
   - Confirm QA gate coverage (static analysis, tests, accessibility, visual, API, bundle) in [`quality-gates.yml`](../.github/workflows/quality-gates.yml).
2. **Develop**
   - Implement features, add or update Storybook stories, and create a Changeset (`pnpm changeset`).
   - Ensure telemetry identifiers are configured for metrics ingestion (GitHub token, Sentry credentials).
3. **Verify (QA Gate task)**
   - Trigger the "Quality Gates" workflow manually or by opening a PR.
   - Download the `qa-metrics` artifact for centralized metrics, along with other gate artifacts for audits.
4. **Release**
   - Merge the automated release PR created by the Changesets workflow once approvals are complete.
   - Allow the release workflow to version packages, publish to npm (using `NPM_TOKEN`), deploy Storybook, and upload the changelog artifact automatically.
5. **Post-release**
   - Share the generated changelog and Storybook URL with stakeholders.
   - Review Sentry and Playwright metrics from `reports/metrics/summary.json` to monitor release health.

## Related automation

- **Quality Gates Workflow**: `.github/workflows/quality-gates.yml`
- **Release Workflow**: `.github/workflows/release.yml`
- **Storybook Deployment Workflow**: `.github/workflows/deploy-storybook.yml`
- **Metrics Script**: `scripts/collect-metrics.ts`

Refer to these assets when updating the QA gate task or onboarding new maintainers.
