import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import DynIcon from './DynIcon';
import { IconDictionaryProvider } from '../../providers/IconDictionaryProvider';
import styles from './DynIcon.module.css';

const mutedVariantClassName =
  styles['dyn-icon-variant-muted'] ?? 'dyn-icon-variant-muted';
const largeSizeClassName = styles['dyn-icon-size-large'] ?? 'dyn-icon-size-large';
const spinningClassName = styles.spinning ?? 'spinning';

const renderIcon = (
  icon: ReactNode,
  props: Partial<ComponentProps<typeof DynIcon>> = {},
  customDictionary?: Record<string, string>
) => {
  const providerProps = customDictionary ? { customDictionary } : {};

  return render(
    <IconDictionaryProvider {...providerProps}>
      <DynIcon icon={icon as string | ReactNode} data-testid="dyn-icon" {...props} />
    </IconDictionaryProvider>
  );
};

describe('DynIcon', () => {
  it('applies dictionary classes when icon key exists', () => {
    renderIcon('ok');

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.className).toContain('dyn-icon');
    expect(icon.className).toContain('dyn-icon-ok');
  });

  it('uses custom dictionary entries when provided', () => {
    renderIcon('custom', {}, { custom: 'my-custom-icon' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.className).toContain('my-custom-icon');
  });

  it('renders registry SVG icons when available', () => {
    renderIcon('check');

    const icon = screen.getByTestId('dyn-icon');
    const svg = icon.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders custom React node icons', () => {
    renderIcon(<span data-testid="custom-icon">R</span>);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies raw class when icon cannot be resolved', () => {
    renderIcon('unknown-icon');

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.className).toContain('unknown-icon');
  });

  it('supports FontAwesome class icons', () => {
    renderIcon('fa-solid fa-user');

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.className).toContain('fa-solid');
    expect(icon.className).toContain('fa-user');
    expect(icon.className).toContain('dyn-fonts-icon');
  });

  it('renders sprite icons when sprite reference is provided', () => {
    renderIcon('sprite:#check');

    const icon = screen.getByTestId('dyn-icon');
    const useElement = icon.querySelector('use');
    expect(useElement).toBeInTheDocument();
    expect(useElement?.getAttribute('href')).toBe('#check');
  });

  it('applies variant classes for visual styling', () => {
    renderIcon('ok', { variant: 'muted' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveClass(mutedVariantClassName);
  });

  it('maps semantic color tokens to CSS variables', () => {
    renderIcon('ok', { color: 'success' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.style.getPropertyValue('--dyn-icon-color')).toBe(
      'var(--dyn-color-success)'
    );
  });

  it('supports custom color overrides via inline CSS variable', () => {
    renderIcon('ok', { color: '#123456' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.style.getPropertyValue('--dyn-icon-color')).toBe('#123456');
  });

  it('applies predefined size classes', () => {
    renderIcon('ok', { size: 'large' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveClass(largeSizeClassName);
  });

  it('applies inline CSS variable for numeric sizes', () => {
    renderIcon('ok', { size: 32 });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.style.getPropertyValue('--dyn-icon-size')).toBe('32px');
  });

  it('applies spinning class when spin is true', () => {
    renderIcon('ok', { spin: true });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveClass(spinningClassName);
  });

  it('handles click interactions when onClick is provided', () => {
    const handleClick = vi.fn();
    renderIcon('ok', { onClick: handleClick });

    const icon = screen.getByTestId('dyn-icon');
    fireEvent.click(icon);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(icon).toHaveAttribute('role', 'button');
    expect(icon.tabIndex).toBe(0);
  });

  it('prevents clicks when disabled', () => {
    const handleClick = vi.fn();
    renderIcon('ok', { onClick: handleClick, disabled: true });

    const icon = screen.getByTestId('dyn-icon');
    fireEvent.click(icon);

    expect(handleClick).not.toHaveBeenCalled();
    expect(icon).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets aria-hidden by default for decorative icons', () => {
    renderIcon('ok');

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes icon to assistive tech when aria-label is provided', () => {
    renderIcon('ok', { 'aria-label': 'Status OK' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon).toHaveAttribute('aria-label', 'Status OK');
  });

  it('exposes icon when aria-labelledby is provided', () => {
    renderIcon('ok', { 'aria-labelledby': 'label-id' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon).toHaveAttribute('aria-labelledby', 'label-id');
  });

  it('ignores explicit aria-hidden when accessible label is present', () => {
    renderIcon('ok', { 'aria-label': 'Info', 'aria-hidden': true });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('honors explicit aria-hidden when no label is present', () => {
    renderIcon('ok', { 'aria-hidden': 'false' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders children when icon is omitted', () => {
    render(
      <IconDictionaryProvider>
        <DynIcon data-testid="dyn-icon">Fallback</DynIcon>
      </IconDictionaryProvider>
    );

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveTextContent('Fallback');
  });
});
