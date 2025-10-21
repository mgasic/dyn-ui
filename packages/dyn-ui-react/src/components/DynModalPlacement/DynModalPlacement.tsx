import React, { forwardRef, useMemo } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './DynModalPlacement.module.css';
import type {
  DynModalPlacementProps,
  DynModalVerticalPlacement,
  DynModalHorizontalAlignment,
  DynModalPlacementStrategy
} from './DynModalPlacement.types';

const resolveSpacingValue = (value?: number | string): string | undefined => {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
};

const STRATEGY_CLASS_MAP: Record<DynModalPlacementStrategy, string> = {
  fixed: styles.strategyFixed,
  absolute: styles.strategyAbsolute,
  relative: styles.strategyRelative
};

const PLACEMENT_CLASS_MAP: Record<DynModalVerticalPlacement, string> = {
  top: styles.placementTop,
  center: styles.placementCenter,
  bottom: styles.placementBottom,
  fullscreen: styles.placementFullscreen
};

const ALIGNMENT_CLASS_MAP: Record<DynModalHorizontalAlignment, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch
};

export const DynModalPlacement = forwardRef<HTMLDivElement, DynModalPlacementProps>(
  (
    {
      placement = 'center',
      alignment = 'center',
      strategy = 'fixed',
      padding,
      gap,
      allowOverflow = false,
      fullHeight = false,
      wrapperClassName,
      wrapperStyle,
      className,
      children,
      style,
      ...rest
    },
    ref
  ) => {
    const spacingVariables = useMemo(() => {
      const variables: Record<string, string> = {};
      const paddingValue = resolveSpacingValue(padding);
      const gapValue = resolveSpacingValue(gap);

      if (paddingValue) {
        variables['--dyn-modal-placement-padding'] = paddingValue;
      }
      if (gapValue) {
        variables['--dyn-modal-placement-gap'] = gapValue;
      }

      return variables;
    }, [padding, gap]);

    const mergedStyle = useMemo(() => ({
      ...spacingVariables,
      ...wrapperStyle,
      ...style
    }), [spacingVariables, wrapperStyle, style]);

    const resolvedClassName = classNames(
      styles.dynModalPlacement,
      STRATEGY_CLASS_MAP[strategy],
      PLACEMENT_CLASS_MAP[placement],
      ALIGNMENT_CLASS_MAP[alignment],
      allowOverflow && styles.allowOverflow,
      fullHeight && styles.fullHeight,
      wrapperClassName,
      className
    );

    return (
      <div
        ref={ref}
        className={resolvedClassName}
        style={mergedStyle}
        data-alignment={alignment}
        data-placement={placement}
        data-strategy={strategy}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

DynModalPlacement.displayName = 'DynModalPlacement';

export type { DynModalPlacementProps } from './DynModalPlacement.types';
