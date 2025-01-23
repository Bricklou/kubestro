import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import stylistic from '@stylistic/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import customRules from './custom-plugin.js'

/*
 * TODO: enable when compatible with Tailwindcss 4
 * import tailwindcss from 'eslint-plugin-tailwindcss'
 */

/**
 * Configures ESLint to use an opinionated config tailored for
 * creating a Typescript & React application.
 *
 * You may pass additional config blocks as multiple arguments
 * to this function.
 *
 * @example
 * ```js
 * configApp(import.meta.dirname)
 *
 * configApp(import.meta.dirname, {
 *   files: ['src/**\/*.ts'],
 *   ignore: ['dist'],
 *   rules: {
 *   }
 * })
 * ````
 *
 * @param  {string} rootDir Path to the root directory of the project
 * @param  {import('typescript-eslint').ConfigWithExtends[]} configBlockToMerge Additional config blocks to merge
 */
export function configApp(rootDir, ...configBlockToMerge) {
  return tseslint.config(
    // Ignore the build output directory
    { ignores: ['dist'] },
    // Ignore unwanted files
    { ignores: ['**/node_modules/**'] },

    pluginJs.configs.recommended,
    tseslint.configs.strictTypeChecked,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    stylistic.configs['recommended-flat'],
    // ...tailwindcss.configs['flat/recommended'],

    {
      plugins: {
        'eslint': pluginJs,
        '@stylistic': stylistic,
        'unused-imports': unusedImports,
        'custom-rules': customRules
      }
    },

    {
      languageOptions: {
        parserOptions: {
          ecmaVersion: 'latest',
          projectService: true
        },
        globals: {
          ...globals.browser,
          ...globals.es2024
        }
      }
    },

    // Typescript configuration
    {
      files: ['**/*.{ts,tsx}'],
      extends: [tseslint.configs.strictTypeChecked],
      languageOptions: { parserOptions: { tsconfigRootDir: rootDir } },
      rules: {
        // Typescript ESLint rules
        '@typescript-eslint/array-type': 'warn',
        '@typescript-eslint/consistent-generic-constructors': 'warn',
        '@typescript-eslint/consistent-indexed-object-style': 'warn',
        '@typescript-eslint/consistent-type-assertions': 'warn',
        '@typescript-eslint/consistent-type-definitions': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': 'warn',
        '@typescript-eslint/explicit-member-accessibility': 'warn',
        '@typescript-eslint/method-signature-style': 'warn',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-unnecessary-qualifier': 'warn',
        '@typescript-eslint/no-useless-empty-export': 'warn',
        '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
        'prefer-destructuring': 'off',
        '@typescript-eslint/prefer-destructuring': 'warn',
        '@typescript-eslint/prefer-function-type': 'warn',
        '@typescript-eslint/prefer-includes': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'warn',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-regexp-exec': 'warn',
        '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        '@typescript-eslint/no-confusing-non-null-assertion': 'error',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/prefer-find': 'warn',
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'warn',
        'consistent-return': 'off',
        '@typescript-eslint/consistent-return': 'error',
        'default-param-last': 'off',
        '@typescript-eslint/default-param-last': 'error',
        'no-loop-func': 'off',
        '@typescript-eslint/no-loop-func': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'warn',
        '@typescript-eslint/no-unsafe-type-assertion': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/require-array-sort-compare': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error'

      }
    },

    // React configuration
    {
      files: ['**/*.tsx'],
      extends: [
        pluginReact.configs.flat.recommended,
        pluginReact.configs.flat['jsx-runtime'],
        jsxA11y.flatConfigs.strict
      ],
      plugins: { 'react-hooks': reactHooks },
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      settings: { react: { version: 'detect' } },
      rules: {
        ...reactHooks.configs.recommended.rules,

        // React rules
        'react/destructuring-assignment': 'warn',
        'react/function-component-definition': ['error',
          { namedComponents: 'function-declaration' }],
        'react/jsx-boolean-value': 'warn',
        'react/jsx-no-leaked-render': 'error',
        'react/jsx-no-useless-fragment': 'warn',
        'react/jsx-fragments': ['warn', 'syntax'],
        'react/no-arrow-function-lifecycle': 'error',
        'react/prefer-read-only-props': 'warn',
        'react/button-has-type': 'warn',
        'react/hook-use-state': 'warn',
        'react/iframe-missing-sandbox': 'error',
        'react/jsx-no-bind': 'error',
        'react/jsx-no-constructed-context-values': 'error',
        'react/jsx-no-script-url': 'error',
        'react/jsx-props-no-spread-multi': 'error',
        'react/no-invalid-html-attribute': 'error',
        'react/no-access-state-in-setstate': 'error',
        'react/no-danger': 'error',
        'react/no-namespace': 'error',
        'react/no-this-in-sfc': 'error',
        'react/no-unstable-nested-components': 'error',
        'react/no-unused-state': 'warn',
        'react/no-object-type-as-default-prop': 'error',
        'react/prefer-stateless-function': 'error',
        'react/void-dom-elements-no-children': 'error',

        // Stylistic JSX
        '@stylistic/jsx-closing-bracket-location': 'warn',
        '@stylistic/jsx-closing-tag-location': 'warn',
        '@stylistic/jsx-curly-spacing': ['warn',
          {
            when: 'never',
            allowMultiline: false
          }],
        '@stylistic/jsx-curly-newline': ['warn', 'consistent'],
        '@stylistic/jsx-equals-spacing': ['warn', 'never'],
        '@stylistic/jsx-first-prop-new-line': ['warn', 'multiline'],
        '@stylistic/jsx-indent-props': 'warn',
        '@stylistic/jsx-max-props-per-line': ['warn',
          {
            maximum: {
              single: 3,
              multi: 1
            }
          }],
        '@stylistic/jsx-newline': ['warn',
          {
            prevent: true,
            allowMultilines: true
          }],
        '@stylistic/jsx-one-expression-per-line': ['warn',
          { allow: 'single-line' }],
        '@stylistic/jsx-curly-brace-presence': ['warn',
          {
            props: 'never',
            children: 'ignore',
            propElementValues: 'always'
          }],
        '@stylistic/jsx-props-no-multi-spaces': 'warn',
        '@stylistic/jsx-tag-spacing': ['warn',
          { beforeClosing: 'proportional-always' }],
        '@stylistic/jsx-wrap-multilines': ['warn',
          {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'parens-new-line',
            logical: 'parens-new-line',
            prop: 'ignore',
            propertyValue: 'parens-new-line'
          }],
        '@stylistic/jsx-self-closing-comp': 'warn',
        '@stylistic/jsx-pascal-case': 'warn',
        '@stylistic/jsx-function-call-newline': 'warn',
        '@stylistic/jsx-quotes': 'warn',
        '@stylistic/jsx-sort-props': 'warn',
        '@stylistic/jsx-child-element-spacing': 'warn',

        // JSX A11y
        'jsx-a11y/lang': 'error',
        'jsx-a11y/no-aria-hidden-on-focusable': 'error',
        'jsx-a11y/prefer-tag-over-role': 'error'
      }
    },

    // Disabled project service for JS files
    {
      files: ['**/*.{js,cjs,mjs}'],
      extends: [tseslint.configs.disableTypeChecked],
      languageOptions: {
        globals: {
          ...globals.nodeBuiltin,
          ...globals.node
        }
      }
    },

    {

      /*
       * Some information about how rules are configures :
       *   - rules that can cause bugs are "error" (ex: `eqeqeq`)
       *   - rules that don't necessarily cause bugs are "warn" (ex: `indent`)
       *
       *   - all the rules below are here to enable or reconfigure rules on plugins
       */
      rules: {
        // ESLint rules
        'capitalized-comments': ['warn', 'always'],
        'curly': ['warn', 'all'],
        'eqeqeq': ['error', 'always'],
        'logical-assignment-operators': ['error', 'always'],
        'no-div-regex': 'error',
        'no-else-return': 'warn',
        'no-extra-bind': 'warn',
        'no-extra-label': 'warn',
        'no-implicit-coercion': 'error',
        'no-lonely-if': 'warn',
        'no-undef-init': 'warn',
        'no-unneeded-ternary': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'object-shorthand': 'warn',
        'one-var': ['warn', 'never'],
        // Note: i don't care what you're using as long as the code is readable
        'operator-assignment': 'off',
        'prefer-arrow-callback': 'warn',
        'prefer-exponentiation-operator': 'warn',
        'prefer-numeric-literals': 'warn',
        'prefer-object-has-own': 'error',
        'prefer-object-spread': 'error',
        'prefer-template': 'warn',
        // Note: eslint-plugin-import handle this for us
        'sort-import': 'off',
        'unicode-bom': 'error',
        'accessor-pairs': 'warn',
        'array-callback-return': 'error',
        'yoda': 'error',
        'default-case': 'error',
        'default-case-last': 'error',
        'func-style': ['error', 'declaration'],
        'grouped-accessor-pairs': 'warn',
        'guard-for-in': 'error',
        'no-alert': 'error',
        'no-await-in-loop': 'warn',
        'no-caller': 'error',
        'no-constructor-return': 'error',
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-inline-comments': 'warn',
        'no-inner-declarations': 'error',
        'no-iterator': 'error',
        'no-label-var': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'warn',
        'no-multi-assign': 'error',
        'no-multi-str': 'warn',
        'no-octal-escape': 'warn',
        'no-param-reassign': 'error',
        'no-promise-executor-return': 'error',
        'no-proto': 'error',
        'no-return-assign': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-template-curly-in-string': 'error',
        'no-underscore-dangle': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unreachable-loop': 'warn',
        'no-useless-assignment': 'warn',
        'no-useless-concat': 'warn',
        'no-void': 'error',
        'no-warning-comments': 'warn',
        'radix': 'error',

        // Import sort
        'import/no-namespace': 'warn',
        'import/no-relative-packages': 'error',
        'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
        'import/first': 'warn',
        'import/no-absolute-path': 'error',
        'import/order': 'warn',
        'import/newline-after-import': 'warn',
        'import/no-useless-path-segments': 'warn',
        'import/no-empty-named-blocks': 'warn',
        'import/no-self-import': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-restricted-paths': 'error',
        'import/no-cycle': 'error',
        'import/no-named-default': 'error',
        'import/no-unused-modules': 'warn',
        'import/no-extraneous-dependencies': 'error',
        'import/no-nodejs-modules': 'error',
        'import/no-dynamic-require': 'error',
        'import/no-deprecated': 'warn',
        'import/no-unresolved': 'off',

        // Stylistic
        '@stylistic/indent': ['warn', 2],
        '@stylistic/array-bracket-newline': ['warn', 'consistent'],
        '@stylistic/array-bracket-spacing': 'warn',
        '@stylistic/array-element-newline': ['warn',
          {
            consistent: true,
            minItems: 5,
            multiline: true
          }],
        '@stylistic/arrow-parens': 'warn',
        '@stylistic/arrow-spacing': 'warn',
        '@stylistic/block-spacing': 'warn',
        '@stylistic/brace-style': 'warn',
        '@stylistic/comma-dangle': ['warn', 'never'],
        '@stylistic/comma-spacing': 'warn',
        '@stylistic/comma-style': 'warn',
        '@stylistic/computed-property-spacing': 'warn',
        '@stylistic/curly-newline': 'warn',
        '@stylistic/dot-location': ['warn', 'property'],
        '@stylistic/eol-last': 'warn',
        '@stylistic/func-call-spacing': 'warn',
        '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
        '@stylistic/function-call-spacing': 'warn',
        '@stylistic/function-paren-newline': ['warn', 'multiline-arguments'],
        '@stylistic/implicit-arrow-linebreak': 'error',
        '@stylistic/indent-binary-ops': ['error', 2],
        '@stylistic/key-spacing': 'warn',
        '@stylistic/keyword-spacing': 'warn',
        '@stylistic/linebreak-style': 'warn',
        '@stylistic/lines-around-comment': 'warn',
        '@stylistic/lines-between-class-members': 'warn',
        '@stylistic/member-delimiter-style': 'warn',
        '@stylistic/multiline-comment-style': 'warn',
        '@stylistic/multiline-ternary': 'warn',
        '@stylistic/new-parens': 'error',
        '@stylistic/newline-per-chained-call': 'warn',
        '@stylistic/no-confusing-arrow': 'error',
        '@stylistic/no-extra-parens': 'warn',
        '@stylistic/no-extra-semi': 'warn',
        '@stylistic/no-floating-decimal': 'warn',
        '@stylistic/no-multi-spaces': 'warn',
        '@stylistic/no-multiple-empty-lines': 'warn',
        '@stylistic/no-trailing-spaces': 'warn',
        '@stylistic/no-whitespace-before-property': 'warn',
        '@stylistic/object-curly-newline': ['warn',
          {
            ObjectExpression: {
              consistent: true,
              minProperties: 5
            },
            ObjectPattern: {
              consistent: true,
              minProperties: 5
            },
            ImportDeclaration: {
              consistent: true,
              minProperties: 3
            },
            ExportDeclaration: {
              consistent: true,
              minProperties: 3
            }
          }],
        // Since `@stylistic/object-curly-newline` seems broken, enable our own rule
        'custom-rules/custom-object-curly-newline': 'warn',
        '@stylistic/object-curly-spacing': ['warn', 'always'],
        '@stylistic/object-property-newline': ['warn',
          { allowAllPropertiesOnSameLine: false }],
        '@stylistic/one-var-declaration-per-line': 'warn',
        '@stylistic/operator-linebreak': ['warn', 'after'],
        '@stylistic/padded-blocks': ['warn', 'never'],
        '@stylistic/quote-props': ['warn', 'consistent-as-needed'],
        '@stylistic/quotes': ['warn', 'single'],
        '@stylistic/rest-spread-spacing': 'warn',
        '@stylistic/semi': ['warn', 'never'],
        '@stylistic/space-before-blocks': 'warn',
        '@stylistic/space-before-function-paren': ['warn',
          {
            asyncArrow: 'always',
            named: 'never',
            anonymous: 'never'
          }],
        '@stylistic/space-in-parens': 'warn',
        '@stylistic/space-infix-ops': 'warn',
        '@stylistic/space-unary-ops': 'warn',
        '@stylistic/spaced-comment': 'warn',
        '@stylistic/switch-colon-spacing': 'warn',
        '@stylistic/template-curly-spacing': 'warn',
        '@stylistic/template-tag-spacing': 'warn',
        '@stylistic/type-annotation-spacing': 'warn',
        '@stylistic/type-generic-spacing': 'warn',
        '@stylistic/type-named-tuple-spacing': 'warn',
        '@stylistic/wrap-iife': 'warn',
        '@stylistic/wrap-regex': 'warn',
        '@stylistic/yield-star-spacing': 'warn',
        '@stylistic/generator-star-spacing': 'warn',
        '@stylistic/nonblock-statement-body-position': 'warn',
        '@stylistic/padding-line-between-statements': 'warn',
        '@stylistic/semi-spacing': 'warn',
        '@stylistic/semi-style': 'warn',
        '@stylistic/line-comment-position': 'warn',
        '@stylistic/max-len': ['warn',
          {
            code: 100,
            ignoreStrings: true,
            comments: 120
          }],
        '@stylistic/max-statements-per-line': 'warn',
        '@stylistic/no-mixed-operators': 'error',
        '@stylistic/no-mixed-spaces-and-tabs': 'warn',
        '@stylistic/no-tabs': 'warn',

        // Unused imports
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_'
          }]
      }
    },

    // Allow NodeJS imports outside src directory
    {
      files: ['**/*.ts'],
      ignores: ['**/src/**'],
      rules: { 'import/no-nodejs-modules': 'off' }
    },

    ...configBlockToMerge
  )
}
