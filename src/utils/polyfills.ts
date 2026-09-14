if (!Array.prototype.at) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'at', {
    configurable: true,
    writable: true,
    value(index: number) {
      const length = this.length >>> 0
      const relativeIndex = Math.trunc(index) || 0
      const actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex

      return actualIndex < 0 || actualIndex >= length ? undefined : this[actualIndex]
    },
  })
}

if (!String.prototype.replaceAll) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(String.prototype, 'replaceAll', {
    configurable: true,
    writable: true,
    value(searchValue: string | RegExp, replaceValue: string) {
      if (searchValue instanceof RegExp) {
        if (!searchValue.global)
          throw new TypeError('String.prototype.replaceAll called with a non-global RegExp argument')

        return this.replace(searchValue, replaceValue)
      }

      return this.split(String(searchValue)).join(replaceValue)
    },
  })
}

if (!globalThis.structuredClone) {
  const clone = (value: any, seen = new WeakMap<object, any>()): any => {
    if (value === null || typeof value !== 'object')
      return value

    if (value instanceof Date)
      return new Date(value.getTime())

    if (value instanceof RegExp)
      return new RegExp(value.source, value.flags)

    if (seen.has(value))
      return seen.get(value)

    if (Array.isArray(value)) {
      const cloned: any[] = []

      seen.set(value, cloned)
      value.forEach((item, index) => {
        cloned[index] = clone(item, seen)
      })

      return cloned
    }

    if (value instanceof Map) {
      const cloned = new Map()

      seen.set(value, cloned)
      value.forEach((item, key) => {
        cloned.set(clone(key, seen), clone(item, seen))
      })

      return cloned
    }

    if (value instanceof Set) {
      const cloned = new Set()

      seen.set(value, cloned)
      value.forEach(item => {
        cloned.add(clone(item, seen))
      })

      return cloned
    }

    const cloned: Record<string, any> = {}

    seen.set(value, cloned)
    Object.keys(value).forEach(key => {
      cloned[key] = clone(value[key], seen)
    })

    return cloned
  }

  globalThis.structuredClone = clone
}
