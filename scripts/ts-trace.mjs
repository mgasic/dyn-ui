#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectTsconfig = path.resolve(__dirname, '../packages/dyn-ui-react/tsconfig.json')

const tscPath = path.resolve(process.cwd(), 'node_modules', 'typescript', 'bin', 'tsc')

const child = spawn(process.execPath, [
  tscPath,
  '--project', projectTsconfig,
  '--traceResolution',
  '--noEmit'
], { stdio: 'pipe', shell: false })

let output = ''
child.stdout.on('data', (d) => { output += d.toString() })
child.stderr.on('data', (d) => { output += d.toString() })
child.on('close', (code) => {
  const outPath = path.resolve(process.cwd(), 'typescript-debug.log')
  fs.writeFileSync(outPath, output)
  console.log(`Trace written to ${outPath} (exit code ${code})`)
  process.exit(code)
})