/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-deprecated': [
      true,
      {
        ignoreAtRules: [
          'apply'
        ]
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'theme',
          'plugin',
          'source',
          'custom-variant'
        ]
      }
    ],
    'import-notation': 'string'
  }
}
