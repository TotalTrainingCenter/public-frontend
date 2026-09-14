export function setupAutoReloadOnStaleAssets() {
  const key = 'app:reload-once'

  const reloadOnce = (reason: string) => {
    try {
      if (sessionStorage.getItem(key))
        return

      sessionStorage.setItem(key, '1')
    }
    catch {}

    console.warn('[auto-reload]', reason)
    window.location.reload()
  }

  const isChunkLoadIssue = (msg: string) => msg.includes('Failed to fetch dynamically imported module')
    || msg.includes('Importing a module script failed')
    || msg.includes('Loading chunk')
    || msg.includes('ChunkLoadError')

  window.addEventListener('unhandledrejection', e => {
    const msg = String((e.reason as any)?.message || e.reason || '')
    if (isChunkLoadIssue(msg))
      reloadOnce(`unhandledrejection: ${msg}`)
  })

  window.addEventListener(
    'error',
    e => {
      const t = e.target as any
      const url: string | undefined = t?.src || t?.href
      if (!url)
        return

      const isAppAsset: boolean = url.includes('/assets/') && (url.endsWith('.js') || url.endsWith('.css'))

      if (isAppAsset)
        reloadOnce(`resource error: ${url}`)
    },
    true,
  )
}
