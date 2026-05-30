// ax-ui-kit sync -- 一键更新 skill 并同步组件到当前项目
// 用法：node scripts/sync.js [目标目录]  默认：src/components/ui

import { cpSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = resolve(__dirname, '..')
const TARGET = process.argv[2] || 'src/components/ui'

// 尝试从 gh CLI 获取 token 避免 API 限流
let env = process.env
try {
  const token = execSync('gh auth token 2>nul', { encoding: 'utf-8' }).trim()
  if (token) { env = { ...process.env, GITHUB_TOKEN: token } }
} catch {}

console.log('')
console.log('ax-ui-kit sync...')

// 用 add --full-depth 重新拉取（绕过 GitHub API 限流）
console.log('  step 1: npx skills add imohuan/axui@ax-ui-kit --full-depth -y')
try {
  execSync('npx skills add imohuan/axui@ax-ui-kit --full-depth -y', { stdio: 'inherit', env })
} catch {
  console.log('  (拉取失败，使用本地已有版本)')
}

console.log('  step 2: assets/ -> ' + TARGET)

if (!existsSync(TARGET)) mkdirSync(TARGET, { recursive: true })
cpSync(resolve(SKILL_DIR, 'assets'), TARGET, { recursive: true })

console.log('sync complete.')
console.log('')
