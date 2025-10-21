import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import { DynDatePicker } from './DynDatePicker';

const createUser = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

describe('DynDatePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates value and closes when selecting a day', async () => {
    const user = createUser();

    const ControlledDatePicker = () => {
      const [selected, setSelected] = useState<Date | null>(null);
      return (
        <DynDatePicker
          name="event"
          label="Event date"
          locale="en-US"
          format="MM/dd/yyyy"
          value={selected}
          onChange={setSelected}
        />
      );
    };

    render(<ControlledDatePicker />);

    await user.click(screen.getByLabelText('Abrir calendário'));

    const targetDay = await screen.findByRole('gridcell', {
      name: 'Thursday, January 18, 2024',
    });

    await user.click(targetDay);

    const input = screen.getByLabelText('Event date');
    expect(input).toHaveValue('01/18/2024');

    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports roving focus with arrow, home and end keys', async () => {
    const user = createUser();

    render(<DynDatePicker name="date" label="Choose date" locale="en-US" />);

    const input = screen.getByLabelText('Choose date');
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    let activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-15');

    await user.keyboard('{ArrowRight}');
    activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-16');

    await user.keyboard('{ArrowUp}');
    activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-09');

    await user.keyboard('{End}');
    activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-13');

    await user.keyboard('{Home}');
    activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-07');
  });

  it('clamps navigation within the configured date range', async () => {
    const user = createUser();

    render(
      <DynDatePicker
        name="range"
        label="Range"
        locale="en-US"
        minDate={new Date(2024, 0, 10)}
        maxDate={new Date(2024, 0, 20)}
      />
    );

    const input = screen.getByLabelText('Range');
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    let activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-15');

    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    activeElement = document.activeElement as HTMLButtonElement;
    expect(activeElement).toHaveAttribute('data-date', '2024-01-10');

    const disabledDay = screen.getByRole('gridcell', {
      name: 'Tuesday, January 9, 2024',
    });
    expect(disabledDay).toHaveAttribute('aria-disabled', 'true');
  });

  it('localizes calendar labels and accessible text', async () => {
    const user = createUser();

    render(<DynDatePicker name="fr" label="Date" locale="fr-FR" />);

    await user.click(screen.getByLabelText('Abrir calendário'));

    expect(screen.getByText(/^janvier 2024$/i)).toBeInTheDocument();
    expect(screen.getByText(/lun\./i)).toBeInTheDocument();

    const focusedDay = await screen.findByRole('gridcell', {
      name: /lundi 15 janvier 2024/i,
    });
    expect(focusedDay).toHaveAttribute('aria-label', expect.stringMatching(/lundi 15 janvier 2024/i));
  });

  it('closes the calendar with Escape and toggles expanded state', async () => {
    const user = createUser();

    render(<DynDatePicker name="escape" label="Escape" locale="en-US" />);

    const input = screen.getByLabelText('Escape');
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('grid')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
