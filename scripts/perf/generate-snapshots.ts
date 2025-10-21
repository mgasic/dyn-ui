import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import './register-css-modules';
import { cleanup, prettyDOM, render } from '@testing-library/react';
import React, { createElement } from 'react';
import { act } from 'react-dom/test-utils';
import { setupDomEnvironment } from './environment';
import type { PerfTarget } from './targets';
import { PERF_TARGETS } from './targets';

setupDomEnvironment();
(globalThis as any).React = React;

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..', '..');
const snapshotsDir = resolve(repoRoot, 'reports', 'perf', 'snapshots');

async function importComponent(target: PerfTarget): Promise<React.ComponentType<any>> {
  const modulePath = new URL(`../../${target.importPath}`, import.meta.url);
  const mod = await import(modulePath.href);
  const component = (mod as Record<string, React.ComponentType<any>>)[target.exportName];
  if (!component) {
    throw new Error(`Could not find export \`${target.exportName}\` in module ${target.importPath}`);
  }
  return component;
}

async function createSnapshot(target: PerfTarget) {
  const Component = await importComponent(target);
  const element = target.wrap ? target.wrap(createElement(Component, target.props)) : createElement(Component, target.props);

  let markup: string | null = null;
  await act(async () => {
    const result = render(element);
    markup = prettyDOM(result.container, Infinity, { highlight: false });
  });

  cleanup();

  const sanitizedMarkup = markup?.replace(/data-testid="[^"]+"/g, '');
  const snapshotPath = join(snapshotsDir, `${target.name}.snap.html`);
  writeFileSync(snapshotPath, sanitizedMarkup ?? '<!-- empty snapshot -->');

  const relativeFile = snapshotPath.replace(`${repoRoot}${sep}`, '');

  return { file: relativeFile, props: target.props };
}

async function main() {
  mkdirSync(snapshotsDir, { recursive: true });

  const metadata = [] as Array<{ component: string; file: string; props: Record<string, unknown> }>;
  for (const target of PERF_TARGETS) {
    // eslint-disable-next-line no-console
    console.log(`🖼️  Generating snapshot for ${target.name}...`);
    const result = await createSnapshot(target);
    metadata.push({ component: target.name, file: result.file, props: result.props });
  }

  const metadataPath = join(snapshotsDir, 'snapshots.json');
  writeFileSync(
    metadataPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), snapshots: metadata }, null, 2),
  );

  // eslint-disable-next-line no-console
  console.log(`🗂️  Snapshot metadata written to ${metadataPath}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Snapshot generation failed:', error);
  process.exitCode = 1;
});
