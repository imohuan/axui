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
}

export { useNotify } from './hooks/useNotify'
export { useFloating } from './hooks/useFloating'
export type * from './types'

export * from './functional'
