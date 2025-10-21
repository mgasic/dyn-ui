#!/usr/bin/env node
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const matches = []
const walk = (dir) => {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      walk(full)
    } else if (entry.isFile() && entry.name.endsWith('.tsbuildinfo')) {
      matches.push(full)
    }
  }
}

walk(root)

let removed = 0
for (const p of matches) {
  try {
    fs.rmSync(p, { force: true })
    console.log('Removed:', p)
    removed++
  } catch (e) {
    console.warn('Failed removing', p, e.message)
  }
}

console.log(`Removed ${removed} .tsbuildinfo file(s).`)