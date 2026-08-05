import type { App } from 'vue'
import { registerIcons } from '../../icons'
import { builtinIcons } from '../../icons/builtin'
// import { Toaster } from 'vue-sonner'
// import 'vue-sonner/style.css'
import './base.css'
import 'vue-sonner/style.css'
import { ThemeEngine } from '../../theme'
import type { ThemeConfig } from '../../theme'

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
import { FloatingBall } from './functional'
import { useNotify } from './hooks/useNotify'
import { useFloating } from './hooks/useFloating'
import { provideTeleportTarget, useTeleportTarget } from './hooks/useTeleportTarget'

const _hooks = { useNotify, useFloating, provideTeleportTarget, useTeleportTarget }

const AxiomUI = {
  install(app: App, options?: { theme?: ThemeConfig }) {
    const engine = new ThemeEngine(options?.theme)
    engine.apply()

    // Register all builtin SVG icons
    registerIcons(builtinIcons)

    app.component('AxButton', AxButton)
    app.component('AxInput', AxInput)
    app.component('AxSlider', AxSlider)
    app.component('AxTooltip', AxTooltip)
    app.component('AxAlert', AxAlert)
    app.component('AxDropdown', AxDropdown)
    app.component('AxSelect', AxSelect)
    app.component('AxDialog', AxDialog)
    app.component('AxPropPanel', AxPropPanel)
    app.component('AxSwitch', AxSwitch)
    app.component('AxImage', AxImage)
    app.component('AxJsonViewer', AxJsonViewer)
    app.component('AxImageViewer', AxImageViewer)
    app.component('AxIcon', AxIcon)
    app.component('AxFloatingBall', FloatingBall)
    // app.component('Toaster', Toaster)
  },

  ..._hooks,
}

export default AxiomUI
