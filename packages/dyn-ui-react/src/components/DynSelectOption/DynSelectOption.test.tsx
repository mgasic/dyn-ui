import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DynSelectOption } from './DynSelectOption';
import styles from '../DynSelect/DynSelect.module.css';

const baseOption = { value: 'value-1', label: 'Option Label' };

describe('DynSelectOption', () => {
  it('renders option label and dispatches selection callback', () => {
    const handleSelect = vi.fn();

    render(
      <DynSelectOption
        id="option-1"
        option={baseOption}
        isSelected={false}
        isActive={false}
        onSelect={handleSelect}
      />
    );

    const option = screen.getByRole('option', { name: 'Option Label' });
    fireEvent.click(option);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect.mock.calls[0][0]).toEqual(baseOption);
  });

  it('does not trigger selection when disabled', () => {
    const handleSelect = vi.fn();

    render(
      <DynSelectOption
        id="option-2"
        option={{ ...baseOption, disabled: true }}
        isSelected={false}
        isActive={false}
        onSelect={handleSelect}
      />
    );

    const option = screen.getByRole('option', { name: 'Option Label' });
    fireEvent.click(option);

    expect(handleSelect).not.toHaveBeenCalled();
    expect(option).toHaveAttribute('aria-disabled', 'true');
    expect(option).toHaveClass(styles.optionDisabled);
  });

  it('applies selected and active state classes', () => {
    render(
      <DynSelectOption
        id="option-3"
        option={baseOption}
        isSelected
        isActive
        onSelect={vi.fn()}
      />
    );

    const option = screen.getByRole('option', { name: 'Option Label' });
    expect(option).toHaveClass(styles.optionSelected);
    expect(option).toHaveClass(styles.optionActive);
  });

  it('notifies activation when hovered', () => {
    const handleActivate = vi.fn();

    render(
      <DynSelectOption
        id="option-4"
        option={baseOption}
        isSelected={false}
        isActive={false}
        onSelect={vi.fn()}
        onActivate={handleActivate}
      />
    );

    const option = screen.getByRole('option', { name: 'Option Label' });
    fireEvent.mouseEnter(option);

    expect(handleActivate).toHaveBeenCalledTimes(1);
    expect(handleActivate.mock.calls[0][0]).toEqual(baseOption);
  });

  it('renders checkbox indicator when in multiple mode', () => {
    render(
      <DynSelectOption
        id="option-5"
        option={baseOption}
        isSelected
        isActive={false}
        multiple
        onSelect={vi.fn()}
      />
    );

    const option = screen.getByRole('option', { name: 'Option Label' });
    const checkbox = option.querySelector(`.${styles.checkbox}`);
    expect(checkbox).toBeTruthy();
    expect(checkbox).toHaveClass(styles.checkboxChecked);
  });

  it('appends custom class names for styling hooks', () => {
    render(
      <DynSelectOption
        id="option-6"
        option={baseOption}
        isSelected
        isActive
        onSelect={vi.fn()}
        classNames={{
          root: 'custom-root',
          selected: 'custom-selected',
          active: 'custom-active',
          checkbox: 'custom-checkbox',
          checkboxChecked: 'custom-checkbox-checked',
          text: 'custom-text',
        }}
        multiple
      >
        Custom Label
      </DynSelectOption>
    );

    const option = screen.getByRole('option', { name: 'Custom Label' });
    expect(option).toHaveClass('custom-root');
    expect(option).toHaveClass('custom-selected');
    expect(option).toHaveClass('custom-active');

    const checkbox = option.querySelector(`.${styles.checkbox}`);
    expect(checkbox).toHaveClass('custom-checkbox');
    expect(checkbox).toHaveClass('custom-checkbox-checked');

    const text = option.querySelector(`.${styles.optionText}`);
    expect(text).toHaveClass('custom-text');
  });
});
