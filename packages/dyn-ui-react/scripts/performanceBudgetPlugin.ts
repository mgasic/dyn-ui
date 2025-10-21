import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import type { NormalizedOutputOptions, OutputBundle, Plugin } from 'rollup';

interface BudgetRule {
  file: string;
  gzipLimitKb: number;
  brotliLimitKb: number;
}

export interface PerformanceBudgetOptions {
  budgets: BudgetRule[];
  reportPath?: string;
}

function ensureDir(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
}

export function performanceBudgetPlugin(options: PerformanceBudgetOptions): Plugin {
  const aggregated = new Map<string, BudgetResult>();

  return {
    name: 'performance-budget',
    generateBundle(_outputOptions: NormalizedOutputOptions, bundle: OutputBundle) {
      const presentBudgets = options.budgets.filter((rule) => rule.file in bundle);

      for (const rule of presentBudgets) {
        const chunk = bundle[rule.file];
        if (!chunk) continue;

        const code = chunk.type === 'asset' ? chunk.source : chunk.code;
        const buffer = Buffer.from(
          typeof code === 'string'
            ? code
            : Array.isArray(code)
              ? Buffer.from(code as number[])
              : code instanceof Uint8Array
                ? Buffer.from(code)
                : code.toString(),
        );
        const rawSizeKb = buffer.byteLength / 1024;
        const gzipSizeKb = gzipSync(buffer).byteLength / 1024;
        const brotliSizeKb = brotliCompressSync(buffer).byteLength / 1024;
        const status: BudgetResult['status'] =
          gzipSizeKb <= rule.gzipLimitKb && brotliSizeKb <= rule.brotliLimitKb ? 'pass' : 'fail';

        const result: BudgetResult = {
          ...rule,
          rawSizeKb: Number(rawSizeKb.toFixed(2)),
          gzipSizeKb: Number(gzipSizeKb.toFixed(2)),
          brotliSizeKb: Number(brotliSizeKb.toFixed(2)),
          status,
        };
        aggregated.set(rule.file, result);
      }
    },
    closeBundle() {
      const results: BudgetResult[] = options.budgets.map((rule) => {
        const existing = aggregated.get(rule.file);
        if (existing) {
          return existing;
        }
        return {
          ...rule,
          rawSizeKb: 0,
          gzipSizeKb: 0,
          brotliSizeKb: 0,
          status: 'missing',
        } satisfies BudgetResult;
      });

      const reportPath = options.reportPath ?? resolve(process.cwd(), 'reports/bundle/performance-budget.json');
      ensureDir(reportPath);
      writeFileSync(
        reportPath,
        JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
      );

      const failed = results.filter((result) => result.status !== 'pass');
      if (failed.length > 0) {
        const detail = failed
          .map((item) => {
            if (item.status === 'missing') {
              return `${item.file} (missing output)`;
            }
            return `${item.file} (gzip ${item.gzipSizeKb.toFixed(2)} KB > ${item.gzipLimitKb} KB, brotli ${item.brotliSizeKb.toFixed(2)} KB > ${item.brotliLimitKb} KB)`;
          })
          .join(', ');
        this.error(`Performance budgets exceeded: ${detail}`);
      } else {
        this.info('Performance budgets satisfied.');
      }
    },
  };
}

interface BudgetResult extends BudgetRule {
  rawSizeKb: number;
  gzipSizeKb: number;
  brotliSizeKb: number;
  status: 'pass' | 'fail' | 'missing';
}
