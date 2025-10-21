import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DynSelectOption } from './DynSelectOption';
import styles from '../DynSelect/DynSelect.module.css';

const baseOption = { value: 'value-1', label: 'Option 1' };

describe('DynSelectOption', () => {
  it('renders the option label and forwards selection', () => {
    const handleSelect = vi.fn();

    render(
      <DynSelectOption
        id="option-1"
        index={0}
        option={baseOption}
        isSelected={false}
        isActive={false}
        isMultiple={false}
        onActivate={vi.fn()}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(handleSelect).toHaveBeenCalledWith(baseOption);
  });

  it('prevents selection and activation when disabled', () => {
    const handleSelect = vi.fn();
    const handleActivate = vi.fn();

    render(
      <DynSelectOption
        id="option-1"
        index={0}
        option={{ ...baseOption, disabled: true }}
        isSelected={false}
        isActive={false}
        isMultiple={false}
        onActivate={handleActivate}
        onSelect={handleSelect}
      />
    );

    const option = screen.getByRole('option', { name: 'Option 1' });
    fireEvent.click(option);
    fireEvent.mouseEnter(option);

    expect(handleSelect).not.toHaveBeenCalled();
    expect(handleActivate).not.toHaveBeenCalled();
    expect(option).toHaveAttribute('aria-disabled', 'true');
    expect(option).toHaveClass(styles.optionDisabled);
  });

  it('applies selected and active styles while exposing data attributes', () => {
    render(
      <DynSelectOption
        id="option-1"
        index={0}
        option={baseOption}
        isSelected
        isActive
        isMultiple={false}
        onActivate={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    const option = screen.getByRole('option', { name: 'Option 1' });
    expect(option).toHaveAttribute('data-active', 'true');
    expect(option).toHaveClass(styles.optionSelected);
    expect(option).toHaveClass(styles.optionActive);
  });

  it('renders checkbox indicator when used within a multiple select', () => {
    render(
      <DynSelectOption
        id="option-1"
        index={0}
        option={baseOption}
        isSelected
        isActive={false}
        isMultiple
        onActivate={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('option', { name: 'Option 1' }).querySelector('span');
    expect(checkbox).toHaveClass(styles.checkboxChecked);
  });
});
