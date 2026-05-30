// ax-ui-kit sync -- 一键更新 skill 并同步组件到当前项目
// 用法：node scripts/sync.js [目标目录]  默认：src/components/ui

import { cpSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = resolve(__dirname, '..')
const TARGET = process.argv[2] || 'src/components/ui'

console.log('')
console.log('ax-ui-kit sync...')
console.log('  step 1: npx skills update ax-ui-kit')

try {
  execSync('npx skills update ax-ui-kit -y', { stdio: 'inherit' })
} catch {
  console.log('  (更新跳过或已是最新)')
}

console.log('  step 2: assets/ -> ' + TARGET)

if (!existsSync(TARGET)) mkdirSync(TARGET, { recursive: true })
cpSync(resolve(SKILL_DIR, 'assets'), TARGET, { recursive: true })

console.log('sync complete.')
console.log('')
