import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import DynFieldContainer from './DynFieldContainer';
import styles from './DynFieldContainer.module.css';

const classes = styles as Record<string, string>;

describe('DynFieldContainer', () => {
  it('renders the provided label and child element', () => {
    render(
      <DynFieldContainer label="First name" htmlFor="first-name">
        <input id="first-name" data-testid="inner-input" />
      </DynFieldContainer>
    );

    const container = screen.getByTestId('dyn-field-container');
    expect(container).toHaveClass(classes.container!);
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByTestId('inner-input')).toBeInTheDocument();
  });

  it('shows validation feedback when error text is provided', () => {
    render(
      <DynFieldContainer
        label="Email"
        errorText="This field is required"
        htmlFor="email"
      >
        <input id="email" />
      </DynFieldContainer>
    );

    const container = screen.getByTestId('dyn-field-container');
    expect(container).toHaveClass(classes.containerError!);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('hides validation messages when showValidation is false', () => {
    render(
      <DynFieldContainer
        label="Phone"
        helpText="Include area code"
        showValidation={false}
        htmlFor="phone"
      >
        <input id="phone" />
      </DynFieldContainer>
    );

    expect(screen.queryByText('Include area code')).not.toBeInTheDocument();
  });

  it('links label, help text, and described by attributes to child inputs', () => {
    render(
      <DynFieldContainer
        label="Email"
        helpText="We will never share your email"
        htmlFor="email"
      >
        <input id="email" data-testid="linked-input" />
      </DynFieldContainer>
    );

    const container = screen.getByTestId('dyn-field-container');
    const input = screen.getByTestId('linked-input');

    expect(container).toHaveAttribute('aria-describedby', 'email-help');
    expect(input).toHaveAttribute('aria-describedby', 'email-help');
    expect(input).toHaveAttribute('aria-labelledby', 'email-label');
  });

  it('merges custom aria-describedby values with generated feedback identifiers', () => {
    render(
      <DynFieldContainer
        label="Email"
        errorText="Required"
        htmlFor="email"
        aria-describedby="external-hint"
      >
        <input id="email" data-testid="error-input" />
      </DynFieldContainer>
    );

    const container = screen.getByTestId('dyn-field-container');
    const input = screen.getByTestId('error-input');

    const containerDescribedBy = container.getAttribute('aria-describedby');
    const inputDescribedBy = input.getAttribute('aria-describedby');

    expect(containerDescribedBy?.split(' ')).toEqual(
      expect.arrayContaining(['external-hint', 'email-error'])
    );
    expect(inputDescribedBy?.split(' ')).toEqual(
      expect.arrayContaining(['external-hint', 'email-error'])
    );
  });

  it('forwards refs and rest props to the container element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <DynFieldContainer ref={ref} data-testid="custom-container" role="group">
        <input />
      </DynFieldContainer>
    );

    const container = screen.getByTestId('custom-container');
    expect(container).toHaveAttribute('role', 'group');
    expect(ref.current).toBe(container);
  });

  it('supports polymorphic rendering and spacing props', () => {
    render(
      <DynFieldContainer as="fieldset" gap="lg" mb="2xl" data-testid="polymorphic">
        <input id="polymorphic-input" />
      </DynFieldContainer>
    );

    const container = screen.getByTestId('polymorphic');

    expect(container.tagName).toBe('FIELDSET');
    expect(container.style.getPropertyValue('--dyn-box-gap')).toContain('var(--dyn-spacing-lg');
    expect(container.style.getPropertyValue('--dyn-box-margin-bottom')).toContain(
      'var(--dyn-spacing-2xl'
    );
  });
});
