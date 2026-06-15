#!/usr/bin/env node

/**
 * Axiom UI CDN 构建脚本
 *
 * 依赖检测 → Vite 构建 → 输出报告。
 * Tailwind CSS 和字体不作为产出，由用户自行加载。
 *
 * 输出到 dist-cdn/：
 *   axiom-ui.umd.js     — UMD 组件库 (~130KB)
 *   axiom-ui.es.js      — ESM 组件库 (~150KB)
 *   axiom-ui.css        — 主题 CSS 变量 + 自定义样式 (~4KB)
 *   index.html          — 测试/演示页面
 */

import { execSync } from 'child_process'
import { existsSync, readdirSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function fileSize(p) {
  try {
    const kb = statSync(p).size / 1024
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(1)} KB`
  } catch {
    return '—'
  }
}

console.log('\n📦 Axiom UI CDN 构建\n')

// ==============================
// 依赖检测
// ==============================

const deps = [
  { name: 'vue',       path: resolve(root, 'node_modules/vue/package.json') },
  { name: 'tailwind',  path: resolve(root, 'node_modules/tailwindcss/package.json'), optional: true, note: '用户自行加载' },
  { name: 'geist',     path: resolve(root, 'node_modules/@fontsource/geist/package.json'), optional: true, note: '用户自行加载' },
  { name: 'jetbrains-mono', path: resolve(root, 'node_modules/@fontsource/jetbrains-mono/package.json'), optional: true, note: '用户自行加载' },
  { name: 'material-symbols', path: resolve(root, 'node_modules/material-symbols/package.json'), optional: true, note: '用户自行加载' },
]

let ok = 0, missing = 0
for (const dep of deps) {
  if (existsSync(dep.path)) {
    if (dep.optional) {
      console.log(`  ⬜ ${dep.name}  ✓（本地可用，但由用户自行加载）`)
    } else {
      console.log(`  ✅ ${dep.name}`)
    }
    ok++
  } else {
    const tag = dep.optional ? '  ⚠️ ' : '  ❌'
    console.log(`${tag} ${dep.name} 未安装${dep.note ? '（' + dep.note + '）' : ''}`)
    if (!dep.optional) missing++
  }
}

if (missing > 0) {
  console.error(`\n❌ ${missing} 个必需的依赖缺失，终止构建。`)
  process.exit(1)
}

// ==============================
// 构建
// ==============================

console.log('\n🔨 构建中...\n')

const configFile = resolve(root, 'vite.config.cdn.ts')

try {
  execSync(`npx vite build --config "${configFile}"`, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  })
} catch (err) {
  console.error('\n❌ 构建失败')
  process.exit(1)
}

// ==============================
// 报告
// ==============================

const dist = resolve(root, 'dist-cdn')
const files = existsSync(dist)
  ? readdirSync(dist, { withFileTypes: true })
      .filter(f => f.isFile())
      .map(f => ({ name: f.name, size: fileSize(resolve(f.parentPath ?? dist, f.name)) }))
  : []

console.log('\n📋 输出:')

for (const f of files) {
  console.log(`  ${f.name.padEnd(35)} ${f.size}`)
}

// 关键文件
const jsSize  = fileSize(resolve(dist, 'axiom-ui.umd.js'))
const cssSize = fileSize(resolve(dist, 'axiom-ui.css'))

console.log(`\n🏷️  核心文件:`)
console.log(`   axiom-ui.umd.js  ${jsSize}`)
console.log(`   axiom-ui.css     ${cssSize}`)
console.log(`   index.html       测试页\n`)

// ==============================
// 使用说明
// ==============================

console.log('📖 使用方式:\n')
console.log('   1. 加载 Tailwind CSS（CDN 或本地构建）')
console.log('   2. 加载字体（Geist + JetBrains Mono + Material Symbols）')
console.log('   3. 加载 axiom-ui.css + axiom-ui.umd.js\n')
console.log('   详见 dist-cdn/index.html 完整示例。\n')
