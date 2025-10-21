import React, { forwardRef } from 'react';
import classNames from 'classnames';
import type {
  DynTreeNodeComponent,
  DynTreeNodeProps,
  DynTreeNodeResponsiveSpacingValue,
  DynTreeNodeSpacingPrimitive,
} from './DynTreeNode.types';
import styles from './DynTreeNode.module.css';

const SPACING_PROP_NAMES = [
  'padding',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'margin',
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

type SpacingSlot =
  | 'padding'
  | 'padding-x'
  | 'padding-y'
  | 'padding-top'
  | 'padding-right'
  | 'padding-bottom'
  | 'padding-left'
  | 'margin'
  | 'margin-x'
  | 'margin-y'
  | 'margin-top'
  | 'margin-right'
  | 'margin-bottom'
  | 'margin-left'
  | 'gap'
  | 'row-gap'
  | 'column-gap';

const PROP_TO_SLOT: Record<SpacingPropName, SpacingSlot> = {
  padding: 'padding',
  p: 'padding',
  px: 'padding-x',
  py: 'padding-y',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  margin: 'margin',
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

const MARGIN_SLOTS = new Set<SpacingSlot>([
  'margin',
  'margin-x',
  'margin-y',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
]);

const RESPONSIVE_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const;

type Breakpoint = (typeof RESPONSIVE_BREAKPOINTS)[number];

const SPACING_TOKENS: Record<string, string> = {
  '0': '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

const toDesignTokenValue = (token: string) => {
  if (token === '0') return '0';
  const fallback = SPACING_TOKENS[token];
  return `var(--dyn-spacing-${token}, var(--spacing-${token}, ${fallback ?? token}))`;
};

const normalizeSpacingPrimitive = (
  value: DynTreeNodeSpacingPrimitive | undefined,
  { allowAuto }: { allowAuto: boolean }
): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    return value === 0 ? '0px' : `${value}px`;
  }

  const trimmed = String(value).trim();
  if (!trimmed) return undefined;

  const lower = trimmed.toLowerCase();

  if (lower === 'none') return '0';
  if (lower === '0') return '0';
  if (lower === 'auto') {
    return allowAuto ? 'auto' : trimmed;
  }

  if (SPACING_TOKENS[lower]) {
    return toDesignTokenValue(lower);
  }

  return trimmed;
};

const isResponsiveObject = (
  value: DynTreeNodeResponsiveSpacingValue
): value is Partial<Record<'base' | Breakpoint, DynTreeNodeSpacingPrimitive>> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const resolveSpacingValue = (
  value: DynTreeNodeResponsiveSpacingValue | undefined,
  slot: SpacingSlot
): {
  base?: string;
  responsive: Partial<Record<Breakpoint, string>>;
} => {
  const allowAuto = MARGIN_SLOTS.has(slot);

  if (value === undefined) {
    return { responsive: {} };
  }

  if (!isResponsiveObject(value)) {
    return {
      base: normalizeSpacingPrimitive(value, { allowAuto }),
      responsive: {},
    };
  }

  const responsive: Partial<Record<Breakpoint, string>> = {};

  const base = normalizeSpacingPrimitive(value.base, { allowAuto });

  for (const breakpoint of RESPONSIVE_BREAKPOINTS) {
    const token = normalizeSpacingPrimitive(value[breakpoint], { allowAuto });
    if (token) {
      responsive[breakpoint] = token;
    }
  }

  return { base, responsive };
};

const assignBaseStyle = (slot: SpacingSlot, cssValue: string, target: React.CSSProperties) => {
  switch (slot) {
    case 'padding':
      target.padding = cssValue;
      break;
    case 'padding-x':
      target.paddingLeft = cssValue;
      target.paddingRight = cssValue;
      break;
    case 'padding-y':
      target.paddingTop = cssValue;
      target.paddingBottom = cssValue;
      break;
    case 'padding-top':
      target.paddingTop = cssValue;
      break;
    case 'padding-right':
      target.paddingRight = cssValue;
      break;
    case 'padding-bottom':
      target.paddingBottom = cssValue;
      break;
    case 'padding-left':
      target.paddingLeft = cssValue;
      break;
    case 'margin':
      target.margin = cssValue;
      break;
    case 'margin-x':
      target.marginLeft = cssValue;
      target.marginRight = cssValue;
      break;
    case 'margin-y':
      target.marginTop = cssValue;
      target.marginBottom = cssValue;
      break;
    case 'margin-top':
      target.marginTop = cssValue;
      break;
    case 'margin-right':
      target.marginRight = cssValue;
      break;
    case 'margin-bottom':
      target.marginBottom = cssValue;
      break;
    case 'margin-left':
      target.marginLeft = cssValue;
      break;
    case 'gap':
      target.gap = cssValue;
      break;
    case 'row-gap':
      target.rowGap = cssValue;
      break;
    case 'column-gap':
      target.columnGap = cssValue;
      break;
    default:
      break;
  }
};

const assignSpacingVars = (
  slot: SpacingSlot,
  cssValue: string,
  target: Record<string, string>,
  breakpoint?: Breakpoint
) => {
  const suffix = breakpoint ? `-${breakpoint}` : '';
  const setVar = (name: string) => {
    target[`--dyn-tree-node-${name}${suffix}`] = cssValue;
  };

  switch (slot) {
    case 'padding':
      setVar('padding');
      break;
    case 'padding-x':
      setVar('padding-x');
      setVar('padding-left');
      setVar('padding-right');
      break;
    case 'padding-y':
      setVar('padding-y');
      setVar('padding-top');
      setVar('padding-bottom');
      break;
    case 'padding-top':
      setVar('padding-top');
      break;
    case 'padding-right':
      setVar('padding-right');
      break;
    case 'padding-bottom':
      setVar('padding-bottom');
      break;
    case 'padding-left':
      setVar('padding-left');
      break;
    case 'margin':
      setVar('margin');
      break;
    case 'margin-x':
      setVar('margin-x');
      setVar('margin-left');
      setVar('margin-right');
      break;
    case 'margin-y':
      setVar('margin-y');
      setVar('margin-top');
      setVar('margin-bottom');
      break;
    case 'margin-top':
      setVar('margin-top');
      break;
    case 'margin-right':
      setVar('margin-right');
      break;
    case 'margin-bottom':
      setVar('margin-bottom');
      break;
    case 'margin-left':
      setVar('margin-left');
      break;
    case 'gap':
      setVar('gap');
      break;
    case 'row-gap':
      setVar('row-gap');
      break;
    case 'column-gap':
      setVar('column-gap');
      break;
    default:
      break;
  }
};

const DynTreeNodeInner = <E extends React.ElementType = 'div'>({
  as,
  children,
  className,
  style,
  direction = 'row',
  align,
  justify,
  ...rest
}: DynTreeNodeProps<E>, ref: React.Ref<React.ElementRef<E>>) => {
  const Component = (as ?? 'div') as React.ElementType;

  const styleOverrides: React.CSSProperties = {};
  const cssVarOverrides: Record<string, string> = {};
  const restProps: Record<string, unknown> = { ...rest };

  for (const propName of SPACING_PROP_NAMES) {
    const value = restProps[propName] as DynTreeNodeResponsiveSpacingValue | undefined;
    if (value === undefined) continue;

    const slot = PROP_TO_SLOT[propName];
    const { base, responsive } = resolveSpacingValue(value, slot);
    const hasResponsiveOverrides = Object.keys(responsive).length > 0;

    if (base) {
      if (!hasResponsiveOverrides) {
        assignBaseStyle(slot, base, styleOverrides);
      }

      assignSpacingVars(slot, base, cssVarOverrides);
    }

    for (const [breakpoint, token] of Object.entries(responsive) as [Breakpoint, string][]) {
      assignSpacingVars(slot, token, cssVarOverrides, breakpoint);
    }

    delete restProps[propName];
  }

  if (align) {
    styleOverrides.alignItems = align;
  }

  if (justify) {
    styleOverrides.justifyContent = justify;
  }

  styleOverrides.flexDirection = direction;

  const element = (
    <Component
      ref={ref}
      data-dyn-tree-node=""
      data-direction={direction}
      className={classNames(
        styles.root,
        direction === 'column' ? styles.directionColumn : styles.directionRow,
        'dyn-tree-node',
        direction === 'column' ? 'dyn-tree-node--column' : 'dyn-tree-node--row',
        className
      )}
      style={{ ...cssVarOverrides, ...styleOverrides, ...style }}
      {...(restProps as Record<string, unknown>)}
    >
      {children}
    </Component>
  );

  return element;
};

const DynTreeNodeForward = forwardRef(DynTreeNodeInner) as DynTreeNodeComponent;
DynTreeNodeForward.displayName = 'DynTreeNode';

export const DynTreeNode = DynTreeNodeForward;
