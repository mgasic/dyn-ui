import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DynSelect } from './DynSelect';
import styles from './DynSelect.module.css';

type Option = { value: string; label: string; disabled?: boolean };

const DynSelectAny = DynSelect as any;

const sampleOptions: Option[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('DynSelect', () => {
  it('renders with label and placeholder', () => {
    render(
      <DynSelectAny
        name="test"
        label="Test Select"
        options={sampleOptions}
        placeholder="Choose option"
      />
    );

    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('opens dropdown and allows option selection', () => {
    const handleChange = vi.fn();
    render(
      <DynSelectAny
        name="test"
        options={sampleOptions}
        onChange={handleChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);
    const option = screen.getByRole('option', { name: 'Option 1' });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('option1');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('ignores disabled options', () => {
    const handleChange = vi.fn();
    render(
      <DynSelectAny
        name="test"
        options={sampleOptions}
        onChange={handleChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);
    fireEvent.click(screen.getByRole('option', { name: 'Option 3' }));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('toggles values in multiple mode', () => {
    const handleChange = vi.fn();
    render(
      <DynSelectAny
        name="test"
        options={sampleOptions}
        multiple
        onChange={handleChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);
    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(handleChange).toHaveBeenCalledWith(['option1']);

    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(handleChange).toHaveBeenLastCalledWith([]);
  });

  it('filters options when searchable', () => {
    render(
      <DynSelectAny
        name="test"
        options={sampleOptions}
        searchable
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);
    fireEvent.change(screen.getByPlaceholderText('Pesquisar...'), {
      target: { value: 'Option 2' },
    });

    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument();
  });

  it('updates active descendant during keyboard navigation', () => {
    const handleChange = vi.fn();
    render(
      <DynSelectAny
        name="test"
        options={sampleOptions}
        onChange={handleChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.focus(combobox);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });

    const firstOption = screen.getByRole('option', { name: 'Option 1' });
    expect(firstOption).toHaveClass(styles.optionActive);
    expect(combobox).toHaveAttribute('aria-activedescendant', firstOption.id);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });

    const secondOption = screen.getByRole('option', { name: 'Option 2' });
    expect(secondOption).toHaveClass(styles.optionActive);
    expect(firstOption).not.toHaveClass(styles.optionActive);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'Enter' });
    });

    expect(handleChange).toHaveBeenCalledWith('option2');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });
});
