import * as React from 'react';
import { DynContainerProps, DynContainerRef } from './DynContainer.types';
import { classNames } from '../../utils/classNames';
import styles from './DynContainer.module.css';

/**
 * DynContainer - Flexible container component for grouping content
 * Follows DYN UI specification for layout components
 */
export const DynContainer = React.forwardRef<DynContainerRef, DynContainerProps>(
  (
    {
      height,
      noBorder = false,
      noPadding = false,
      title,
      className,
      children,
      style,
      ...rest
    },
    ref
  ) => {
    // Build CSS classes
    const containerClasses = classNames(
      styles['dyn-container'],
      {
        [styles['dyn-container--no-border']]: noBorder,
        [styles['dyn-container--no-padding']]: noPadding,
        [styles['dyn-container--with-title']]: !!title,
      },
      className
    );

    // Build container styles
    const containerStyle: React.CSSProperties = {
      ...style,
      ...(height && { height: `${height}px` })
    };

    // Imperative API
    React.useImperativeHandle(ref, () => ({
      focus() {
        // Container focus implementation if needed
        console.log('DynContainer focused');
      }
    }));

    return (
      <div
        className={containerClasses}
        style={containerStyle}
        data-testid="dyn-container"
        {...rest}
      >
        {title && (
          <div className={styles['dyn-container__header']}>
            <h2 className={styles['dyn-container__title']}>{title}</h2>
          </div>
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
