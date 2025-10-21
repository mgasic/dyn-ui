import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import { tokens } from '../../tokens';
import { DynBox } from '../DynBox';
import type { DynBoxProps, SpacingSize } from '../DynBox';
import type {
  DynUIProps,
  DynUIRef,
  DynUITone,
  DynUIBreakpoint,
  ResponsiveSpacingValue,
} from './DynUI.types';
import { DYN_UI_DEFAULT_PROPS } from './DynUI.types';
import styles from './DynUI.module.css';

type BreakpointWithoutBase = Exclude<DynUIBreakpoint, 'base'>;

const RESPONSIVE_BREAKPOINTS: BreakpointWithoutBase[] = ['sm', 'md', 'lg', 'xl'];

const SPACING_PROP_NAMES = [
  'padding',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'gap',
  'rowGap',
  'columnGap',
] as const;

type SpacingPropName = (typeof SPACING_PROP_NAMES)[number];

const PROP_TO_SLOT: Record<SpacingPropName, string> = {
  padding: 'padding',
  p: 'padding',
  px: 'padding-x',
  py: 'padding-y',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  m: 'margin',
  mx: 'margin-x',
  my: 'margin-y',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  gap: 'gap',
  rowGap: 'row-gap',
  columnGap: 'column-gap',
};

const PADDING_SLOTS = new Set<string>([
  'padding',
  'padding-x',
  'padding-y',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
]);

const MARGIN_SLOTS = new Set<string>([
  'margin',
  'margin-x',
  'margin-y',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
]);

const SPACING_TOKENS = tokens.spacing as Record<string, string>;

const toneVars: Record<DynUITone, Record<string, string>> = {
  surface: {},
  muted: {
    '--dyn-box-bg':
      'var(--dyn-color-surface-muted, var(--color-surface-muted, #f8fafc))',
    '--dyn-box-border':
      'var(--dyn-border-width, 1px) solid var(--dyn-color-border-muted, rgba(15, 23, 42, 0.12))',
  },
  elevated: {
    '--dyn-box-bg': 'var(--dyn-color-surface, var(--color-surface, #ffffff))',
    '--dyn-box-border':
      'var(--dyn-border-width, 1px) solid var(--dyn-color-border-subtle, rgba(15, 23, 42, 0.08))',
    '--dyn-box-shadow':
      'var(--dyn-shadow-lg, 0 24px 32px rgba(15, 23, 42, 0.12))',
  },
  inverse: {
    '--dyn-box-bg':
      'var(--dyn-color-surface-inverse, var(--color-surface-inverse, #0f172a))',
    '--dyn-box-color':
      'var(--dyn-color-text-on-inverse, var(--color-text-inverse, #f8fafc))',
    '--dyn-box-border': 'var(--dyn-border-width, 1px) solid rgba(255, 255, 255, 0.24)',
  },
};

const isResponsiveObject = (
  value: ResponsiveSpacingValue
): value is Partial<Record<DynUIBreakpoint, SpacingSize>> => {
  return typeof value === 'object' && value !== null;
};

const resolveSpacingValue = (
  value: ResponsiveSpacingValue | undefined
): {
  base?: SpacingSize;
  responsive: Partial<Record<BreakpointWithoutBase, SpacingSize>>;
} => {
  if (value === undefined) {
    return { responsive: {} };
  }

  if (typeof value === 'string') {
    return { base: value as SpacingSize, responsive: {} };
  }

  if (!isResponsiveObject(value)) {
    return { responsive: {} };
  }

  const responsive: Partial<Record<BreakpointWithoutBase, SpacingSize>> = {};

  for (const breakpoint of RESPONSIVE_BREAKPOINTS) {
    const token = value[breakpoint];
    if (token) {
      responsive[breakpoint] = token;
    }
  }

  return {
    base: value.base,
    responsive,
  };
};

const toSpacingCssValue = (value: SpacingSize, slot: string): string => {
  if (value === 'auto') {
    return MARGIN_SLOTS.has(slot) ? 'auto' : 'auto';
  }

  if (value === '0') {
    return '0';
  }

  const token = SPACING_TOKENS[value as Exclude<SpacingSize, '0' | 'auto'>];

  if (token) {
    return `var(--dyn-spacing-${value}, var(--spacing-${value}, ${token}))`;
  }

  return value;
};

const filterToneVars = (
  tone: DynUITone,
  overrides: {
    background?: unknown;
    bg?: unknown;
    backgroundColor?: unknown;
    color?: unknown;
    shadow?: unknown;
    border?: unknown;
  }
) => {
  const base = toneVars[tone] ?? {};

  return Object.fromEntries(
    Object.entries(base).filter(([key]) => {
      if (key === '--dyn-box-bg' && (overrides.background ?? overrides.bg ?? overrides.backgroundColor) !== undefined) {
        return false;
      }
      if (key === '--dyn-box-color' && overrides.color !== undefined) {
        return false;
      }
      if (key === '--dyn-box-shadow' && overrides.shadow !== undefined) {
        return false;
      }
      if (key === '--dyn-box-border' && overrides.border !== undefined) {
        return false;
      }
      return true;
    })
  );
};

const DynUIComponent = <E extends React.ElementType = 'section'>(
  props: DynUIProps<E>,
  ref: DynUIRef<E>
) => {
  const {
    as,
    tone = DYN_UI_DEFAULT_PROPS.tone,
    className,
    cssVars,
    style,
    'data-testid': dataTestId = DYN_UI_DEFAULT_PROPS['data-testid'],
    padding,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    gap,
    rowGap,
    columnGap,
    ...rest
  } = props as DynUIProps<E>;

  const spacingValues: Partial<Record<SpacingPropName, ResponsiveSpacingValue | undefined>> = {
    padding,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    gap,
    rowGap,
    columnGap,
  };

  const baseSpacing: Partial<Record<SpacingPropName, SpacingSize>> = {};
  const responsiveCssVars: Record<string, string> = {};
  let hasPaddingValue = false;

  for (const propName of SPACING_PROP_NAMES) {
    const value = spacingValues[propName];
    if (value === undefined) continue;

    const slot = PROP_TO_SLOT[propName];
    const { base, responsive } = resolveSpacingValue(value);

    if (base !== undefined) {
      baseSpacing[propName] = base;
      if (PADDING_SLOTS.has(slot)) {
        hasPaddingValue = true;
      }
    }

    for (const [breakpoint, token] of Object.entries(responsive) as [
      BreakpointWithoutBase,
      SpacingSize
    ][]) {
      responsiveCssVars[`--dyn-ui-${slot}-${breakpoint}`] = toSpacingCssValue(token, slot);
      if (PADDING_SLOTS.has(slot)) {
        hasPaddingValue = true;
      }
    }
  }

  if (!hasPaddingValue) {
    baseSpacing.p = DYN_UI_DEFAULT_PROPS.p;
  }

  const toneCssVars = filterToneVars(tone, {
    background: (rest as any).background,
    bg: (rest as any).bg,
    backgroundColor: (rest as any).backgroundColor,
    color: (rest as any).color,
    shadow: (rest as any).shadow,
    border: (rest as any).border,
  });

  const mergedCssVars = {
    ...toneCssVars,
    ...responsiveCssVars,
    ...(cssVars ?? {}),
  };

  return (
    <DynBox
      ref={ref as any}
      as={(as ?? DYN_UI_DEFAULT_PROPS.as) as E}
      className={cn(styles.root, className)}
      cssVars={mergedCssVars}
      style={style}
      data-testid={dataTestId}
      {...(rest as unknown as DynBoxProps<E>)}
      {...(baseSpacing as Partial<DynBoxProps<E>>)}
    />
  );
};

export const DynUI = forwardRef(DynUIComponent) as <
  E extends React.ElementType = 'section'
>(
  props: DynUIProps<E> & { ref?: React.Ref<DynUIRef<E>> }
) => React.ReactElement | null;

DynUI.displayName = 'DynUI';
