const fs = require('fs');
const path = require('path');

// This script merges the package.json in the package folder with package_dis.json
// and writes the result to dist/package.json. It is intended to be run from the
// package (npm script) and used before publish to ensure the published package
// contains correct entry points (main/module/types/exports/files).

const scriptsDir = __dirname; // packages/dyn-ui-react/scripts
const pkgDir = path.resolve(scriptsDir, '..'); // packages/dyn-ui-react
const srcPkgPath = path.join(pkgDir, 'package.json');
const disPkgPath = path.join(pkgDir, 'package_dis.json');
const outDir = path.join(pkgDir, 'dist');
const outPkgPath = path.join(outDir, 'package.json');

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const src = readJson(srcPkgPath);
if (!src) {
  console.error('Source package.json not found at', srcPkgPath);
  process.exit(1);
}

const dis = readJson(disPkgPath) || {};

// Merge strategy: take everything from src, then override with fields from dis.
// This preserves scripts, devDependencies, etc. but replaces entry points.
const out = Object.assign({}, src, dis);

// Ensure files field contains dist for publishing
if (!out.files) out.files = ['dist'];
if (!out.files.includes('dist')) out.files.push('dist');

// Remove local-only scripts that should not be published (optional)
// Keep build/test scripts; you can adjust this list if needed.

// Ensure dist directory exists
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(outPkgPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('Wrote dist/package.json ->', outPkgPath);
console.log('Package name:', out.name, 'version:', out.version);
