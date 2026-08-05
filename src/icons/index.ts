export interface IconDefinition {
  name: string
  path: string
  html?: string
  viewBox: string
}

const iconRegistry = new Map<string, IconDefinition>()

export function registerIcons(icons: IconDefinition[]) {
  for (const icon of icons) {
    iconRegistry.set(icon.name, icon)
  }
}

export function getIcon(name: string): IconDefinition | undefined {
  return iconRegistry.get(name)
}

export function getAllIcons(): IconDefinition[] {
  return Array.from(iconRegistry.values())
}
