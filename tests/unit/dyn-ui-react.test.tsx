import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { DynButton } from '../../packages/dyn-ui-react/src/components/DynButton';
import {
  ThemeProvider,
  useTheme,
} from '../../packages/dyn-ui-react/src/theme/ThemeProvider';
import { classNames } from '../../packages/dyn-ui-react/src/utils/classNames';
import { generateInitials } from '../../packages/dyn-ui-react/src/utils/dynFormatters';
import { renderWithProviders } from '../utils/render-with-providers';

function TestConsumer() {
  const theme = useTheme();
  return <span data-testid="theme-value">{theme.theme}</span>;
}

describe('Dyn UI public API smoke tests', () => {
  it('renders DynButton label and loading state', () => {
    const { rerender } = renderWithProviders(
      <DynButton loading={false}>Click me</DynButton>,
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeEnabled();

    rerender(<DynButton loading>Click me</DynButton>);

    expect(screen.getByRole('button', { name: 'Click me' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('exposes ThemeProvider context via useTheme', () => {
    renderWithProviders(
      <ThemeProvider initialTheme="dark">
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });

  it('provides utility helpers', () => {
    expect(classNames('base', { active: true, disabled: false })).toBe(
      'base active',
    );
    expect(generateInitials('Dyn UI Library')).toBe('DL');
  });
});
