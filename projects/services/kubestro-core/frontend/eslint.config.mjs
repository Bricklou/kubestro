import { configApp } from '@kubestro/eslint-config'

export default configApp(import.meta.dirname, [
  { ignores: ['**/.react-router/**', '**/.__mf__temp/**', '**/build/**'] }
])
