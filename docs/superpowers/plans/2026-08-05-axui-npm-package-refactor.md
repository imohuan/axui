# AxUI NPM Package Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform AxUI from Tailwind-dependent library into independent npm package with theme system, embedded SVG icons, and full CDN support.

**Architecture:** 
- Remove Tailwind dependency → semantic CSS classes + CSS variables
- JavaScript-configurable theme engine with Material Design preset (based on current style)
- Replace Material Symbols (28 occurrences) with embedded SVG icons
- Support ESM import + UMD CDN usage
- Full TypeScript declarations

**Tech Stack:**
- Vue 3.5+ (peer dependency)
- Vite (build tool)
- CSS Variables (theming)
- Embedded SVG icons (path + HTML support)

**Package Details:**
- Name: `axui`
- Version: `1.0.0`
- License: MIT
- Exports: ESM, UMD, TypeScript declarations

---

## Parallel Execution Strategy

**Subagent Support:**
- ✅ Tasks 4, 5, 6 can run in parallel (3 subagents simultaneously)
- ✅ Tasks 1-3 must run sequentially (foundation)
- ✅ Task 7-8 sequential (depends on 4-6)
- ✅ Task 9 can run parallel with Task 8
- ✅ Task 10 sequential (final publishing)

**Recommended Tool:** `superpowers:subagent-driven-development`
- Launches fresh subagent per task
- Two-stage review between tasks
- Maximum 3 parallel subagents for Tasks 4-6

---

## File Structure Overview

**New Files Created (9 files):**
```
src/theme/types.ts           # Theme TypeScript definitions
src/theme/engine.ts          # Theme engine (CSS variable injection)
src/theme/presets.ts         # Material Design preset theme
src/theme/index.ts           # Theme module exports
src/icons/builtin.ts         # 28+ embedded SVG icons
src/icons/index.ts           # Icon registry & component
src/components/ui/AxIcon.vue # Icon component (supports path + HTML)
src/components/ui/base.css   # Semantic CSS classes
vite.config.lib.ts           # NPM build configuration
tsconfig.lib.json            # TypeScript build config
.npmignore                   # NPM publish exclusions
LICENSE                      # MIT License
CHANGELOG.md                 # Version history
```

**Modified Files (15+ files):**
```
package.json                        # Name, version, exports, peer deps
src/components/ui/*.vue             # 13 components - remove Tailwind, add AxIcon
src/components/ui/plugin.ts         # Initialize theme engine
src/components/ui/plugin.cdn.ts     # CDN version with theme
src/components/ui/index.ts          # Export theme & icons
README.md                           # User documentation
```

**Deleted Files:**
```
src/style.css                # Replaced by base.css + theme presets
src/cdn-theme.css            # Replaced by base.css
```

---
## Task 1: Create Theme System Foundation

**Files:**
- Create: `src/theme/types.ts`
- Create: `src/theme/engine.ts`
- Create: `src/theme/presets.ts`
- Create: `src/theme/index.ts`

**Parallel Support:** ❌ Must run sequentially (foundation for all components)

**Description:** Build complete theme system with TypeScript types, CSS variable engine, and Material Design preset based on current UI style.

- [ ] **Step 1: Create theme directory**

```bash
mkdir -p src/theme
```

- [ ] **Step 2: Create theme type definitions**

Create `src/theme/types.ts` (200 lines):

```typescript
// Full TypeScript interfaces for:
// - ThemeColors (30+ color tokens)
// - ThemeSpacing (button, input, card, generic)
// - ThemeRadius (component-specific roundness)
// - ThemeShadows (elevation system)
// - ThemeBorders (width, style, component borders)
// - ThemeTypography (fonts, sizes, weights, line-heights)
// - AxiomTheme (complete theme interface)
// - DeepPartial<T> utility type
// - ThemeConfig (for user overrides)
```

Reference current `src/style.css` for exact values.

- [ ] **Step 3: Create theme engine**

Create `src/theme/engine.ts` (150 lines):

```typescript
// ThemeEngine class with methods:
// - constructor(config?: ThemeConfig | string)
// - apply() - inject CSS variables to :root
// - update(config: ThemeConfig) - runtime theme switching
// - getTheme() - get current theme object
// - private mergeTheme() - deep merge configs
// - private kebabCase() - convert camelCase to kebab-case
```

Engine converts theme object to CSS variables like:
- `colors.primary` → `--ax-color-primary`
- `spacing.buttonPaddingMd` → `--ax-spacing-button-padding-md`

- [ ] **Step 4: Create Material Design preset**

Create `src/theme/presets.ts` (300 lines):

```typescript
// Extract exact values from current src/style.css:
export const materialTheme: AxiomTheme = {
  name: 'material',
  colors: {
    primary: '#000000',           // from --color-primary
    primaryHover: '#1a1a1a',
    onPrimary: '#ffffff',
    secondary: '#5f5e61',
    // ... 25+ more colors from style.css
  },
  spacing: {
    buttonPaddingMd: '8px 16px',
    // ... extract from current components
  },
  radius: {
    button: '0.375rem',  // from --radius-ax-md
    // ...
  },
  // ... shadows, borders, typography
}

// Also create fluent and ios presets for future use
export const themePresets = {
  material: materialTheme,
  fluent: fluentTheme,
  ios: iosTheme,
}
```

- [ ] **Step 5: Create theme barrel export**

Create `src/theme/index.ts`:

```typescript
export * from './types'
export * from './engine'
export * from './presets'
export { ThemeEngine } from './engine'
export { themePresets, materialTheme } from './presets'
```

- [ ] **Step 6: Test theme engine manually**

Create temporary test file `src/theme/test.ts`:

```typescript
import { ThemeEngine } from './engine'

const engine = new ThemeEngine('material')
engine.apply()
console.log('Theme applied:', engine.getTheme().name)
```

Run: `npx tsx src/theme/test.ts`

Expected output: "Theme applied: material"

Delete test file after verification.

- [ ] **Step 7: Commit theme system**

```bash
git add src/theme/
git commit -m "feat(theme): add theme system with Material Design preset"
```

---

## Task 2: Create Icon System with Path + HTML Support

**Files:**
- Create: `src/icons/builtin.ts`
- Create: `src/icons/index.ts`
- Create: `src/components/ui/AxIcon.vue`

**Parallel Support:** ❌ Must run sequentially (foundation for all components)

**Description:** Build embedded SVG icon system supporting both path strings and full HTML. Extract all 28 Material Symbols icons used in components and convert to SVG paths.

**Icon Requirements:**
- Support `IconDefinition` interface with path + viewBox
- Support raw HTML string (for complex multi-path icons)
- User-extensible via `registerIcons()`
- 28+ icons extracted from current components

- [ ] **Step 1: Create icons directory**

```bash
mkdir -p src/icons
```

- [ ] **Step 2: Define icon types and registry**

Create `src/icons/index.ts`:

```typescript
// src/icons/index.ts

export interface IconDefinition {
  name: string
  path?: string        // Simple single-path icons
  html?: string        // Complex multi-path or full SVG content
  viewBox?: string     // Default: '0 0 24 24'
}

// Registry
const builtinIcons = new Map<string, IconDefinition>()
const customIcons = new Map<string, IconDefinition>()

export function registerIcons(icons: Record<string, IconDefinition>) {
  Object.entries(icons).forEach(([name, icon]) => {
    customIcons.set(name, icon)
  })
}

export function getIcon(name: string): IconDefinition | undefined {
  return customIcons.get(name) || builtinIcons.get(name)
}

export function getAllIcons(): IconDefinition[] {
  return [...customIcons.values(), ...builtinIcons.values()]
}

// Register builtin icons on module load
import { builtinIconList } from './builtin'
builtinIconList.forEach(icon => builtinIcons.set(icon.name, icon))
```

- [ ] **Step 3: Create builtin icons from Material Symbols**

Create `src/icons/builtin.ts` (400+ lines):

Extract SVG paths for these 28 icons currently used in components:
1. `close` - Used in: AxSelect, AxDialog, AxImageViewer
2. `expand_more` - Used in: AxSelect, AxDropdown
3. `check` - Used in: AxSelect
4. `visibility` - Used in: AxInput (password toggle)
5. `visibility_off` - Used in: AxInput
6. `info` - Used in: AxAlert (info type)
7. `check_circle` - Used in: AxAlert (success type)
8. `warning` - Used in: AxAlert (warning type)
9. `error` - Used in: AxAlert (error type)
10. `image` - Used in: AxImage (placeholder)
11. `broken_image` - Used in: AxImage (error state)
12. `zoom_in` - Used in: AxImage (hover icon)
13. `chevron_left` - Used in: AxImageViewer (navigation)
14. `chevron_right` - Used in: AxImageViewer
15. `download` - Used in: AxImageViewer
16. `rotate_left` - Used in: AxImageViewer
17. `rotate_right` - Used in: AxImageViewer
18. `flip` - Used in: AxImageViewer
19. `zoom_in` - Used in: AxImageViewer (zoom controls)
20. `zoom_out` - Used in: AxImageViewer
21. `settings` - Used in: layout components
22. `menu` - Used in: layout components
23. `search` - Used in: layout components
24. `add` - Used in: layout components
25. `delete` - Used in: layout components
26. `edit` - Used in: layout components
27. `refresh` - Used in: layout components
28. `more_vert` - Used in: layout components

```typescript
// src/icons/builtin.ts
import type { IconDefinition } from './index'

export const builtinIconList: IconDefinition[] = [
  {
    name: 'close',
    path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    viewBox: '0 0 24 24',
  },
  {
    name: 'check',
    path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    viewBox: '0 0 24 24',
  },
  {
    name: 'expand_more',
    path: 'M7 10l5 5 5-5z',
    viewBox: '0 0 24 24',
  },
  // ... Add remaining 25 icons with actual SVG paths
  // Use Material Design Icons as reference:
  // https://fonts.google.com/icons
]
```

**Note:** For each icon, extract the actual SVG path from Material Symbols. Use simple path string for single-path icons, use html field for multi-path icons.

- [ ] **Step 4: Create AxIcon component**

Create `src/components/ui/AxIcon.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../icons'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  { size: 20 }
)

const icon = computed(() => getIcon(props.name))
const hasHtml = computed(() => icon.value?.html != null)
const hasPath = computed(() => icon.value?.path != null)
const viewBox = computed(() => icon.value?.viewBox || '0 0 24 24')
</script>

<template>
  <svg
    v-if="icon"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="currentColor"
    class="ax-icon"
  >
    <!-- HTML mode: render raw SVG content -->
    <g v-if="hasHtml" v-html="icon.html" />
    <!-- Path mode: render single path -->
    <path v-else-if="hasPath" :d="icon.path" />
  </svg>
  <span v-else class="ax-icon ax-icon--missing">?</span>
</template>

<style scoped>
.ax-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  line-height: 1;
}

.ax-icon--missing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  border: 1px solid currentColor;
  border-radius: 2px;
  font-size: 0.8em;
  opacity: 0.5;
}
</style>
```

- [ ] **Step 5: Test icon system**

Create test file `src/icons/test-icon.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { getIcon, registerIcons } from './index.ts'
    
    // Test builtin
    console.log('Builtin close:', getIcon('close'))
    
    // Test custom registration
    registerIcons({
      'custom-icon': {
        name: 'custom-icon',
        path: 'M12 2L2 7v10l10 5 10-5V7L12 2z',
      }
    })
    console.log('Custom icon:', getIcon('custom-icon'))
  </script>
</head>
<body>
  Check console for icon test results
</body>
</html>
```

Open in browser, verify console output shows icon definitions.

Delete test file after verification.

- [ ] **Step 6: Commit icon system**

```bash
git add src/icons/ src/components/ui/AxIcon.vue
git commit -m "feat(icons): add embedded SVG icon system with 28 core icons"
```

---
## Task 3: Create Base CSS with Semantic Classes

**Files:**
- Create: `src/components/ui/base.css`
- Delete: `src/style.css`
- Delete: `src/cdn-theme.css`

**Parallel Support:** ❌ Must run sequentially (foundation for all components)

**Description:** Replace Tailwind classes with semantic CSS classes using CSS variables. This makes components independent of Tailwind.

- [ ] **Step 1: Create base.css with semantic classes**

Create `src/components/ui/base.css` (500+ lines):

```css
/* src/components/ui/base.css */

/* ===== Base styles ===== */
.ax-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ax-spacing-button-gap);
  font-family: var(--ax-typography-font-family);
  font-size: var(--ax-typography-md);
  font-weight: var(--ax-typography-weight-medium);
  line-height: var(--ax-typography-line-height-normal);
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 150ms ease;
  user-select: none;
  white-space: nowrap;
}

/* Button sizes */
.ax-button--xs {
  padding: var(--ax-spacing-button-padding-xs);
  font-size: var(--ax-typography-xs);
  border-radius: var(--ax-radius-button);
}
.ax-button--sm {
  padding: var(--ax-spacing-button-padding-sm);
  font-size: var(--ax-typography-sm);
  border-radius: var(--ax-radius-button);
}
.ax-button--md {
  padding: var(--ax-spacing-button-padding-md);
  font-size: var(--ax-typography-md);
  border-radius: var(--ax-radius-button);
}
.ax-button--lg {
  padding: var(--ax-spacing-button-padding-lg);
  font-size: var(--ax-typography-lg);
  border-radius: var(--ax-radius-button);
}
.ax-button--xl {
  padding: var(--ax-spacing-button-padding-xl);
  font-size: var(--ax-typography-xl);
  border-radius: var(--ax-radius-button);
}
.ax-button--icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--ax-radius-button);
}

/* Button variants */
.ax-button--primary {
  background: var(--ax-color-primary);
  color: var(--ax-color-on-primary);
  box-shadow: var(--ax-shadow-button);
}
.ax-button--primary:hover:not(.ax-button--disabled) {
  background: var(--ax-color-primary-hover);
  box-shadow: var(--ax-shadow-button-hover);
}
.ax-button--outline {
  background: transparent;
  color: var(--ax-color-primary);
  border: var(--ax-border-width) solid var(--ax-color-primary);
}
.ax-button--outline:hover:not(.ax-button--disabled) {
  background: var(--ax-color-surface-hover);
}
.ax-button--ghost {
  background: transparent;
  color: var(--ax-color-text-secondary);
}
.ax-button--ghost:hover:not(.ax-button--disabled) {
  background: var(--ax-color-surface-hover);
}
.ax-button--danger {
  background: var(--ax-color-error);
  color: var(--ax-color-on-error);
}

/* Button states */
.ax-button--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
.ax-button--loading {
  cursor: wait;
  opacity: 0.7;
}

/* ===== Input styles ===== */
.ax-input {
  width: 100%;
  font-family: var(--ax-typography-font-family-mono);
  background: var(--ax-color-surface-container-low);
  border: var(--ax-border-input);
  border-radius: var(--ax-radius-input);
  transition: all 150ms ease;
}
.ax-input:focus {
  outline: none;
  border: var(--ax-border-input-focus);
  box-shadow: 0 0 0 1px var(--ax-color-primary);
}
.ax-input::placeholder {
  color: var(--ax-color-outline);
}
.ax-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input sizes */
.ax-input--xs {
  padding: 4px 8px;
  font-size: var(--ax-typography-xs);
}
.ax-input--sm {
  padding: 6px 12px;
  font-size: var(--ax-typography-sm);
}
.ax-input--md {
  padding: var(--ax-spacing-input-padding-y) var(--ax-spacing-input-padding-x);
  font-size: var(--ax-typography-md);
}
.ax-input--lg {
  padding: 10px 20px;
  font-size: var(--ax-typography-lg);
}

/* ===== Card/Surface styles ===== */
.ax-card {
  background: var(--ax-color-surface);
  border: var(--ax-border-card);
  border-radius: var(--ax-radius-card);
  padding: var(--ax-spacing-card-padding);
  box-shadow: var(--ax-shadow-card);
}

/* ===== Dropdown styles ===== */
.ax-dropdown {
  background: var(--ax-color-surface);
  border: 1px solid var(--ax-color-border);
  border-radius: var(--ax-radius-dropdown);
  box-shadow: var(--ax-shadow-dropdown);
  padding: var(--ax-spacing-sm);
}

/* ===== Dialog styles ===== */
.ax-dialog {
  background: var(--ax-color-surface);
  border-radius: var(--ax-radius-dialog);
  box-shadow: var(--ax-shadow-dialog);
  padding: var(--ax-spacing-lg);
}

/* ===== Alert styles ===== */
.ax-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--ax-spacing-sm);
  padding: var(--ax-spacing-md);
  border-radius: var(--ax-radius-md);
  font-size: var(--ax-typography-sm);
}
.ax-alert--info {
  background: color-mix(in srgb, var(--ax-color-primary) 10%, var(--ax-color-surface));
  color: var(--ax-color-primary);
}
.ax-alert--success {
  background: color-mix(in srgb, var(--ax-color-success) 10%, var(--ax-color-surface));
  color: var(--ax-color-success);
}
.ax-alert--warning {
  background: color-mix(in srgb, var(--ax-color-warning) 10%, var(--ax-color-surface));
  color: var(--ax-color-warning);
}
.ax-alert--error {
  background: color-mix(in srgb, var(--ax-color-error) 10%, var(--ax-color-surface));
  color: var(--ax-color-error);
}

/* ===== Switch styles ===== */
.ax-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background: var(--ax-color-outline-variant);
  border-radius: var(--ax-radius-full);
  cursor: pointer;
  transition: background 200ms ease;
}
.ax-switch--checked {
  background: var(--ax-color-primary);
}
.ax-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 200ms ease;
}
.ax-switch--checked .ax-switch__thumb {
  transform: translateX(20px);
}

/* ===== Utilities ===== */
.ax-scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.ax-scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**Note:** Extract all unique class patterns from current components and create semantic equivalents.

- [ ] **Step 2: Verify no Tailwind dependencies**

```bash
# Check if any Tailwind classes remain
grep -r "className.*\(bg-\|text-\|px-\|py-\|rounded-\|flex\|grid\)" src/components/ui/*.vue
```

Expected: No matches (all replaced with ax-* classes)

- [ ] **Step 3: Delete old style files**

```bash
git rm src/style.css src/cdn-theme.css
```

- [ ] **Step 4: Commit base CSS**

```bash
git add src/components/ui/base.css
git commit -m "feat(styles): add semantic CSS classes, remove Tailwind dependency"
```

---

## Task 4: Refactor AxButton Component

**Files:**
- Modify: `src/components/ui/AxButton.vue`

**Parallel Support:** ✅ Can run in parallel with Task 5, 6 (separate subagent)

**Description:** Replace Tailwind classes with semantic CSS classes and Material Symbols with AxIcon.

- [ ] **Step 1: Replace icon with AxIcon**

In `src/components/ui/AxButton.vue` line 125, replace:

```vue
<!-- OLD -->
<span v-else-if="icon" class="material-symbols-outlined leading-none" :style="{ fontSize: iconSize }">{{ icon }}</span>

<!-- NEW -->
<AxIcon v-else-if="icon" :name="icon" :size="iconSize" />
```

- [ ] **Step 2: Replace Tailwind classes with semantic classes**

Replace `classes` computed property (lines 62-71):

```vue
<!-- OLD -->
const classes = computed(() => [
  'relative overflow-hidden inline-flex items-center justify-center gap-ax-xs font-label-md transition-colors outline-none border-0 shrink-0',
  ROUNDED_CLASSES[props.rounded],
  isIconOnly.value ? 'leading-none' : '',
  VARIANT_CLASSES[props.variant],
  SIZE_CLASSES[props.size],
  props.block ? 'w-full' : '',
  props.disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
])

<!-- NEW -->
const classes = computed(() => [
  'ax-button',
  `ax-button--${props.variant}`,
  `ax-button--${props.size}`,
  props.disabled && 'ax-button--disabled',
  props.loading && 'ax-button--loading',
  props.block && 'ax-button--block',
])
```

- [ ] **Step 3: Add AxIcon import**

Add to script setup:

```vue
import AxIcon from './AxIcon.vue'
```

- [ ] **Step 4: Remove VARIANT_CLASSES and SIZE_CLASSES**

Delete lines 6-17 (hardcoded Tailwind classes), CSS classes now in base.css

- [ ] **Step 5: Update component styles**

Replace scoped styles to use CSS variables:

```vue
<style scoped>
.ax-button--block {
  width: 100%;
}

/* Ripple effect styles remain unchanged */
.ax-ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ax-ripple-anim 600ms ease-out forwards;
  pointer-events: none;
}

.ax-ripple--light {
  background: rgba(255, 255, 255, 0.3);
}

.ax-ripple--dark {
  background: rgba(0, 0, 0, 0.12);
}

@keyframes ax-ripple-anim {
  to {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
```

- [ ] **Step 6: Test AxButton manually**

Create test file `test-button.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="src/components/ui/base.css">
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp } from 'vue'
    import AxButton from './src/components/ui/AxButton.vue'
    
    createApp({
      components: { AxButton },
      template: `
        <div style="padding: 20px; display: flex; gap: 10px;">
          <AxButton variant="primary">Primary</AxButton>
          <AxButton variant="outline">Outline</AxButton>
          <AxButton variant="ghost">Ghost</AxButton>
          <AxButton variant="danger">Danger</AxButton>
          <AxButton icon="settings" size="icon"></AxButton>
        </div>
      `
    }).mount('#app')
  </script>
</body>
</html>
```

Open in browser, verify all variants render correctly.

Delete test file after verification.

- [ ] **Step 7: Commit AxButton refactor**

```bash
git add src/components/ui/AxButton.vue
git commit -m "refactor(AxButton): replace Tailwind with semantic CSS, use AxIcon"
```

---

## Task 5: Refactor AxInput Component

**Files:**
- Modify: `src/components/ui/AxInput.vue`

**Parallel Support:** ✅ Can run in parallel with Task 4, 6 (separate subagent)

**Description:** Replace Tailwind classes with semantic CSS classes and Material Symbols with AxIcon.

- [ ] **Step 1: Replace icon with AxIcon**

In `src/components/ui/AxInput.vue` line 193, replace:

```vue
<!-- OLD -->
<span class="material-symbols-outlined" :class="ICON_SIZE_CLASSES[size]">
  {{ passwordVisible ? 'visibility' : 'visibility_off' }}
</span>

<!-- NEW -->
<AxIcon 
  :name="passwordVisible ? 'visibility' : 'visibility_off'" 
  :size="iconSizeMap[size]" 
/>
```

- [ ] **Step 2: Add icon size mapping**

Add computed property:

```typescript
const iconSizeMap: Record<InputSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
}
```

- [ ] **Step 3: Replace Tailwind classes with semantic classes**

Replace `inputClasses` and `textareaClasses` computed:

```typescript
const inputClasses = computed(() => [
  'ax-input',
  `ax-input--${props.size}`,
  props.disabled && 'ax-input--disabled',
])

const textareaClasses = computed(() => [
  'ax-input',
  'ax-input--textarea',
  `ax-input--${props.size}`,
  props.disabled && 'ax-input--disabled',
  `ax-input--resize-${props.resize}`,
])
```

- [ ] **Step 4: Add AxIcon import**

```vue
import AxIcon from './AxIcon.vue'
```

- [ ] **Step 5: Remove ROUNDED_CLASSES, CONTROL_SIZE_CLASSES imports**

Delete line 4, no longer needed.

- [ ] **Step 6: Update scoped styles**

```vue
<style scoped>
.ax-input--textarea {
  resize: vertical;
}
.ax-input--resize-none {
  resize: none;
}
.ax-input--resize-horizontal {
  resize: horizontal;
}
.ax-input--resize-both {
  resize: both;
}
</style>
```

- [ ] **Step 7: Commit AxInput refactor**

```bash
git add src/components/ui/AxInput.vue
git commit -m "refactor(AxInput): replace Tailwind with semantic CSS, use AxIcon"
```

---

## Task 6: Refactor Remaining Components (Parallel Batch)

**Files:**
- Modify: `src/components/ui/AxSelect.vue` (10 icon occurrences)
- Modify: `src/components/ui/AxAlert.vue` (4 icon types)
- Modify: `src/components/ui/AxDialog.vue` (1 close icon)
- Modify: `src/components/ui/AxImage.vue` (3 icon states)
- Modify: `src/components/ui/AxImageViewer.vue` (8 control icons)
- Modify: `src/components/ui/AxJsonViewer.vue` (1 expand icon)
- Modify: `src/components/ui/AxTooltip.vue` (Tailwind only)
- Modify: `src/components/ui/AxSlider.vue` (Tailwind only)
- Modify: `src/components/ui/AxSwitch.vue` (Tailwind only)
- Modify: `src/components/ui/AxDropdown.vue` (Tailwind only)
- Modify: `src/components/ui/AxPropPanel.vue` (Tailwind only)

**Parallel Support:** ✅ Can run in parallel with Task 4, 5 (separate subagent)

**Strategy:** Use subagent to process all 11 components following same pattern as Task 4 & 5.

**Description:** Batch refactor all remaining components to remove Tailwind and use AxIcon.

- [ ] **Step 1: Create refactor checklist**

For each component, perform:
1. Import AxIcon
2. Replace all `material-symbols-outlined` with `<AxIcon :name="..." />`
3. Replace Tailwind utility classes with semantic `ax-*` classes
4. Remove imports of ROUNDED_CLASSES, CONTROL_SIZE_CLASSES
5. Update scoped styles to use CSS variables
6. Test component renders correctly

- [ ] **Step 2: Refactor AxSelect.vue**

Icon replacements (10 occurrences):
- Line 286: `close` icon in tag remove button
- Line 294: `expand_more` dropdown arrow
- Line 310: `close` icon in selected tags
- Line 365: `close` clear button
- Line 369: `expand_more` dropdown arrow
- Line 422: `check` icon for selected items

Replace Tailwind classes with:
- `.ax-select-trigger`
- `.ax-select-tag`
- `.ax-select-option`
- `.ax-select-option--selected`
- `.ax-select-option--highlighted`

- [ ] **Step 3: Refactor AxAlert.vue**

Icon replacements (4 types):
- Line 92: Type-specific icons (info/check_circle/warning/error)

```vue
<AxIcon :name="iconMap[type]" :size="20" />
```

Add computed:
```typescript
const iconMap = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
}
```

Replace Tailwind with `.ax-alert`, `.ax-alert--{type}` classes.

- [ ] **Step 4: Refactor AxDialog.vue**

Icon replacement:
- Line 152: `close` icon

Replace Tailwind with:
- `.ax-dialog`
- `.ax-dialog-overlay`
- `.ax-dialog-content`
- `.ax-dialog-header`
- `.ax-dialog-footer`

- [ ] **Step 5: Refactor AxImage.vue**

Icon replacements (3 states):
- Line 104: `broken_image` for error state
- `image` for loading placeholder
- `zoom_in` for hover preview

- [ ] **Step 6: Refactor AxImageViewer.vue**

Icon replacements (8 controls):
- Line 158 and throughout: `close`, `chevron_left`, `chevron_right`, `download`, `rotate_left`, `rotate_right`, `flip`, `zoom_in`, `zoom_out`

- [ ] **Step 7: Refactor AxJsonViewer.vue**

Icon replacement:
- Line 225: `expand_more` for expand/collapse

- [ ] **Step 8: Refactor remaining components (no icons)**

AxTooltip, AxSlider, AxSwitch, AxDropdown, AxPropPanel:
- Replace Tailwind classes with semantic classes
- Update scoped styles to use CSS variables

- [ ] **Step 9: Test all components together**

Create comprehensive test page with all components, verify rendering.

- [ ] **Step 10: Commit all component refactors**

```bash
git add src/components/ui/Ax*.vue
git commit -m "refactor(components): replace Tailwind with semantic CSS, use AxIcon in all components"
```

---
## Task 7: Update Plugin and Configure NPM Package

**Files:**
- Modify: `package.json`
- Modify: `src/components/ui/plugin.ts`
- Modify: `src/components/ui/plugin.cdn.ts`
- Modify: `src/components/ui/index.ts`
- Create: `vite.config.lib.ts`
- Create: `tsconfig.lib.json`
- Create: `.npmignore`
- Create: `LICENSE`

**Parallel Support:** ❌ Must run sequentially (depends on Task 1-6)

**Description:** Configure package for npm publishing with theme initialization, proper exports, and build configuration.

- [ ] **Step 1: Update plugin.ts to initialize theme**

Modify `src/components/ui/plugin.ts`:

```typescript
import type { App } from 'vue'
import { ThemeEngine } from '../../theme/engine'
import type { ThemeConfig } from '../../theme/types'
import { registerIcons } from '../../icons'
import type { IconDefinition } from '../../icons'

// Import base CSS
import './base.css'

// Import all components
import AxButton from './AxButton.vue'
import AxInput from './AxInput.vue'
import AxIcon from './AxIcon.vue'
// ... import all other components

export interface AxiomUIOptions {
  theme?: ThemeConfig | 'material' | 'fluent' | 'ios'
  icons?: Record<string, IconDefinition>
}

const AxiomUI = {
  install(app: App, options: AxiomUIOptions = {}) {
    // 1. Initialize theme engine
    const themeEngine = new ThemeEngine(options.theme || 'material')
    themeEngine.apply()
    
    // 2. Register custom icons if provided
    if (options.icons) {
      registerIcons(options.icons)
    }
    
    // 3. Register all components
    app.component('AxButton', AxButton)
    app.component('AxInput', AxInput)
    app.component('AxIcon', AxIcon)
    // ... register all other components
    
    // 4. Provide theme engine for runtime access
    app.provide('$axiomTheme', themeEngine)
  },
}

export default AxiomUI
```

- [ ] **Step 2: Update plugin.cdn.ts for CDN usage**

Modify `src/components/ui/plugin.cdn.ts` (same as plugin.ts but ensure no dev dependencies).

- [ ] **Step 3: Update index.ts to export theme and icons**

Modify `src/components/ui/index.ts`:

```typescript
// Theme exports
export { ThemeEngine } from '../../theme/engine'
export { themePresets, materialTheme, fluentTheme, iosTheme } from '../../theme/presets'
export type * from '../../theme/types'

// Icon exports
export { registerIcons, getIcon, getAllIcons } from '../../icons'
export type { IconDefinition } from '../../icons'

// Component exports (existing)
export {
  AxButton,
  AxInput,
  AxIcon,
  // ... all other components
}

// Plugin export
export { default as AxiomUI } from './plugin'

// Hooks exports (existing)
export { useNotify } from './hooks/useNotify'
export { useFloating } from './hooks/useFloating'
```

- [ ] **Step 4: Update package.json**

Replace current `package.json` content:

```json
{
  "name": "axui",
  "version": "1.0.0",
  "description": "Independent Vue 3 UI component library with theme system and embedded SVG icons",
  "type": "module",
  "main": "./dist/axui.umd.js",
  "module": "./dist/axui.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/axui.es.js",
      "require": "./dist/axui.umd.js"
    },
    "./style.css": "./dist/style.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "vue",
    "vue3",
    "ui",
    "components",
    "component-library",
    "theme",
    "typescript"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/axui"
  },
  "bugs": {
    "url": "https://github.com/yourusername/axui/issues"
  },
  "homepage": "https://github.com/yourusername/axui#readme",
  "scripts": {
    "dev": "vite",
    "build": "npm run build:lib && npm run build:types",
    "build:lib": "vite build --config vite.config.lib.ts",
    "build:types": "vue-tsc --declaration --emitDeclarationOnly --outDir dist -p tsconfig.lib.json",
    "build:cdn": "vite build --config vite.config.cdn.ts",
    "preview": "vite preview",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "dependencies": {
    "@floating-ui/dom": "^1.7.6",
    "@floating-ui/vue": "^1.1.11",
    "@vueuse/core": "^14.3.0",
    "vue-sonner": "^2.0.9"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.6",
    "@vue/tsconfig": "^0.9.1",
    "typescript": "~6.0.2",
    "vite": "^8.0.12",
    "vue": "^3.5.34",
    "vue-tsc": "^3.2.8"
  }
}
```

- [ ] **Step 5: Create vite.config.lib.ts**

Create `vite.config.lib.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/ui/index.ts'),
      name: 'AxiomUI',
      formats: ['es', 'umd'],
      fileName: (format) => `axui.${format}.js`
    },
    
    rollupOptions: {
      // Externalize peer dependencies
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        // Polyfill for UMD require
        intro: 'var require=function(m){return m==="vue"?window.Vue||Vue:undefined};',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name
        }
      }
    },
    
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015',
    outDir: 'dist'
  }
})
```

- [ ] **Step 6: Create tsconfig.lib.json**

Create `tsconfig.lib.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./dist",
    "emitDeclarationOnly": true,
    "composite": false,
    "outDir": "./dist"
  },
  "include": [
    "src/components/ui/**/*",
    "src/theme/**/*",
    "src/icons/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "src/components/ui/layout/**/*"
  ]
}
```

- [ ] **Step 7: Create .npmignore**

Create `.npmignore`:

```
# Source files
src/
scripts/
skills/
docs/

# Development files
.git/
.github/
.vscode/
.cursor/
.husky/
.workbuddy/
.codegraph/

# Config files
vite.config.ts
vite.config.cdn.ts
vite.config.lib.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
tsconfig.lib.json
pnpm-lock.yaml
pnpm-workspace.yaml
bun.lock
package-lock.json

# Build artifacts
dist-cdn/
node_modules/

# Misc
*.log
.DS_Store
*.html
index.html
cdn-demo.html
```

- [ ] **Step 8: Create LICENSE file**

Create `LICENSE`:

```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 9: Verify package structure**

```bash
# Check all exports are valid
npx publint
```

Expected: No errors

- [ ] **Step 10: Commit NPM configuration**

```bash
git add package.json vite.config.lib.ts tsconfig.lib.json .npmignore LICENSE src/components/ui/plugin.ts src/components/ui/index.ts
git commit -m "feat(build): configure npm package with theme system integration"
```

---

## Task 8: Generate TypeScript Declarations

**Files:**
- Generate: `dist/*.d.ts` (multiple declaration files)

**Parallel Support:** ❌ Must run sequentially (depends on Task 7)

**Description:** Generate TypeScript declaration files for full IDE support.

- [ ] **Step 1: Build library with types**

```bash
npm run build
```

This runs both `build:lib` and `build:types` scripts.

- [ ] **Step 2: Verify TypeScript declarations**

```bash
ls dist/
```

Expected output should include:
- `axui.es.js`
- `axui.umd.js`
- `style.css`
- `index.d.ts`
- `types.d.ts`
- Other `.d.ts` files

- [ ] **Step 3: Test types in consuming project**

Create test TypeScript file `type-test.ts`:

```typescript
import { AxiomUI, ThemeEngine, registerIcons } from './dist/index'
import type { ThemeConfig, IconDefinition } from './dist/index'

// Test theme types
const config: ThemeConfig = {
  colors: {
    primary: '#3b82f6'
  }
}

const engine = new ThemeEngine(config)
engine.apply()

// Test icon types
const customIcon: IconDefinition = {
  name: 'test',
  path: 'M12 2L2 7v10l10 5 10-5V7L12 2z'
}

registerIcons({ test: customIcon })
```

Run: `npx tsc --noEmit type-test.ts`

Expected: No errors

Delete `type-test.ts` after verification.

- [ ] **Step 4: Verify bundle sizes**

```bash
ls -lh dist/
```

Expected sizes (approximate):
- `axui.es.js`: ~80-100KB
- `axui.umd.js`: ~85-105KB
- `style.css`: ~15-20KB

- [ ] **Step 5: Commit TypeScript declarations**

```bash
git add dist/
git commit -m "build: generate TypeScript declarations"
```

---

## Task 9: Write User Documentation

**Files:**
- Modify: `README.md`
- Create: `CHANGELOG.md`

**Parallel Support:** ✅ Can run parallel with Task 8 (separate subagent)

**Description:** Create comprehensive user-facing documentation for npm package.

- [ ] **Step 1: Rewrite README.md**

Replace `README.md` content:

```markdown
# AxUI

Independent Vue 3 UI component library with JavaScript-configurable theme system and embedded SVG icons. Zero external CSS dependencies.

## Features

- 🎨 **Theme System** - JavaScript-configurable with CSS variables, includes Material Design preset
- 🎯 **13 Components** - Button, Input, Select, Dialog, Alert, and more
- 📦 **Zero Dependencies** - No Tailwind or external icon fonts required
- 🚀 **CDN Ready** - Use via npm or `<script>` tag
- 📘 **TypeScript** - Full type definitions included
- 🎭 **Icon System** - 28+ embedded SVG icons, user-extensible

## Installation

### NPM

```bash
npm install axui
```

### CDN

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3"></script>

<!-- AxUI -->
<link rel="stylesheet" href="https://unpkg.com/axui/dist/style.css">
<script src="https://unpkg.com/axui/dist/axui.umd.js"></script>
```

## Quick Start

### ESM Import

```typescript
import { createApp } from 'vue'
import AxiomUI from 'axui'
import 'axui/style.css'

const app = createApp(App)
app.use(AxiomUI)
app.mount('#app')
```

### CDN Usage

```html
<div id="app">
  <ax-button variant="primary">Click Me</ax-button>
</div>

<script>
  const { createApp } = Vue
  createApp({}).use(AxiomUI).mount('#app')
</script>
```

## Theme Configuration

### Use Preset Theme

```typescript
app.use(AxiomUI, {
  theme: 'material'  // or 'fluent', 'ios'
})
```

### Custom Theme

```typescript
app.use(AxiomUI, {
  theme: {
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
    },
    radius: {
      button: '12px',
    },
    shadows: {
      button: '0 4px 12px rgba(59, 130, 246, 0.3)',
    }
  }
})
```

### Runtime Theme Switching

```vue
<script setup>
import { inject } from 'vue'

const themeEngine = inject('$axiomTheme')

function switchTheme() {
  themeEngine.update({
    colors: { primary: '#ef4444' }
  })
}
</script>
```

## Custom Icons

```typescript
import { registerIcons } from 'axui'

app.use(AxiomUI, {
  icons: {
    'logo': {
      name: 'logo',
      path: 'M12 2L2 7v10c0 5.55 3.84 10.74 9 12...',
      viewBox: '0 0 24 24'
    },
    'custom': {
      name: 'custom',
      html: '<circle cx="12" cy="12" r="10"/><path d="..."/>',
    }
  }
})
```

## Components

| Component | Description |
|-----------|-------------|
| `AxButton` | Button with variants: primary, outline, ghost, danger |
| `AxInput` | Input field with password toggle, prefix/suffix slots |
| `AxSelect` | Single/multi select with search |
| `AxDropdown` | Dropdown menu with click/hover/contextmenu triggers |
| `AxDialog` | Modal dialog with focus trap |
| `AxAlert` | Alert messages (info, success, warning, error) |
| `AxSlider` | Range slider |
| `AxTooltip` | Hover tooltip |
| `AxSwitch` | Toggle switch |
| `AxImage` | Lazy-loaded image with preview |
| `AxJsonViewer` | Collapsible JSON tree viewer |
| `AxImageViewer` | Full-screen image gallery with zoom/rotate |
| `AxIcon` | SVG icon component |

## API Documentation

### AxButton

```vue
<AxButton
  variant="primary | outline | ghost | danger"
  size="xs | sm | md | lg | xl | icon"
  :disabled="false"
  :loading="false"
  icon="icon-name"
  @click="handler"
>
  Button Text
</AxButton>
```

### AxInput

```vue
<AxInput
  v-model="value"
  type="text | password"
  placeholder="Enter text"
  size="xs | sm | md | lg"
  :disabled="false"
>
  <template #prefix>Icon</template>
  <template #suffix>Button</template>
</AxInput>
```

*(Full API docs for all components...)*

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

## License

MIT © 2026

## Contributing

Issues and PRs welcome at [GitHub](https://github.com/yourusername/axui)
```

- [ ] **Step 2: Create CHANGELOG.md**

Create `CHANGELOG.md`:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-05

### Added
- Initial release
- 13 core UI components
- JavaScript-configurable theme system with Material Design preset
- Embedded SVG icon system (28 core icons)
- Full TypeScript support
- CDN and ESM support
- Zero external CSS dependencies (removed Tailwind)

### Components
- AxButton - Button with 4 variants and 6 sizes
- AxInput - Input field with password toggle
- AxSelect - Single/multi select with search
- AxDropdown - Dropdown menu with multiple trigger modes
- AxDialog - Modal dialog with focus lock
- AxAlert - Alert component with 4 types
- AxSlider - Range slider
- AxTooltip - Hover tooltip
- AxSwitch - Toggle switch
- AxImage - Image with lazy loading and preview
- AxJsonViewer - JSON tree viewer
- AxImageViewer - Image gallery with zoom/rotate
- AxIcon - SVG icon component

### Breaking Changes
- Removed Tailwind CSS dependency
- Replaced Material Symbols with embedded SVG icons
- New semantic CSS class naming (`ax-*` prefix)
```

- [ ] **Step 3: Commit documentation**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: add user documentation and changelog"
```

---

## Task 10: Local Testing and NPM Publishing

**Files:**
- N/A (testing and publishing only)

**Parallel Support:** ❌ Must run sequentially (final step)

**Description:** Test package locally with npm link, then publish to npm registry.

- [ ] **Step 1: Build final production bundle**

```bash
npm run build
```

Verify output in `dist/`:
- `axui.es.js`
- `axui.umd.js`
- `style.css`
- `index.d.ts`
- Other `.d.ts` files

- [ ] **Step 2: Test package locally with npm link**

```bash
# In axui project
npm link

# In a test project
mkdir ../test-axui-project
cd ../test-axui-project
npm init -y
npm install vue
npm link axui
```

Create test file `../test-axui-project/test.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
        "axui": "/node_modules/axui/dist/axui.es.js"
      }
    }
  </script>
  <link rel="stylesheet" href="/node_modules/axui/dist/style.css">
</head>
<body>
  <div id="app">
    <ax-button variant="primary" @click="count++">Count: {{ count }}</ax-button>
  </div>
  
  <script type="module">
    import { createApp } from 'vue'
    import AxiomUI from 'axui'
    
    createApp({
      data() {
        return { count: 0 }
      }
    })
    .use(AxiomUI, { theme: 'material' })
    .mount('#app')
  </script>
</body>
</html>
```

Serve with: `npx live-server`

Verify:
- Button renders with correct styles
- Theme colors apply
- Click increments counter
- No console errors

- [ ] **Step 3: Test CDN bundle**

Create `../test-axui-project/test-cdn.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <link rel="stylesheet" href="/node_modules/axui/dist/style.css">
  <script src="/node_modules/axui/dist/axui.umd.js"></script>
</head>
<body>
  <div id="app">
    <ax-button variant="primary">Primary</ax-button>
    <ax-button variant="outline">Outline</ax-button>
    <ax-input v-model="text" placeholder="Type..."></ax-input>
    <p>{{ text }}</p>
  </div>
  
  <script>
    const { createApp } = Vue
    createApp({
      data() {
        return { text: '' }
      }
    })
    .use(AxiomUI)
    .mount('#app')
  </script>
</body>
</html>
```

Serve and verify all components work in UMD mode.

- [ ] **Step 4: Test TypeScript integration**

Create `../test-axui-project/test-types.ts`:

```typescript
import { AxiomUI, ThemeEngine, registerIcons } from 'axui'
import type { ThemeConfig, IconDefinition } from 'axui'

const config: ThemeConfig = {
  colors: {
    primary: '#3b82f6'
  }
}

const icon: IconDefinition = {
  name: 'test',
  path: 'M12 2L2 7v10l10 5 10-5V7L12 2z'
}
```

Run: `npx tsc --noEmit test-types.ts`

Expected: No TypeScript errors

- [ ] **Step 5: Verify package contents**

```bash
cd ../../axui
npm pack --dry-run
```

Review output, ensure only necessary files included:
- ✅ `dist/` directory
- ✅ `README.md`
- ✅ `LICENSE`
- ✅ `package.json`
- ❌ `src/` (should be excluded)
- ❌ `node_modules/` (should be excluded)

- [ ] **Step 6: Create git tag for release**

```bash
git tag v1.0.0
git push origin v1.0.0
git push origin main
```

- [ ] **Step 7: Login to npm**

```bash
npm login
```

Enter npm credentials when prompted.

- [ ] **Step 8: Publish to npm (dry-run first)**

```bash
npm publish --dry-run
```

Review output, verify package contents.

- [ ] **Step 9: Publish to npm**

```bash
npm publish --access public
```

Expected output:
```
+ axui@1.0.0
```

- [ ] **Step 10: Verify package on npm**

Visit: `https://www.npmjs.com/package/axui`

Verify:
- ✅ Package page loads
- ✅ README displays correctly
- ✅ Files tab shows dist/ contents
- ✅ Version is 1.0.0

- [ ] **Step 11: Test installation from npm**

```bash
cd ../test-from-npm
npm init -y
npm install axui
```

Create quick test file and verify it works.

- [ ] **Step 12: Test CDN availability**

Wait 5-10 minutes for CDN propagation, then test:

```html
<script src="https://unpkg.com/axui@1.0.0/dist/axui.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/axui@1.0.0/dist/style.css">
```

Visit: `https://unpkg.com/axui@1.0.0/`

Verify all files accessible.

- [ ] **Step 13: Update repository README**

Add npm badge to README:

```markdown
[![npm version](https://img.shields.io/npm/v/axui.svg)](https://www.npmjs.com/package/axui)
[![npm downloads](https://img.shields.io/npm/dm/axui.svg)](https://www.npmjs.com/package/axui)
```

- [ ] **Step 14: Final commit**

```bash
git add README.md
git commit -m "docs: add npm badges"
git push origin main
```

---

## Implementation Summary

**Total Tasks:** 10 major tasks
**Estimated Time:** 5-7 days
**Parallel Support:** Tasks 4, 5, 6 can run simultaneously (3 subagents)

**Execution Recommendation:**

Use `superpowers:subagent-driven-development` for optimal workflow:

1. **Sequential Phase (Tasks 1-3):** Foundation - theme system, icons, base CSS
2. **Parallel Phase (Tasks 4-6):** Component refactoring - dispatch 3 subagents
3. **Sequential Phase (Tasks 7-8):** NPM config and TypeScript declarations
4. **Parallel Phase (Task 9):** Documentation (can overlap with Task 8)
5. **Sequential Phase (Task 10):** Testing and publishing

**Key Deliverables:**
- ✅ Tailwind-independent component library
- ✅ JavaScript-configurable theme system
- ✅ 28+ embedded SVG icons
- ✅ Full TypeScript support
- ✅ NPM package: `axui@1.0.0`
- ✅ CDN-ready UMD bundle
- ✅ Comprehensive user documentation

**Post-Launch:**
- Monitor npm download stats
- Address user feedback and bug reports
- Plan v1.1.0 with additional components/features

---

## Appendix: Subagent Usage Guide

### When to Use Subagents

**✅ Use Subagents:**
- Tasks 4, 5, 6 (component refactoring) - Independent, parallel work
- Task 9 (documentation) - Can write while Task 8 builds

**❌ Don't Use Subagents:**
- Tasks 1-3 (foundation) - Sequential dependencies
- Task 7-8 (configuration) - Requires coordinated changes
- Task 10 (publishing) - Linear verification steps

### Launching Parallel Subagents

For Tasks 4-6, use this command:

```bash
# Task 4: AxButton
opencode agent --task="Refactor AxButton: replace Tailwind with semantic CSS, use AxIcon" --skill=subagent-driven-development

# Task 5: AxInput  
opencode agent --task="Refactor AxInput: replace Tailwind with semantic CSS, use AxIcon" --skill=subagent-driven-development

# Task 6: Remaining components
opencode agent --task="Refactor remaining 11 components: replace Tailwind with semantic CSS, use AxIcon" --skill=subagent-driven-development
```

**Maximum Concurrent:** 3 subagents (Tasks 4, 5, 6)

### Monitoring Progress

Each subagent will:
1. Read the task description
2. Execute step-by-step
3. Commit changes atomically
4. Report completion

Review each subagent's output before proceeding to Task 7.

---

**END OF PLAN**
