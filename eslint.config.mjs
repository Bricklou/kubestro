import { configApp } from 'eslint-config-kubestro'

export default configApp(import.meta.dirname, {
  ignores: ['**/projects/**']
})
