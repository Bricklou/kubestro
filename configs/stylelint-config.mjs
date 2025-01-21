/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
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
        ],
      },
    ],
    'import-notation': 'string',
    'at-rule-no-deprecated': [
      true,
      {
        ignoreAtRules: [
          'apply',
        ],
      },
    ],
  },
}
