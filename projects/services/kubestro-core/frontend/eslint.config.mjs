import { configApp } from 'eslint-config-kubestro'

export default configApp(import.meta.dirname, [
  { ignores: ['**/.react-router/**', '**/.__mf__temp/**', '**/build/**'] }
])
