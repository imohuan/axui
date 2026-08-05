# Axiom UI

A self-developed Vue 3 component library with 13 components, built-in theme engine, and custom icon system. Built on Tailwind CSS v4 + Floating UI + Material Symbols.

## Features

- **Theme System** — Three built-in presets (Material, Fluent, iOS) plus full runtime customization via `ThemeEngine`. Override colors, spacing, radius, shadows, borders, and typography at any granularity.
- **13 Components** — Button, Input, Select, Dropdown, Dialog, Alert, Slider, Tooltip, Switch, Image, JsonViewer, ImageViewer, and PropPanel (schema-driven property panel).
- **Zero CSS Dependencies** — No external CSS imports required. All styles are compiled into a single `axiom-ui.css`.
- **CDN Ready** — Use directly in any HTML page via `<script>` and `<link>` tags. No build tools needed.
- **Full TypeScript Support** — All components, hooks, and theme APIs are fully typed with exported type definitions.
- **Custom Icon System** — Register SVG path icons at runtime. 27 built-in icons included. Supports `html`-based icons for complex SVGs.
- **Floating UI Positioning** — Dropdown, Select, and Tooltip use `@floating-ui/vue` for intelligent viewport-aware positioning.
- **Notify Hook** — Toast notification system powered by `vue-sonner` with `useNotify()` composable.
- **FloatingBall** — Draggable floating action button with dock-to-edge, theme switching, and expandable menu.

## Installation

### NPM

```bash
npm install axui
```

```bash
yarn add axui
```

```bash
pnpm add axui
```

```bash
bun add axui
```

### CDN

```html
<!-- Vue 3 (required peer dependency) -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>

<!-- Tailwind CSS (required for utility classes) -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Fonts -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/geist@5/400.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/geist@5/600.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/400.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/500.css" />

<!-- Material Symbols -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<!-- Axiom UI -->
<link rel="stylesheet" href="https://unpkg.com/axui/dist/axiom-ui.css" />
<script src="https://unpkg.com/axui/dist/axiom-ui.umd.js"></script>
```

## Quick Start

### ESM (Vite / Webpack)

```ts
// main.ts
import { createApp } from 'vue'
import AxiomUI from 'axui'
import 'axui/dist/axiom-ui.css'
import App from './App.vue'

const app = createApp(App)
app.use(AxiomUI)
app.mount('#app')
```

Then use components directly in your templates:

```vue
<template>
  <AxButton variant="primary">Click Me</AxButton>
  <AxInput v-model="text" placeholder="Type something..." />
  <AxAlert type="success">Operation completed!</AxAlert>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AxButton, AxInput, AxAlert } from 'axui'

const text = ref('')
</script>
```

Or use the plugin's auto-registration (no imports needed):

```vue
<template>
  <ax-button variant="primary">Click Me</ax-button>
  <ax-input v-model="text" placeholder="Type something..." />
</template>
```

### CDN (No Build Tools)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://unpkg.com/axui/dist/axiom-ui.css" />
  <script src="https://unpkg.com/axui/dist/axiom-ui.umd.js"></script>
</head>
<body>
  <div id="app">
    <ax-button variant="primary">Click Me</ax-button>
    <ax-input v-model="text" placeholder="Type..." />
  </div>
  <script>
    const { createApp, ref } = Vue
    createApp({ setup() { return { text: ref('') } } }).use(AxiomUI).mount('#app')
  </script>
</body>
</html>
```

## Theme Configuration

### Using a Preset

```ts
import { createApp } from 'vue'
import AxiomUI from 'axui'
import { materialTheme, fluentTheme, iosTheme } from 'axui'

const app = createApp(App)
app.use(AxiomUI, { theme: fluentTheme })
app.mount('#app')
```

### Custom Theme

```ts
import { createApp } from 'vue'
import AxiomUI from 'axui'

app.use(AxiomUI, {
  theme: {
    colors: {
      primary: '#1a73e8',
      onPrimary: '#ffffff',
      background: '#f8f9fa',
    },
    radius: {
      md: '8px',
      lg: '12px',
    },
    typography: {
      fontDisplay: 'Inter',
    },
  },
})
```

Only specify what you want to override — unspecified values fall back to the Material default.

### Runtime Theme Updates

```ts
import { ThemeEngine } from 'axui'

const engine = new ThemeEngine()

// Switch presets at runtime
engine.update(fluentTheme)

// Fine-grained runtime tweaks
engine.update({
  colors: { primary: '#ff6b35' },
  radius: { md: '12px' },
})

// Apply without updating the style tag yet
engine.update(config, false)

// Manually apply
engine.apply()

// Get current theme as object
const current = engine.getTheme()

// Get CSS variable string
const cssVars = engine.toCssVars()
```

The theme engine writes CSS custom properties to a `<style id="axiom-theme-vars">` element. All components reference these variables, so changes apply instantly.

## Custom Icons

Axiom UI ships with 27 built-in SVG icons. You can register additional icons at runtime:

```ts
import { registerIcons, getIcon, getAllIcons } from 'axui'
import type { IconDefinition } from 'axui'

const customIcons: IconDefinition[] = [
  {
    name: 'rocket',
    path: 'M12 2L2 22h6l4-4 4 4h6L12 2z',
    viewBox: '0 0 24 24',
  },
  // Complex icons can use html instead of path
  {
    name: 'brand-logo',
    html: '<circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10">A</text>',
    viewBox: '0 0 24 24',
  },
]

registerIcons(customIcons)

// Use in templates
// <AxIcon name="rocket" :size="24" />
```

Built-in icons: `close`, `expand_more`, `check`, `visibility`, `visibility_off`, `info`, `check_circle`, `warning`, `error`, `image`, `broken_image`, `zoom_in`, `zoom_out`, `chevron_left`, `chevron_right`, `download`, `rotate_left`, `rotate_right`, `flip`, `settings`, `menu`, `search`, `add`, `delete`, `edit`, `refresh`, `more_vert`, `more_horiz`, `arrow_back`.

## Components

| Component | Tag | Description |
|---|---|---|
| **AxButton** | `<AxButton>` / `<ax-button>` | Multi-variant button with ripple effect, loading state, icon support, and block mode |
| **AxInput** | `<AxInput>` / `<ax-input>` | Text input with password toggle, multiline textarea, prefix/suffix slots, and autocomplete |
| **AxSelect** | `<AxSelect>` / `<ax-select>` | Single/multi select with search, based on AxDropdown + useFloating |
| **AxDropdown** | `<AxDropdown>` / `<ax-dropdown>` | Dropdown menu with click/hover/contextmenu triggers and floating positioning |
| **AxDialog** | `<AxDialog>` / `<ax-dialog>` | Modal dialog with backdrop blur, focus trap, scroll lock, and #footer slot |
| **AxAlert** | `<AxAlert>` / `<ax-alert>` | Info/success/warning/error alert banners |
| **AxSlider** | `<AxSlider>` / `<ax-slider>` | Range slider with label, min/max, and step support |
| **AxTooltip** | `<AxTooltip>` / `<ax-tooltip>` | Hover tooltip with configurable placement (top/right/bottom/left) |
| **AxSwitch** | `<AxSwitch>` / `<ax-switch>` | Toggle switch with v-model, disabled state, and ARIA accessibility |
| **AxImage** | `<AxImage>` / `<ax-image>` | Lazy-loading image with loading/error/loaded states, click preview, and aspect ratio |
| **AxJsonViewer** | `<AxJsonViewer>` / `<ax-json-viewer>` | Collapsible JSON tree viewer with depth control, Ctrl+click recursive fold, and long text horizontal scroll |
| **AxImageViewer** | `<AxImageViewer>` / `<ax-image-viewer>` | Fullscreen image viewer with zoom, rotate, flip, keyboard shortcuts, and download |
| **AxPropPanel** | `<AxPropPanel>` / `<ax-prop-panel>` | Schema-driven property panel (switch/slider/select/input/textarea/segmented) |
| **AxIcon** | `<AxIcon>` / `<ax-icon>` | SVG icon renderer from the icon registry |
| **FloatingBall** | `<AxFloatingBall>` / `<ax-floating-ball>` | Draggable floating action button with dock-to-edge, theme toggle, and expandable menu |

### Hooks

| Hook | Description |
|---|---|
| `useNotify()` | Toast notification system. Returns `triggerNotify(message, type, title)`, `notificationHistory`, `clearLogs()` |
| `useFloating(ref, ref, opts)` | Floating UI positioning hook. Returns `floatingStyles`, `updatePosition`, `isPositioned` |
| `useTeleportTarget()` | Shadow DOM teleport target injection for Content Script environments |

## API Reference

### AxButton

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon' \| 'icon-lg'` | `'md'` | Button size. `icon` / `icon-lg` render icon-only buttons |
| `rounded` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Border radius |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinning loader, replaces content |
| `icon` | `string` | `''` | Material Symbols icon name (requires material-symbols stylesheet) |
| `iconSize` | `string` | `'16px'` | Icon font size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `block` | `boolean` | `false` | Full-width button |

**Events:** `click`

**Slots:** `default`, `prefix`, `suffix`

### AxInput

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| number` | `''` | Bound value (v-model) |
| `type` | `string` | `'text'` | HTML input type (text, email, number, etc.) |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the input |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Input size |
| `rounded` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Border radius |
| `password` | `boolean` | `false` | Enables password mode with visibility toggle |
| `autocomplete` | `string` | auto | HTML autocomplete attribute. Password fields default to `'new-password'` |
| `multiline` | `boolean` | `false` | Renders as `<textarea>` instead of `<input>` |
| `rows` | `number` | `3` | Textarea row count (multiline only) |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Textarea resize behavior (multiline only) |

**Events:** `update:modelValue`, `keydown`, `blur`, `focus`

**Slots:** `prefix`, `suffix`

**Exposed:** `focus()`, `inputRef`, `textareaRef`

## Browser Support

All modern browsers that support CSS custom properties and ES2015+:

- Chrome 63+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT — see [LICENSE](./LICENSE) for details.
