# Changelog

All notable changes to Axiom UI will be documented in this file.

## [1.0.0] — 2025-01-XX

### Added

- **Theme Engine** — `ThemeEngine` class with CSS custom property output, three built-in presets (`materialTheme`, `fluentTheme`, `iosTheme`), deep partial merge for custom overrides, and runtime `update()` / `apply()` API.
- **Icon System** — `registerIcons()`, `getIcon()`, `getAllIcons()` API with 27 built-in SVG icons and support for `html`-based complex SVGs.
- **AxButton** — Multi-variant button (primary, outline, ghost, danger) with ripple effect, loading spinner, icon-only mode, block mode, and 7 sizes (xs–xl, icon, icon-lg).
- **AxInput** — Text input with password visibility toggle, multiline textarea mode, prefix/suffix slots, autocomplete resolution, and 5 sizes.
- **AxSelect** — Single and multi-select dropdown with search filtering, based on AxDropdown + `useFloating`.
- **AxDropdown** — Dropdown menu with click, hover, and contextmenu triggers, floating positioning, and menu width control.
- **AxDialog** — Modal dialog with backdrop blur, focus trap (Tab cycling), scroll lock, `#footer` slot, and `closeOnOverlay` option.
- **AxAlert** — Alert banners with info, success, warning, and error types.
- **AxSlider** — Range slider with label, min/max, step, and value display.
- **AxTooltip** — Hover tooltip with top/right/bottom/left placement via Floating UI.
- **AxSwitch** — Toggle switch with v-model, disabled state, ARIA accessibility, and 4 sizes.
- **AxImage** — Lazy-loading image with loading/error/loaded states, click-to-preview, hover zoom icon, and configurable object-fit.
- **AxJsonViewer** — Collapsible JSON tree viewer with depth control (-1/0/N), Ctrl+click recursive fold/unfold, long text horizontal scroll, and syntax-colored values.
- **AxImageViewer** — Fullscreen image viewer with zoom, rotate, flip, keyboard shortcuts (arrow keys, Escape), and download button.
- **AxPropPanel** — Schema-driven property panel supporting switch, slider, select, input, textarea, and segmented field types.
- **AxIcon** — SVG icon renderer that reads from the icon registry, with fallback display for missing icons.
- **FloatingBall** — Draggable floating action button with dock-to-edge behavior, light/dark theme toggle, and expandable action menu.
- **useNotify** — Toast notification composable wrapping vue-sonner with info/success/error/secondary types and notification history.
- **useFloating** — Floating UI positioning composable with reactive placement, offset, matchWidth, and arrow support.
- **useTeleportTarget** — Teleport target injection for Shadow DOM environments (Content Script).
- **Plugin System** — `app.use(AxiomUI, options)` auto-registers all 14 components + Toaster with optional theme config.
- **CDN Build** — Separate UMD + ESM build (`dist-cdn/`) for direct browser usage without build tools. Excludes Tailwind/fonts.
- **Library Build** — ES + UMD formats (`dist/`) with TypeScript declarations for npm consumption.
- **TypeScript** — Full type exports for all components, hooks, theme interfaces, and icon definitions.
- **Skill Distribution** — Components also distributed as an AI editor skill (`skills/ax-ui-kit/`) via `npx skills add`.

### Breaking Changes

- Initial release — no breaking changes.
