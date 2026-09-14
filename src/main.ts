import '@/utils/polyfills'

import { createApp } from 'vue'

import App from '@/App.vue'
import { setupAutoReloadOnStaleAssets } from '@core/utils/autoReloadOnStaleAssets'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

setupAutoReloadOnStaleAssets()

// Mount vue app
app.mount('#app')
