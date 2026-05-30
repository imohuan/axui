# Axiom UI

自研 Vue 3 组件库，9 个基础组件 + 功能模块 + 布局示例。基于 Tailwind v4 + Floating UI + Material Symbols。

## 快速开始

```bash
bun install
bun dev
```

## 组件


| 组件             | 说明                                                                         |
| -------------- | -------------------------------------------------------------------------- |
| `AxButton`     | variant: primary / outline / ghost / danger；size: sm / md / icon / icon-lg |
| `AxInput`      | size: sm / md / lg；支持 password、prefix / suffix slot                        |
| `AxSelect`     | 单选 / 多选 / 可搜索；基于 AxDropdown + useFloating                                  |
| `AxDropdown`   | trigger: click / hover / contextmenu；浮层定位                                  |
| `AxDialog`     | 遮罩弹窗；焦点锁定；滚动锁定；#footer slot                                                |
| `AxAlert`      | type: info / success / warning / error                                     |
| `AxSlider`     | 范围滑块                                                                       |
| `AxTooltip`    | hover 文字提示                                                                 |
| `AxPropPanel`  | schema 驱动属性面板（switch / slider / select / input / textarea / segmented）     |
| `FloatingBall` | 浮动球组件                                                                      |
| `useNotify`    | 封装 vue-sonner 通知                                                           |
| `useFloating`  | Floating UI 定位 hook                                                        |


## 技能（Skill）

本项目通过 `npx skills` 机制以技能形式分发组件库，使 AI 编辑器（WorkBuddy / Cursor / Copilot）能在接入项目时自动使用 `Ax*` 组件。

### 发布机制

`skills/ax-ui-kit/` 由 git pre-commit hook 自动构建，确保每次提交都包含最新的技能产物：

```
git commit
  └─ husky pre-commit → node scripts/install.js → 生成 skills/ax-ui-kit/
```

### 安装方式

#### 方式一：从 GitHub 安装（推荐）

```bash
npx skills add imohuan/axui@ax-ui-kit -y
```

#### 方式二：本地安装

```bash
npx skills add ./skills/ax-ui-kit -y
```

### 安装后接入目标项目

技能安装后，AI 编辑器会按 `SKILL.md` 中的指引自动完成以下步骤：

1. 将 `assets/` 复制到目标项目 `src/components/ui/`
2. 安装依赖（Tailwind v4、Floating UI、vue-sonner 等）
3. 配置 Vite + Tailwind 插件
4. 写入全局样式（`@theme` token、字体、图标）
5. 注册组件与通知
6. 配置 AI 编辑器规则，强制使用 `Ax*` 组件

详细安装文档见 `skills/ax-ui-kit/references/component-install.md`，设计规范见 `references/ui-style.md`。

### 手动构建技能

```bash
bun prepush
# 或
node scripts/install.js
```

## 目录结构

```
web/
├── src/components/ui/       # 组件源码
│   ├── AxButton.vue ...     # 9 个 Vue 组件
│   ├── index.ts             # registerComponents
│   ├── types.ts
│   ├── hooks/               # useNotify / useFloating
│   ├── functional/          # FloatingBall
│   ├── layout/              # 示例界面
│   └── docs/                # 安装文档 + 设计规范
├── scripts/
│   ├── SKILL.md             # 技能说明源文件
│   └── install.js           # 技能构建脚本
├── skills/                  # 技能产物（由 pre-commit 自动生成）
│   └── ax-ui-kit/
│       ├── SKILL.md
│       ├── assets/          # 组件库源码
│       └── references/      # 参考文档
└── .husky/pre-commit        # 提交前自动构建技能
```

## 技术栈


| 依赖                                  | 用途                                |
| ----------------------------------- | --------------------------------- |
| Vue 3 + Vite + TypeScript           | 框架                                |
| Tailwind CSS v4                     | 样式引擎                              |
| @floating-ui/vue                    | 浮层定位（Dropdown / Select / Tooltip） |
| @vueuse/core                        | 组合式工具（onClickOutside 等）           |
| vue-sonner                          | 通知队列（useNotify）                   |
| material-symbols                    | Material Symbols 图标               |
| @fontsource/geist                   | Geist UI 正文字体                     |
| @fontsource-variable/jetbrains-mono | JetBrains Mono 等宽字体               |


