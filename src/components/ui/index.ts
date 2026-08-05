import { registerIcons } from '../../icons'
import { builtinIcons } from '../../icons/builtin'

// Auto-register all builtin icons on module load
registerIcons(builtinIcons)
import type { App } from 'vue'
import AxButton from './AxButton.vue'
import AxInput from './AxInput.vue'
import AxSlider from './AxSlider.vue'
import AxTooltip from './AxTooltip.vue'
import AxAlert from './AxAlert.vue'
import AxDropdown from './AxDropdown.vue'
import AxSelect from './AxSelect.vue'
import AxDialog from './AxDialog.vue'
import AxPropPanel from './AxPropPanel.vue'
import AxSwitch from './AxSwitch.vue'
import AxImage from './AxImage.vue'
import AxJsonViewer from './AxJsonViewer.vue'
import AxImageViewer from './AxImageViewer.vue'
import AxIcon from './AxIcon.vue'

const components = {
  AxButton,
  AxInput,
  AxSlider,
  AxTooltip,
  AxAlert,
  AxDropdown,
  AxSelect,
  AxDialog,
  AxPropPanel,
  AxSwitch,
  AxImage,
  AxJsonViewer,
  AxImageViewer,
  AxIcon,
}

export function registerComponents(app: App) {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
}

export {
  AxButton,
  AxInput,
  AxSlider,
  AxTooltip,
  AxAlert,
  AxDropdown,
  AxSelect,
  AxDialog,
  AxPropPanel,
  AxSwitch,
  AxImage,
  AxJsonViewer,
  AxImageViewer,
  AxIcon,
}

export { default as AxiomUI } from './plugin'

export { useNotify } from './hooks/useNotify'
export { useFloating } from './hooks/useFloating'
export { provideTeleportTarget, useTeleportTarget } from './hooks/useTeleportTarget'
export type * from './types'

export { registerIcons, getIcon, getAllIcons } from '../../icons'
export type { IconDefinition } from '../../icons'

export { ThemeEngine, materialTheme, fluentTheme, iosTheme } from '../../theme'
export type {
  ThemeColors,
  ThemeSpacing,
  ThemeRadius,
  ThemeShadows,
  ThemeBorders,
  ThemeTypography,
  TypographyScale,
  AxiomTheme,
  DeepPartial,
  ThemeConfig,
} from '../../theme'

export * from './functional'
