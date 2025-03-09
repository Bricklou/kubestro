import { configApp } from '@kubestro/eslint-config'

export default configApp(import.meta.dirname, [
  { ignores: ['**/.__mf__temp/**', '**/build/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-throw-literal': 'off',
      // FIX: `only-throw-error` rule is not working properly, so we need to disable it for now
      '@typescript-eslint/only-throw-error': 'off'
    }
  }
])
