import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testA11y } from '../../testing/accessibility';
import { describe, expect, it, vi } from 'vitest';
import { DynInput } from './DynInput';
import styles from './DynInput.module.css';
import { useState } from 'react';

// Accessibility assertions use axe-core directly

// Mock DynIcon component
vi.mock('../DynIcon', () => ({
  DynIcon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid="dyn-icon" className={className}>
      {icon}
    </span>
  )
}));

const classes = styles as Record<string, string>;

describe('DynInput', () => {
  const user = userEvent.setup();

  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<DynInput name="test" label="Test Input" />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'test');
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByText('Test Input')).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(<DynInput name="test" label="Test" value="initial value" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial value');
    });

    it('renders with placeholder', () => {
      render(
        <DynInput
          name="test"
          label="Test"
          placeholder="Enter text here"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });

    it('generates unique ID when not provided', () => {
      const { rerender } = render(<DynInput name="test1" label="Test 1" />);
      const firstInput = screen.getByRole('textbox');
      const firstId = firstInput.id;

      rerender(<DynInput name="test2" label="Test 2" />);
      const secondInput = screen.getByRole('textbox');
      const secondId = secondInput.id;

      expect(firstId).toBeTruthy();
      expect(secondId).toBeTruthy();
      expect(firstId).not.toBe(secondId);
    });

    it('uses provided ID when specified', () => {
      render(<DynInput name="test" label="Test" id="custom-input" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-input');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <DynInput name="accessible" label="Accessible Input" />
      );
  await testA11y(<DynInput name="accessible" label="Accessible Input" />);
    });

    it('properly associates label with input', () => {
      render(<DynInput name="test" label="Test Label" />);

      const input = screen.getByLabelText('Test Label');
      expect(input).toBeInTheDocument();
    });

    it('supports required attribute and aria-required', () => {
      render(<DynInput name="test" label="Test" required />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('properly handles disabled state', () => {
      render(<DynInput name="test" label="Test" disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('aria-disabled', 'true');
    });

    it('properly handles readonly state', () => {
      render(<DynInput name="test" label="Test" readonly />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onChange when typing', async () => {
      const onChange = vi.fn();
      render(<DynInput name="test" label="Test" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');

      expect(onChange).toHaveBeenLastCalledWith('hello');
    });

    it('calls onFocus when input gains focus', async () => {
      const onFocus = vi.fn();
      render(<DynInput name="test" label="Test" onFocus={onFocus} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input loses focus', async () => {
      const onBlur = vi.fn();
      render(<DynInput name="test" label="Test" onBlur={onBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('does not call onChange when disabled', async () => {
      const onChange = vi.fn();
      render(
        <DynInput name="test" label="Test" disabled onChange={onChange} />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled and uncontrolled usage', () => {
    it('manages its own state when used uncontrolled', async () => {
      render(<DynInput name="notes" label="Notes" />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'memo');

      expect(input).toHaveValue('memo');
    });

    it('supports controlled usage by respecting external value updates', async () => {
      const Controlled = () => {
        const [value, setValue] = useState('initial');

        return (
          <div>
            <DynInput
              name="controlled"
              label="Controlled"
              value={value}
              onChange={(next) => setValue(String(next))}
            />
            <button type="button" onClick={() => setValue('reset')}>
              Reset
            </button>
          </div>
        );
      };

      render(<Controlled />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');

      await user.clear(input);
      await user.type(input, '123');
      expect(input).toHaveValue('123');

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(input).toHaveValue('reset');
    });
  });

  describe('Variants and States', () => {
    it('renders different input types', () => {
      const { rerender } = render(
        <DynInput name="test" label="Email" type="email" />
      );
      let input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');

      rerender(<DynInput name="test" label="Password" type="password" />);
      input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders with icon', () => {
      render(<DynInput name="test" label="Search" icon="search" />);

      const icon = screen.getByTestId('dyn-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('search');
    });

    it('renders prefix and suffix content and links them via aria-describedby', () => {
      render(
        <DynInput
          name="amount"
          label="Amount"
          prefix="USD"
          suffix="per month"
        />
      );

      const input = screen.getByRole('textbox');
      const prefixElement = document.getElementById(`${input.id}-prefix`);
      const suffixElement = document.getElementById(`${input.id}-suffix`);

      expect(prefixElement).toBeTruthy();
      expect(suffixElement).toBeTruthy();

      const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
      expect(describedBy).toEqual(
        expect.arrayContaining([prefixElement!.id, suffixElement!.id])
      );
    });

    it('applies warning state and message when warningMessage is provided', () => {
      render(
        <DynInput
          name="warning"
          label="Warning"
          warningMessage="Check your input"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(classes['dyn-input--warning']!);
      const message = screen.getByText('Check your input');
      expect(message).toHaveAttribute('id', `${input.id}-validation`);
    });

    it('applies success state when valid prop or successMessage is provided', () => {
      render(
        <DynInput
          name="success"
          label="Success"
          valid
          successMessage="Tudo certo"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(classes['dyn-input--success']!);
      expect(screen.getByText('Tudo certo')).toBeInTheDocument();
    });

    it('shows loading state with spinner and aria-busy attribute', () => {
      const { container } = render(
        <DynInput
          name="loading"
          label="Loading"
          loading
          loadingMessage="Carregando dados"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Carregando dados')).toBeInTheDocument();
      expect(
        container.querySelector(`.${classes['dyn-input-loading-indicator']}`)
      ).toBeTruthy();
    });
  });

  describe('Props and Customization', () => {
    it('accepts custom className', () => {
      render(
        <DynInput name="test" label="Custom" className="custom-class" />
      );

      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveClass('custom-class');
    });

    it('passes through additional HTML attributes', () => {
      render(
        <DynInput
          name="test"
          label="Test"
          maxLength={10}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('forwards the form attribute to the native input element', () => {
      render(
        <DynInput
          name="password"
          label="Password"
          type="password"
          form="login-form"
          aria-describedby="password-help"
        />
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('form', 'login-form');
      expect(input).toHaveAttribute('aria-describedby', 'password-help');
    });

    it('merges custom aria-describedby with help and validation feedback', async () => {
      render(
        <DynInput
          name="username"
          label="Username"
          help="Use your account username"
          required
          aria-describedby="external-hint"
        />
      );

      const input = screen.getByLabelText(/Username/);
      const helpId = `${input.id}-help`;
      const validationId = `${input.id}-validation`;

      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('external-hint'));
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(helpId));

      fireEvent.blur(input);

      await screen.findByText('Este campo é obrigatório');

      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy?.split(' ')).toEqual(
        expect.arrayContaining(['external-hint', helpId, validationId])
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty value gracefully', () => {
      render(<DynInput name="test" label="Test" value="" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('handles undefined value', () => {
      render(<DynInput name="test" label="Test" value={undefined} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('Currency and Spin Controls', () => {
    it('formats currency values and renders symbol', () => {
      render(
        <DynInput name="amount" label="Amount" type="currency" value={1234.56} />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('1.234,56');
      expect(screen.getByText('R$')).toBeInTheDocument();
    });

    it('emits numeric value when typing currency', () => {
      const onChange = vi.fn();
      render(
        <DynInput name="amount" label="Amount" type="currency" onChange={onChange} />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '1234' } });

      expect(onChange).toHaveBeenLastCalledWith(1234);
      expect(input).toHaveValue('1.234,00');
    });

    it('renders spin buttons and adjusts value respecting boundaries', async () => {
      const onChange = vi.fn();
      render(
        <DynInput
          name="quantity"
          label="Quantity"
          type="number"
          value={2}
          min={0}
          max={4}
          step={2}
          showSpinButtons
          onChange={onChange}
        />
      );

      const input = screen.getByRole('textbox');
      const increment = screen.getByRole('button', { name: 'Increase value' });
      const decrement = screen.getByRole('button', { name: 'Decrease value' });

      await user.click(increment);
      expect(input).toHaveValue('4');
      expect(onChange).toHaveBeenLastCalledWith(4);

      await user.click(increment);
      expect(input).toHaveValue('4');

      await user.click(decrement);
      expect(input).toHaveValue('2');
      expect(onChange).toHaveBeenLastCalledWith(2);
    });
  });
});
