import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Module = require('module') as typeof import('module');

const extensions = ['.css', '.scss', '.sass'] as const;

for (const extension of extensions) {
  Module._extensions[extension] = function (module: NodeModule) {
    const fileName = module.filename ?? 'style';
    const sanitized = fileName
      .replace(/\\/g, '/')
      .split('/')
      .slice(-2)
      .join('-')
      .replace(/[^a-zA-Z0-9_-]/g, '-');

    const proxy = new Proxy(
      {},
      {
        get: (_target, property) => `${sanitized}__${String(property)}`,
      },
    );

    module.exports = proxy;
    (module.exports as any).default = proxy;
    (module.exports as any).__esModule = true;
  };
}
