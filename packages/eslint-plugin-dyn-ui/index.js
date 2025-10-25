module.exports = {
  rules: {
    'require-component-export-pattern': require('./rules/require-component-export-pattern'),
    'require-component-support-files': require('./rules/require-component-support-files'),
    'enforce-onchange-handler-name': require('./rules/enforce-onchange-handler-name'),
    'require-data-testid': require('./rules/require-data-testid'),
    'no-prop-drilling': require('./rules/no-prop-drilling'),
  },
  configs: {
    recommended: {
      plugins: ['dyn-ui'],
      rules: {
        'dyn-ui/require-component-export-pattern': 'error',
        'dyn-ui/require-component-support-files': 'error',
        'dyn-ui/enforce-onchange-handler-name': 'warn',
        'dyn-ui/require-data-testid': 'error',
        'dyn-ui/no-prop-drilling': 'warn',
      },
    },
  },
};
