import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynNewComponent } from './DynNewComponent';

describe('DynNewComponent', () => {
  it('exports a React component', () => {
    expect(DynNewComponent).toBeDefined();
  });

  it('renders children correctly', () => {
    render(
      <DynNewComponent>
        <span>Child content</span>
      </DynNewComponent>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('supports polymorphic as prop', () => {
    render(
      <DynNewComponent as="section" aria-label="wrapper">
        Content
      </DynNewComponent>
    );

    const element = screen.getByTestId('dyn-new-component');
    expect(element.tagName).toBe('SECTION');
    expect(element).toHaveAttribute('aria-label', 'wrapper');
  });

  it('applies spacing tokens to CSS variables', () => {
    render(
      <DynNewComponent gap="md" p="lg" m="sm">
        Tokens
      </DynNewComponent>
    );

    const element = screen.getByTestId('dyn-new-component');
    expect(element.style.getPropertyValue('--dyn-new-component-gap')).toBe(
      'var(--dyn-spacing-md, var(--spacing-md, 1rem))'
    );
    expect(element.style.getPropertyValue('--dyn-new-component-padding')).toBe(
      'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))'
    );
    expect(element.style.getPropertyValue('--dyn-new-component-margin')).toBe(
      'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))'
    );
  });

  it('accepts numeric spacing values', () => {
    render(
      <DynNewComponent gap={24} p={12} m={8}>
        Numbers
      </DynNewComponent>
    );

    const element = screen.getByTestId('dyn-new-component');
    expect(element.style.getPropertyValue('--dyn-new-component-gap')).toBe('24px');
    expect(element.style.getPropertyValue('--dyn-new-component-padding')).toBe('12px');
    expect(element.style.getPropertyValue('--dyn-new-component-margin')).toBe('8px');
  });

  it('merges custom class names', () => {
    render(
      <DynNewComponent className="custom-wrapper" data-testid="custom-id">
        Styled
      </DynNewComponent>
    );

    const element = screen.getByTestId('custom-id');
    expect(element.className).toMatch(/custom-wrapper/);
  });
});
