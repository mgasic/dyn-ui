import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import DynChart from './DynChart';
import styles from './DynChart.module.css';
import type { ChartDataPoint, ChartSeries } from './DynChart.types';

const mockGetContext = vi.fn();

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
});

const mockCanvasContext: Record<string, any> = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  closePath: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  fillRect: vi.fn(),
  setLineDash: vi.fn(),
  strokeStyle: '#000',
  fillStyle: '#000',
  lineWidth: 1,
  font: '12px Arial',
  textAlign: 'center',
  lineCap: 'round',
  lineJoin: 'round',
};

beforeEach(() => {
  mockGetContext.mockReturnValue(mockCanvasContext);

  Object.keys(mockCanvasContext).forEach(key => {
    if (typeof mockCanvasContext[key as keyof typeof mockCanvasContext] === 'function') {
      (mockCanvasContext[key as keyof typeof mockCanvasContext] as unknown as Mock).mockClear();
    }
  });
});

const sampleData: ChartDataPoint[] = [
  { label: 'Jan', value: 10 },
  { label: 'Feb', value: 20 },
  { label: 'Mar', value: 15 },
  { label: 'Apr', value: 25 },
];

const multiSeriesData: ChartSeries[] = [
  { name: 'Series 1', data: sampleData },
  { name: 'Series 2', data: sampleData.map(point => ({ ...point, value: point.value * 2 })) },
];

describe('DynChart', () => {
  it('renders canvas element with accessible role', () => {
    render(<DynChart data={sampleData} title="Sales" />);

    const canvas = screen.getByRole('img', { name: 'Sales' });
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-label', 'Sales');
  });

  it('applies custom aria-label to the canvas element', () => {
    render(
      <DynChart
        id="custom-chart"
        data={sampleData}
        title="Sales"
        aria-label="Revenue chart visualization"
      />
    );

    const canvas = screen.getByRole('img', { name: 'Revenue chart visualization' });
    expect(canvas).toHaveAttribute('aria-label', 'Revenue chart visualization');
    expect(canvas).not.toHaveAttribute('aria-labelledby');
  });

  it('merges aria-labelledby values for figure and canvas elements', () => {
    const { container } = render(
      <>
        <h2 id="external-heading">Dashboard charts</h2>
        <DynChart
          id="dashboard-chart"
          data={sampleData}
          title="KPI Overview"
          aria-labelledby="external-heading"
        />
      </>
    );

    const figure = container.querySelector('figure');
    expect(figure).not.toBeNull();
    expect(figure as HTMLElement).toHaveAttribute(
      'aria-labelledby',
      'dashboard-chart-title external-heading'
    );

    const canvas = screen.getByRole('img', { name: 'KPI Overview Dashboard charts' });
    expect(canvas).not.toHaveAttribute('aria-label');
    expect(canvas).toHaveAttribute(
      'aria-labelledby',
      'dashboard-chart-title external-heading'
    );
  });

  it('merges base and custom class names', () => {
    const { container } = render(
      <DynChart data={sampleData} className="custom-chart" />
    );

    expect(container.firstChild).toHaveClass(styles.root!);
    expect(container.firstChild).toHaveClass('custom-chart');
  });

  it('applies variant class names for each chart type', () => {
    (['line', 'bar', 'pie', 'area'] as const).forEach(type => {
      const { container, unmount } = render(<DynChart data={sampleData} type={type} />);
      expect(container.firstChild).toHaveClass(styles.root!);
      const expectedClass =
        type === 'line'
          ? styles.typeLine
          : type === 'bar'
          ? styles.typeBar
          : type === 'pie'
          ? styles.typePie
          : styles.typeArea;
      expect(container.firstChild).toHaveClass(expectedClass!);
      unmount();
    });
  });

  it('renders legend items when enabled', () => {
    render(<DynChart data={multiSeriesData} showLegend />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Series 1')).toBeInTheDocument();
    expect(screen.getByText('Series 2')).toBeInTheDocument();
  });

  it('omits legend when disabled', () => {
    render(<DynChart data={multiSeriesData} showLegend={false} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders tooltip container only when enabled', () => {
    const { rerender, container } = render(<DynChart data={sampleData} showTooltip />);
    expect(container.querySelector(`.${styles.tooltip}`)).toBeInTheDocument();

    rerender(<DynChart data={sampleData} showTooltip={false} />);
    expect(container.querySelector(`.${styles.tooltip}`)).not.toBeInTheDocument();
  });

  it('initializes tooltip visibility as hidden', () => {
    const { container } = render(<DynChart data={sampleData} showTooltip />);

    const tooltip = container.querySelector(`.${styles.tooltip}`);
    expect(tooltip).toHaveAttribute('data-visible', 'false');
  });

  it('shows empty state message for empty data', () => {
    render(<DynChart data={[]} />);

    expect(screen.getByRole('status')).toHaveTextContent('No chart data available');
  });

  it('shows empty state message for zero-value series', () => {
    const zeroSeries: ChartDataPoint[] = [
      { label: 'A', value: 0 },
      { label: 'B', value: 0 },
    ];

    render(<DynChart data={zeroSeries} />);

    expect(screen.getByRole('status')).toHaveTextContent('Chart data contains no measurable values');
  });

  it('provides descriptive figcaption when ariaDescription is passed', () => {
    render(
      <DynChart data={sampleData} title="Chart" ariaDescription="Quarterly sales overview" />
    );

    const figcaption = screen.getByText('Quarterly sales overview');
    expect(figcaption.tagName).toBe('FIGCAPTION');
  });

  it('calls canvas drawing functions during render', () => {
    render(<DynChart data={sampleData} />);

    expect(mockGetContext).toHaveBeenCalledWith('2d');
    expect(mockCanvasContext.clearRect).toHaveBeenCalled();
  });

});
