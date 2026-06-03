import type { App } from 'vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import 'material-symbols/outlined.css'
import '@fontsource/geist/400.css'
import '@fontsource/geist/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '../../style.css'

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
import { FloatingBall } from './functional'

const AxiomUI = {
  install(app: App) {
    // 注册所有基础组件
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
    app.component('AxFloatingBall', FloatingBall)

    // 注册 Toaster 通知容器（可选，用户可以不使用）
    app.component('Toaster', Toaster)
  },
}

export default AxiomUI

// 同时导出单个组件供按需使用
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
  FloatingBall,
  Toaster,
}

export { useNotify } from './hooks/useNotify'
export { useFloating } from './hooks/useFloating'
export { provideTeleportTarget, useTeleportTarget } from './hooks/useTeleportTarget'
