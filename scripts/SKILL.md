---
name: ax-ui-kit
description: >
  Axiom UI — 自研 Vue 3 组件库（Tailwind v4 + Floating UI + Material Symbols）。
  This skill should be used when the project requires a design-system-driven Vue 3 component set
  (buttons, inputs, selects, dialogs, dropdowns, tooltips, sliders, alerts, property panels),
  or when building tool-style admin/dashboard interfaces with consistent spacing, typography, and semantic color tokens.
  Also used when AI editors (WorkBuddy, Cursor, Copilot) need to be instructed to prefer these components
  during UI development.
agent_created: true
---

# Axiom UI 组件库

自研 Vue 3 组件库，提供 9 个基础组件 + 功能模块 + 布局示例。基于 Tailwind v4、Floating UI、Material Symbols 图标、Geist / JetBrains Mono 字体。

## 组件清单

| 组件 | 文件 | 功能 |
|------|------|------|
| `AxButton` | `AxButton.vue` | variant: primary / outline / ghost / danger；size: sm / md / icon / icon-lg |
| `AxInput` | `AxInput.vue` | size: sm / md / lg；支持 password、#prefix / #suffix slot |
| `AxSelect` | `AxSelect.vue` | 单选 / 多选 / 可搜索；基于 AxDropdown + useFloating |
| `AxDropdown` | `AxDropdown.vue` | trigger: click / hover / contextmenu；浮层定位 |
| `AxDialog` | `AxDialog.vue` | 遮罩弹窗；焦点锁定；滚动锁定；#footer slot |
| `AxAlert` | `AxAlert.vue` | type: info / success / warning / error |
| `AxSlider` | `AxSlider.vue` | 范围滑块 |
| `AxTooltip` | `AxTooltip.vue` | hover 文字提示 |
| `AxPropPanel` | `AxPropPanel.vue` | schema 驱动属性面板（switch / slider / select / input / textarea / segmented） |
| `FloatingBall` | `functional/floating-ball/` | 浮动球组件 |
| `useNotify` | `hooks/useNotify.ts` | 封装 vue-sonner 通知 |
| `useFloating` | `hooks/useFloating.ts` | Floating UI 定位 hook |

## 何时使用此技能

当用户在 Vue 3 + Vite + TypeScript 项目中：

- 需要安装并接入组件库
- 需要搭建标准管理后台 / 配置面板 / 工具型界面
- 需要为 AI 编辑器配置规则，强制使用此组件库进行 UI 开发
- 需要参考组件使用示例（DemoView、SettingsView 等布局示例）

## 安装与接入

### 第一步：复制组件目录

将本技能 `assets/ui/` 目录完整复制到目标项目的 `src/components/ui/`：

```bash
cp -r <skill-path>/assets/ui src/components/ui
```

### 第二步：安装依赖

```bash
bun add @floating-ui/dom @floating-ui/vue @tailwindcss/vite tailwindcss @vueuse/core vue vue-sonner \
  material-symbols @fontsource/geist @fontsource-variable/jetbrains-mono

bun add -d @tailwindcss/forms @vitejs/plugin-vue typescript vite vue-tsc
```

> 如果使用 npm/pnpm，将 `bun add` 替换为对应的包管理命令。

### 第三步：配置 Vite

`vite.config.ts`：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

### 第四步：全局样式

在 `src/style.css` 中：

```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";

@theme {
  --color-primary: #000000;
  --color-ball: #6366f1;
  --color-ball-light: #818cf8;
  --color-on-primary: #ffffff;
  --color-secondary: #5f5e61;
  --color-on-secondary: #ffffff;
  --color-tertiary: #000000;
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-background: #f9f9fa;
  --color-surface: #f9f9fa;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f3f3f4;
  --color-surface-container: #eeeeef;
  --color-surface-container-high: #e8e8e9;
  --color-surface-container-highest: #e2e2e3;
  --color-surface-variant: #e2e2e3;
  --color-on-surface: #1a1c1d;
  --color-on-surface-variant: #47464a;
  --color-on-background: #1a1c1d;
  --color-outline: #78767b;
  --color-outline-variant: #c8c5ca;
  --color-secondary-container: #e4e1e5;
  --color-on-secondary-container: #656467;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
  --radius-lg: 0.25rem;
  --radius-xl: 0.5rem;
  --radius-full: 1rem;
  --spacing-ax-xs: 0.25rem;
  --spacing-ax-sm: 0.5rem;
  --spacing-ax-md: 1rem;
  --spacing-ax-lg: 1.5rem;
  --spacing-ax-xl: 2rem;
  --spacing-gutter: 16px;
  --spacing-margin: 24px;
  --font-headline-sm: Geist, system-ui, -apple-system, sans-serif;
  --font-body-sm: Geist, system-ui, -apple-system, sans-serif;
  --font-body-md: Geist, system-ui, -apple-system, sans-serif;
  --font-label-md: "JetBrains Mono Variable", system-ui, -apple-system, sans-serif;
  --text-headline-sm: 16px;
  --text-headline-sm--line-height: 24px;
  --text-headline-sm--font-weight: 600;
  --text-body-sm: 12px;
  --text-body-sm--line-height: 16px;
  --text-body-sm--font-weight: 400;
  --text-body-md: 14px;
  --text-body-md--line-height: 20px;
  --text-body-md--font-weight: 400;
  --text-label-md: 12px;
  --text-label-md--line-height: 16px;
  --text-label-md--letter-spacing: 0.02em;
  --text-label-md--font-weight: 500;
}

body {
  font-family: Geist, system-ui, sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  font-size: 18px;
  display: inline-block;
  vertical-align: middle;
}

.pro-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

### 第五步：main.ts 注册

```ts
import { createApp } from 'vue'
import { Toaster } from 'vue-sonner'
import 'material-symbols/outlined.css'
import '@fontsource/geist'
import '@fontsource-variable/jetbrains-mono'
import 'vue-sonner/style.css'
import './style.css'
import App from './App.vue'
import { registerComponents } from './components/ui'

const app = createApp(App)
registerComponents(app)
app.component('Toaster', Toaster)
app.mount('#app')
```

### 第六步：模板中使用

**全局标签**（已执行 `registerComponents`）：

```vue
<AxButton variant="primary">保存</AxButton>
<AxInput v-model="name" placeholder="名称" />
<AxSelect v-model="selected" :options="options" placeholder="请选择" />
<AxDialog v-model="open" title="设置" icon="settings">
  <template #default="{ close }">
    <!-- 内容 -->
  </template>
  <template #footer="{ close }">
    <AxButton variant="outline" @click="close">取消</AxButton>
    <AxButton @click="save">保存</AxButton>
  </template>
</AxDialog>
```

**按需导入**（不全局注册时）：

```ts
import { AxButton, useNotify, useFloating } from '@/components/ui'
import { FloatingBall, useFloatingBall } from '@/components/ui'
```

## 为 AI 编辑器配置规则

将此技能接入后，需要配置 AI 编辑器规则，确保 AI 在开发时优先使用 Axiom UI 组件。

### WorkBuddy 规则

在项目根目录的 `.workbuddy/rules.md` 或项目 skills 中添加：

```markdown
# UI 组件规则

本项目使用 Axiom UI 组件库（`src/components/ui/`）。

- **所有 UI 界面必须使用 `Ax*` 组件**，禁止手写原生 HTML 按钮/输入框/选择器
- 布局使用 Tailwind v4 class，间距使用 `gap-ax-sm` / `p-ax-md` 等 ax- 前缀间距
- 颜色使用语义 token（`text-primary` / `bg-surface-container-low`），禁止硬编码色值
- 图标使用 Material Symbols Outlined：`<span class="material-symbols-outlined">icon_name</span>`
- 通知使用 `useNotify()`，禁止手写通知逻辑
- 弹窗使用 `AxDialog`，浮层使用 `AxDropdown` / `AxTooltip`
```

### Cursor 规则

在项目根目录创建 `.cursorrules`，追加：

```
- Use Ax* Vue components from src/components/ui/ for all UI elements
- Do NOT write raw HTML buttons, inputs, or selects — use AxButton, AxInput, AxSelect
- Space utilities: gap-ax-sm, p-ax-md, etc.
- Colors: use semantic tokens (text-primary, bg-surface-container-low), never hardcoded hex
- Icons: Material Symbols Outlined via span.material-symbols-outlined
- Dialogs: AxDialog; overlays: AxDropdown/AxTooltip; notifications: useNotify()
```

### GitHub Copilot 规则

在项目根目录创建 `.github/copilot-instructions.md`：

```markdown
Prefer Ax* Vue components from src/components/ui/:
- AxButton, AxInput, AxSelect, AxDialog, AxDropdown, AxTooltip, AxAlert, AxSlider, AxPropPanel
- Space: gap-ax-sm, p-ax-md; Colors: semantic Tailwind tokens
- Icons: span.material-symbols-outlined; Notifications: useNotify()
```

## 示例界面

`assets/ui/layout/` 中包含完整示例，可在开发时参考：

| 文件 | 说明 |
|------|------|
| `ComponentsView.vue` | 组件展示页 — 每个 Ax* 组件带实时属性编辑面板 |
| `SettingsView.vue` | 设置界面 — 分组配置卡（通用/性能/安全/通知/高级） |
| `ConsoleLayout.vue` | 控制台布局壳 — 侧栏导航 + 主内容区 + 通知 + 弹窗调度 |
| `DemoView.vue` | 交互工坊 — 组件联动演示 |

这些示例文件可复制到目标项目的 `src/views/` 目录参考使用。

## 技术栈依赖

| 依赖 | 版本要求 |
|------|---------|
| Vue | ^3.x |
| Vite | ^5.x / ^6.x |
| TypeScript | ^5.x |
| Tailwind CSS | v4 |
| @floating-ui/vue | 最新 |
| @vueuse/core | 最新 |
| vue-sonner | 最新 |
| material-symbols | 最新 |
| @fontsource/geist | 最新 |
| @fontsource-variable/jetbrains-mono | 最新 |

## 文件结构

```
assets/ui/
├── index.ts               # 组件注册入口（registerComponents）
├── types.ts               # 公共类型定义
├── AxButton.vue
├── AxInput.vue
├── AxSelect.vue
├── AxDropdown.vue
├── AxDialog.vue
├── AxAlert.vue
├── AxSlider.vue
├── AxTooltip.vue
├── AxPropPanel.vue
├── docs/
│   ├── component-install.md   # 详细安装文档
│   └── ui-style.md            # 设计规范文档
├── hooks/
│   ├── useNotify.ts           # 通知 hook
│   └── useFloating.ts         # 浮层定位 hook
├── functional/
│   ├── index.ts
│   └── floating-ball/         # FloatingBall 组件
└── layout/                    # 示例布局页面
    ├── ConsoleLayout.vue
    ├── ComponentsView.vue
    ├── SettingsView.vue
    └── DemoView.vue
```
