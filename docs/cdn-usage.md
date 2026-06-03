# Axiom UI CDN 接入指南

## 快速开始

在 HTML 中引入 Vue 3 和 Axiom UI 的 UMD 包即可：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Axiom UI Demo</title>
  <!-- 1. 先引入 Vue 3 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <!-- 2. 再引入 Axiom UI（包含所有组件、字体、图标、样式） -->
  <script src="./axiom-ui.umd.js"></script>
</head>
<body>
  <div id="app">
    <ax-button variant="primary" @click="handleClick">点击我</ax-button>
    <toaster position="bottom-right" />
  </div>

  <script>
    const { createApp } = Vue
    const app = createApp({
      methods: {
        handleClick() {
          AxiomUI.useNotify({ type: 'success', title: '操作成功' })
        }
      }
    })
    app.use(AxiomUI)
    app.mount('#app')
  </script>
</body>
</html>
```

## 构建命令

```bash
# 一次性构建 CDN 包
npm run build:cdn

# 开发模式（监听改动、自动构建、浏览器刷新）
npm run dev:cdn
```

输出目录 `dist-cdn/`：

| 文件 | 用途 |
|---|---|
| `axiom-ui.umd.js` | UMD 格式，浏览器 `<script>` 引入 |
| `axiom-ui.es.js` | ES Module 格式，`import` 引入 |
| `index.html` | 测试页面，展示所有组件 |

## 包含内容

一个 JS 文件包含全部：

- **10 个 Ax 组件**：AxButton、AxInput、AxSwitch、AxSlider、AxSelect、AxAlert、AxTooltip、AxDialog、AxDropdown、AxPropPanel
- **FloatingBall 悬浮球**
- **Toaster 通知容器**
- **图标**：Material Symbols（outlined 变体）
- **字体**：Geist（正文）+ JetBrains Mono（标签）
- **样式**：Tailwind CSS v4 + Axiom Design Token
- **Hooks**：useNotify / useFloating / useTeleportTarget

## 组件注册

```js
// 全局注册（推荐）
app.use(AxiomUI)

// 注册后自动可用 kebab-case 标签
// <ax-button> <ax-input> <ax-switch> ...
```

## 使用 Hooks

```js
const { createApp, ref } = Vue
const app = createApp({
  setup() {
    // useNotify — 触发 Toast 通知
    const { triggerNotify } = AxiomUI.useNotify()

    function showToast() {
      triggerNotify('这是一条消息', 'info', '标题')
      // triggerNotify(message, type, title)
      // type: 'info' | 'success' | 'warning' | 'error'
    }

    // useTeleportTarget — Shadow DOM 场景下指定 Teleport 目标
    const { provideTeleportTarget } = AxiomUI.useTeleportTarget()

    return { showToast }
  }
})
app.use(AxiomUI)
app.mount('#app')
```

## 按需引入（ESM 场景）

通过 ESM 方式按需引入组件，不注册全局标签：

```js
import { AxButton, AxInput } from './axiom-ui.es.js'

const app = createApp({
  components: { AxButton, AxInput },
  template: '<AxButton variant="primary">Button</AxButton>'
})
```

## 设计 Token

CDN 注入的 Tailwind CSS 包含 Axiom 自定义 Token，可直接在 HTML 中使用：

```html
<div class="bg-background text-on-surface p-ax-lg rounded-xl">
  <h2 class="text-primary font-headline-sm">Hello Axiom</h2>
</div>
```

常用 Token：

| Token | 说明 |
|---|---|
| `bg-background` | 页面背景色 |
| `bg-surface-container-lowest` | 卡片/弹层背景 |
| `text-primary` / `text-secondary` / `text-tertiary` | 文字层级 |
| `text-error` | 错误/危险色 |
| `border-outline-variant` | 边框色 |
| `p-ax-xs` ~ `p-ax-xl` | 内边距（4px ~ 32px） |
| `gap-ax-xs` ~ `gap-ax-xl` | 间距 |
| `rounded-xl` | 12px 圆角 |

## 注意事项

1. **Vue 引入顺序**：必须先加载 `vue.global.prod.js`，再加载 `axiom-ui.umd.js`
2. **Tailwind 类名**：CDN 的 Tailwind CSS 已在打包时生成，demo 页面中直接写 Tailwind 类名即可生效，**无需**额外引入 Tailwind CDN
3. **Toaster**：使用 `useNotify` 前必须在模板中放置 `<toaster>` 组件
4. **文件体积**：约 5.7MB（含字体 base64），建议部署到 CDN 并开启 gzip（gzip 后约 4.3MB）
