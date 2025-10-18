import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { testA11y } from '../../testing/accessibility';
import { DynTextArea } from './DynTextArea';
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
});
