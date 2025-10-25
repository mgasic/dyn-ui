import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { act, createRef, useState } from 'react';
import { testA11y } from '../../testing/accessibility';
import { DynTextArea } from './DynTextArea';
import type { DynTextAreaRef } from './DynTextArea.types';
import styles from './DynTextArea.module.css';

const classes = styles as Record<string, string>;

describe('DynTextArea', () => {
  const user = userEvent.setup();

  it('renders textarea with label and placeholder', () => {
    render(<DynTextArea name="bio" label="Bio" placeholder="Tell us about yourself" />);

    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Tell us about yourself');
  });

  it('respects rows and cols props', () => {
    render(<DynTextArea name="message" label="Message" rows={8} cols={40} />);

    const textarea = screen.getByLabelText('Message');
    expect(textarea).toHaveAttribute('rows', '8');
    expect(textarea).toHaveAttribute('cols', '40');
  });

  it('calls onChange with new value', async () => {
    const handleChange = vi.fn();
    render(<DynTextArea name="comments" label="Comments" onChange={handleChange} />);

    const textarea = screen.getByLabelText('Comments');
    await user.type(textarea, 'Hello world');

    expect(handleChange).toHaveBeenLastCalledWith('Hello world');
  });

  it('supports focus and blur handlers', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <DynTextArea
        name="notes"
        label="Notes"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );

    const textarea = screen.getByLabelText('Notes');
    await user.click(textarea);
    await user.tab();

    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows validation error when required and left empty on blur', async () => {
    render(<DynTextArea name="summary" label="Summary" required />);

    const textarea = screen.getByLabelText(/Summary/);
    await user.click(textarea);
    await user.tab();

    expect(await screen.findByText('Este campo é obrigatório')).toBeInTheDocument();
  });

  it('applies disabled and readonly states', () => {
    render(<DynTextArea name="status" label="Status" disabled readonly value="Fixed" />);

    const textarea = screen.getByLabelText('Status');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveClass(classes.textareaDisabled);
    expect(textarea).toHaveClass(classes.textareaReadonly);
  });

  it('sets resize classes based on prop', () => {
    const { rerender } = render(
      <DynTextArea name="resizable" label="Resizable" resize="none" />
    );

    let textarea = screen.getByLabelText('Resizable');
    expect(textarea).toHaveClass(classes.textareaResizeNone);

    rerender(
      <DynTextArea name="resizable" label="Resizable" resize="horizontal" />
    );
    textarea = screen.getByLabelText('Resizable');
    expect(textarea).toHaveClass(classes.textareaResizeHorizontal);

    rerender(<DynTextArea name="resizable" label="Resizable" resize="both" />);
    textarea = screen.getByLabelText('Resizable');
    expect(textarea).toHaveClass(classes.textareaResizeBoth);
  });

  it('does not render when visible is false', () => {
    const { container } = render(
      <DynTextArea name="hidden" label="Hidden" visible={false} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    await testA11y(<DynTextArea name="accessible" label="Accessible text" />);
  });

  it('supports controlled usage', async () => {
    const ControlledExample = () => {
      const [value, setValue] = useState('Initial');
      return (
        <DynTextArea
          name="controlled"
          label="Controlled"
          value={value}
          onChange={setValue}
        />
      );
    };

    render(<ControlledExample />);

    const textarea = screen.getByLabelText('Controlled');
    await user.clear(textarea);
    await user.type(textarea, 'Updated');

    expect(textarea).toHaveValue('Updated');
  });

  it('supports uncontrolled usage with defaultValue', async () => {
    render(
      <DynTextArea
        name="uncontrolled"
        label="Uncontrolled"
        defaultValue="Start"
      />
    );

    const textarea = screen.getByLabelText('Uncontrolled');
    await user.type(textarea, ' value');

    expect(textarea).toHaveValue('Start value');
  });

  it('auto-resizes when enabled', async () => {
    render(<DynTextArea name="auto" label="Auto" autoResize rows={2} />);

    const textarea = screen.getByLabelText('Auto');

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 160,
    });

    await user.type(textarea, 'Trigger resize');

    expect(textarea.style.height).toBe('160px');
  });

  it('renders status styling and updates aria-describedby', async () => {
    render(
      <DynTextArea
        id="status-field"
        name="status"
        label="Status"
        status="warning"
        statusMessage="Proverite unos"
        help="Dodatni savet"
        maxLength={50}
        showCharacterCount
      />
    );

    const textarea = screen.getByLabelText('Status');
    const statusMessage = screen.getByText('Proverite unos');
    const counter = screen.getByText('0/50');

    expect(textarea).toHaveClass(classes.textareaWarning);
    expect(statusMessage).toHaveAttribute('id', 'status-field-status');
    expect(counter).toHaveAttribute('id', 'status-field-counter');

    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy?.split(' ')).toEqual(
      expect.arrayContaining(['status-field-help', 'status-field-status', 'status-field-counter'])
    );

    await user.type(textarea, 'Hello');
    expect(screen.getByText('5/50')).toBeInTheDocument();
  });

  it('marks loading state as busy', () => {
    render(
      <DynTextArea
        name="loading"
        label="Loading"
        status="loading"
        statusMessage="Učitavanje..."
      />
    );

    const textarea = screen.getByLabelText('Loading');
    expect(textarea).toHaveAttribute('aria-busy', 'true');
    expect(textarea).toHaveClass(classes.textareaLoading);
  });

  it('forwards ref methods and native element', async () => {
    const ref = createRef<DynTextAreaRef>();

    render(
      <DynTextArea
        name="ref"
        label="Ref"
        defaultValue="Initial"
        ref={ref}
      />
    );

    expect(ref.current?.getElement()).toBeInstanceOf(HTMLTextAreaElement);

    act(() => {
      ref.current?.clear();
    });

    await waitFor(() => {
      expect(ref.current?.getValue()).toBe('');
      expect(ref.current?.getElement()?.value).toBe('');
    });
  });
});
