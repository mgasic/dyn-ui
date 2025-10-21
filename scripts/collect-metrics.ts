import { promises as fs } from 'fs';
import path from 'path';

type MetricResult<T> = {
  data?: T;
  skipped?: string;
  error?: string;
};

type GitHubMetrics = {
  repository: string;
  openIssues: number;
  openPullRequests: number;
  defaultBranch: string;
  pushedAt: string | null;
};

type SentryMetrics = {
  organization: string;
  project: string;
  interval?: string;
  totalReceived?: number;
};

type PlaywrightSummary = {
  file: string;
  summary?: unknown;
};

type MetricsSummary = {
  generatedAt: string;
  github: MetricResult<GitHubMetrics>;
  sentry: MetricResult<SentryMetrics>;
  playwright: MetricResult<PlaywrightSummary[]>;
};

const reportsDir = path.resolve(process.cwd(), 'reports');
const metricsDir = path.join(reportsDir, 'metrics');

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeJson(filePath: string, value: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Request failed with ${response.status}: ${message}`);
  }
  return (await response.json()) as T;
}

async function collectGitHubMetrics(): Promise<MetricResult<GitHubMetrics>> {
  const repository = process.env.GITHUB_REPOSITORY ?? 'dyn-ui/dyn-ui';
  const [owner, repo] = repository.split('/');
  const token = process.env.GITHUB_METRICS_TOKEN ?? process.env.GITHUB_TOKEN;

  try {
    if (!owner || !repo) {
      return { skipped: 'GITHUB_REPOSITORY is not available' };
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'dyn-ui-metrics-script'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const repoData = await fetchJson<{ open_issues_count: number; default_branch: string; pushed_at: string | null }>(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    const pullsData = await fetchJson<{ total_count: number }>(
      `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:pr+state:open`,
      { headers }
    );

    return {
      data: {
        repository,
        openIssues: repoData.open_issues_count ?? 0,
        openPullRequests: pullsData.total_count ?? 0,
        defaultBranch: repoData.default_branch,
        pushedAt: repoData.pushed_at ?? null
      }
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown GitHub error' };
  }
}

async function collectSentryMetrics(): Promise<MetricResult<SentryMetrics>> {
  const token = process.env.SENTRY_TOKEN ?? process.env.SENTRY_AUTH_TOKEN;
  const organization = process.env.SENTRY_ORG;
  const project = process.env.SENTRY_PROJECT;

  if (!token || !organization || !project) {
    return { skipped: 'Sentry credentials are not configured' };
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    type SentrySeries = Array<[number, number]>;

    const stats = await fetchJson<{ intervals: string[]; groups: Array<{ series: { received: SentrySeries } }> }>(
      `https://sentry.io/api/0/projects/${organization}/${project}/stats/?stat=received&interval=1d`,
      { headers }
    );

    const totalReceived = stats.groups.reduce((total, group) => {
      const series = group.series?.received ?? [];
      return total + series.reduce((sum, [, count]) => sum + count, 0);
    }, 0);

    return {
      data: {
        organization,
        project,
        interval: stats.intervals?.[0] ? `${stats.intervals.length}d` : undefined,
        totalReceived
      }
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown Sentry error' };
  }
}

async function readJsonFile(filePath: string): Promise<unknown> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to parse JSON' };
  }
}

async function walkDirectory(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const resolvedPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(resolvedPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(resolvedPath);
    }
  }

  return files;
}

async function collectPlaywrightMetrics(): Promise<MetricResult<PlaywrightSummary[]>> {
  const playwrightDir = path.join(reportsDir, 'playwright');
  try {
    await fs.access(playwrightDir);
  } catch {
    return { skipped: 'No Playwright reports were found' };
  }

  try {
    const jsonFiles = await walkDirectory(playwrightDir);
    if (jsonFiles.length === 0) {
      return { skipped: 'Playwright reports directory does not contain JSON files' };
    }

    const summaries: PlaywrightSummary[] = [];
    for (const file of jsonFiles) {
      summaries.push({
        file: path.relative(reportsDir, file),
        summary: await readJsonFile(file)
      });
    }

    return { data: summaries };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown Playwright error' };
  }
}

async function main() {
  await ensureDir(metricsDir);

  const [github, sentry, playwright] = await Promise.all([
    collectGitHubMetrics(),
    collectSentryMetrics(),
    collectPlaywrightMetrics()
  ]);

  const summary: MetricsSummary = {
    generatedAt: new Date().toISOString(),
    github,
    sentry,
    playwright
  };

  await writeJson(path.join(metricsDir, 'github.json'), github);
  await writeJson(path.join(metricsDir, 'sentry.json'), sentry);
  await writeJson(path.join(metricsDir, 'playwright.json'), playwright);
  await writeJson(path.join(metricsDir, 'summary.json'), summary);

  console.log(`Metrics summary written to ${path.relative(process.cwd(), metricsDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
