import { customObjectCurlyNewline } from './rules/custom-object-curly-newline.js'

/**
 * @type {import('eslint').ESLint.Plugin}
 */
const customPlugin = {
  meta: {
    name: 'custom-rules'
  },
  rules: {
    'custom-object-curly-newline': customObjectCurlyNewline
  }
}
export default customPlugin
