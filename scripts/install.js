#!/usr/bin/env node

/**
 * Axiom UI Kit — 技能构建脚本
 *
 * 功能：将 web/src/components/ui 组件库打包为 npx skills 可识别的技能结构。
 * 输出目录：.workbuddy/skills/ax-ui-kit/（npx skills 自动发现路径）
 *
 * 用法：node scripts/install.js
 *
 * 技能结构：
 *   ax-ui-kit/
 *   ├── SKILL.md          ← 技能说明（从 web/scripts/SKILL.md 读取）
 *   └── assets/
 *       └── ui/           ← 完整的组件库源码
 */

import { readFileSync, cpSync, rmSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// ─── 路径常量 ────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')              // web/
const REPO_ROOT = resolve(ROOT, '..')               // 仓库根目录
const SKILL_SOURCE = resolve(__dirname, 'SKILL.md')
const UI_SOURCE = resolve(ROOT, 'src', 'components', 'ui')
const OUTPUT_DIR = resolve(REPO_ROOT, '.workbuddy', 'skills', 'ax-ui-kit')
const OUTPUT_SKILL = resolve(OUTPUT_DIR, 'SKILL.md')
const OUTPUT_ASSETS = resolve(OUTPUT_DIR, 'assets', 'ui')

// ─── npx skills 目标路径 ─────────────────────────────────────────
const SKILLS_TARGET = '.workbuddy/skills/ax-ui-kit'

// ─── 日志工具 ────────────────────────────────────────────────────
const log = {
  info: (msg) => console.log(`\x1b[36m[install]\x1b[0m ${msg}`),
  ok: (msg) => console.log(`\x1b[32m[install]\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[install]\x1b[0m ${msg}`),
  error: (msg) => {
    console.error(`\x1b[31m[install]\x1b[0m ${msg}`)
    process.exit(1)
  },
}

// ─── 检查前置条件 ────────────────────────────────────────────────
function checkPrerequisites() {
  if (!existsSync(SKILL_SOURCE)) {
    log.error(`SKILL.md 不存在：${SKILL_SOURCE}`)
  }
  if (!existsSync(UI_SOURCE)) {
    log.error(`组件源目录不存在：${UI_SOURCE}`)
  }
  log.ok('源文件检查通过')
}

// ─── 清理并创建输出目录 ──────────────────────────────────────────
function prepareOutput() {
  if (existsSync(OUTPUT_DIR)) {
    rmSync(OUTPUT_DIR, { recursive: true, force: true })
  }
  mkdirSync(OUTPUT_DIR, { recursive: true })
  mkdirSync(OUTPUT_ASSETS, { recursive: true })
  log.ok(`输出目录已就绪：${SKILLS_TARGET}`)
}

// ─── 复制 SKILL.md ──────────────────────────────────────────────
function copySkill() {
  const content = readFileSync(SKILL_SOURCE, 'utf-8')
  if (!content.trimStart().startsWith('---')) {
    log.warn('SKILL.md 缺少 YAML frontmatter，请检查格式')
  }
  cpSync(SKILL_SOURCE, OUTPUT_SKILL)
  log.ok(`SKILL.md → ${SKILLS_TARGET}/SKILL.md`)
}

// ─── 复制组件目录 ────────────────────────────────────────────────
function copyComponents() {
  const entries = ['index.ts', 'types.ts', 'hooks', 'functional', 'docs', 'layout']
  const vueFiles = [
    'AxButton.vue', 'AxInput.vue', 'AxSelect.vue', 'AxDropdown.vue',
    'AxDialog.vue', 'AxAlert.vue', 'AxSlider.vue', 'AxTooltip.vue', 'AxPropPanel.vue',
  ]

  let count = 0

  for (const file of vueFiles) {
    const src = resolve(UI_SOURCE, file)
    const dest = resolve(OUTPUT_ASSETS, file)
    if (existsSync(src)) {
      cpSync(src, dest)
      count++
    }
  }

  for (const dir of entries) {
    const src = resolve(UI_SOURCE, dir)
    const dest = resolve(OUTPUT_ASSETS, dir)
    if (existsSync(src)) {
      cpSync(src, dest, { recursive: true })
      count++
    }
  }

  log.ok(`组件文件已复制：${count} 项 → ${SKILLS_TARGET}/assets/ui/`)
}

// ─── 统计输出 ────────────────────────────────────────────────────
function summarize() {
  log.info(`技能目录结构：`)
  log.info(`  ${SKILLS_TARGET}/`)
  log.info(`  ├── SKILL.md`)
  log.info(`  └── assets/ui/`)
  log.info(`       ├── AxButton.vue`)
  log.info(`       ├── AxInput.vue`)
  log.info(`       ├── AxSelect.vue`)
  log.info(`       ├── AxDropdown.vue`)
  log.info(`       ├── AxDialog.vue`)
  log.info(`       ├── AxAlert.vue`)
  log.info(`       ├── AxSlider.vue`)
  log.info(`       ├── AxTooltip.vue`)
  log.info(`       ├── AxPropPanel.vue`)
  log.info(`       ├── index.ts / types.ts`)
  log.info(`       ├── hooks/ (useNotify, useFloating)`)
  log.info(`       ├── functional/ (FloatingBall)`)
  log.info(`       ├── docs/ (安装文档, 设计规范)`)
  log.info(`       └── layout/ (示例界面)`)
}

// ─── 主流程 ──────────────────────────────────────────────────────
function main() {
  console.log('')
  log.info('Axiom UI Kit 技能构建开始...')
  console.log('')

  checkPrerequisites()
  prepareOutput()
  copySkill()
  copyComponents()
  summarize()

  console.log('')
  log.ok('构建完成！')
  console.log('')
  log.info(`技能已安装到 ${SKILLS_TARGET}/`)
  log.info('  npx skills 会自动发现该技能，无需手动注册')
  log.info(`  推送后其他人可通过 GitHub 安装：npx skills add <owner/repo>@ax-ui-kit -g -y`)
  console.log('')
}

main()
