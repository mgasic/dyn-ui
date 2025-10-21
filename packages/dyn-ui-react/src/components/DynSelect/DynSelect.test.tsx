import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DynSelect } from './DynSelect';
import styles from './DynSelect.module.css';

const DynSelectAny = DynSelect as any;

const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('DynSelect', () => {
  it('renders with label', () => {
    render(<label>Test Select<DynSelectAny name="test" options={sampleOptions} /></label>);
    expect(screen.getByText('Test Select')).toBeInTheDocument();
  });

  it('displays placeholder when no value selected', () => {
    render(<label>Test<DynSelectAny name="test" options={sampleOptions} placeholder="Choose option" /></label>);
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<label>Test<DynSelectAny name="test" options={sampleOptions} /></label>);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('selects option when clicked', () => {
    const handleChange = vi.fn();
    render(<label>Test<DynSelectAny name="test" options={sampleOptions} onChange={handleChange} /></label>);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles multiple selection', () => {
    const handleChange = vi.fn();
    render(
      <label>
        Test
        <DynSelectAny
          name="test"
          options={sampleOptions}
          multiple
          onChange={handleChange}
        />
      </label>
    );

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    expect(handleChange).toHaveBeenCalled();
  });

  it('searchable filters options', () => {
    render(
      <label>
        Test
        <DynSelectAny
          name="test"
          options={sampleOptions}
          searchable
        />
      </label>
    );

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.change(searchInput, { target: { value: 'Option 1' } });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('prevents interaction when disabled', () => {
    const handleChange = vi.fn();
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} disabled onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('prevents selection of disabled options', () => {
    const handleChange = vi.fn();
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const disabledOption = screen.getByText('Option 3');
    fireEvent.click(disabledOption);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('activates options on hover and ignores disabled ones', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const option2 = screen.getByRole('option', { name: 'Option 2' });
    const option3 = screen.getByRole('option', { name: 'Option 3' });

    fireEvent.mouseEnter(option2);
    expect(option2).toHaveClass(styles.optionActive);

    fireEvent.mouseEnter(option3);
    expect(option3).not.toHaveClass(styles.optionActive);
    expect(option2).toHaveClass(styles.optionActive);
  });

  it('tracks the active option for keyboard navigation', () => {
    const handleChange = vi.fn();
    render(
      <label>
        Test
        <DynSelectAny name="test" options={sampleOptions} onChange={handleChange} />
      </label>
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.focus(combobox);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });
    const option1 = screen.getByRole('option', { name: 'Option 1' });
    expect(option1).toHaveClass(styles.optionActive);
    const activeId = combobox.getAttribute('aria-activedescendant');
    expect(activeId).toBe(option1.getAttribute('id'));

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });
    const option2 = screen.getByRole('option', { name: 'Option 2' });
    expect(option2).toHaveClass(styles.optionActive);
    expect(option1).not.toHaveClass(styles.optionActive);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'End' });
    });
    expect(option2).toHaveClass(styles.optionActive);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'Home' });
    });
    expect(option1).toHaveClass(styles.optionActive);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'Enter' });
    });
    expect(handleChange).toHaveBeenCalledWith('option1');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles page navigation and skips disabled options', () => {
    render(
      <label>
        Test
        <DynSelectAny name="test" options={sampleOptions} />
      </label>
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.focus(combobox);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });
    const option1 = screen.getByRole('option', { name: 'Option 1' });
    const option2 = screen.getByRole('option', { name: 'Option 2' });
    const option3 = screen.getByRole('option', { name: 'Option 3' });

    act(() => {
      fireEvent.keyDown(combobox, { key: 'PageDown' });
    });
    expect(option2).toHaveClass(styles.optionActive);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });
    expect(option3).not.toHaveClass(styles.optionActive);
    expect(option1).toHaveClass(styles.optionActive);

    act(() => {
      fireEvent.keyDown(combobox, { key: 'PageUp' });
    });
    expect(option2).toHaveClass(styles.optionActive);
  });

  it('supports character search to jump to options', () => {
    const alphaOptions = [
      { value: 'alpha', label: 'Alpha' },
      { value: 'bravo', label: 'Bravo' },
      { value: 'charlie', label: 'Charlie' },
    ];

    render(
      <label>
        Test
        <DynSelectAny name="test" options={alphaOptions} />
      </label>
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.focus(combobox);

    vi.useFakeTimers();

    act(() => {
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    });
    act(() => {
      fireEvent.keyDown(combobox, { key: 'c' });
    });

    const charlie = screen.getByRole('option', { name: 'Charlie' });
    expect(charlie).toHaveClass(styles.optionActive);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    act(() => {
      fireEvent.keyDown(combobox, { key: 'b' });
    });
    const bravo = screen.getByRole('option', { name: 'Bravo' });
    expect(bravo).toHaveClass(styles.optionActive);

    vi.useRealTimers();
  });

  it('displays selected value', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} value="option2" />);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} loading />);
    // if loading shows a spinner or similar, ensure combobox still renders
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('displays help and error text', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} help="Help text" />);
    expect(screen.getByText('Help text')).toBeInTheDocument();

    render(<DynSelectAny name="test" label="Test" options={sampleOptions} errorMessage="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} size="large" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass(styles.selectSizeLarge);
  });

  it('applies custom className', () => {
    const { container } = render(
      <DynSelectAny name="test" label="Test" options={sampleOptions} className="custom-select" />
    );
    expect(container.firstChild).toHaveClass('custom-select');
  });

  it('shows empty state when no options match search', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} searchable />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
  });

  it('hides when not visible', () => {
    render(<DynSelectAny name="test" label="Test" options={sampleOptions} visible={false} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
