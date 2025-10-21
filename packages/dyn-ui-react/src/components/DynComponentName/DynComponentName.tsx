import React, { forwardRef, useMemo } from 'react';
import { cn } from '../../utils/classNames';
import type {
  DynComponentNameBreakpoint,
  DynComponentNameProps,
  DynComponentNameRef,
  DynComponentNameResponsiveSpacingValue,
  DynComponentNameSpacingToken,
} from './DynComponentName.types';
import styles from './DynComponentName.module.css';

const RESPONSIVE_BREAKPOINTS: Exclude<DynComponentNameBreakpoint, 'base'>[] = ['sm', 'md', 'lg', 'xl'];

const SPACING_TOKENS: Record<Exclude<DynComponentNameSpacingToken, '0' | 'auto'>, string> = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

const isResponsiveObject = (
  value: DynComponentNameResponsiveSpacingValue | undefined
): value is Partial<Record<DynComponentNameBreakpoint, DynComponentNameResponsiveSpacingValue>> =>
  typeof value === 'object' && value !== null;

const resolveSpacingValue = (
  value: DynComponentNameResponsiveSpacingValue | undefined
): {
  base?: DynComponentNameResponsiveSpacingValue;
  responsive: Partial<Record<Exclude<DynComponentNameBreakpoint, 'base'>, DynComponentNameResponsiveSpacingValue>>;
} => {
  if (value === undefined) {
    return { responsive: {} };
  }

  if (!isResponsiveObject(value)) {
    return { base: value, responsive: {} };
  }

  const responsive: Partial<Record<Exclude<DynComponentNameBreakpoint, 'base'>, DynComponentNameResponsiveSpacingValue>> = {};

  for (const breakpoint of RESPONSIVE_BREAKPOINTS) {
    const token = value[breakpoint];
    if (token !== undefined) {
      responsive[breakpoint] = token;
    }
  }

  return {
    base: value.base,
    responsive,
  };
};

type SpacingSlot = 'padding' | 'margin' | 'gap';

const toSpacingCssValue = (
  value: DynComponentNameResponsiveSpacingValue,
  slot: SpacingSlot
): string => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (value === 'auto') {
    return slot === 'margin' ? 'auto' : String(value);
  }

  if (value === '0') {
    return '0';
  }

  const token = SPACING_TOKENS[value as Exclude<DynComponentNameSpacingToken, '0' | 'auto'>];
  if (token) {
    return `var(--dyn-spacing-${value}, var(--spacing-${value}, ${token}))`;
  }

  return String(value);
};

const assignSpacingVars = (
  slot: SpacingSlot,
  cssValue: string,
  target: React.CSSProperties,
  breakpoint?: Exclude<DynComponentNameBreakpoint, 'base'>
) => {
  const suffix = breakpoint ? `-${breakpoint}` : '';
  target[`--dyn-component-name-${slot}${suffix}`] = cssValue;
};

const buildSpacingVars = (
  gap: DynComponentNameResponsiveSpacingValue | undefined,
  padding: DynComponentNameResponsiveSpacingValue | undefined,
  margin: DynComponentNameResponsiveSpacingValue | undefined
) => {
  const vars: React.CSSProperties = {};

  const applySpacing = (value: DynComponentNameResponsiveSpacingValue | undefined, slot: SpacingSlot) => {
    if (value === undefined) {
      return;
    }

    const { base, responsive } = resolveSpacingValue(value);

    if (base !== undefined) {
      assignSpacingVars(slot, toSpacingCssValue(base, slot), vars);
    }

    for (const [breakpoint, token] of Object.entries(responsive)) {
      if (token !== undefined) {
        assignSpacingVars(
          slot,
          toSpacingCssValue(token, slot),
          vars,
          breakpoint as Exclude<DynComponentNameBreakpoint, 'base'>
        );
      }
    }
  };

  applySpacing(gap, 'gap');
  applySpacing(padding, 'padding');
  applySpacing(margin, 'margin');

  return vars;
};

export const DynComponentName = forwardRef(function DynComponentNameInner<
  E extends React.ElementType = 'div'
>(
  props: DynComponentNameProps<E>,
  ref: DynComponentNameRef<E>
) {
  const {
    as,
    gap,
    p,
    m,
    className,
    style,
    children,
    'data-testid': dataTestId = 'dyn-component-name',
    ...rest
  } = props;

  const Component = (as ?? 'div') as React.ElementType;

  const spacingVars = useMemo(() => buildSpacingVars(gap, p, m), [gap, p, m]);

  return (
    <Component
      {...rest}
      ref={ref}
      data-testid={dataTestId}
      className={cn(styles.root, className)}
      style={{ ...spacingVars, ...style }}
    >
      {children}
    </Component>
  );
});

DynComponentName.displayName = 'DynComponentName';
