import vitestConfig from './vitest.config'

export default {
  test: {
    ...vitestConfig.test,
    include: ['**/src/*.spec.ts']
  }
}
