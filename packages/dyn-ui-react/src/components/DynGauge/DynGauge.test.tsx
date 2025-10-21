import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DynGauge } from './DynGauge';

describe('DynGauge', () => {
  beforeEach(() => {
    // Provide a stable requestAnimationFrame shim for animations
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const timeoutId = window.setTimeout(() => cb(performance.now()), 16);
      return timeoutId as unknown as number;
    });

    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      window.clearTimeout(id as unknown as number);
    });

    // Mock canvas 2D context methods used by the gauge drawing code
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      const context = {
        beginPath: vi.fn(),
        arc: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        clearRect: vi.fn(),
        fillText: vi.fn(),
        closePath: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      return context;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with default props', () => {
    render(<DynGauge value={50} />);

    const gauge = screen.getByTestId('dyn-gauge');
    expect(gauge).toBeInTheDocument();
    expect(gauge).toHaveAttribute('role', 'progressbar');
    expect(gauge).toHaveAttribute('data-size', 'medium');
    expect(gauge).toHaveAttribute('data-type', 'arc');
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('uses label as accessible title when title is not provided', () => {
    render(<DynGauge value={65} label="Server load" />);

    const gauge = screen.getByTestId('dyn-gauge');
    const title = screen.getByText('Server load');

    expect(title).toBeInTheDocument();
    expect(gauge).toHaveAttribute('aria-labelledby', title.id);
  });

  it('clamps the value to provided bounds', () => {
    render(<DynGauge value={150} min={0} max={100} animated={false} />);

    const gauge = screen.getByTestId('dyn-gauge');
    expect(gauge).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('supports custom value formatting', () => {
    render(
      <DynGauge
        value={42}
        animated={false}
        format={val => `${Math.round(val)} MB/s`}
        showRanges={false}
      />
    );

    expect(screen.getByText('42 MB/s')).toBeInTheDocument();
  });

  it('derives aria-valuetext from the formatter and passes through aria-label', () => {
    render(
      <DynGauge
        value={38.7}
        animated={false}
        showValue={false}
        format={val => `${Math.round(val)} MB/s`}
        aria-label="Network throughput"
      />
    );

    const gauge = screen.getByRole('progressbar', { name: 'Network throughput' });
    expect(gauge).toHaveAttribute('aria-valuetext', '39 MB/s');
  });

  it('allows overriding aria-valuetext via props', () => {
    render(
      <DynGauge
        value={25}
        animated={false}
        aria-label="Battery status"
        aria-valuetext="Battery quarter charged"
      />
    );

    const gauge = screen.getByRole('progressbar', { name: 'Battery status' });
    expect(gauge).toHaveAttribute('aria-valuetext', 'Battery quarter charged');
  });

  it('forwards additional aria-* attributes to the root progressbar', () => {
    render(
      <DynGauge
        value={40}
        animated={false}
        aria-label="Queue depth"
        aria-live="polite"
        aria-errormessage="queue-error"
      />
    );

    const gauge = screen.getByRole('progressbar', { name: 'Queue depth' });
    expect(gauge).toHaveAttribute('aria-live', 'polite');
    expect(gauge).toHaveAttribute('aria-errormessage', 'queue-error');
  });

  it('omits the value display when showValue is false', () => {
    render(<DynGauge value={70} showValue={false} animated={false} />);

    expect(screen.queryByText('70%')).not.toBeInTheDocument();
  });

  it('renders a legend entry for each range', () => {
    render(
      <DynGauge
        value={35}
        animated={false}
        ranges={[
          { from: 0, to: 33, color: '#4caf50', label: 'Low' },
          { from: 33, to: 66, color: '#ff9800', label: 'Medium' },
        ]}
      />
    );

    const legend = screen.getByText('Low').closest('figcaption');
    expect(legend).not.toBeNull();
    const legendScope = within(legend!);

    expect(legendScope.getByText('Low')).toBeInTheDocument();
    expect(legendScope.getByText('Medium')).toBeInTheDocument();
  });

});
