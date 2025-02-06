const maxLenRule = 100

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export const customObjectCurlyNewline = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce line breaks between properties in object destructuring',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',
    schema: []
  },
  create(context) {
    return {
      ObjectPattern(node) {
        const { properties } = node
        const { sourceCode } = context

        /*
         * Get line length of the full line (compute all the line length that are
         * occupied by the object destructuring)
         */
        let lineLength = 0

        for (let i = node.loc.start.line; i <= node.loc.end.line; i++) {
          lineLength += sourceCode.lines[i - 1].length
          // Console.log('line', sourceCode.lines[i - 1])
        }

        /*
         * Console.log('lineLength checked', lineLength, maxLenRule, line)
         * If there are more than 5 items in the object
         */
        if (node.properties.length > 5 || lineLength > maxLenRule) {
          let firstReportedProperty = null
          let lastReportedProperty = null
          properties.forEach((property, index) => {
            if (index > 0) {
              const previousProperty = node.properties[index - 1]
              if (property.loc.start.line === previousProperty.loc.end.line) {
                if (!firstReportedProperty) {
                  firstReportedProperty = previousProperty
                }
                lastReportedProperty = property
              }
            }
          })

          if (firstReportedProperty && lastReportedProperty) {
            context.report({
              node,
              loc: {
                start: firstReportedProperty.loc.start,
                end: lastReportedProperty.loc.end
              },
              message: 'Each property in object destructuring should be on a new line if there are more than 5 properties.',
              fix(fixer) {
                const indent = ' '.repeat(firstReportedProperty.loc.start.column)

                return properties
                  .slice(1)
                  .filter((property, index) => {
                    return property.loc.start.line === properties[index].loc.end.line
                  })
                  .map((property, index) => fixer.replaceTextRange(
                    [properties[index].range[1] + 1, property.range[0]],
                    `\n${indent}`
                  ))
              }
            })
          }
          return
        }

        // Otherwise, when there's less than 5 items, put everything on one line
        const firstProperty = properties[0]
        const lastProperty = properties[properties.length - 1]

        if (firstProperty.loc.start.line !== lastProperty.loc.end.line) {
          context.report({
            node,
            loc: {
              start: firstProperty.loc.start,
              end: lastProperty.loc.end
            },
            message: 'Each property in object destructuring should be on the same line if there are 5 or fewer properties.',
            fix(fixer) {
              const paramText = sourceCode.getText(node)
              const inlineText = paramText.replace(/\n\s*/g, ' ')
              return fixer.replaceText(node, inlineText)
            }
          })
        }

        // Ensure the properties are inlined with the curly braces
        const paramText = sourceCode.getText(node)
        const inlineText = paramText.replace(/\n\s*/g, ' ')
        if (paramText !== inlineText) {
          context.report({
            node,
            message: 'Each property in object destructuring should be inlined with the curly braces.',
            fix(fixer) {
              return fixer.replaceText(node, inlineText)
            }
          })
        }
      }
    }
  }
}
