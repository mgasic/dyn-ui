import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '../packages/dyn-ui-react/src/theme/ThemeProvider';
import '../packages/dyn-ui-react/src/styles/themes.css';

const themes = ['light', 'dark'];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      React.useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.className = `theme-${theme}`;
      }, [theme]);

      return (
        <ThemeProvider initialTheme={theme}>
          <div
            style={{
              minHeight: '100vh',
              backgroundColor: 'var(--dyn-color-background)',
              color: 'var(--dyn-color-foreground)',
              padding: '1rem',
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
