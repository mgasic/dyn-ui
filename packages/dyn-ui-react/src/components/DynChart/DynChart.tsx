import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MouseEvent } from 'react';
import { cn } from '../../utils/classNames';
import { DYN_CHART_DEFAULT_PROPS, DynChartProps } from './DynChart.types';
import {
  buildLegendItems,
  calculateChartDimensions,
  calculateDataRanges,
  getEmptyStateMessage,
  normalizeSeries,
} from './DynChart.utils';
import styles from './DynChart.module.css';

type TooltipTarget =
  | {
      kind: 'point';
      x: number;
      y: number;
      radius: number;
      value: number;
      label?: string;
      series: string;
      color: string;
    }
  | {
      kind: 'bar';
      x: number;
      y: number;
      width: number;
      height: number;
      value: number;
      label?: string;
      series: string;
      color: string;
    }
  | {
      kind: 'slice';
      startAngle: number;
      endAngle: number;
      centerX: number;
      centerY: number;
      radius: number;
      value: number;
      label?: string;
      series: string;
      color: string;
      percentage: number;
    };

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  value: number;
  label?: string;
  series?: string;
  color?: string;
  percentage?: number;
}

const normalizeAngle = (angle: number) => {
  const twoPi = Math.PI * 2;
  const normalized = angle % twoPi;
  return normalized >= 0 ? normalized : normalized + twoPi;
};

// const createTooltipState = (
//   target: TooltipTarget,
//   offsetX: number,
//   offsetY: number
// ): TooltipState => {
//   const nextState: TooltipState = {
//     visible: true,
//     x: offsetX + 12,
//     y: offsetY - 12,
//     value: target.value,
//   };

//   if (typeof target.series === 'string' && target.series.length > 0) {
//     nextState.series = target.series;
//   }

//   if (typeof target.color === 'string' && target.color.length > 0) {
//     nextState.color = target.color;
//   }

//   if (typeof target.label === 'string' && target.label.length > 0) {
//     nextState.label = target.label;
//   }

//   if (target.kind === 'slice') {
//     nextState.percentage = target.percentage;
//   }

//   return nextState;
// };

const typeClassNameMap: Record<'line' | 'bar' | 'pie' | 'area', string | undefined> = {
  line: styles.typeLine,
  bar: styles.typeBar,
  pie: styles.typePie,
  area: styles.typeArea,
};

const DynChart = forwardRef<HTMLDivElement, DynChartProps>((props, ref) => {
  const {
    type = DYN_CHART_DEFAULT_PROPS.type,
    data = DYN_CHART_DEFAULT_PROPS.data,
    title,
    subtitle,
    width = DYN_CHART_DEFAULT_PROPS.width,
    height = DYN_CHART_DEFAULT_PROPS.height,
    colors = DYN_CHART_DEFAULT_PROPS.colors,
    showLegend = DYN_CHART_DEFAULT_PROPS.showLegend,
    showTooltip = DYN_CHART_DEFAULT_PROPS.showTooltip,
    showGrid = DYN_CHART_DEFAULT_PROPS.showGrid,
    xAxis,
    yAxis,
    ariaDescription,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    role,
    className,
    id,
    children,
    'data-testid': dataTestId,
    ...rest
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipTargetsRef = useRef<TooltipTarget[]>([]);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    value: 0,
  });

  const instanceId = useId();
  const titleId = title ? `${id ?? instanceId}-title` : undefined;
  const subtitleId = subtitle ? `${id ?? instanceId}-subtitle` : undefined;
  const descriptionId = ariaDescription ? `${id ?? instanceId}-description` : undefined;

  const normalizedData = useMemo(
    () => normalizeSeries(data, colors),
    [data, colors]
  );

  const chartDimensions = useMemo(
    () => calculateChartDimensions(width, height),
    [width, height]
  );

  const dataRanges = useMemo(
    () => calculateDataRanges(normalizedData, yAxis),
    [normalizedData, yAxis]
  );

  const legendItems = useMemo(
    () => buildLegendItems(normalizedData),
    [normalizedData]
  );

  const emptyStateMessage = useMemo(
    () => getEmptyStateMessage(normalizedData),
    [normalizedData]
  );

  const hideTooltip = useCallback(() => {
    setTooltipState(prev => (prev.visible ? { ...prev, visible: false } : prev));
  }, []);

  const findTooltipTarget = useCallback((x: number, y: number) => {
    for (const target of tooltipTargetsRef.current) {
      if (target.kind === 'point') {
        const distance = Math.hypot(x - target.x, y - target.y);
        if (distance <= target.radius + 6) {
          return target;
        }
      } else if (target.kind === 'bar') {
        if (
          x >= target.x &&
          x <= target.x + target.width &&
          y >= target.y &&
          y <= target.y + target.height
        ) {
          return target;
        }
      } else if (target.kind === 'slice') {
        const dx = x - target.centerX;
        const dy = y - target.centerY;
        const distance = Math.hypot(dx, dy);

        if (distance > target.radius) {
          continue;
        }

        const angle = normalizeAngle(Math.atan2(dy, dx));
        const start = normalizeAngle(target.startAngle);
        const end = normalizeAngle(target.endAngle);

        if (end < start) {
          if (angle >= start || angle <= end) {
            return target;
          }
        } else if (angle >= start && angle <= end) {
          return target;
        }
      }
    }

    return undefined;
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!showTooltip) {
        return;
      }

      const { offsetX, offsetY } = event.nativeEvent;
      const target = findTooltipTarget(offsetX, offsetY);

      if (!target) {
        hideTooltip();
        return;
      }

      setTooltipState(prev => {
        const nextState: TooltipState = {
          visible: true,
          x: offsetX + 12,
          y: offsetY - 12,
          value: target.value,
          series: target.series,
          color: target.color,
        };
        if (target.kind === 'slice') {
          nextState.percentage = target.percentage;
        }

        if (typeof target.label === 'string' && target.label.length > 0) {
          nextState.label = target.label;
        }

        if (
          prev.visible &&
          prev.x === nextState.x &&
          prev.y === nextState.y &&
          prev.value === nextState.value &&
          prev.label === nextState.label &&
          prev.series === nextState.series &&
          prev.color === nextState.color &&
          prev.percentage === nextState.percentage
        ) {
          return prev;
        }

        return nextState;
      });
    },
    [findTooltipTarget, hideTooltip, showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    if (!showTooltip) {
      return;
    }

    hideTooltip();
  }, [hideTooltip, showTooltip]);

  useEffect(() => {
    if (!showTooltip) {
      hideTooltip();
    }
  }, [hideTooltip, showTooltip]);

  useEffect(() => () => hideTooltip(), [hideTooltip]);

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!showGrid || type === 'pie') return;

      const { padding, chartWidth, chartHeight } = chartDimensions;

      ctx.save();
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
      }

      const maxDataPoints = normalizedData.length
        ? Math.max(...normalizedData.map(series => series.data.length))
        : 0;

      if (maxDataPoints > 1) {
        const stepCount = Math.min(maxDataPoints - 1, 10);
        for (let i = 0; i <= stepCount; i++) {
          const x = padding.left + (chartWidth / stepCount) * i;
          ctx.beginPath();
          ctx.moveTo(x, padding.top);
          ctx.lineTo(x, padding.top + chartHeight);
          ctx.stroke();
        }
      }

      ctx.restore();
    },
    [chartDimensions, normalizedData, showGrid, type]
  );

  const drawAxes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (type === 'pie') return;

      const { padding, chartWidth, chartHeight } = chartDimensions;

      ctx.save();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + chartHeight);
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.stroke();

      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';

      if (xAxis?.title) {
        ctx.fillText(xAxis.title, padding.left + chartWidth / 2, chartDimensions.totalHeight - 10);
      }

      if (yAxis?.title) {
        ctx.save();
        ctx.translate(15, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(yAxis.title, 0, 0);
        ctx.restore();
      }

      ctx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const value = dataRanges.minY + ((dataRanges.maxY - dataRanges.minY) / 5) * (5 - i);
        const y = padding.top + (chartHeight / 5) * i;
        ctx.fillText(value.toFixed(1), padding.left - 10, y + 5);
      }

      ctx.restore();
    },
    [chartDimensions, dataRanges, type, xAxis?.title, yAxis?.title]
  );

  const drawLineOrAreaChart = useCallback(
    (ctx: CanvasRenderingContext2D, variant: 'line' | 'area') => {
      const { padding, chartWidth, chartHeight } = chartDimensions;
      const yRange = Math.max(dataRanges.maxY - dataRanges.minY || 0, 1);

      normalizedData.forEach((series, seriesIndex) => {
        const color = series.color || colors[seriesIndex % colors.length] || '#0066cc';

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (series.data.length === 0) return;

        ctx.beginPath();

        series.data.forEach((point, index) => {
          const x = padding.left + (chartWidth / Math.max(series.data.length - 1, 1)) * index;
          const y =
            padding.top +
            chartHeight -
            ((point.value - dataRanges.minY) / yRange) * chartHeight;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        if (variant === 'area') {
          const lastX =
            padding.left +
            (chartWidth / Math.max(series.data.length - 1, 1)) * (series.data.length - 1);
          const firstX = padding.left;
          const baseY = padding.top + chartHeight;

          ctx.lineTo(lastX, baseY);
          ctx.lineTo(firstX, baseY);
          ctx.closePath();
          ctx.globalAlpha = 0.15;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.stroke();

        series.data.forEach((point, index) => {
          const x = padding.left + (chartWidth / Math.max(series.data.length - 1, 1)) * index;
          const y =
            padding.top +
            chartHeight -
            ((point.value - dataRanges.minY) / yRange) * chartHeight;

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();

          if (showTooltip) {
            tooltipTargetsRef.current.push({
              kind: 'point',
              x,
              y,
              radius: 6,
              value: point.value,
              label: point.label ?? `Point ${index + 1}`,
              series: series.name,
              color,
            });
          }
        });
      });
    },
    [chartDimensions, colors, dataRanges, normalizedData, showTooltip]
  );

  const drawBarChart = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { padding, chartWidth, chartHeight } = chartDimensions;
      const yRange = Math.max(dataRanges.maxY - dataRanges.minY || 0, 1);

      if (!normalizedData.length) return;

      const maxDataPoints = normalizedData[0]?.data.length || 0;
      if (maxDataPoints === 0) return;

      const groupWidth = chartWidth / maxDataPoints;
      const barWidth = groupWidth * 0.8;
      const barSpacing = groupWidth * 0.2;

      normalizedData.forEach((series, seriesIndex) => {
        const color = series.color || colors[seriesIndex % colors.length] || '#0066cc';
        ctx.fillStyle = color;

        series.data.forEach((point, index) => {
          const x =
            padding.left +
            groupWidth * index +
            barSpacing / 2 +
            (barWidth / normalizedData.length) * seriesIndex;
          const individualWidth = barWidth / Math.max(normalizedData.length, 1);
          const barHeight = ((point.value - dataRanges.minY) / yRange) * chartHeight;
          const y = padding.top + chartHeight - barHeight;

          ctx.fillRect(x, y, individualWidth, barHeight);

          if (showTooltip) {
            tooltipTargetsRef.current.push({
              kind: 'bar',
              x,
              y,
              width: individualWidth,
              height: barHeight,
              value: point.value,
              label: point.label ?? `Category ${index + 1}`,
              series: series.name,
              color,
            });
          }
        });
      });
    },
    [chartDimensions, colors, dataRanges, normalizedData, showTooltip]
  );

  const drawPieChart = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { chartWidth, chartHeight } = chartDimensions;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 3;

      if (!normalizedData.length) return;

      const series = normalizedData[0];
      const dataPoints = series?.data ?? [];
      const total = dataPoints.reduce((sum, point) => sum + point.value, 0);

      if (total === 0) return;

      let currentAngle = -Math.PI / 2;

      dataPoints.forEach((point, index) => {
        const sliceAngle = (point.value / total) * 2 * Math.PI;
        const color = point.color || colors[index % colors.length] || '#0066cc';
        const nextAngle = currentAngle + sliceAngle;
        const percentage = total ? (point.value / total) * 100 : 0;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, nextAngle);
        ctx.closePath();
        ctx.fill();

        if (point.value / total > 0.05) {
          const labelAngle = currentAngle + sliceAngle / 2;
          const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
          const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${percentage.toFixed(1)}%`, labelX, labelY);
        }

        if (showTooltip) {
          tooltipTargetsRef.current.push({
            kind: 'slice',
            startAngle: currentAngle,
            endAngle: nextAngle,
            centerX,
            centerY,
            radius,
            value: point.value,
            label: point.label ?? '',
            series: series?.name ?? 'Series 1',
            color,
            percentage,
          });
        }

        currentAngle = nextAngle;
      });
    },
    [chartDimensions, colors, height, normalizedData, showTooltip, width]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    canvas.width = chartDimensions.totalWidth;
    canvas.height = chartDimensions.totalHeight;

    tooltipTargetsRef.current = [];
    hideTooltip();

    context.clearRect(0, 0, chartDimensions.totalWidth, chartDimensions.totalHeight);

    if (!normalizedData.length) {
      return;
    }

    drawGrid(context);
    drawAxes(context);

    switch (type) {
      case 'line':
        drawLineOrAreaChart(context, 'line');
        break;
      case 'area':
        drawLineOrAreaChart(context, 'area');
        break;
      case 'bar':
        drawBarChart(context);
        break;
      case 'pie':
        drawPieChart(context);
        break;
      default:
        drawLineOrAreaChart(context, 'line');
    }
  }, [
    chartDimensions,
    drawAxes,
    drawBarChart,
    drawGrid,
    drawLineOrAreaChart,
    drawPieChart,
    hideTooltip,
    normalizedData,
    type,
  ]);

  const figureAriaLabelledBy = [titleId, ariaLabelledBy].filter(Boolean).join(' ') || undefined;
  const describedByParts = [
    subtitle ? subtitleId : undefined,
    ariaDescription ? descriptionId : undefined,
    ariaDescribedBy,
  ].filter(Boolean);
  const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;
  const canvasAriaLabel =
    ariaLabel ?? (ariaLabelledBy ? undefined : title ?? 'Chart visualization');
  const canvasAriaLabelledBy = ariaLabel ? undefined : figureAriaLabelledBy;
  const canvasRole = role ?? 'img';

  return (
    <div
      {...rest}
      ref={ref}
      id={id}
      data-testid={dataTestId}
      className={cn(styles.root, typeClassNameMap[type], className)}
    >
      <figure className={styles.figure} aria-labelledby={figureAriaLabelledBy} aria-describedby={describedBy}>
        {(title || subtitle) && (
          <header className={styles.header}>
            {title && (
              <h3 id={titleId} className={styles.title}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p id={subtitleId} className={styles.subtitle}>
                {subtitle}
              </p>
            )}
          </header>
        )}

        <div className={styles.content}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            role={canvasRole}
            aria-label={canvasAriaLabel}
            aria-labelledby={canvasAriaLabelledBy}
            aria-describedby={describedBy}
            width={chartDimensions.totalWidth}
            height={chartDimensions.totalHeight}
            style={{ width, height }}
            onMouseMove={showTooltip ? handleMouseMove : undefined}
            onMouseLeave={showTooltip ? handleMouseLeave : undefined}
          />

          {showTooltip && (
            <div
              className={styles.tooltip}
              data-visible={tooltipState.visible}
              aria-hidden={!tooltipState.visible}
              style={{
                left: `${tooltipState.x}px`,
                top: `${tooltipState.y}px`,
              }}
            >
              {(tooltipState.series || tooltipState.color || typeof tooltipState.percentage === 'number') && (
                <div className={styles.tooltipHeader}>
                  {tooltipState.color && (
                    <span
                      className={styles.tooltipColor}
                      style={{ backgroundColor: tooltipState.color }}
                    />
                  )}
                  {tooltipState.series && (
                    <span className={styles.tooltipSeries}>{tooltipState.series}</span>
                  )}
                  {typeof tooltipState.percentage === 'number' && (
                    <span className={styles.tooltipPercentage}>
                      {tooltipState.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
              <div className={styles.tooltipValue}>{tooltipState.value}</div>
              {tooltipState.label && <div className={styles.tooltipLabel}>{tooltipState.label}</div>}
            </div>
          )}

          {emptyStateMessage && (
            <p className={styles.emptyState} role="status">
              {emptyStateMessage}
            </p>
          )}
        </div>

        {showLegend && legendItems.length > 0 && (
          <div className={styles.legend} role="list">
            {legendItems.map(item => (
              <div key={item.id} className={styles.legendItem} role="listitem">
                <span
                  className={styles.legendColor}
                  style={{ backgroundColor: normalizedData[item.seriesIndex]?.color }}
                />
                <span className={styles.legendLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {children}

        {ariaDescription && (
          <figcaption id={descriptionId} className={styles.visuallyHidden}>
            {ariaDescription}
          </figcaption>
        )}
      </figure>
    </div>
  );
});

DynChart.displayName = 'DynChart';

export { DynChart };
export default DynChart;
