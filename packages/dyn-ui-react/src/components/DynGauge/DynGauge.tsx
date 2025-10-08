import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { DynGaugeProps } from './DynGauge.types';
import styles from './DynGauge.module.css';

export const DynGauge: React.FC<DynGaugeProps> = ({
  value,
  min = 0,
  max = 100,
  title,
  subtitle,
  unit = '',
  ranges = [],
  showValue = true,
  showRanges = true,
  size = 'medium',
  thickness = 20,
  rounded = true,
  animated = true,
  color,
  backgroundColor = '#e0e0e0',
  className,
  format,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const currentValueRef = useRef<number>(min);

  // Calculate dimensions based on size
  const dimensions = useMemo(() => {
    const sizes = {
      small: { width: 120, height: 120 },
      medium: { width: 200, height: 200 },
      large: { width: 280, height: 280 },
    };
    return sizes[size];
  }, [size]);

  // Normalize value between 0 and 1
  const normalizedValue = useMemo(() => {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }, [value, min, max]);

  // Find current range
  const currentRange = useMemo(() => {
    if (!ranges.length) return null;
    return ranges.find(range => value >= range.from && value <= range.to) || null;
  }, [value, ranges]);

  // Get current color
  const currentColor = useMemo(() => {
    if (color) return color;
    if (currentRange) return currentRange.color;
    return '#0066cc'; // Default blue
  }, [color, currentRange]);

  // Format value function
  const formatValue = useCallback(
    (val: number): string => {
      if (format) return format(val);
      return `${val.toFixed(1)}${unit}`;
    },
    [format, unit]
  );

  // Animation function
  const animateToValue = useCallback(
    (targetValue: number) => {
      if (!animated) {
        currentValueRef.current = targetValue;
        return;
      }

      const startValue = currentValueRef.current;
      const distance = targetValue - startValue;
      const duration = 1000; // 1 second
      let startTime: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        currentValueRef.current = startValue + (distance * eased);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    },
    [animated]
  );

  // Draw gauge
  const drawGauge = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - thickness / 2 - 10;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.strokeStyle = backgroundColor;
    ctx.lineWidth = thickness;
    ctx.lineCap = rounded ? 'round' : 'butt';
    ctx.stroke();
    
    // Draw range arcs if enabled
    if (showRanges && ranges.length > 0) {
      ranges.forEach(range => {
        const startAngle = -Math.PI * 0.75 + 
          ((range.from - min) / (max - min)) * (Math.PI * 1.5);
        const endAngle = -Math.PI * 0.75 + 
          ((range.to - min) / (max - min)) * (Math.PI * 1.5);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = range.color;
        ctx.lineWidth = thickness * 0.3;
        ctx.stroke();
      });
    }
    
    // Draw value arc
    const currentNormalized = (currentValueRef.current - min) / (max - min);
    const endAngle = -Math.PI * 0.75 + currentNormalized * (Math.PI * 1.5);
    
    if (currentNormalized > 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, endAngle);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = thickness;
      ctx.lineCap = rounded ? 'round' : 'butt';
      ctx.stroke();
    }
    
    // Draw tick marks
    const tickCount = 11;
    for (let i = 0; i < tickCount; i++) {
      const angle = -Math.PI * 0.75 + (i / (tickCount - 1)) * (Math.PI * 1.5);
      const isMainTick = i % 2 === 0;
      const tickLength = isMainTick ? 15 : 8;
      const tickWidth = isMainTick ? 2 : 1;
      
      const startRadius = radius + thickness / 2 + 5;
      const endRadius = startRadius + tickLength;
      
      const startX = centerX + Math.cos(angle) * startRadius;
      const startY = centerY + Math.sin(angle) * startRadius;
      const endX = centerX + Math.cos(angle) * endRadius;
      const endY = centerY + Math.sin(angle) * endRadius;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = tickWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw tick labels for main ticks
      if (isMainTick) {
        const tickValue = min + (i / (tickCount - 1)) * (max - min);
        const labelRadius = endRadius + 15;
        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;
        
        ctx.fillStyle = '#666';
        ctx.font = `${size === 'small' ? '10' : size === 'medium' ? '12' : '14'}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tickValue.toFixed(0), labelX, labelY);
      }
    }
    
    // Draw needle
    const needleAngle = -Math.PI * 0.75 + currentNormalized * (Math.PI * 1.5);
    const needleLength = radius - 20;
    const needleX = centerX + Math.cos(needleAngle) * needleLength;
    const needleY = centerY + Math.sin(needleAngle) * needleLength;
    
    // Needle base
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = currentColor;
    ctx.fill();
    
    // Needle line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [dimensions, thickness, rounded, backgroundColor, showRanges, ranges, min, max, currentColor]);

  // Animation loop
  useEffect(() => {
    let frameId: number;
    
    const animate = () => {
      drawGauge();
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGauge]);

  // Animate to new value
  useEffect(() => {
    animateToValue(value);
  }, [value, animateToValue]);

  const gaugeClasses = classNames(
    styles['dyn-gauge'],
    styles[`dyn-gauge--${size}`],
    {
      [styles['dyn-gauge--animated']]: animated,
      [styles['dyn-gauge--rounded']]: rounded,
    },
    className
  );

  return (
    <div className={gaugeClasses}>
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles['dyn-gauge__header']}>
          {title && <h3 className={styles['dyn-gauge__title']}>{title}</h3>}
          {subtitle && <p className={styles['dyn-gauge__subtitle']}>{subtitle}</p>}
        </div>
      )}
      
      {/* Gauge */}
      <div className={styles['dyn-gauge__content']}>
        <div className={styles['dyn-gauge__canvas-container']}>
          <canvas
            ref={canvasRef}
            className={styles['dyn-gauge__canvas']}
            style={{
              width: dimensions.width,
              height: dimensions.height,
            }}
          />
          
          {/* Value display */}
          {showValue && (
            <div className={styles['dyn-gauge__value']}>
              <div className={styles['dyn-gauge__value-text']}>
                {formatValue(value)}
              </div>
              {currentRange?.label && (
                <div className={styles['dyn-gauge__value-label']}>
                  {currentRange.label}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Ranges legend */}
      {showRanges && ranges.length > 0 && (
        <div className={styles['dyn-gauge__legend']}>
          {ranges.map((range, index) => (
            <div key={index} className={styles['dyn-gauge__legend-item']}>
              <div
                className={styles['dyn-gauge__legend-color']}
                style={{ backgroundColor: range.color }}
              />
              <span className={styles['dyn-gauge__legend-label']}>
                {range.label || `${range.from}-${range.to}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DynGauge.displayName = 'DynGauge';

export default DynGauge;