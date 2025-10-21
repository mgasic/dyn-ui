import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynStep } from './DynStep';
import { DYN_STEP_DEFAULT_PROPS } from './DynStep.types';

describe('DynStep', () => {
  it('exports a React component', () => {
    expect(DynStep).toBeDefined();
    expect((DynStep as any).displayName).toBe('DynStep');
  });

  it('renders with default props as a section', () => {
    render(<DynStep>Content</DynStep>);
    const element = screen.getByTestId(DYN_STEP_DEFAULT_PROPS['data-testid']);

    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SECTION');
  });

  it('supports polymorphic rendering via the `as` prop', () => {
    render(
      <DynStep as="article" data-testid="polymorphic-step">
        Article content
      </DynStep>
    );

    const element = screen.getByTestId('polymorphic-step');
    expect(element.tagName).toBe('ARTICLE');
  });

  it('applies spacing tokens as CSS variables', () => {
    render(
      <DynStep spacing="lg" padding="sm" data-testid="spaced-step">
        Spaced content
      </DynStep>
    );

    const element = screen.getByTestId('spaced-step');

    expect(element).toHaveStyle({
      '--dyn-step-gap': 'var(--dyn-spacing-lg, 1rem)',
      '--dyn-step-padding': 'var(--dyn-spacing-sm, 0.5rem)',
    });
  });

  it('supports custom spacing values', () => {
    render(
      <DynStep spacing={12} padding="24px" data-testid="custom-spacing">
        Custom spacing
      </DynStep>
    );

    const element = screen.getByTestId('custom-spacing');

    expect(element).toHaveStyle({
      '--dyn-step-gap': '12px',
      '--dyn-step-padding': '24px',
    });
  });

  it('matches snapshot with spacing props', () => {
    const { asFragment } = render(
      <DynStep spacing="xl" padding="lg" data-testid="snapshot-step">
        <header>
          <h2>Review &amp; Submit</h2>
          <p>Confirm your entries before finishing.</p>
        </header>
        <div>
          <p>All fields look good. Click finish to complete the wizard.</p>
        </div>
      </DynStep>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
