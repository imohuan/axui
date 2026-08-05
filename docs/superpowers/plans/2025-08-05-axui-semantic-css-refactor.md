# AxUI 组件样式语义化重构

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 AxUI 组件库从"Tailwind 原子化 class + 松散的组件 class"风格重构为"纯语义化组件 class"风格，所有样式内聚在主题 CSS 文件中。

**Architecture:**
1. 新建 `src/theme/material.css` 作为 Material Design 主题的完整样式文件
2. 所有控件共享统一的通用尺寸 CSS 变量体系
3. `src/components/ui/base.css` 精简为只保留全局基础样式
4. 全部 Vue 组件改用新 class 命名，通过 `:style` + CSS 变量动态切换尺寸

**Tech Stack:** Vue 3 + CSS Custom Properties

## 命名规则

```
.ax-{component}-base      组件基础样式（引用 --ax-control-* 变量）
.ax-{component}-{variant} 颜色/风格变体
.ax-{component}-{state}   状态
.ax-{component}-{element} 子元素
```

## 文件变更清单

| 文件 | 操作 |
|------|------|
| `src/theme/material.css` | 新建 |
| `src/components/ui/base.css` | 重写 |
| `src/components/ui/common.ts` | 重写 |
| `src/components/ui/AxButton.vue` | 修改 |
| `src/components/ui/AxInput.vue` | 修改 |
| `src/components/ui/AxSwitch.vue` | 修改 |
| `src/components/ui/AxDialog.vue` | 修改 |
| `src/components/ui/AxDropdown.vue` | 修改 |
| `src/components/ui/AxSelect.vue` | 修改 |
| `src/components/ui/AxTooltip.vue` | 修改 |
| `src/components/ui/AxSlider.vue` | 修改 |
| `src/components/ui/AxPropPanel.vue` | 修改 |
| `src/components/ui/AxJsonViewer.vue` | 修改 |
| `src/components/ui/layout/ConsoleLayout.vue` | 修改 |
| `src/components/ui/layout/ComponentsView.vue` | 检查修改 |
| `src/components/ui/layout/DemoView.vue` | 检查修改 |
| `src/components/ui/layout/SettingsView.vue` | 检查修改 |
| `src/components/ui/layout/SettingsDialog.vue` | 检查修改 |

## 不变文件

`theme/engine.ts`, `theme/presets.ts`, `theme/types.ts`, `theme/index.ts`, `AxIcon.vue`, `AxImage.vue`, `AxImageViewer.vue`, `AxAlert.vue`
