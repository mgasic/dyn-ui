import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { DynStepProps, DynStepRef, DynStepSpacingValue } from './DynStep.types';
import { DYN_STEP_DEFAULT_PROPS } from './DynStep.types';
import styles from './DynStep.module.css';

const SPACING_TOKEN_MAP = {
  none: '0',
  xs: 'var(--dyn-spacing-xs, 0.25rem)',
  sm: 'var(--dyn-spacing-sm, 0.5rem)',
  md: 'var(--dyn-spacing-md, 0.75rem)',
  lg: 'var(--dyn-spacing-lg, 1rem)',
  xl: 'var(--dyn-spacing-xl, 1.5rem)',
} as const;

type LayoutSpacingKey = keyof typeof SPACING_TOKEN_MAP;

const isLayoutSpacingToken = (value: DynStepSpacingValue | undefined): value is LayoutSpacingKey => {
  if (typeof value !== 'string') return false;
  return value in SPACING_TOKEN_MAP;
};

const resolveSpacingValue = (value: DynStepSpacingValue | undefined) => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    return value === 0 ? '0' : `${value}px`;
  }
  if (isLayoutSpacingToken(value)) {
    return SPACING_TOKEN_MAP[value];
  }
  return value;
};

export const DynStep = forwardRef(function DynStep<
  E extends React.ElementType = typeof DYN_STEP_DEFAULT_PROPS.as
>(
  {
    as,
    spacing = DYN_STEP_DEFAULT_PROPS.spacing,
    padding,
    className,
    style,
    children,
    'data-testid': dataTestId = DYN_STEP_DEFAULT_PROPS['data-testid'],
    ...rest
  }: DynStepProps<E>,
  ref: DynStepRef<E>
) {
  const Component = (as ?? DYN_STEP_DEFAULT_PROPS.as) as React.ElementType;

  const gapValue = resolveSpacingValue(spacing ?? DYN_STEP_DEFAULT_PROPS.spacing);
  const paddingValue = resolveSpacingValue(padding);

  const cssVariables: React.CSSProperties = {
    ...(gapValue ? { ['--dyn-step-gap' as const]: gapValue } : {}),
    ...(paddingValue !== undefined ? { ['--dyn-step-padding' as const]: paddingValue } : {}),
  };

  return (
    <Component
      ref={ref as any}
      className={cn(styles.root, className)}
      data-testid={dataTestId}
      style={{ ...cssVariables, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
});

DynStep.displayName = 'DynStep';

export default DynStep;
