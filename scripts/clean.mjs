#!/usr/bin/env node
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const root = path.resolve(__dirname, '..')

const toDelete = [
  path.join(root, 'dist'),
  // delete all packages/*/dist
  ...(() => {
    const pkgsDir = path.join(root, 'packages')
    if (!fs.existsSync(pkgsDir)) return []
    return fs
      .readdirSync(pkgsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(pkgsDir, d.name, 'dist'))
  })(),
  // tsbuildinfo anywhere
  ...(() => {
    /** recursively collect .tsbuildinfo */
    const results = []
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          // skip node_modules for speed
          if (entry.name === 'node_modules' || entry.name === '.git') continue
          walk(full)
        } else if (entry.isFile() && entry.name.endsWith('.tsbuildinfo')) {
          results.push(full)
        }
      }
    }
    walk(root)
    return results
  })(),
  path.join(root, 'node_modules', '.cache')
]

let removed = 0
for (const p of toDelete) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true })
      console.log('Removed:', p)
      removed++
    }
  } catch (e) {
    console.warn('Failed removing', p, e.message)
  }
}

console.log(`Cleanup done. Removed ${removed} target(s).`)