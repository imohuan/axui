import { createApp } from 'vue'
import { Toaster } from 'vue-sonner'
import 'material-symbols/outlined.css'
import '@fontsource/geist'
import '@fontsource-variable/jetbrains-mono'
import 'vue-sonner/style.css'
import './style.css'
import App from './App.vue'
import { registerComponents } from './components/ui'

const app = createApp(App)
registerComponents(app)
app.component('Toaster', Toaster)
app.mount('#app')
