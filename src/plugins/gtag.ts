import type { App } from 'vue'
import { createGtag } from 'vue-gtag'
import { router } from './1.router'

export default function (app: App) {
  if (process.env.NODE_ENV === 'production') {
    const gtag = createGtag({
      tagId: 'G-HQFH04TH3D',
      pageTracker: {
        router,
      },
    })

    app.use(gtag)
  }
}
