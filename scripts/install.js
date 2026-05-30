#!/usr/bin/env node

/**
 * Axiom UI Kit -- 技能构建脚本
 *
 * 功能：将 web/src/components/ui 组件库打包为 npx skills 可识别的技能结构。
 * 输出目录：skills/ax-ui-kit/（GitHub 仓库根目录下的 skills/ 目录）
 *
 * 用法：node scripts/install.js
 */

import { readFileSync, cpSync, rmSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')
const SKILL_SOURCE = resolve(__dirname, 'SKILL_SOURCE.md')
const UI_SOURCE = resolve(ROOT, 'src', 'components', 'ui')
const OUTPUT_DIR = resolve(ROOT, 'skills', 'ax-ui-kit')
const OUTPUT_SKILL = resolve(OUTPUT_DIR, 'SKILL.md')
const OUTPUT_ASSETS = resolve(OUTPUT_DIR, 'assets')
const OUTPUT_REFS = resolve(OUTPUT_DIR, 'references')
const OUTPUT_SCRIPTS = resolve(OUTPUT_DIR, 'scripts')
const SKILLS_TARGET = 'skills/ax-ui-kit'

const log = {
  info: (m) => console.log(`\x1b[36m[install]\x1b[0m ${m}`),
  ok: (m) => console.log(`\x1b[32m[install]\x1b[0m ${m}`),
  warn: (m) => console.warn(`\x1b[33m[install]\x1b[0m ${m}`),
  error: (m) => { console.error(`\x1b[31m[install]\x1b[0m ${m}`); process.exit(1) },
}

function check() {
  if (!existsSync(SKILL_SOURCE)) log.error('SKILL_SOURCE.md 不存在')
  if (!existsSync(UI_SOURCE)) log.error('组件源目录不存在')
  log.ok('源文件检查通过')
}

function prepare() {
  if (existsSync(OUTPUT_DIR)) rmSync(OUTPUT_DIR, { recursive: true, force: true })
  mkdirSync(OUTPUT_DIR, { recursive: true })
  mkdirSync(OUTPUT_ASSETS, { recursive: true })
  mkdirSync(OUTPUT_REFS, { recursive: true })
  mkdirSync(OUTPUT_SCRIPTS, { recursive: true })
  log.ok(`输出目录已就绪：${SKILLS_TARGET}`)
}

function copySkill() {
  const c = readFileSync(SKILL_SOURCE, 'utf-8')
  if (!c.trimStart().startsWith('---')) log.warn('SKILL_SOURCE.md 缺少 YAML frontmatter')
  cpSync(SKILL_SOURCE, OUTPUT_SKILL)
  log.ok(`SKILL.md -> ${SKILLS_TARGET}/SKILL.md`)
}

function copyComponents() {
  const vueFiles = [
    'AxButton.vue','AxInput.vue','AxSelect.vue','AxDropdown.vue',
    'AxDialog.vue','AxAlert.vue','AxSlider.vue','AxTooltip.vue','AxPropPanel.vue',
  ]
  const dirs = ['index.ts','types.ts','hooks','functional','layout']
  let n = 0
  for (const f of vueFiles) { const s = resolve(UI_SOURCE, f); if (existsSync(s)) { cpSync(s, resolve(OUTPUT_ASSETS, f)); n++ } }
  for (const d of dirs) { const s = resolve(UI_SOURCE, d); if (existsSync(s)) { cpSync(s, resolve(OUTPUT_ASSETS, d), { recursive: true }); n++ } }
  const docsSrc = resolve(UI_SOURCE, 'docs')
  if (existsSync(docsSrc)) { cpSync(docsSrc, OUTPUT_REFS, { recursive: true }); n++ }
  log.ok(`组件文件已复制：${n} 项 -> ${SKILLS_TARGET}/assets/ + references/`)
}

function copySync() {
  cpSync(resolve(__dirname, 'sync.js'), resolve(OUTPUT_SCRIPTS, 'sync.js'))
  log.ok(`sync.js -> ${SKILLS_TARGET}/scripts/`)
}

function summarize() {
  const t = SKILLS_TARGET
  log.info('技能目录结构：')
  log.info(`  ${t}/`)
  log.info('  ├── SKILL.md')
  log.info('  ├── assets/ (9 个 Vue 组件 + hooks + functional + layout)')
  log.info('  ├── references/ (component-install.md + ui-style.md)')
  log.info('  └── scripts/sync.js (一键更新 + 同步)')
}

function main() {
  console.log('')
  log.info('Axiom UI Kit 技能构建开始...')
  console.log('')
  check()
  prepare()
  copySkill()
  copyComponents()
  copySync()
  summarize()
  console.log('')
  log.ok('构建完成！')
  console.log('')
  log.info(`技能已输出到 ${SKILLS_TARGET}/`)
  log.info('  本地安装：npx skills add ./skills/ax-ui-kit -g -y')
  log.info('  远程安装：npx skills add <owner/repo>@ax-ui-kit -g -y')
  console.log('')
}

main()
