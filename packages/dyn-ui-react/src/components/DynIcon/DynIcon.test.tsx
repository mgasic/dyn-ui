import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import DynIcon from './DynIcon';
import { IconDictionaryProvider } from '../../providers/IconDictionaryProvider';
import styles from './DynIcon.module.css';

const renderIcon = (
  icon: ReactNode,
  props: Partial<ComponentProps<typeof DynIcon>> = {},
  customDictionary?: Record<string, string>
) => {
  return render(
    <IconDictionaryProvider customDictionary={customDictionary}>
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

  it('applies tone classes for semantic colors', () => {
    renderIcon('ok', { tone: 'success' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveClass(styles.success);
  });

  it('applies predefined size classes', () => {
    renderIcon('ok', { size: 'large' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveClass(styles['dyn-icon-size-large']);
  });

  it('applies inline styles for numeric sizes', () => {
    renderIcon('ok', { size: 32 });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon.style.width).toBe('32px');
    expect(icon.style.height).toBe('32px');
  });

  it('applies spinning class when spin is true', () => {
    renderIcon('ok', { spin: true });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).toHaveClass(styles.spinning);
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

  it('allows overriding aria attributes', () => {
    renderIcon('ok', { 'aria-label': 'Status OK' });

    const icon = screen.getByTestId('dyn-icon');
    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon).toHaveAttribute('aria-label', 'Status OK');
  });
});
