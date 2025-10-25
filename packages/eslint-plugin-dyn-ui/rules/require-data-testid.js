'use strict';

function isComponentName(name) {
  return typeof name === 'string' && /^(?:[A-Z]|Dyn)/.test(name);
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

function objectPatternHasDataTestId(pattern) {
  return pattern.properties.some(prop => {
    if (prop.type === 'Property') {
      const key = prop.key;
      if (key.type === 'Literal') {
        return key.value === 'data-testid';
      }
      if (key.type === 'Identifier') {
        return key.name === 'dataTestId' || key.name === 'data-testid';
      }
      return false;
    }
    if (prop.type === 'RestElement' && prop.argument?.type === 'ObjectPattern') {
      return objectPatternHasDataTestId(prop.argument);
    }
    return false;
  });
}

function collectPropParamNames(params) {
  const names = new Set();

  params.forEach(param => {
    if (!param) {
      return;
    }

    if (param.type === 'Identifier') {
      names.add(param.name);
      return;
    }

    if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
      names.add(param.left.name);
      return;
    }

    if (param.type === 'ObjectPattern') {
      param.properties.forEach(prop => {
        if (prop.type === 'RestElement' && prop.argument.type === 'Identifier') {
          names.add(prop.argument.name);
        }
      });
    }

    if (param.type === 'RestElement' && param.argument.type === 'Identifier') {
      names.add(param.argument.name);
    }
  });

  return names;
}

function getComponentNameFromFunction(node) {
  if (!node) return null;

  if (node.type === 'FunctionDeclaration' && node.id && isComponentName(node.id.name)) {
    return node.id.name;
  }

  let current = node.parent;
  while (current) {
    if (current.type === 'VariableDeclarator' && current.id.type === 'Identifier') {
      if (isComponentName(current.id.name)) {
        return current.id.name;
      }
    }

    if (current.type === 'AssignmentExpression' && current.left.type === 'Identifier') {
      if (isComponentName(current.left.name)) {
        return current.left.name;
      }
    }

    current = current.parent;
  }

  return null;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Requires Dyn components to expose a data-testid prop binding for root elements to keep testing hooks consistent.',
      recommended: false,
    },
    schema: [],
    messages: {
      missingDataTestId:
        "Component '{{name}}' should destructure the `'data-testid'` prop to keep the testing contract consistent.",
    },
  },
  create(context) {
    const componentStack = [];

    function enterComponent(node) {
      const name = getComponentNameFromFunction(node);
      if (!name) {
        return;
      }

      const propNames = collectPropParamNames(node.params ?? []);
      const hasDataTestId = node.params?.some(param =>
        param.type === 'ObjectPattern' && objectPatternHasDataTestId(param)
      );

      componentStack.push({ node, name, propNames, hasDataTestId });
    }

    function exitComponent(node) {
      const state = componentStack.pop();
      if (!state || state.node !== node) {
        return;
      }

      if (!state.hasDataTestId) {
        context.report({ node, messageId: 'missingDataTestId', data: { name: state.name } });
      }
    }

    return {
      FunctionDeclaration: enterComponent,
      'FunctionDeclaration:exit': exitComponent,
      FunctionExpression: enterComponent,
      'FunctionExpression:exit': exitComponent,
      ArrowFunctionExpression: enterComponent,
      'ArrowFunctionExpression:exit': exitComponent,
      VariableDeclarator(node) {
        const state = componentStack[componentStack.length - 1];
        if (!state) {
          return;
        }

        if (state.hasDataTestId) {
          return;
        }

        if (node.id.type !== 'ObjectPattern') {
          return;
        }

        const initializer = unwrapExpression(node.init);
        if (!initializer || initializer.type !== 'Identifier') {
          return;
        }

        if (!state.propNames.has(initializer.name)) {
          return;
        }

        if (objectPatternHasDataTestId(node.id)) {
          state.hasDataTestId = true;
        }
      },
    };
  },
};
