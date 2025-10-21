import type { FormEvent } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Controller, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { DynCheckbox } from './DynCheckbox';

describe('DynCheckbox', () => {
  it('renders with label', () => {
    render(<DynCheckbox name="test" label="Test Checkbox" />);
    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    const { rerender } = render(<DynCheckbox name="test" label="Test" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(<DynCheckbox name="test" label="Test" checked />);
    expect(checkbox).toBeChecked();
  });

  it('handles indeterminate state', () => {
    render(<DynCheckbox name="test" label="Test" indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<DynCheckbox name="test" label="Test" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('handles keyboard activation for Space and Enter', () => {
    const handleChange = vi.fn();
    render(<DynCheckbox name="test" label="Test" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: ' ' });
    fireEvent.keyDown(checkbox, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenNthCalledWith(1, true);
    expect(handleChange).toHaveBeenNthCalledWith(2, false);
  });

  it('prevents interaction when disabled', () => {
    const handleChange = vi.fn();
    render(<DynCheckbox name="test" label="Test" disabled onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
    expect(checkbox).toBeDisabled();
  });

  it('prevents interaction when readonly', () => {
    const handleChange = vi.fn();
    render(<DynCheckbox name="test" label="Test" readonly onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows loading spinner and blocks interaction', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <DynCheckbox name="test" label="Test" loading onChange={handleChange} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('[data-loading="true"]')).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('displays help text and links it via aria-describedby', () => {
    render(<DynCheckbox name="test" label="Test" help="Help text" />);
    const checkbox = screen.getByRole('checkbox');

    expect(screen.getByText('Help text')).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-describedby', 'test-help');
  });

  it('displays error message and sets aria attributes', () => {
    render(<DynCheckbox name="test" label="Test" errorMessage="Error" />);
    const checkbox = screen.getByRole('checkbox');

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby', 'test-error');
  });

  it('shows required indicator', () => {
    render(<DynCheckbox name="test" label="Test" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<DynCheckbox name="test" label="Test" size="large" />);
    expect(container.querySelector('[data-size="large"]')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DynCheckbox name="test" label="Test" className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <DynCheckbox
        name="test"
        label="Test"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.focus(checkbox);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(checkbox);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('hides when not visible', () => {
    render(<DynCheckbox name="test" label="Test" visible={false} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('handles validation with required prop', async () => {
    render(<DynCheckbox name="test" label="Test" required />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.blur(checkbox);
    await waitFor(() => expect(checkbox).toHaveAttribute('aria-invalid', 'true'));
  });

  it('integrates with native form submission', () => {
    const handleSubmit = vi.fn<(value: FormDataEntryValue | null) => void>();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      handleSubmit(data.get('terms'));
    };

    render(
      <form onSubmit={onSubmit}>
        <DynCheckbox name="terms" label="Accept terms" />
        <button type="submit">Submit</button>
      </form>
    );

    const checkbox = screen.getByLabelText('Accept terms');
    const form = checkbox.closest('form') as HTMLFormElement;

    fireEvent.click(checkbox);
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('on');
  });

  it('integrates with react-hook-form including validation feedback', async () => {
    const handleSubmit = vi.fn<(values: { consent: boolean }, event?: unknown) => void>();

    const TestForm = ({ onSubmit }: { onSubmit: (values: { consent: boolean }) => void }) => {
      const { control, handleSubmit: submit } = useForm<{ consent: boolean }>({
        defaultValues: { consent: false }
      });

      return (
        <form onSubmit={submit(onSubmit)}>
          <Controller
            name="consent"
            control={control}
            rules={{ required: 'Consent is required' }}
            render={({ field, fieldState }) => (
              <DynCheckbox
                label="Consent"
                name={field.name}
                checked={field.value}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                validation={[{ type: 'required', message: 'Consent is required' }]}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<TestForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    );

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(submitButton);

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

    const lastCall = handleSubmit.mock.calls.at(-1);
    expect(lastCall?.[0]).toEqual({ consent: true });
  });
});
