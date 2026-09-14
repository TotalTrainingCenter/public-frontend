<script setup lang="ts">
const inflight = ref(0)

const visible = ref(false)
const progress = ref(0)

const router = useRouter()
const isNavigating = ref(false)
let removeBeforeEach: (() => void) | null = null
let removeAfterEach: (() => void) | null = null

let tick: number | null = null
let startTimer: number | null = null
let originalFetch: typeof fetch | null = null

const start = () => {
  visible.value = true
  progress.value = 0.08
  if (tick)
    window.clearInterval(tick)
  tick = window.setInterval(() => {
    if (progress.value < 0.9)
      progress.value = progress.value + (0.9 - progress.value) * 0.2 + 0.01
  }, 200)
}

const done = () => {
  progress.value = 1
  if (tick) {
    window.clearInterval(tick)
    tick = null
  }
  window.setTimeout(() => {
    visible.value = false
    progress.value = 0
  }, 200)
}

const inc = () => {
  inflight.value += 1
  if (inflight.value === 1) {
    if (startTimer)
      window.clearTimeout(startTimer)
    startTimer = window.setTimeout(start, 120)
  }
}

const dec = () => {
  inflight.value = Math.max(0, inflight.value - 1)
  if (inflight.value === 0) {
    if (startTimer) {
      window.clearTimeout(startTimer)
      startTimer = null
    }

    if (visible.value)
      done()
  }
}

const shouldTrack = (input: RequestInfo | URL, init?: RequestInit) => {
  if (isNavigating.value)
    return false

  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
  if (method === 'OPTIONS')
    return false

  const url = typeof input === 'string' ? input : (input instanceof URL) ? input.toString() : (input as Request)?.url

  if (!url)
    return true

  if (url.startsWith('ws:') || url.startsWith('wss:'))
    return false

  if (url.includes('/ws'))
    return false

  return !(url.startsWith('chrome-extension:'))
}

onMounted(() => {
  removeBeforeEach = router.beforeEach((to, from, next) => {
    isNavigating.value = true
    next()
  })
  removeAfterEach = router.afterEach(() => {
    // small delay so the app's own page indicator can complete without overlap
    window.setTimeout(() => {
      isNavigating.value = false
    }, 400)
  })

  originalFetch = globalThis.fetch
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const track = shouldTrack(input, init)
    if (track)
      inc()
    try {
      return await (originalFetch as typeof fetch)(input as any, init)
    }
    finally {
      if (track)
        dec()
    }
  }
})

onBeforeUnmount(() => {
  if (removeBeforeEach) {
    removeBeforeEach()
    removeBeforeEach = null
  }
  if (removeAfterEach) {
    removeAfterEach()
    removeAfterEach = null
  }

  if (originalFetch)
    globalThis.fetch = originalFetch

  if (tick) {
    window.clearInterval(tick)
    tick = null
  }
  if (startTimer) {
    window.clearTimeout(startTimer)
    startTimer = null
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="visible"
      class="loading-indicator"
    >
      <div
        class="loading-indicator__bar"
        :style="{ width: `${Math.floor(progress * 100)}%` }"
      />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.loading-indicator {
  position: fixed;
  z-index: 99999;
  block-size: 5px;
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
  pointer-events: none;

  &__bar {
    background: linear-gradient(90deg, rgba(59, 130, 246, 100%) 0%, rgba(99, 102, 241, 100%) 50%, rgba(236, 72, 153, 100%) 100%);
    block-size: 100%;
    box-shadow: 0 0 6px rgba(0, 0, 0, 15%);
    transition: inline-size 200ms ease;
  }
}
</style>
