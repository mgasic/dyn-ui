'use strict';

const DEFAULT_ALLOWED_IDENTIFIERS = new Set(['onChange']);
const HANDLER_NAME_PATTERN = /^(?:handle|on)[A-Z].*Change$/;

function isLiteralNull(node) {
  return node.type === 'Literal' && node.value === null;
}

function unwrapExpression(node) {
  let current = node;
  while (
    current &&
    (current.type === 'TSAsExpression' ||
      current.type === 'TSTypeAssertion' ||
      current.type === 'ChainExpression' ||
      current.type === 'ParenthesizedExpression')
  ) {
    current = current.expression;
  }
  return current;
}

function getMemberExpressionPropertyName(node) {
  if (!node) return null;
  if (node.property?.type === 'Identifier' && !node.computed) {
    return node.property.name;
  }
  if (node.property?.type === 'Literal' && typeof node.property.value === 'string') {
    return node.property.value;
  }
  return null;
}

function isAllowedHandlerIdentifier(name, allowedIdentifiers) {
  if (!name) return false;
  if (allowedIdentifiers.has(name)) {
    return true;
  }
  if (HANDLER_NAME_PATTERN.test(name)) {
    return true;
  }
  return false;
}

function isAllowedHandlerExpression(expression, contextOptions) {
  const { allowInline, allowedIdentifiers } = contextOptions;

  const node = unwrapExpression(expression);
  if (!node) {
    return true;
  }

  switch (node.type) {
    case 'Identifier':
      return (
        isAllowedHandlerIdentifier(node.name, allowedIdentifiers) ||
        node.name === 'undefined'
      );
    case 'MemberExpression': {
      const propertyName = getMemberExpressionPropertyName(node);
      if (!propertyName) {
        return false;
      }
      return isAllowedHandlerIdentifier(propertyName, allowedIdentifiers);
    }
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return Boolean(allowInline);
    case 'ConditionalExpression':
      return (
        isAllowedHandlerExpression(node.consequent, contextOptions) &&
        isAllowedHandlerExpression(node.alternate, contextOptions)
      );
    case 'LogicalExpression':
      return (
        isAllowedHandlerExpression(node.left, contextOptions) &&
        isAllowedHandlerExpression(node.right, contextOptions)
      );
    case 'SequenceExpression':
      return node.expressions.every(expr =>
        isAllowedHandlerExpression(expr, contextOptions)
      );
    case 'Literal':
      return node.value == null;
    default:
      return false;
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforces the use of named onChange handlers to keep APIs discoverable and consistent.',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInline: {
            type: 'boolean',
            default: false,
          },
          allowedIdentifiers: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useNamedHandler:
        'Use a named handler (e.g. handleValueChange) or forward an existing onChange prop instead of an inline expression.',
    },
  },
  create(context) {
    const options = context.options?.[0] ?? {};
    const allowInline = Boolean(options.allowInline);
    const allowedIdentifiers = new Set(options.allowedIdentifiers ?? DEFAULT_ALLOWED_IDENTIFIERS);

    return {
      JSXAttribute(node) {
        if (node.name?.type !== 'JSXIdentifier' || node.name.name !== 'onChange') {
          return;
        }

        const value = node.value;
        if (!value) {
          return;
        }

        if (value.type !== 'JSXExpressionContainer') {
          return;
        }

        const expression = value.expression;
        if (isLiteralNull(expression)) {
          return;
        }

        if (!isAllowedHandlerExpression(expression, { allowInline, allowedIdentifiers })) {
          context.report({ node: value, messageId: 'useNamedHandler' });
        }
      },
    };
  },
};
