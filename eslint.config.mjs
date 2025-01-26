import { configApp } from '@kubestro/eslint-config'

export default configApp(import.meta.dirname, {
  ignores: ['**/projects/**']
})
