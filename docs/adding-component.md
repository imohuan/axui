# 添加新组件规范

> 本文档定义向 Axiom UI 组件库添加一个新 `Ax*` 组件的完整步骤和检查清单。
> 以后每次新增组件均按此流程执行，无需额外提醒。

---

## 修改范围总览

每个新组件涉及以下 **6 类文件**，必须全部同步修改：

| # | 路径 | 操作 |
|---|------|------|
| 1 | `web/src/components/ui/AxXxx.vue` | **新建** — 组件源文件 |
| 2 | `web/src/components/ui/index.ts` | **修改** — 导入 + 注册 + 导出 |
| 3 | `web/src/components/ui/layout/ComponentsView.vue` | **修改** — 添加组件展示区（props/schema + 模板） |
| 4 | `web/src/components/ui/layout/ConsoleLayout.vue` | **修改** — 左侧导航添加子菜单 + 更新组件计数 |
| 5 | `web/README.md` | **修改** — 组件表 + 组件数量 |
| 6 | `web/scripts/SKILL_SOURCE.md` | **修改** — 组件清单 + Copilot 指令 + 文件结构注释 + frontmatter + 数量描述 |
| 7 | `web/src/components/ui/docs/ui-style.md` | **修改** — §8.0 组件一览表 + 对应样式章节 |

> **禁止修改 `web/skills/` 目录**：该目录由 `git pre-commit hook` 自动生成，手动修改会被下次构建覆盖。

---

## 详细步骤

### 第一步：创建组件文件

在 `web/src/components/ui/` 下创建 `AxXxx.vue`：

- 使用 `<script setup lang="ts">` + TypeScript
- Props 使用 `defineProps<>()` 泛型声明
- Events 使用 `defineEmits<>()` 泛型声明
- 支持 `v-model` 时使用 `modelValue` / `update:modelValue` 约定
- 样式使用 Tailwind v4 语义 token（`text-primary` / `bg-surface-container-low` 等）
- 间距使用 `ax-` 前缀 class（`gap-ax-sm` / `p-ax-md` 等）
- 可访问性：按钮用 `<button>`，开关用 `role="switch"` + `aria-checked`
- 图标用 `<span class="material-symbols-outlined">icon_name</span>`

### 第二步：注册到组件库

修改 `web/src/components/ui/index.ts`：

1. 顶部 `import AxXxx from './AxXxx.vue'`
2. `components` 对象中添加 `AxXxx,`
3. 底部 `export { ... }` 中添加 `AxXxx,`

### 第三步：在 ComponentsView 添加展示区

修改 `web/src/components/ui/layout/ComponentsView.vue`：

**脚本部分** — 在其他组件的 props/schema 之后添加：

```ts
const xxxProps = ref({ /* 默认值 */ })
const xxxSchema: PropPanelSchemaItem[] = [
  { key: '...', label: '...', type: '...', /* ... */ },
  // ...
]
```

**模板部分** — 在合适位置（按组件类型逻辑排列）插入展示区块：

```html
<div id="section-xxx" class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden pro-shadow scroll-mt-4">
  <div class="px-ax-md py-ax-sm border-b border-outline-variant flex items-center gap-ax-sm bg-surface-container-low">
    <span class="font-label-md text-[11px] font-semibold text-primary uppercase tracking-wider">XxxName</span>
    <span class="font-body-sm text-[11px] text-secondary">说明文字</span>
  </div>
  <div class="flex divide-x divide-outline-variant min-h-[180px]">
    <!-- 左侧预览区 -->
    <div class="flex-1 p-ax-lg comp-preview flex flex-col gap-ax-lg items-start justify-center">
      <!-- 动态预览 + 所有状态静态展示 -->
    </div>
    <!-- 右侧属性面板 -->
    <div class="w-84 p-ax-md bg-surface-container-lowest overflow-y-auto">
      <AxPropPanel v-model="xxxProps" :schema="xxxSchema" title="属性" />
    </div>
  </div>
</div>
```

要点：
- `id` 使用 `section-xxx` 格式，对应子菜单的 `sectionId`
- 加上 `scroll-mt-4` 防止锚点滚动被顶栏遮挡
- 左侧预览区含"动态预览"和"所有状态"两部分
- 右侧面板宽度固定 `w-72`

### 第四步：更新左侧导航菜单

修改 `web/src/components/ui/layout/ConsoleLayout.vue`：

1. 在 `subMenus` 数组中按逻辑顺序插入子菜单项：
   ```ts
   { id: 'xxx', name: 'XxxName 中文名', sectionId: 'section-xxx' },
   ```
   - `sectionId` 必须与 ComponentsView 中的 `id` 完全一致
2. 更新组件计数徽章 `badge`，如 `'11 个组件'` → `'12 个组件'`

### 第五步：更新文档

#### 5a. `web/README.md`

- 组件表添加一行
- 更新组件总数（如 "9 个基础组件" → "10 个基础组件"）
- 目录结构注释中的数量

#### 5b. `web/scripts/SKILL_SOURCE.md`

- **Frontmatter `description`**：在括号中添加组件类型
- **组件清单表**：添加一行
- **Copilot 指令**：`Prefer Ax* Vue components` 行中添加
- **文件结构注释**："9 个 Vue 组件" → "10 个 Vue 组件"
- **描述文字**："9 个基础组件" → "10 个基础组件"

#### 5c. `web/src/components/ui/docs/ui-style.md`

- **§8.0 组件一览表**：添加一行
- **对应样式章节**：如需要，新增或修改相关章节（如 §8.5 开关章节）
- 如果是全新控件类型，在 §8 下新增一个小节描述其样式规范

---

## 检查清单（合并前自检）

| # | 项 | ✓ |
|---|-----|---|
| 1 | 组件源文件已创建，含 TypeScript 类型、v-model、disabled、可访问性 | |
| 2 | `index.ts` 已注册 + 导出 | |
| 3 | `ComponentsView.vue` 有展示区（动态预览 + 静态态 + 属性面板） | |
| 4 | `ConsoleLayout.vue` 有子菜单项（sectionId 匹配） | |
| 5 | 组件计数 badge 已递增 | |
| 6 | `README.md` 组件表 + 数量已更新 | |
| 7 | `SKILL_SOURCE.md` 清单表 + frontmatter + Copilot 指令 + 数量已更新 | |
| 8 | `ui-style.md` §8.0 一览表 + 样式章节已更新 | |
| 9 | 未碰 `web/skills/` 目录 | |
| 10 | 间距用 `ax-` 前缀，颜色用语义 token | |
