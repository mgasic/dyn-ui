import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import type { DynDatePickerProps } from '../../types/field.types';
import { DynDatePicker } from './DynDatePicker';

const formatAriaLabel = (locale: string, date: Date) =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

const ControlledDatePicker = ({
  initialValue,
  ...props
}: { initialValue?: Date } & Partial<DynDatePickerProps>) => {
  const [value, setValue] = React.useState<Date | null>(initialValue ?? null);
  return (
    <DynDatePicker
      name="controlled-date"
      label="Controlled Date"
      value={value}
      onChange={setValue}
      {...props}
    />
  );
};

describe('DynDatePicker', () => {
  it('renders with label and opens the calendar', async () => {
    render(<DynDatePicker name="test" label="Test Date Picker" />);

    expect(screen.getByLabelText('Test Date Picker')).toBeInTheDocument();

    const calendarButton = screen.getByLabelText('Abrir calendário');
    await userEvent.click(calendarButton);

    expect(screen.getByText('Hoje')).toBeInTheDocument();
    expect(screen.getByText('Limpar')).toBeInTheDocument();
  });

  it('selects a date from the calendar grid and closes the dropdown', async () => {
    render(
      <ControlledDatePicker
        initialValue={new Date('2024-05-15')}
        locale="en-US"
        format="MM/dd/yyyy"
      />
    );

    await userEvent.click(screen.getByLabelText('Abrir calendário'));

    const targetLabel = formatAriaLabel('en-US', new Date('2024-05-20'));
    await userEvent.click(screen.getByRole('gridcell', { name: targetLabel }));

    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('textbox')).toHaveValue('05/20/2024');
  });

  it('supports roving focus and directional navigation', async () => {
    render(
      <ControlledDatePicker
        initialValue={new Date('2024-05-15')}
        locale="en-US"
        format="MM/dd/yyyy"
      />
    );

    await userEvent.click(screen.getByLabelText('Abrir calendário'));

    const focusedLabel = formatAriaLabel('en-US', new Date('2024-05-15'));
    const focusedCell = await screen.findByRole('gridcell', { name: focusedLabel });
    expect(focusedCell).toHaveFocus();

    fireEvent.keyDown(focusedCell, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('data-date', '2024-05-16');
    });

    const nextFocused = document.activeElement as HTMLElement;
    fireEvent.keyDown(nextFocused, { key: 'Home' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('data-date', '2024-05-12');
    });

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'End' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('data-date', '2024-05-18');
    });
  });

  it('closes the calendar with Escape when focused inside the grid', async () => {
    render(<ControlledDatePicker initialValue={new Date('2024-05-15')} locale="en-US" />);

    await userEvent.click(screen.getByLabelText('Abrir calendário'));
    const focusedLabel = formatAriaLabel('en-US', new Date('2024-05-15'));
    const focusedCell = await screen.findByRole('gridcell', { name: focusedLabel });

    fireEvent.keyDown(focusedCell, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('disables days outside the provided range', async () => {
    render(
      <ControlledDatePicker
        initialValue={new Date('2024-05-15')}
        locale="en-US"
        minDate={new Date('2024-05-10')}
        maxDate={new Date('2024-05-20')}
      />
    );

    await userEvent.click(screen.getByLabelText('Abrir calendário'));

    const beforeRange = formatAriaLabel('en-US', new Date('2024-05-05'));
    const afterRange = formatAriaLabel('en-US', new Date('2024-05-25'));

    expect(screen.getByRole('gridcell', { name: beforeRange })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: afterRange })).toBeDisabled();
  });

  it('orders weekday headers based on locale', async () => {
    const { rerender } = render(
      <DynDatePicker name="locale-us" label="US" locale="en-US" />
    );

    await userEvent.click(screen.getByLabelText('Abrir calendário'));
    const usWeekdays = screen.getAllByTestId('dyn-datepicker-weekday');
    expect(usWeekdays[0]).toHaveTextContent(/sun/i);

    rerender(<DynDatePicker name="locale-gb" label="GB" locale="en-GB" />);
    await userEvent.click(screen.getByLabelText('Abrir calendário'));
    const gbWeekdays = screen.getAllByTestId('dyn-datepicker-weekday');
    expect(gbWeekdays[0]).toHaveTextContent(/mon/i);
  });

  it('announces the active date for assistive technologies', async () => {
    render(
      <ControlledDatePicker initialValue={new Date('2024-05-15')} locale="en-US" />
    );

    await userEvent.click(screen.getByLabelText('Abrir calendário'));

    const announcement = formatAriaLabel('en-US', new Date('2024-05-15'));
    expect(screen.getByText(announcement)).toBeInTheDocument();
  });
});
