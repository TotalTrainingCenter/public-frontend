import type { App } from 'vue'
import { createHead } from '@unhead/vue/client'

export default function (app: App) {
  app.use(createHead())
}
