import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './register-css-modules';
import React, { Profiler, act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { ReactElement } from 'react';
import { setupDomEnvironment } from './environment';
import type { PerfTarget } from './targets';
import { PERF_TARGETS } from './targets';

interface ProfilerSample {
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

interface ProfilerSummary {
  component: string;
  runs: number;
  mount: PhaseSummary;
  update: PhaseSummary;
  props: Record<string, unknown>;
}

interface PhaseSummary {
  samples: number;
  averageActualDuration: number;
  maxActualDuration: number;
  averageBaseDuration: number;
}

setupDomEnvironment();
(globalThis as any).React = React;

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..', '..');
const reportsDir = resolve(repoRoot, 'reports', 'perf', 'profiler');

function formatNumber(value: number): number {
  return Number(value.toFixed(3));
}

async function importComponent(target: PerfTarget): Promise<React.ComponentType<any>> {
  const modulePath = new URL(`../../${target.importPath}`, import.meta.url);
  const mod = await import(modulePath.href);
  const component = (mod as Record<string, React.ComponentType<any>>)[target.exportName];
  if (!component) {
    throw new Error(`Could not find export \`${target.exportName}\` in module ${target.importPath}`);
  }
  return component;
}

async function measureTarget(target: PerfTarget): Promise<ProfilerSummary> {
  const Component = await importComponent(target);
  const container = window.document.createElement('div');
  window.document.body.appendChild(container);

  const allSamples: ProfilerSample[] = [];
  const iterations = target.iterations ?? 5;

  const renderOnce = async (element: ReactElement) => {
    const root = createRoot(container);
    const onRender: Parameters<typeof Profiler>[0]['onRender'] = (
      _id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    ) => {
      allSamples.push({
        phase: phase as 'mount' | 'update',
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      });
    };

    const wrappedElement = target.wrap ? target.wrap(element) : element;

    await act(async () => {
      root.render(
        createElement(Profiler, { id: `${target.name}-run`, onRender }, wrappedElement),
      );
    });

    // Trigger an update pass to capture update timing as well
    await act(async () => {
      root.render(
        createElement(Profiler, { id: `${target.name}-run-update`, onRender }, wrappedElement),
      );
    });

    await act(async () => {
      root.unmount();
    });
  };

  for (let index = 0; index < iterations; index += 1) {
    const element = createElement(Component, target.props);
    await renderOnce(element);
  }

  container.remove();

  const mountSamples = allSamples.filter((sample) => sample.phase === 'mount');
  const updateSamples = allSamples.filter((sample) => sample.phase === 'update');

  const summarize = (samples: ProfilerSample[]): PhaseSummary => {
    if (samples.length === 0) {
      return {
        samples: 0,
        averageActualDuration: 0,
        maxActualDuration: 0,
        averageBaseDuration: 0,
      };
    }

    const actualDurations = samples.map((sample) => sample.actualDuration);
    const baseDurations = samples.map((sample) => sample.baseDuration);

    const averageActualDuration = actualDurations.reduce((total, value) => total + value, 0) / samples.length;
    const averageBaseDuration = baseDurations.reduce((total, value) => total + value, 0) / samples.length;
    const maxActualDuration = Math.max(...actualDurations);

    return {
      samples: samples.length,
      averageActualDuration: formatNumber(averageActualDuration),
      maxActualDuration: formatNumber(maxActualDuration),
      averageBaseDuration: formatNumber(averageBaseDuration),
    };
  };

  return {
    component: target.name,
    runs: iterations,
    mount: summarize(mountSamples),
    update: summarize(updateSamples),
    props: target.props,
  };
}

async function main() {
  mkdirSync(reportsDir, { recursive: true });

  const summaries: ProfilerSummary[] = [];
  for (const target of PERF_TARGETS) {
    // eslint-disable-next-line no-console
    console.log(`⚙️  Measuring ${target.name} render performance...`);
    const summary = await measureTarget(target);
    summaries.push(summary);
  }

  const jsonReportPath = join(reportsDir, 'react-profiler.json');
  const markdownReportPath = join(reportsDir, 'react-profiler.md');

  writeFileSync(
    jsonReportPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), results: summaries }, null, 2),
  );

  const markdownLines = [
    '# React Profiler Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '| Component | Runs | Mount avg (ms) | Mount max (ms) | Update avg (ms) | Update max (ms) |',
    '| --- | --- | --- | --- | --- | --- |',
    ...summaries.map((summary) =>
      `| ${summary.component} | ${summary.runs} | ${summary.mount.averageActualDuration} | ${summary.mount.maxActualDuration} | ${summary.update.averageActualDuration} | ${summary.update.maxActualDuration} |`,
    ),
    '',
  ];

  writeFileSync(markdownReportPath, markdownLines.join('\n'));

  // eslint-disable-next-line no-console
  console.log(`📊 React profiler metrics saved to ${jsonReportPath}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('React profiler run failed:', error);
  process.exitCode = 1;
});
