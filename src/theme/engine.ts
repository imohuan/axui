import type { AxiomTheme, ThemeConfig } from './types'
import { materialTheme } from './presets'

export class ThemeEngine {
  private theme: AxiomTheme

  constructor(config?: ThemeConfig) {
    this.theme = this.mergeTheme(materialTheme, config ?? {})
  }

  apply(): void {
    const vars = this.themeToCssVars(this.theme)
    let styleEl = document.getElementById('axiom-theme-vars') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'axiom-theme-vars'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = `:root {\n${vars}\n}`
  }

  update(config: ThemeConfig, autoApply = true): void {
    this.theme = this.mergeTheme(this.theme, config)
    if (autoApply) {
      this.apply()
    }
  }

  toCssVars(): string {
    return this.themeToCssVars(this.theme)
  }

  getTheme(): Readonly<AxiomTheme> {
    return this.theme
  }

  private mergeTheme(base: AxiomTheme, overrides: ThemeConfig): AxiomTheme {
    const merged = structuredClone(base)
    if (overrides.colors) {
      Object.assign(merged.colors, overrides.colors)
    }
    if (overrides.spacing) {
      Object.assign(merged.spacing, overrides.spacing)
    }
    if (overrides.radius) {
      Object.assign(merged.radius, overrides.radius)
    }
    if (overrides.shadows) {
      Object.assign(merged.shadows, overrides.shadows)
    }
    if (overrides.borders) {
      Object.assign(merged.borders, overrides.borders)
    }
    if (overrides.typography) {
      Object.assign(merged.typography, overrides.typography)
    }
    return merged
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  private themeToCssVars(theme: AxiomTheme, prefix = 'ax'): string {
    const lines: string[] = []

    const walk = (obj: Record<string, unknown>, path: string[]) => {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = [...path, key]
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          walk(value as Record<string, unknown>, fullPath)
        } else {
          const varName = `--${prefix}-${fullPath.map(k => this.kebabCase(k)).join('-')}`
          lines.push(`  ${varName}: ${value};`)
        }
      }
    }

    walk(theme as unknown as Record<string, unknown>, [])
    return lines.join('\n')
  }
}
