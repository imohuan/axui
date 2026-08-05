# 04 - CLI 工具与初始化流程

## CLI 架构

CLI 工具是最核心的部分，发布为 npm 包 `shadcn-vue`。

入口: `packages/cli/src/index.ts`

使用 Commander.js 构建命令行程序，提供 12 个命令：

```
shadcn-vue
├── init      - 初始化项目
├── add       - 添加组件
├── apply     - 应用配置
├── diff      - 比较差异
├── docs      - 打开文档
├── view      - 查看组件
├── search    - 搜索组件
├── migrate   - 项目迁移
├── info      - 项目信息
├── build     - 构建注册表
└── mcp       - MCP 服务器
```

## init 命令：初始化流程

`init` 是最重要的命令，完成项目的完整初始化。

### 初始化步骤

```
1. 预检查 (preflight)
   ├── 检查 Node.js 版本
   ├── 检查是否有 package.json
   ├── 检查项目类型 (Nuxt / Vite / Laravel / Astro)
   └── 检查 TypeScript 配置

2. 选择预设或手动配置
   ├── 如果传了 --preset，直接使用预设
   ├── 否则交互式选择:
   │   ├── Base: reka
   │   ├── Style: vega/nova/maia/lyra/mira/luma/sera/rhea
   │   ├── Base Color: neutral/stone/zinc/mauve/olive/mist/taupe
   │   ├── Theme: 30+ 颜色主题
   │   ├── Icon Library: lucide/hugeicons/phosphor/tabler/remixicon
   │   ├── Font: 24 种字体
   │   ├── Heading Font: inherit 或独立字体
   │   ├── Radius: none/small/default/medium/large
   │   ├── Menu Accent: subtle/bold
   │   ├── Menu Color: default/inverted/...
   │   └── Pointer: true/false (cursor:pointer)
   └── 确认选择

3. 创建项目配置
   ├── 生成 components.json
   │   └── 包含所有选择的设计系统参数
   ├── 生成 tailwind.config (如果项目还没有)
   ├── 生成 CSS 文件 (包含 @import 和 @layer base)
   ├── 生成 utils.ts (cn 函数)
   └── 安装依赖 (reka-ui, tailwindcss 等)

4. 添加默认组件 (可选)
   └── 如果 --components 指定了组件列表
```

### components.json 结构

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "reka-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/assets/css/tailwind.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  },
  "iconLibrary": "lucide",
  "registries": [
    "https://shadcn-vue.com/r"
  ]
}
```

### 注入到项目的文件

| 文件 | 内容 |
|------|------|
| `components.json` | 配置文件 |
| `lib/utils.ts` | cn() 函数 |
| `assets/css/tailwind.css` 或等效路径 | Tailwind 入口 CSS |
| tailwind 配置 | 根据项目类型生成 |

## add 命令：添加组件

```
shadcn-vue add button card dialog
```

### 添加组件流程

```
1. 读取 components.json 配置
2. 解析配置:
   ├── 确定 registry URL
   ├── 确定目标目录 (aliases.ui)
   └── 确定样式和主题

3. 从 registry 获取组件信息:
   ├── 发送 HTTP 请求到 registry API
   ├── 获取组件的文件列表
   └── 获取组件的依赖列表

4. 检查并安装依赖:
   ├── 对比 package.json 中的依赖
   ├── 自动安装缺失的 npm 包
   └── 更新 package.json

5. 下载组件文件:
   ├── 逐个下载组件文件
   ├── 写入到目标目录 (如 @/components/ui/button/)
   └── 保持目录结构

6. 更新项目配置:
   └── 可能需要更新 tailwind.config 内容
```

### 组件下载的目标路径

```
用户选择的 aliases.ui = @/components/ui

添加 button 组件后:
src/
└── components/
    └── ui/
        └── button/
            ├── Button.vue
            └── index.ts
```

## Registry 通信

CLI 与 Registry (文档网站) 之间通过 HTTP API 通信。

### Registry API 端点

| 端点 | 功能 |
|------|------|
| GET /r/index.json | 获取注册表索引 |
| GET /r/styles/index.json | 获取所有风格 |
| GET /r/icons/index.json | 获取图标库 |
| GET /r/{registry}/index.json | 获取特定注册表的组件列表 |
| GET /r/{registry}/{component}.json | 获取特定组件的文件列表 |

### Registry URL 解析

```typescript
function buildUrlAndHeadersForRegistryItem(
  itemPath: string,
  registryUrl: string,
) {
  // 构建完整的 URL
  // 支持本地开发 URL 和远程 URL
  // 可以设置环境变量 REGISTRY_URL 覆盖
}
```

## diff 命令：差异比较

比较本地组件与 registry 上的最新版本：

```
shadcn-vue diff button
```

显示每个文件的差异（类似 git diff），让用户可以决定是否更新。

## build 命令：构建注册表

用于 registry 维护者构建注册表 JSON 文件：

```
shadcn-vue build
```

这个命令在 `apps/v4` 的构建脚本中被调用，将 registry 目录中的组件爬取并生成注册表 JSON。

## MCP 命令：AI 工具支持

```
shadcn-vue mcp
```

启动一个 MCP (Model Context Protocol) 服务器，让 AI 工具（如 Codex）可以直接通过协议获取组件信息和添加组件。

## 核心工具模块

### 配置读取 (get-config.ts)

```typescript
// 读取 components.json
// 解析路径别名
// 合并默认配置
// 提供 DEFAULT_COMPONENTS, DEFAULT_TAILWIND_CONFIG 等
```

### 项目信息 (get-project-info.ts)

```typescript
// 检测项目类型 (Nuxt/Vite/Laravel/Astro)
// 检测 Tailwind CSS 版本
// 检测 TypeScript 配置
// 检测 src 目录结构
```

### 依赖安装 (add-components.ts)

```typescript
// 解析 npm 依赖
// 调用包管理器安装
// 自动检测使用的包管理器 (npm/pnpm/yarn/bun)
```

### 预设系统 (preset/)

```typescript
// DEFAULT_PRESETS: 内置 8 个预设
// promptForPreset: 交互式选择
// isPresetCode: 检测 URL 中的预设码
// decodePreset: 从 URL 参数解码配置
```

CLI 支持通过 URL 参数传递完整的预设配置，这在文档网站的 "Design System Picker" 中被使用——用户选择配置后，可以复制一个包含所有参数的 `npx shadcn-vue init` 命令。
