import * as React from 'react';

import { classNames } from '../../utils/classNames';
import {
  DynContainerProps,
  DynContainerRef,
  DynContainerLayout,
} from './DynContainer.types';
import styles from './DynContainer.module.css';

const LAYOUT_VALUES: readonly DynContainerLayout[] = ['fluid', 'fixed', 'responsive'] as const;
const SIZE_VALUES = ['small', 'medium', 'large'] as const;

const isLayoutValue = (value?: DynContainerProps['size']): value is DynContainerLayout =>
  typeof value === 'string' && (LAYOUT_VALUES as readonly string[]).includes(value);

const isPaddingSize = (value?: DynContainerProps['size']): value is (typeof SIZE_VALUES)[number] =>
  typeof value === 'string' && (SIZE_VALUES as readonly string[]).includes(value);

/**
 * DynContainer - Flexible container component for grouping content
 * Provides layout, spacing and visual configuration options.
 */
export const DynContainer = React.forwardRef<DynContainerRef, DynContainerProps>(
  (
    {
      align,
      background = 'card',
      bordered,
      children,
      className,
      direction = 'vertical',
      height,
      justify,
      layout,
      maxWidth,
      noBorder,
      noPadding = false,
      shadow,
      size = 'medium',
      spacing = 'md',
      style,
      subtitle,
      tabIndex,
      title,
      'data-testid': dataTestId = 'dyn-container',
      ...rest
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(ref, () => ({
      focus() {
        containerRef.current?.focus();
      },
    }));

    const resolvedLayout: DynContainerLayout | undefined = layout ?? (isLayoutValue(size) ? size : undefined);
    const resolvedPaddingSize = isPaddingSize(size) ? size : !resolvedLayout && size ? 'medium' : undefined;

    const shouldApplyBorder = bordered ?? !noBorder;
    const shouldApplyShadow = shadow ?? shouldApplyBorder;

    const backgroundClass = background
      ? styles[`dyn-container--background-${background}`]
      : undefined;
    const spacingClass = spacing ? styles[`dyn-container--spacing-${spacing}`] : undefined;
    const paddingClass = resolvedPaddingSize
      ? styles[`dyn-container--size-${resolvedPaddingSize}`]
      : undefined;
    const layoutClass = resolvedLayout ? styles[`dyn-container--layout-${resolvedLayout}`] : undefined;

    const containerClasses = classNames(
      styles['dyn-container'],
      styles[`dyn-container--direction-${direction}`],
      backgroundClass,
      spacingClass,
      paddingClass,
      layoutClass,
      {
        [styles['dyn-container--align-start']]: align === 'start',
        [styles['dyn-container--align-center']]: align === 'center',
        [styles['dyn-container--align-end']]: align === 'end',
        [styles['dyn-container--align-stretch']]: align === 'stretch',
        [styles['dyn-container--justify-start']]: justify === 'start',
        [styles['dyn-container--justify-center']]: justify === 'center',
        [styles['dyn-container--justify-end']]: justify === 'end',
        [styles['dyn-container--justify-between']]: justify === 'between',
        [styles['dyn-container--justify-around']]: justify === 'around',
        [styles['dyn-container--justify-evenly']]: justify === 'evenly',
        [styles['dyn-container--no-border']]: !shouldApplyBorder,
        [styles['dyn-container--bordered']]: shouldApplyBorder,
        [styles['dyn-container--shadow']]: shouldApplyShadow,
        [styles['dyn-container--no-padding']]: noPadding,
        [styles['dyn-container--with-title']]: Boolean(title || subtitle),
      },
      className
    );

    const containerStyle: React.CSSProperties = {
      ...style,
      ...(height !== undefined
        ? { height: typeof height === 'number' ? `${height}px` : height }
        : null),
      ...(maxWidth !== undefined
        ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
        : null),
    };

    return (
      <div
        ref={node => {
          containerRef.current = node;
        }}
        className={containerClasses}
        style={containerStyle}
        data-testid={dataTestId}
        tabIndex={tabIndex ?? -1}
        {...rest}
      >
        {(title || subtitle) && (
          <header className={styles['dyn-container__header']}>
            {title && (
              typeof title === 'string' ? (
                <h2 className={styles['dyn-container__title']}>{title}</h2>
              ) : (
                <div className={styles['dyn-container__title']}>{title}</div>
              )
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className={styles['dyn-container__subtitle']}>{subtitle}</p>
              ) : (
                <div className={styles['dyn-container__subtitle']}>{subtitle}</div>
              )
            )}
          </header>
        )}
        <div className={styles['dyn-container__content']}>
          {children}
        </div>
      </div>
    );
  }
);

DynContainer.displayName = 'DynContainer';

export default DynContainer;
