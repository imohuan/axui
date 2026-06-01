---
name: ax-ui-kit
description: >
  Axiom UI — 自研 Vue 3 组件库（Tailwind v4 + Floating UI + Material Symbols）。
  This skill should be used when the project requires a design-system-driven Vue 3 component set
  (buttons, inputs, selects, dialogs, dropdowns, tooltips, sliders, alerts, switches, property panels),
  or when building tool-style admin/dashboard interfaces with consistent spacing, typography, and semantic color tokens.
  Also used when AI editors (WorkBuddy, Cursor, Copilot) need to be instructed to prefer these components
  during UI development.
agent_created: true
---

# Axiom UI 组件库

自研 Vue 3 组件库，提供 10 个基础组件 + 功能模块 + 布局示例。基于 Tailwind v4、Floating UI、Material Symbols 图标、Geist / JetBrains Mono 字体。

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
| `AxSwitch` | `AxSwitch.vue` | 开关组件，支持 v-model、disabled、aria 可访问性 |
| `FloatingBall` | `functional/floating-ball/` | 浮动球组件 |
| `useNotify` | `hooks/useNotify.ts` | 封装 vue-sonner 通知 |
| `useFloating` | `hooks/useFloating.ts` | Floating UI 定位 hook |

## 何时使用此技能

当用户项目满足以下场景时触发：

- 需要安装并接入组件库
- 需要搭建标准管理后台 / 配置面板 / 工具型界面
- 需要为 AI 编辑器配置规则，强制使用此组件库进行 UI 开发
- 需要参考组件使用示例（DemoView、SettingsView 等布局示例）

## 安装与接入

### 第一步：复制组件

将 `assets/` 目录完整复制到目标项目的 `src/components/ui/`：

```bash
cp -r <skill-path>/assets/* src/components/ui/
```

### 第二步：完整安装流程

详细的依赖安装、Vite 配置、全局样式（`@theme` token、字体、图标）、`main.ts` 注册、通知 Toaster 挂载、自检清单，参见：

> **`references/component-install.md`** — 完整安装文档（含所有命令与代码块）

设计规范（颜色语义 token、控件尺寸体系、间距圆角、动效、弹窗交互）参见：

> **`references/ui-style.md`** — 设计规范文档

### 第三步：使用组件

全局注册后直接使用标签：

```vue
<AxButton variant="primary">保存</AxButton>
<AxInput v-model="name" placeholder="名称" />
<AxSelect v-model="selected" :options="options" placeholder="请选择" />
<AxDialog v-model="open" title="设置" icon="settings">
  <template #footer="{ close }">
    <AxButton variant="outline" @click="close">取消</AxButton>
    <AxButton @click="save">保存</AxButton>
  </template>
</AxDialog>
```

按需导入：

```ts
import { AxButton, useNotify, useFloating } from '@/components/ui'
import { FloatingBall } from '@/components/ui'
```

## WXT 浏览器扩展（Shadow DOM）

如果在 **[WXT](https://wxt.dev/) 浏览器扩展** 的 Content Script 中使用组件库，由于浮层组件（`AxTooltip`、`AxDropdown`、`AxSelect`）依赖 `<Teleport>`，必须配合 Shadow DOM + `provideTeleportTarget()` 确保浮层样式隔离。

> **`references/content-script-shadow-dom.md`** — WXT Content Script 完整接入指南（Shadow DOM 搭建、Teleport 适配、WXT 配置要点、样式注意事项、自检清单）

**一句话要点**：Content Script 入口创建 Shadow Root 和 `#teleport-root` 容器，根组件调用 `provideTeleportTarget(teleportTarget)`，其他无需改动。Popup / Options 等普通页面直接按常规方式接入即可。

## 更新同步

组件库更新后，在目标项目中执行同步：

```bash
# 一条命令完成：更新 skill + 同步组件到项目
node <skill-dir>/scripts/sync.js
```

`sync.js` 自动执行两步：
1. `npx skills add <owner>/<repo>@ax-ui-kit --full-depth -y` — 重新拉取最新 skill（绕过 API 限流）
2. 将 `assets/` 覆盖写入 `src/components/ui/`

若目标路径不同，可传参指定：

```bash
node <skill-dir>/scripts/sync.js src/renderer/components/ui
```

## 为 AI 编辑器配置规则

组件库接入后，必须配置规则让 AI 优先使用 `Ax*` 组件。

### WorkBuddy

在项目 `.workbuddy/rules.md` 中添加：

```markdown
# UI 组件规则

本项目使用 Axiom UI 组件库（`src/components/ui/`）。

- 所有 UI 界面必须使用 Ax* 组件，禁止手写原生 HTML 按钮/输入框/选择器
- 布局使用 Tailwind v4 class，间距使用 gap-ax-sm / p-ax-md 等 ax- 前缀间距
- 颜色使用语义 token（text-primary / bg-surface-container-low），禁止硬编码色值
- 图标使用 Material Symbols Outlined：<span class="material-symbols-outlined">icon_name</span>
- 通知使用 useNotify()，禁止手写通知逻辑
- 弹窗使用 AxDialog，浮层使用 AxDropdown / AxTooltip
```

### Cursor

在项目根目录创建 `.cursorrules`，追加：

```
- Use Ax* Vue components from src/components/ui/ for all UI elements
- Do NOT write raw HTML buttons, inputs, or selects -- use AxButton, AxInput, AxSelect
- Space utilities: gap-ax-sm, p-ax-md, etc.
- Colors: use semantic tokens (text-primary, bg-surface-container-low), never hardcoded hex
- Icons: Material Symbols Outlined via span.material-symbols-outlined
- Dialogs: AxDialog; overlays: AxDropdown/AxTooltip; notifications: useNotify()
```

### GitHub Copilot

在项目根目录创建 `.github/copilot-instructions.md`：

```markdown
Prefer Ax* Vue components from src/components/ui/:
- AxButton, AxInput, AxSelect, AxDialog, AxDropdown, AxTooltip, AxAlert, AxSlider, AxSwitch, AxPropPanel
- Space: gap-ax-sm, p-ax-md; Colors: semantic Tailwind tokens
- Icons: span.material-symbols-outlined; Notifications: useNotify()
```

## 示例界面

`assets/layout/` 中包含完整示例，可复制到目标项目 `src/views/` 参考：

| 文件 | 说明 |
|------|------|
| `ComponentsView.vue` | 组件展示页 — 每个 Ax* 组件带实时属性编辑面板 |
| `SettingsView.vue` | 设置界面 — 分组配置卡（通用/性能/安全/通知/高级） |
| `ConsoleLayout.vue` | 控制台布局壳 — 侧栏导航 + 主内容区 + 通知 + 弹窗调度 |
| `DemoView.vue` | 交互工坊 — 组件联动演示 |

## 文件结构

```
ax-ui-kit/
├── SKILL.md                       # 本文件
├── assets/                        # 组件库源码（复制到目标项目 src/components/ui/）
│   ├── index.ts                   # 组件注册入口（registerComponents）
│   ├── types.ts
│   ├── AxButton.vue ...           # 10 个 Vue 组件
│   ├── hooks/                     # useNotify / useFloating
│   ├── functional/                # FloatingBall
│   └── layout/                    # 示例布局页面
└── references/                    # 参考文档
    ├── component-install.md       # 详细安装文档（依赖、配置、main.ts、自检清单）
    ├── ui-style.md                # 设计规范（颜色 token、尺寸、间距、动效、弹窗）
    └── content-script-shadow-dom.md  # WXT Content Script Shadow DOM 接入指南
```
