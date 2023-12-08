import { defineConfig } from 'vitest/config'

const vitestConfig = defineConfig({
  test: {
    coverage: {
      provider: 'istanbul'
    }
  }
})

export default vitestConfig
