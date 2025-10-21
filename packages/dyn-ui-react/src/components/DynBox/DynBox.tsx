import React, { forwardRef, useEffect, useMemo } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import { tokens } from '../../tokens';
import type {
  DynBoxBreakpoint,
  DynBoxProps,
  DynBoxRef,
  ResponsiveSpacingValue,
  SpacingSize,
} from './DynBox.types';
import styles from './DynBox.module.css';

const getStyleClass = (name: string) => (styles as Record<string, string>)[name] || '';

const FILTERED_PROPS = new Set([
  'as','padding','p','px','py','pt','pr','pb','pl','m','mx','my','mt','mr','mb','ml',
  'radius','borderRadius','customBorderRadius','shadow','border','borderTop','borderRight','borderBottom','borderLeft','background','bg','backgroundColor','color',
  'align','justify','direction','flexDirection','wrap','gap','rowGap','columnGap',
  'gridTemplateColumns','gridTemplateRows','gridTemplateAreas','top','right','bottom','left','zIndex',
  'interactive','cssVars','ariaLiveMessage','ariaLivePoliteness','focusOnMount','display','position','textAlign','overflow','overflowX','overflowY',
  'alignContent','width','height','minWidth','minHeight','maxWidth','maxHeight','hideOnMobile','hideOnTablet','hideOnDesktop','mobileOnly','tabletOnly','desktopOnly'
]);

type BreakpointWithoutBase = Exclude<DynBoxBreakpoint, 'base'>;

const RESPONSIVE_BREAKPOINTS: BreakpointWithoutBase[] = ['sm', 'md', 'lg', 'xl'];

const SPACING_TOKENS = tokens.spacing as Record<string, string>;

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

const MARGIN_SLOTS = new Set<SpacingSlot>([
  'margin',
  'margin-x',
  'margin-y',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
]);

const PADDING_CLASS_TOKENS = new Set<SpacingSize>(['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']);

const isResponsiveSpacingObject = (
  value: ResponsiveSpacingValue | undefined
): value is Partial<Record<DynBoxBreakpoint, SpacingSize>> => {
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

  if (!isResponsiveSpacingObject(value)) {
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

const toSpacingCssValue = (value: SpacingSize, slot: SpacingSlot): string => {
  if (value === 'auto') {
    return MARGIN_SLOTS.has(slot) ? 'auto' : value;
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

const assignSpacingVars = (
  slot: SpacingSlot,
  cssValue: string,
  target: Record<string, string>,
  breakpoint?: BreakpointWithoutBase
) => {
  const suffix = breakpoint ? `-${breakpoint}` : '';
  const setVar = (name: string) => {
    target[`--dyn-box-${name}${suffix}`] = cssValue;
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

const applySpacingValue = (
  value: ResponsiveSpacingValue | undefined,
  slot: SpacingSlot,
  target: Record<string, string>,
  responsiveTarget: Record<string, string>
): SpacingSize | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const { base, responsive } = resolveSpacingValue(value);

  if (base !== undefined) {
    assignSpacingVars(slot, toSpacingCssValue(base, slot), target);
  }

  for (const [breakpoint, token] of Object.entries(responsive) as [
    BreakpointWithoutBase,
    SpacingSize
  ][]) {
    assignSpacingVars(slot, toSpacingCssValue(token, slot), responsiveTarget, breakpoint);
  }

  return base;
};

function DynBoxInner<E extends React.ElementType = 'div'>(props: DynBoxProps<E>, ref: DynBoxRef<E>) {
  const {
    as, padding, p, px, py, pt, pr, pb, pl,
    m, mx, my, mt, mr, mb, ml,
    radius = 'md', borderRadius, customBorderRadius,
    shadow = 'none', border = 'default',
    background = 'surface', bg, backgroundColor, color,
    align, justify,
    direction = 'column', flexDirection, wrap,
    gap = 'md', rowGap, columnGap,
    gridTemplateColumns, gridTemplateRows, gridTemplateAreas,
    alignContent, display, position, textAlign, overflow, overflowX, overflowY,
    width, height, maxWidth, maxHeight, minWidth, minHeight,
    top, right, bottom, left, zIndex,
    className, style, id, role,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'data-testid': dataTestId = 'dyn-box',
    focusOnMount, interactive,
    ariaLiveMessage, ariaLivePoliteness = 'polite',
    cssVars,
    hideOnMobile, hideOnTablet, hideOnDesktop, mobileOnly, tabletOnly, desktopOnly,
    children, ...rest
  } = props;

  const Component = (as ?? 'div') as React.ElementType;
  const internalId = useMemo(() => id || generateId('dyn-box'), [id]);
  const domProps = Object.fromEntries(Object.entries(rest).filter(([k]) => !FILTERED_PROPS.has(k)));

  // Stable ref that also forwards
  const elementRef = React.useRef<HTMLElement | null>(null);
  const setRefs = (node: any) => {
    elementRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref && 'current' in (ref as any)) (ref as any).current = node;
  };

  const legacyAliases: string[] = ['box'];
  const finalDirection = flexDirection || direction;
  if (finalDirection?.startsWith('row') || finalDirection?.startsWith('column')) legacyAliases.push('box--flex');
  const finalBackground = bg || background;
  if (['primary','secondary','success','warning','danger'].includes(finalBackground as string)) legacyAliases.push(`box--bg-${finalBackground}`);

  const finalRadius = borderRadius || customBorderRadius || radius;
  const basePadding = p ?? padding; // keep undefined if not provided

  const spacingStyleVars: Record<string, string> = {};
  const responsiveSpacingStyleVars: Record<string, string> = {};

  const basePaddingValue = applySpacingValue(
    basePadding,
    'padding',
    spacingStyleVars,
    responsiveSpacingStyleVars
  );
  applySpacingValue(px, 'padding-x', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(py, 'padding-y', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(pt, 'padding-top', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(pr, 'padding-right', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(pb, 'padding-bottom', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(pl, 'padding-left', spacingStyleVars, responsiveSpacingStyleVars);

  applySpacingValue(m, 'margin', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(mx, 'margin-x', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(my, 'margin-y', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(mt, 'margin-top', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(mr, 'margin-right', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(mb, 'margin-bottom', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(ml, 'margin-left', spacingStyleVars, responsiveSpacingStyleVars);

  applySpacingValue(gap, 'gap', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(rowGap, 'row-gap', spacingStyleVars, responsiveSpacingStyleVars);
  applySpacingValue(columnGap, 'column-gap', spacingStyleVars, responsiveSpacingStyleVars);

  const classes = cn(
    getStyleClass('box'),
    basePaddingValue && PADDING_CLASS_TOKENS.has(basePaddingValue) &&
      getStyleClass(`box--p-${basePaddingValue}`),
    finalBackground && ['primary','secondary','tertiary','success','warning','danger'].includes(finalBackground) && getStyleClass(`box--bg-${finalBackground}`),
    display && getStyleClass(`box--${display}`),
    position && getStyleClass(`box--${position}`),
    finalRadius && ['none','sm','md','lg','xl','full'].includes(finalRadius) && getStyleClass(`box--rounded-${finalRadius}`),
    shadow && ['sm','md','lg'].includes(shadow) && getStyleClass(`box--shadow-${shadow}`),
    textAlign && getStyleClass(`box--text-${textAlign}`),
    overflow && getStyleClass(`box--overflow-${overflow}`),
    border === 'default' && getStyleClass('box--border'),
    interactive && getStyleClass('box--interactive'),
    hideOnMobile && getStyleClass('box--mobile-hidden'),
    hideOnTablet && getStyleClass('box--tablet-hidden'),
    hideOnDesktop && getStyleClass('box--desktop-hidden'),
    mobileOnly && [getStyleClass('box--tablet-hidden'), getStyleClass('box--desktop-hidden')],
    tabletOnly && [getStyleClass('box--mobile-hidden'), getStyleClass('box--desktop-hidden')],
    desktopOnly && [getStyleClass('box--mobile-hidden'), getStyleClass('box--tablet-hidden')],
    ...legacyAliases,
    className
  );

  const styleVars: React.CSSProperties = {
    ...(width !== undefined ? { ['--dyn-box-width' as any]: typeof width === 'number' ? (width === 0 ? '0' : `${width}px`) : width } : {}),
    ...(height !== undefined ? { ['--dyn-box-height' as any]: typeof height === 'number' ? (height === 0 ? '0' : `${height}px`) : height } : {}),
    ...(maxWidth ? { ['--dyn-box-max-width' as any]: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : {}),
    ...(maxHeight ? { ['--dyn-box-max-height' as any]: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : {}),
    ...(minWidth ? { ['--dyn-box-min-width' as any]: typeof minWidth === 'number' ? `${minWidth}px` : minWidth } : {}),
    ...(minHeight ? { ['--dyn-box-min-height' as any]: typeof minHeight === 'number' ? `${minHeight}px` : minHeight } : {}),
    ...(top !== undefined ? { ['--dyn-box-top' as any]: typeof top === 'number' ? `${top}px` : top } : {}),
    ...(right !== undefined ? { ['--dyn-box-right' as any]: typeof right === 'number' ? `${right}px` : right } : {}),
    ...(bottom !== undefined ? { ['--dyn-box-bottom' as any]: typeof bottom === 'number' ? (bottom === 0 ? '0' : `${bottom}px`) : bottom } : {}),
    ...(left !== undefined ? { ['--dyn-box-left' as any]: typeof left === 'number' ? `${left}px` : left } : {}),
    ...(zIndex !== undefined ? { ['--dyn-box-z-index' as any]: String(zIndex) } : {}),
    ...(backgroundColor ? { ['--dyn-box-bg' as any]: backgroundColor } : {}),
    ...(color ? { ['--dyn-box-color' as any]: color } : {}),
    ...(finalBackground && !['primary','secondary','tertiary','success','warning','danger','surface'].includes(finalBackground as string) ? { ['--dyn-box-bg' as any]: finalBackground as any } : {}),
    ...(customBorderRadius ? { ['--dyn-box-radius' as any]: customBorderRadius } : {}),
    ...(finalRadius && !['none','xs','sm','md','lg','xl','full'].includes(finalRadius as string) ? { ['--dyn-box-radius' as any]: finalRadius as any } : {}),
    ...(finalDirection ? { ['--dyn-box-flex-direction' as any]: finalDirection } : {}),
    ...(wrap ? { ['--dyn-box-flex-wrap' as any]: wrap } : {}),
    ...(justify ? { ['--dyn-box-justify-content' as any]: justify } : {}),
    ...(align ? { ['--dyn-box-align-items' as any]: align } : {}),
    ...(alignContent ? { ['--dyn-box-align-content' as any]: alignContent } : {}),
    ...(gridTemplateColumns ? { ['--dyn-box-grid-columns' as any]: gridTemplateColumns } : {}),
    ...(gridTemplateRows ? { ['--dyn-box-grid-rows' as any]: gridTemplateRows } : {}),
    ...(gridTemplateAreas ? { ['--dyn-box-grid-areas' as any]: gridTemplateAreas } : {}),
    ...(overflowX ? { ['--dyn-box-overflow-x' as any]: overflowX } : {}),
    ...(overflowY ? { ['--dyn-box-overflow-y' as any]: overflowY } : {}),
    ...spacingStyleVars,
    ...responsiveSpacingStyleVars,
    ...(cssVars as any),
    ...style,
  } as React.CSSProperties;

  useEffect(() => {
    if (focusOnMount && interactive) {
      queueMicrotask?.(() => {
        try { elementRef.current?.focus?.(); } catch {}
      });
    }
  }, [focusOnMount, interactive]);

  const liveRegionId = ariaLiveMessage ? `${internalId}-liveregion` : undefined;
  const describedBy = [ariaDescribedBy, liveRegionId].filter(Boolean).join(' ') || undefined;

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    (domProps as any).onKeyDown?.(e as any);
    if (!interactive) return;
    // Ensure Enter and Space both trigger clicks in tests
    if (e.key === 'Enter' || e.key === ' ') {
      (domProps as any).onClick?.(e as any);
      if (e.key === ' ') e.preventDefault();
    }
  };

  const element = React.createElement(
    Component as any,
    {
      // Spread user provided DOM props first so that internal handlers like
      // onKeyDown can wrap and call them. If we spread domProps last they
      // would overwrite our internal handlers and break expected behaviour
      // (e.g. triggering click on Enter/Space and forwarding the event to
      // user's onKeyDown).
      ...domProps,
      ref: setRefs,
      id: internalId,
      role: interactive ? (role ?? 'button') : role,
      className: classes,
      style: styleVars,
      'aria-label': ariaLabel,
      'aria-describedby': describedBy,
      'aria-labelledby': ariaLabelledBy,
      'data-testid': dataTestId,
      tabIndex: interactive ? ((domProps as any).tabIndex ?? 0) : (domProps as any).tabIndex,
      onKeyDown,
    } as any,
    children,
    ariaLiveMessage && (
      <span id={liveRegionId} aria-live={ariaLivePoliteness} aria-atomic="true" className="dyn-sr-only">{ariaLiveMessage}</span>
    )
  );

  return element;
}

const _DynBox = forwardRef(DynBoxInner as any) as React.NamedExoticComponent<any>;
export const DynBox = _DynBox as <E extends React.ElementType = 'div'>(
  props: DynBoxProps<E> & { ref?: DynBoxRef<E> }
) => React.ReactElement | null;

(_DynBox as React.NamedExoticComponent).displayName = 'DynBox';
