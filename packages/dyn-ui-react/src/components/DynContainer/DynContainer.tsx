import * as React from 'react';
import { DynContainerProps, DynContainerRef } from './DynContainer.types';
import { classNames } from '../../utils/classNames';
import styles from './DynContainer.module.css';

type ContainerFocusOptions = Parameters<HTMLElement['focus']>[0];

/**
 * DynContainer - Flexible container component for grouping content
 * Follows DYN UI specification for layout components
 */
export const DynContainer = React.forwardRef<DynContainerRef, DynContainerProps>(
  (
    {
      align = 'stretch',
      background = 'card',
      bordered,
      children,
      className,
      direction = 'vertical',
      height,
      justify = 'start',
      layout = 'responsive',
      maxWidth,
      noBorder = false,
      noPadding = false,
      shadow = false,
      size = 'medium',
      spacing = 'md',
      style,
      subtitle,
      tabIndex,
      title,
      ...rest
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const resolveMeasurement = (value?: string | number) => {
      if (value === undefined) return undefined;
      return typeof value === 'number' ? `${value}px` : value;
    };

    const resolveTokenClass = (prefix: string, value?: string | number) => {
      if (!value) return undefined;
      return styles[`dyn-container--${prefix}-${value}`];
    };

    const shouldShowBorder = bordered ?? !noBorder;

    const containerClasses = classNames(
      styles['dyn-container'],
      resolveTokenClass('size', size),
      resolveTokenClass('spacing', spacing),
      resolveTokenClass('layout', layout),
      resolveTokenClass('background', background),
      resolveTokenClass('direction', direction),
      resolveTokenClass('align', align),
      resolveTokenClass('justify', justify),
      {
        [styles['dyn-container--bordered']]: shouldShowBorder,
        [styles['dyn-container--no-border']]: !shouldShowBorder,
        [styles['dyn-container--shadow']]: shadow,
        [styles['dyn-container--no-padding']]: noPadding,
        [styles['dyn-container--with-title']]: Boolean(title || subtitle),
      },
      className
    );

    const resolvedHeight = resolveMeasurement(height);
    const resolvedMaxWidth = resolveMeasurement(maxWidth);

    const containerStyle: React.CSSProperties = {
      ...style,
      ...(resolvedHeight && { height: resolvedHeight }),
      ...(resolvedMaxWidth && { maxWidth: resolvedMaxWidth }),
    };

    React.useImperativeHandle(
      ref,
      () => ({
        focus: (options?: ContainerFocusOptions) => {
          if (!containerRef.current) return;
          if (tabIndex === undefined && !containerRef.current.hasAttribute('tabindex')) {
            containerRef.current.setAttribute('tabindex', '-1');
          }
          containerRef.current.focus(options);
        },
      }),
      [tabIndex]
    );

    return (
      <div
        ref={containerRef}
        className={containerClasses}
        style={containerStyle}
        tabIndex={tabIndex ?? -1}
        data-testid="dyn-container"
        {...rest}
      >
        {(title || subtitle) && (
          <div className={styles['dyn-container__header']}>
            {title && <h2 className={styles['dyn-container__title']}>{title}</h2>}
            {subtitle && <p className={styles['dyn-container__subtitle']}>{subtitle}</p>}
          </div>
        )}
        <div className={styles['dyn-container__content']}>{children}</div>
      </div>
    );
  }
);

DynContainer.displayName = 'DynContainer';

export default DynContainer;
