import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'packages', 'dyn-ui-react', 'dist');
const reportDir = resolve(rootDir, 'reports', 'bundle');

const budgets = [
  { file: 'dyn-ui-ci.es.js', gzipLimitKb: 30, brotliLimitKb: 25 },
  { file: 'dyn-ui-ci.cjs.js', gzipLimitKb: 35, brotliLimitKb: 30 },
];

function formatKb(bytes: number): number {
  return Number((bytes / 1024).toFixed(2));
}

function runBuild() {
  console.log('📦 Building Dyn UI smoke bundle with analysis...');
  execSync(
    'pnpm exec vite build --config packages/dyn-ui-react/vite.bundle-ci.config.ts',
    {
      cwd: rootDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        BUNDLE_ANALYZE: 'true',
      },
    },
  );
}

function ensureReportDir() {
  mkdirSync(reportDir, { recursive: true });
}

function collectMetrics() {
  const results = budgets.map(({ file, gzipLimitKb, brotliLimitKb }) => {
    const filePath = join(distDir, file);
    const fileBuffer = readFileSync(filePath);
    const rawSizeKb = formatKb(fileBuffer.byteLength);
    const gzipSizeKb = formatKb(gzipSync(fileBuffer).byteLength);
    const brotliSizeKb = formatKb(brotliCompressSync(fileBuffer).byteLength);

    const status =
      gzipSizeKb <= gzipLimitKb && brotliSizeKb <= brotliLimitKb
        ? 'pass'
        : 'fail';

    return {
      file,
      rawSizeKb,
      gzipSizeKb,
      brotliSizeKb,
      gzipLimitKb,
      brotliLimitKb,
      status,
    };
  });

  return results;
}

function writeReports(results: ReturnType<typeof collectMetrics>) {
  const jsonReportPath = join(reportDir, 'bundle-report.json');
  const markdownReportPath = join(reportDir, 'bundle-report.md');

  const markdown = [
    '# Bundle Budget Report',
    '',
    '| File | Size (KB) | Gzip (KB) | Gzip Budget (KB) | Brotli (KB) | Brotli Budget (KB) | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...results.map(
      (result) =>
        `| ${result.file} | ${result.rawSizeKb} | ${result.gzipSizeKb} | ${result.gzipLimitKb} | ${result.brotliSizeKb} | ${result.brotliLimitKb} | ${result.status.toUpperCase()} |`,
    ),
    '',
  ].join('\n');

  writeFileSync(
    jsonReportPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
  );
  writeFileSync(markdownReportPath, markdown);

  console.log(`📑 Bundle report written to ${jsonReportPath}`);
}

function main() {
  ensureReportDir();
  runBuild();
  const results = collectMetrics();
  writeReports(results);

  const failures = results.filter((result) => result.status === 'fail');
  if (failures.length > 0) {
    console.error(
      '❌ Bundle budgets exceeded for:',
      failures.map((f) => f.file).join(', '),
    );
    process.exit(1);
  }

  console.log('✅ Bundle budgets satisfied.');
}

main();
