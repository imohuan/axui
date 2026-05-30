# UI 设计规范

> 视觉参考：`web/src/components/ui/layout`（`ConsoleLayout` 等演示壳层）  
> 气质：中性灰阶、克制留白、工具型配置面板。

本文档描述 **`components/ui` 自研 `Ax*` 组件** 的设计 token 与样式约定，并兼顾 HTML 原型栈。适用于：

- **HTML 单页** — Tailwind CDN + Vue 3 ESM，快速原型（间距 class 可用 `gap-sm` / `p-md`）
- **Vue 项目（本仓库）** — Tailwind v4 + `AxButton` / `AxSelect` / `AxDialog` 等，间距 class 使用 **`gap-ax-sm` / `p-ax-md`**（对应 `@theme` 中的 `--spacing-ax-*`）

两套栈共享同一套**颜色与字号** token；Vue 工程的间距 token 带 `ax-` 前缀，与 HTML CDN 的 `xs`/`sm`/`md` 命名不同，但数值一致。

---

## 1. 设计原则


| 原则    | 说明                                                                  |
| ----- | ------------------------------------------------------------------- |
| 语义化颜色 | 使用 `primary`、`surface-container` 等 token，禁止硬编码 `#000`、`bg-gray-500` |
| 层级清晰  | 背景 → 容器 → 卡片 → 控件，每层有明确的边框或色差                                       |
| 尺寸统一  | 同类控件（按钮、Select 触发器、Dropdown 触发器）高度一致，禁止局部放大                         |
| 克制动效  | 过渡 100–200ms；导航激活 `scale-[0.98]`；悬停仅改背景色                            |
| 可访问性  | 弹窗焦点锁定、ESC / 点击遮罩关闭、开关带 `aria-checked`                              |
| 库优先   | 浮层定位、点击外部、快捷键、通知队列等横切能力**必须**使用成熟库，禁止手写                             |
| 栈无关   | 样式 class 与 token 命名一致，HTML 与 Vue 可互换复用                              |


---

## 2. 快速接入

### 2.1 共享资源（字体 + 图标）

#### HTML 单页：CDN `<head>`

```html
<!-- 图标 -->
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
  rel="stylesheet">
<!-- 字体 -->
<link href="https://cdn.jsdelivr.net/npm/@fontsource/geist@5.2.9/index.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

#### Vue 项目（本仓库）：`main.ts` npm 包

```ts
import 'material-symbols/outlined.css'
import '@fontsource/geist'
import '@fontsource-variable/jetbrains-mono'
```

对应依赖：`material-symbols`、`@fontsource/geist`、`@fontsource-variable/jetbrains-mono`（见 [`component-install.md`](./component-install.md)）。

> **注意**：Material Symbols 只需引入一次，勿重复。

```css
/* 本仓库 style.css 当前为简栈；含中文页面建议按 §3.3 补全回退 */
body {
  font-family: Geist, system-ui, sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
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

### 2.2 HTML 单页（Tailwind CDN + Vue 3 ESM）

适用场景：设计稿、交互原型、无构建步骤的静态页。

#### 2.2.1 依赖架构（必读）

**禁止**混用 `vue.global.js`（IIFE 全局版）与 ESM 第三方库（VueUse、vue-sonner 等）。两套 Vue 运行时实例会导致 `setupContext is null` 等崩溃。

**正确做法**：Import Map + 统一 ESM 实例：

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js",
    "@vueuse/core": "https://esm.sh/@vueuse/core@11?external=vue",
    "@floating-ui/dom": "https://esm.sh/@floating-ui/dom@1.6.3",
    "vue-sonner": "https://esm.sh/vue-sonner@1?external=vue"
  }
}
</script>

<link rel="stylesheet" href="https://unpkg.com/vue-sonner/style.css" />

<script type="module">
  import { createApp, ref, h } from 'vue';
  import { onClickOutside, useMagicKeys } from '@vueuse/core';
  import { computePosition, flip, shift, offset } from '@floating-ui/dom';
  import { Toaster, toast } from 'vue-sonner';
  // ...
</script>
```


| 规则                       | 说明                                                   |
| ------------------------ | ---------------------------------------------------- |
| `?external=vue`          | 确保所有库共享 import map 中的同一个 `vue` 实例                    |
| `<script type="module">` | 入口脚本必须是 ESM，禁止 `const { ref } = Vue`                 |
| CDN 选型                   | Vue 用 `vue.esm-browser.js`；其余库用 `esm.sh` 或等效 ESM CDN |


#### 2.2.2 Tailwind 配置

```html
<script src="https://cdn.tailwindcss.com?plugins=forms"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#000000',
          'on-primary': '#ffffff',
          secondary: '#5f5e61',
          'on-secondary': '#ffffff',
          tertiary: '#000000',
          error: '#ba1a1a',
          'on-error': '#ffffff',
          background: '#f9f9fa',
          surface: '#f9f9fa',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#f3f3f4',
          'surface-container': '#eeeeef',
          'surface-container-high': '#e8e8e9',
          'surface-container-highest': '#e2e2e3',
          'surface-variant': '#e2e2e3',
          'on-surface': '#1a1c1d',
          'on-surface-variant': '#47464a',
          'on-background': '#1a1c1d',
          outline: '#78767b',
          'outline-variant': '#c8c5ca',
          'secondary-container': '#e4e1e5',
          'on-secondary-container': '#656467',
          'error-container': '#ffdad6',
          'on-error-container': '#93000a',
        },
        borderRadius: {
          DEFAULT: '0.125rem',
          lg: '0.25rem',
          xl: '0.5rem',
          full: '0.75rem',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          gutter: '16px',
          margin: '24px',
        },
        /* 字体栈必须含中文回退，见 §3.3 */
        fontFamily: {
          'headline-sm': ['Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Microsoft YaHei', 'sans-serif'],
          'body-sm':     ['Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Microsoft YaHei', 'sans-serif'],
          'body-md':     ['Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Microsoft YaHei', 'sans-serif'],
          'label-md':    ['JetBrains Mono', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Microsoft YaHei', 'sans-serif'],
        },
        fontSize: {
          'headline-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
          'body-sm':     ['12px', { lineHeight: '16px', fontWeight: '400' }],
          'body-md':     ['14px', { lineHeight: '20px', fontWeight: '400' }],
          'label-md':    ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        },
      },
    },
  };
</script>
```

完整示例见仓库根目录 `记录/ui.html` 等 HTML 原型；Vue 演示见 `web/src/components/ui/layout`。

> HTML CDN 的 `borderRadius.full` 为 `0.75rem`；Vue `@theme` 的 `--radius-full` 为 **`1rem`**，以 `web/src/style.css` 为准。

### 2.3 Vue 项目（Tailwind v4）

适用场景：本仓库 `web` 工程及复制出去的 `components/ui`。

在 `src/style.css` 注册 token（与仓库实现保持一致；完整文件见 `web/src/style.css`）：

```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";

@theme {
  /* 颜色 */
  --color-primary: #000000;
  --color-ball: #6366f1;
  --color-ball-light: #818cf8;
  --color-on-primary: #ffffff;
  /* …其余 surface / outline / error 等同 component-install.md … */

  --radius-lg: 0.25rem;
  --radius-xl: 0.5rem;
  --radius-full: 1rem;

  /* Vue 组件间距：class 为 gap-ax-sm、p-ax-md 等 */
  --spacing-ax-xs: 0.25rem;
  --spacing-ax-sm: 0.5rem;
  --spacing-ax-md: 1rem;
  --spacing-ax-lg: 1.5rem;
  --spacing-ax-xl: 2rem;
  --spacing-gutter: 16px;
  --spacing-margin: 24px;

  /* 字号 token：font-headline-sm + text-headline-sm 等 */
  --font-headline-sm: Geist, system-ui, -apple-system, sans-serif;
  --font-label-md: "JetBrains Mono Variable", system-ui, -apple-system, sans-serif;
  --text-headline-sm: 16px;
  --text-headline-sm--line-height: 24px;
  --text-headline-sm--font-weight: 600;
  /* …body-sm / body-md / label-md 见 style.css … */
}
```

另需复制 `style.css` 中的 `.material-symbols-outlined`、`.pro-shadow`、`.scrollbar-hide` 及 `input[type="range"]` 滑块样式（供 `AxSlider` / `AxPropPanel`）。

Vue 组件使用语义色 + `ax` 间距，例如 `bg-surface-container-lowest gap-ax-sm p-ax-md`。`FloatingBall` 等使用 `--color-ball` / `--color-ball-light`。

---

## 3. 字体

### 3.1 字体族


| 用途       | 字体                 | Tailwind class                    |
| -------- | ------------------ | --------------------------------- |
| 界面正文、标题  | **Geist**          | `font-body-`* / `font-headline-*` |
| 标签、代码、徽章 | **JetBrains Mono** | `font-label-md`                   |


### 3.2 字号阶梯

**已写入 `web/src/style.css` `@theme` 的 token**（`Ax*` 组件实际使用）：

| Token          | 字号 / 行高     | 字重  | 字距      | 典型场景          |
| -------------- | ----------- | --- | ------- | ------------- |
| `headline-sm`  | 16px / 24px | 600 | —       | 侧栏标题、`AxDialog` 标题 |
| `body-md`      | 14px / 20px | 400 | —       | 默认正文、Toast 标题辅助 |
| `body-sm`      | 12px / 16px | 400 | —       | 辅助说明、`AxAlert` 正文 |
| `label-md`     | 12px / 16px | 500 | +0.02em | 按钮、导航、表单标签（JetBrains Mono Variable） |

**仅 HTML CDN 原型扩展**（Vue 组件库未定义对应 `--text-*`）：`display`、`headline-lg`、`headline-md`、`body-lg` 等，见 §2.2.2。


```html
<h2 class="font-headline-sm text-headline-sm text-primary">节标题</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">辅助说明</p>
<label class="font-label-md text-label-md font-semibold text-primary">字段标签</label>
```

### 3.3 中文回退（必读）

Geist 与 JetBrains Mono **均不含中文字形**。若字体栈末尾仅写 `sans-serif` 或 `monospace`，Windows 会将中文回退到**宋体 (SimSun)**，与西文形成严重视觉撕裂。

**所有字体栈末尾必须追加现代中文无衬线回退：**

```
system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Microsoft YaHei, sans-serif
```


| 字符类型  | 实际渲染字体                                    |
| ----- | ----------------------------------------- |
| 英文、数字 | Geist 或 JetBrains Mono                    |
| 中文    | Microsoft YaHei / system-ui（自动跳过无字形的西文字体） |


`font-label-md` 用于导航项、按钮等含中文场景时，中文不会使用等宽体，但会正确回退到雅黑而非宋体。

---

## 4. 图标

### 4.1 规范

**标准库：Material Symbols Outlined**


| 状态       | FILL | 字重  | 尺寸   |
| -------- | ---- | --- | ---- |
| 默认 / 未选中 | `0`  | 400 | 18px |
| 导航激活     | `1`  | 400 | 18px |
| 提示信息     | `0`  | 400 | 14px |


```html
<!-- 静态 HTML -->
<span class="material-symbols-outlined">settings</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_fix_high</span>
```

#### Vue 动态 FILL 绑定

在 HTML 文件的标签属性中，**禁止**在 `:style` 表达式内使用 `\"` 转义双引号——HTML 解析器会截断属性，导致模板编译失败。

```html
<!-- ✅ 正确：表达式内用单引号包裹 CSS 值 -->
<span
  class="material-symbols-outlined"
  :style="{ fontVariationSettings: active ? '\'FILL\' 1' : '\'FILL\' 0' }"
>{{ name }}</span>

<!-- ❌ 错误：HTML 属性内的 \" 会被解析器破坏 -->
<span :style="{ fontVariationSettings: active ? \"'FILL' 1\" : \"'FILL' 0\" }">
```

`.vue` 单文件组件中可使用双引号（无 HTML 属性层嵌套）：

```vue
:style="{ fontVariationSettings: active ? \"'FILL' 1\" : \"'FILL' 0\" }"
```

或抽为计算属性 / 工具函数，避免模板内嵌套引号。

### 4.2 常用映射


| 场景   | 图标名                 |
| ---- | ------------------- |
| 通用设置 | `settings`          |
| 语音   | `record_voice_over` |
| 角色识别 | `person_search`     |
| 文本处理 | `auto_fix_high`     |
| 输出   | `volume_up`         |
| 帮助   | `help_outline`      |
| 状态   | `analytics`         |
| 关闭   | `close`             |
| 信息提示 | `info`              |
| 跳转链接 | `arrow_forward`     |
| 更多操作 | `more_vert`         |
| 通知   | `notifications`     |


---

## 5. 主题颜色

基于 Material Design 3 语义色板，中性灰阶为主，主色为纯黑。

### 5.1 核心色


| Token          | 色值        | 用途            |
| -------------- | --------- | ------------- |
| `primary`      | `#000000` | 主按钮、开关开启、强调文字 |
| `on-primary`   | `#ffffff` | 主色上的文字        |
| `secondary`    | `#5f5e61` | 次要文字、图标       |
| `on-secondary` | `#ffffff` | 次要色上的文字       |
| `tertiary`     | `#000000` | 第三强调          |
| `error`        | `#ba1a1a` | 错误状态          |
| `on-error`     | `#ffffff` | 错误色上的文字       |


### 5.2 表面与背景


| Token                       | 色值        | 用途         |
| --------------------------- | --------- | ---------- |
| `background`                | `#f9f9fa` | 页面底色       |
| `surface`                   | `#f9f9fa` | 通用表面       |
| `surface-container-lowest`  | `#ffffff` | 弹窗、卡片、侧栏   |
| `surface-container-low`     | `#f3f3f4` | 悬停背景、输入框底色 |
| `surface-container`         | `#eeeeef` | 徽章、次要容器    |
| `surface-container-high`    | `#e8e8e9` | 抬升容器       |
| `surface-container-highest` | `#e2e2e3` | 最高层级表面     |
| `surface-variant`           | `#e2e2e3` | 变体表面       |


### 5.3 文字与边框


| Token                | 色值        | 用途        |
| -------------------- | --------- | --------- |
| `on-surface`         | `#1a1c1d` | 主文字       |
| `on-surface-variant` | `#47464a` | 辅助说明      |
| `on-background`      | `#1a1c1d` | 背景上的文字    |
| `outline`            | `#78767b` | 开关关闭、次要边框 |
| `outline-variant`    | `#c8c5ca` | 卡片边框、分隔线  |


### 5.4 容器强调色


| Token                    | 色值        | 用途     |
| ------------------------ | --------- | ------ |
| `secondary-container`    | `#e4e1e5` | 导航激活背景（`ConsoleLayout` 侧栏） |
| `on-secondary-container` | `#656467` | 导航激活文字 |
| `error-container`        | `#ffdad6` | `AxAlert` type=error 背景 |
| `on-error-container`     | `#93000a` | 错误提示文字 |

> `primary-container` / `on-primary-container` 仅见于 HTML 原型配置，**未**写入 `web/src/style.css` 的 `@theme`，`Ax*` 组件不使用。


### 5.5 使用规则

```
页面背景     → bg-surface-container-low
弹窗/卡片    → bg-surface-container-lowest + border-outline-variant
主文字       → text-primary 或 text-on-surface
辅助说明     → text-on-surface-variant 或 text-secondary
分隔线       → border-outline-variant
主按钮       → AxButton variant=primary
线框/幽灵    → AxButton variant=outline | ghost
危险操作     → AxButton variant=danger
导航激活     → bg-secondary-container text-on-secondary-container
输入框       → bg-surface-container-low border-outline-variant
聚焦环       → focus:ring-1 focus:ring-primary focus:border-primary
```

---

## 6. 间距与圆角

### 6.1 间距


| Token（Vue class） | CSS 变量 | 值       | 用途           |
| ---------------- | -------- | ------- | ------------ |
| `ax-xs`          | `--spacing-ax-xs` | 0.25rem | 图标与文字、紧凑 gap |
| `ax-sm`          | `--spacing-ax-sm` | 0.5rem  | 按钮内 gap、行内间距 |
| `ax-md`          | `--spacing-ax-md` | 1rem    | 卡片、Toast 内边距 |
| `ax-lg`          | `--spacing-ax-lg` | 1.5rem  | 预览区、Dialog 内容区 |
| `ax-xl`          | `--spacing-ax-xl` | 2rem    | 大区块横向间距 |
| `gutter`         | `--spacing-gutter` | 16px    | 栅格沟槽         |
| `margin`         | `--spacing-margin` | 24px    | 内容区水平内边距 `p-margin` |

HTML CDN 栈将上表映射为 `xs` / `sm` / `md` / `lg` / `xl`（无 `ax-` 前缀），数值相同。


### 6.2 圆角


| Token     | 值    | 用途        |
| --------- | ---- | --------- |
| `DEFAULT` | 2px  | 极小元素      |
| `lg`      | 4px  | 输入框、按钮    |
| `xl`      | 8px  | 卡片、导航项、弹窗 |
| `full`    | 16px（`1rem`） | 开关轨道、药丸形、浮层圆角 |


### 6.3 阴影

仅弹窗、浮层使用 `pro-shadow`，避免多层阴影叠加。

---

## 7. 控件尺寸体系（全局统一）

工具型面板中，**所有可交互控件的物理高度必须对齐**。禁止局部使用 `p-3`、`py-2` 等导致某组件明显偏大。

### 7.1 标准高度基准


| 控件类型         | 内边距           | 近似高度  | 说明       |
| ------------ | ------------- | ----- | -------- |
| `AxButton` size=md | `px-4 py-1.5` | ~32px | 默认主/线框/幽灵按钮 |
| `AxButton` size=sm | `px-2.5 py-1` | ~28px | 紧凑按钮 |
| `AxButton` size=icon | `w-7 h-7` | 28px | 纯图标（如侧栏 more） |
| `AxButton` size=icon-lg | `w-8 h-8` | 32px | 大号图标按钮 |
| `AxSelect` 触发器 | `px-3 py-1.5` | ~32px | 与 md 按钮等高 |
| `AxDropdown` 菜单项 | `px-3 py-1.5` | — | 由触发器 slot 决定高度 |
| 侧栏导航项        | `py-1.5 px-2` | ~32px | 与按钮视觉对齐  |
| 下拉菜单项        | `px-3 py-1.5` | —     | 菜单内列表行   |


### 7.2 宽度约束


| 控件         | 宽度规则                               |
| ---------- | ---------------------------------- |
| `AxSelect` 触发器 | 默认 `w-full`；需限宽时传 `trigger-max-width`（如 `280px`），非强制写死 class |
| `AxButton` | 默认自适应；`block` 时 `w-full` |
| `AxInput` | 默认 `w-full`；size=`md` 为 `p-2.5`，`lg` 为 `p-3` |


### 7.3 纯图标按钮（Square IconButton）

纯图标按钮**必须**显式声明等宽等高，禁止仅用 `p-1` 或 `p-0.5`（字体图标行高会导致长方形）。

```html
<!-- 结构模板 -->
<button class="w-{size} h-{size} flex items-center justify-center rounded-lg shrink-0 …">
  <span class="material-symbols-outlined">close</span>
</button>
```


| 场景                    | 尺寸              | 圆角           |
| --------------------- | --------------- | ------------ |
| Alert 内联关闭            | `w-5 h-5`（20px） | `rounded`    |
| Toast / Drawer 关闭     | `w-6 h-6`（24px） | `rounded-lg` |
| 侧栏 more 菜单            | `w-7 h-7`（28px） | `rounded-lg` |
| Header 铃铛 / Dialog 关闭 | `w-8 h-8`（32px） | `rounded-lg` |


悬停态：`hover:bg-surface-container-low`；错误上下文：`hover:bg-error/10`。

---

## 8. 布局与组件样式

### 8.0 自研组件一览（`components/ui`）

| 组件 | 说明 |
| --- | --- |
| `AxButton` | `variant`: primary / outline / ghost / danger；`size`: sm / md / icon / icon-lg |
| `AxInput` | `size`: sm / md / lg；支持 `password`、`#prefix` / `#suffix` |
| `AxSelect` | 单选 / 多选 / 可搜索；基于 `AxDropdown` + `useFloating` |
| `AxDropdown` | 浮层菜单；`trigger`: click / hover / contextmenu |
| `AxDialog` | 遮罩弹窗；Tab 焦点环；默认 `max-width` 为 `max-w-xl` |
| `AxAlert` | `type`: info / success / warning / error |
| `AxSlider` | range 滑块（样式见 `style.css` 伪元素） |
| `AxTooltip` | 悬停提示 |
| `AxPropPanel` | schema 驱动属性面板（含 switch / slider / select 等） |
| `useNotify` | 封装 `vue-sonner` 的 `toast.custom` |
| `FloatingBall` | `functional/floating-ball`，使用 `ball` / `ball-light` 色 |

以下 class 示例：**Vue 工程**使用 `gap-ax-sm`、`p-ax-md`；HTML CDN 原型将 `ax-` 换为 `sm` / `md` 即可。

### 8.1 设置弹窗结构（`AxDialog` / 演示壳层）

```
┌─────────────────────────────────────────────┐
│  SideNav (w-60)  │  Main Content            │
│  ─────────────── │  ─ Header (h-12) ──────  │
│  标题 + 副标题    │  ─ Scroll Area ─────────  │
│  导航列表         │    节标题 + 说明           │
│  底部链接         │    卡片 / 表单项           │
│                  │  ─ Footer (h-12) ───────  │
└─────────────────────────────────────────────┘
```


| 属性        | 值                     |
| --------- | --------------------- |
| `AxDialog` 默认宽度 | `max-w-xl`（prop `maxWidth` 可改） |
| `AxDialog` 最大高度 | `max-h-[85vh]`；内容区 `p-ax-lg overflow-y-auto scrollbar-hide` |
| `AxDialog` 顶栏 | `h-12`；关闭按钮 `w-8 h-8` |
| `AxDialog` 底栏（可选） | `h-14`；`#footer` slot |
| 演示壳层侧栏（`ConsoleLayout`） | `w-60`（非 `w-52`） |
| 区块垂直间距（Vue） | `space-y-ax-lg` |


### 8.2 侧栏导航

```html
<!-- 默认（Vue：gap-ax-sm） -->
<a class="flex items-center gap-ax-sm text-secondary hover:bg-surface-container-low rounded-xl py-1.5 px-2 font-label-md text-label-md transition-all duration-100" href="#">
  <span class="material-symbols-outlined">settings</span>
  <span>General</span>
</a>

<!-- 激活：FILL=1 + scale-[0.98]（与 ConsoleLayout 一致） -->
<a class="flex items-center gap-ax-sm bg-secondary-container text-on-secondary-container font-medium scale-[0.98] rounded-xl py-1.5 px-2 font-label-md text-label-md transition-all duration-100" href="#">
  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_fix_high</span>
  <span>Processing</span>
</a>
```

### 8.3 卡片

```html
<section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-ax-md">
  <label class="font-label-md text-label-md font-semibold text-primary">标题</label>
  <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">说明文字</p>
</section>
```

### 8.4 按钮（`AxButton`）


| `variant` | 实现要点 |
| --- | --- |
| `primary` | `bg-primary text-on-primary hover:opacity-90`；带水波纹 `ax-ripple` |
| `outline` | `text-primary bg-white hover:bg-surface-container-high`（**无边框**，与旧文档「次按钮描边」不同） |
| `ghost` | `text-secondary hover:bg-surface-container-low` |
| `danger` | `text-error hover:bg-error-container hover:text-on-error-container` |

公共 class：`inline-flex gap-ax-xs font-label-md rounded-md transition-colors`；默认 `size="md"`。图标按钮用 `size="icon"` / `icon-lg`，或见 §7.3 手写 `w-N h-N`。


### 8.5 开关（Switch）


| 状态  | 轨道           | 滑块位置            |
| --- | ------------ | --------------- |
| 开启  | `bg-primary` | `translate-x-4` |
| 关闭  | `bg-outline` | `translate-x-0` |


```html
<button
  role="switch"
  aria-checked="true"
  class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full bg-primary p-0.5 transition-colors duration-200 focus:outline-none"
>
  <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out translate-x-4"></span>
</button>
```

尺寸：轨道 `h-5 w-9`，滑块 `h-4 w-4`。与 `AxPropPanel` type=`switch` 一致。

### 8.6 Select（`AxSelect` + `AxDropdown`）

- 触发器默认 `w-full` + `px-3 py-1.5`；限宽用 prop `trigger-max-width`，非写死 `max-w-[280px]`。
- 下拉定位：`useFloating`，`AxSelect` 传 `:offset="4"`；`AxDropdown` 默认 `offset=6`、`shift({ padding: 5 })`。
- 单选选中项：`bg-primary text-on-primary`；多选：`bg-primary/10` + 左侧复选框。

```html
<!-- 单选触发器（与 AxSelect 非搜索模式一致） -->
<button
  class="w-full flex items-center justify-between px-3 py-1.5 font-label-md text-label-md
    bg-surface-container-low border border-outline-variant rounded-md
    hover:bg-surface-container hover:border-outline
    focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-left"
>
  <span class="text-primary font-medium">选项文字</span>
  <span class="material-symbols-outlined text-secondary transition-transform duration-200">expand_more</span>
</button>
```

### 8.7 输入框（`AxInput`）

```html
<!-- size=md（默认） -->
<input
  class="w-full p-2.5 font-label-md text-label-md bg-surface-container-low border border-outline-variant rounded-md
    focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-outline transition-all"
/>
```

`AxPropPanel` 的 `textarea` 仍可用 `p-3`；与 `AxInput` size=`lg` 对齐。

### 8.8 信息提示条（`AxAlert`）

```html
<!-- type=info：左边框 primary，非 border-outline -->
<div class="flex items-start justify-between gap-ax-sm p-2.5 rounded-r-lg
  text-on-surface-variant bg-surface-container-lowest border border-outline-variant border-l-2 border-l-primary">
  <div class="flex items-start gap-ax-xs">
    <span class="material-symbols-outlined text-[16px] mt-0.5 text-primary">info</span>
    <p class="text-[10px] leading-relaxed text-secondary"><slot /></p>
  </div>
  <button class="w-5 h-5 flex items-center justify-center rounded text-secondary hover:bg-surface-container-low">
    <span class="material-symbols-outlined text-[14px]">close</span>
  </button>
</div>
```

`type=error` 时使用 `bg-error-container`、`border-l-error` 等（见 `AxAlert.vue` 的 `TYPE_CONFIG`）。

### 8.9 通知（Notify / Toast）

**必须使用 [vue-sonner](https://github.com/xiaoluoboding/vue-sonner)**，禁止手写通知队列。


| 配置项        | 值                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| 位置         | `position="top-center"`                                                                                                 |
| 自动关闭       | `duration: 4000`（4 秒）                                                                                                   |
| 悬停暂停       | vue-sonner 内置，无需额外实现                                                                                                    |
| 自定义样式      | `toast.custom()` + `h()` 渲染，保持灰阶 token                                                                                  |
| Toaster 容器 | 透明背景，避免双层卡片：`toast-options="{ style: { background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' } }"` |


```vue
<!-- ConsoleLayout：透明容器，避免双层卡片 -->
<Toaster
  position="top-center"
  :toast-options="{ style: { background: 'transparent', border: 'none', boxShadow: 'none', padding: '0px' } }"
/>
```

```ts
// useNotify.ts 自定义卡片（节选）
toast.custom(
  (tId) =>
    h('div', {
      class:
        'flex items-start gap-ax-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-ax-md pro-shadow pointer-events-auto w-80 text-left',
    }, [/* 图标、标题 font-headline-sm、正文 font-body-sm、w-6 h-6 关闭 */]),
  { duration: 4000 },
)
```

Toast 内关闭按钮：`w-6 h-6 rounded-lg`（§7.3）。

---

## 9. 弹窗交互规范

所有 Dialog / Drawer / Popover 必须支持：


| 行为     | 要求                             |
| ------ | ------------------------------ |
| ESC 关闭 | 监听 `keydown`（`Escape`），关闭并归还焦点 |
| 点击遮罩关闭 | 点击 overlay 区域关闭（有未保存更改时可二次确认）  |
| 焦点锁定   | Tab 仅在弹窗内循环                    |
| 打开时焦点  | 聚焦第一个可交互元素或关闭按钮                |
| 关闭后焦点  | 归还至触发元素                        |
| 滚动锁定   | 打开时锁定 `body` 滚动                |


### 9.1 HTML 单页实现要点

```javascript
// ESC 关闭（可用 VueUse useMagicKeys 替代手写监听）
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllOverlays();
});

// 遮罩点击
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeDialog();
});

// 滚动锁定
document.body.style.overflow = open ? 'hidden' : '';
```

焦点陷阱可用原生 `tabindex` 管理，或引入轻量库（如 `focus-trap`）。

### 9.2 Vue 项目实现要点（`AxDialog` / `AxDropdown`）

| 能力 | 实现 |
| --- | --- |
| 遮罩关闭 | `AxDialog`：`@click.self` + prop `closeOnOverlay`（默认 true） |
| 滚动锁定 | 打开时 `document.body.style.overflow = 'hidden'` |
| Tab 焦点环 | `AxDialog` 内 `@keydown` 在首尾 focusable 间循环 |
| ESC | `AxDropdown` / `AxSelect` 下拉内已监听；**`AxDialog` 本体未绑 ESC**，需在父级（如 `ConsoleLayout` 的 `handleGlobalKeydown`）或业务层补充 |
| 点击外部 | `AxDropdown`：`onClickOutside`（`AxDropdown.vue`） |

```vue
<AxDialog v-model="open" title="标题" icon="settings" max-width="max-w-xl">
  <template #default="{ close, setFocusableRef }">…</template>
  <template #footer="{ close }">
    <AxButton variant="outline" @click="close">取消</AxButton>
    <AxButton @click="save">保存</AxButton>
  </template>
</AxDialog>
```

关闭按钮：`w-8 h-8 flex items-center justify-center rounded-lg`（§7.3）。

---

## 10. 组件底层依赖（兵器谱）

写**无样式**基础组件时，按类型选用底层库；样式层统一套用本文档 token。

> HTML 单页原型中，以下库为**强制推荐**，不得用原生替代。

### 10.1 通用（HTML + Vue）


| 组件类型 | 核心痛点          | HTML 推荐              | Vue 推荐                 |
| ---- | ------------- | -------------------- | ---------------------- |
| 日期计算 | 星期矩阵、格式化      | `date-fns` / `dayjs` | 同左                     |
| 表单校验 | 脏检查、schema 校验 | 原生 + 自研 / `zod`      | `vee-validate` + `zod` |
| 防抖节流 | 搜索、resize     | 自研或 `lodash-es`      | `@vueuse/core`         |


### 10.2 浮层与定位


| 组件类型                        | 核心痛点         | HTML 推荐                  | Vue 推荐                                  |
| --------------------------- | ------------ | ------------------------ | --------------------------------------- |
| Dropdown / Tooltip / Select | 边缘碰撞、翻转、偏移   | `@floating-ui/dom`       | `@floating-ui/vue` + `<Teleport>`       |
| Dialog                      | 焦点锁定、滚动锁定   | 原生 + 自研              | **`AxDialog`**（自研 Tab 环，非 shadcn） |
| Notify / Toast              | 堆叠、自动关闭、悬停暂停 | `vue-sonner`             | `vue-sonner` + **`useNotify`**          |


Vue 工程统一走 **`hooks/useFloating.ts`**（`@floating-ui/vue` + `autoUpdate` + `transform: false`）：

```ts
// AxDropdown 默认 middleware
[offset(6), flip(), shift({ padding: 5 })]
// AxSelect 绑定 AxDropdown 时 :offset="4"
```

HTML 单页仍可用 `@floating-ui/dom` 的 `computePosition`（`shift` padding 建议与 Vue 对齐为 `5`）。

### 10.3 数据密集型


| 组件类型       | 核心痛点     | Vue 推荐                |
| ---------- | -------- | --------------------- |
| Data Table | 排序、过滤、分页 | `@tanstack/vue-table` |


### 10.4 横切能力


| 能力      | HTML             | Vue（HTML 单页同样适用）                  |
| ------- | ---------------- | --------------------------------- |
| 点击外部关闭  | 禁止手写 `window` 监听 | `@vueuse/core` → `onClickOutside` |
| 全局快捷键   | 禁止手写 keydown 分发  | `@vueuse/core` → `useMagicKeys`   |
| 防抖 / 节流 | 自研               | `@vueuse/core` → `useDebounceFn`  |


```javascript
import { onClickOutside, useMagicKeys } from '@vueuse/core';

// AxDropdown：需排除菜单内部点击（见 AxDropdown.vue）
onClickOutside(containerRef, (e) => {
  if (menuRef.value?.contains(e.target)) return;
  if (isOpen.value) close();
});

// ⌘K / Ctrl+K / / 聚焦搜索框
const { meta_k, ctrl_k, slash } = useMagicKeys();
watch([meta_k, ctrl_k, slash], (v) => { if (v.some(Boolean)) searchRef.value?.focus(); });
```

---

## 11. 动效与滚动


| 场景       | 参数                                                   |
| -------- | ---------------------------------------------------- |
| 颜色过渡     | `transition-colors duration-200`                     |
| 开关滑块     | `transition duration-200 ease-in-out`                |
| 导航激活     | `transition-transform duration-100` + `scale-[0.98]` |
| 主按钮悬停    | `hover:opacity-90 transition-opacity`                |
| 内容区滚动    | `overflow-y-auto scrollbar-hide`                     |
| Toast 入场 | vue-sonner 内置弹性动画，勿叠加自定义 transition                  |


---

## 12. 检查清单

新页面或组件合并前对照：

### 视觉与 Token

- 字体：正文 Geist，标签 JetBrains Mono，**含中文回退栈**（§3.3）
- 图标：Material Symbols Outlined，激活态 FILL=1
- 颜色：全部使用语义 token，无硬编码色值
- 圆角：卡片 `rounded-lg`，导航 `rounded-xl`，按钮 `rounded-md`
- 间距（Vue）：`p-margin` / `p-ax-md` / `gap-ax-sm` / `space-y-ax-lg`
- 阴影：弹窗、Toast、下拉面板使用 `pro-shadow`（`AxDropdown` 菜单亦带 `pro-shadow`）

### 尺寸与对称

- `AxButton` md / `AxSelect` 触发器统一 `py-1.5`（§7.1）
- `AxSelect` 限宽用 `trigger-max-width`，非强制 `max-w-[280px]`
- 纯图标按钮：`AxButton` icon 尺寸或 `w-N h-N` 正方形（§7.3）

### 交互与库

- `AxDialog`：遮罩关闭 + Tab 焦点环 + 滚动锁定；ESC 由业务层补齐
- `AxDropdown`：ESC + `onClickOutside`
- 浮层定位：Floating UI（flip + shift），非手写 `getBoundingClientRect`
- 点击外部关闭：`onClickOutside`，非手写 document 监听
- 通知：vue-sonner，`top-center`，`duration: 4000`，自定义灰阶样式
- 可访问性：开关有 `role="switch"` + `aria-checked`

### 工程

- HTML 单页：Import Map + `vue.esm-browser.js`，**禁止** `vue.global.js` 混用 ESM 库（§2.2.1）
- Vue `:style` 绑定：HTML 文件内用单引号转义，无 `\"` 属性截断（§4.1）
- Vue 间距 class 带 `ax-` 前缀，与 HTML CDN 的 `sm`/`md` 数值一致
- 优先使用 `Ax*` 组件而非复制 markup，避免与实现漂移

