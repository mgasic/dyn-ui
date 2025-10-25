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

function collectInitialSpreadSources(params) {
  const names = new Set();

  params.forEach(param => {
    if (!param) return;

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

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prevents blindly forwarding component props via spread attributes to avoid prop drilling.',
      recommended: false,
    },
    schema: [],
    messages: {
      avoidPropDrilling:
        "Avoid spreading '{{identifier}}' props into child components. Prefer explicit props or composition.",
    },
  },
  create(context) {
    const componentStack = [];

    function enterComponent(node) {
      const name = getComponentNameFromFunction(node);
      if (!name) return;

      const spreadSources = collectInitialSpreadSources(node.params ?? []);
      componentStack.push({ node, name, spreadSources });
    }

    function exitComponent(node) {
      const state = componentStack.pop();
      if (state && state.node === node) {
        // no-op
      }
    }

    function trackAlias(identifierName) {
      const state = componentStack[componentStack.length - 1];
      if (!state) {
        return;
      }
      state.spreadSources.add(identifierName);
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

        const init = unwrapExpression(node.init);
        if (!init || init.type !== 'Identifier') {
          return;
        }

        if (!state.spreadSources.has(init.name)) {
          return;
        }

        if (node.id.type === 'Identifier') {
          trackAlias(node.id.name);
          return;
        }

        if (node.id.type === 'ObjectPattern') {
          node.id.properties.forEach(prop => {
            if (prop.type === 'RestElement' && prop.argument.type === 'Identifier') {
              trackAlias(prop.argument.name);
            }
          });
        }
      },
      JSXSpreadAttribute(node) {
        const state = componentStack[componentStack.length - 1];
        if (!state) {
          return;
        }

        const argument = unwrapExpression(node.argument);
        if (!argument || argument.type !== 'Identifier') {
          return;
        }

        if (!state.spreadSources.has(argument.name)) {
          return;
        }

        context.report({
          node,
          messageId: 'avoidPropDrilling',
          data: { identifier: argument.name },
        });
      },
    };
  },
};
