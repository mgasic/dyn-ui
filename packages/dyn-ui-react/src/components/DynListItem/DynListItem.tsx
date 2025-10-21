import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import {
  DYN_LIST_ITEM_DEFAULT_PROPS,
  type DynListItemProps,
  type DynListItemRef,
} from './DynListItem.types';
import styles from './DynListItem.module.css';

const SPACING_TOKEN_VALUES: Record<string, string> = {
  '0': '0',
  xs: 'var(--dyn-spacing-xs, var(--spacing-xs, 0.25rem))',
  sm: 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
  md: 'var(--dyn-spacing-md, var(--spacing-md, 1rem))',
  lg: 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
  xl: 'var(--dyn-spacing-xl, var(--spacing-xl, 2rem))',
  '2xl': 'var(--dyn-spacing-2xl, var(--spacing-2xl, 3rem))',
};

type SpacingSizeInternal = keyof typeof SPACING_TOKEN_VALUES;

const isSpacingToken = (value?: string): value is SpacingSizeInternal => {
  return Boolean(value && value in SPACING_TOKEN_VALUES);
};

const resolveSpacingValue = (
  value: string | undefined,
  { allowAuto = false }: { allowAuto?: boolean } = {}
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'auto') {
    return allowAuto ? 'auto' : undefined;
  }

  if (isSpacingToken(value)) {
    return SPACING_TOKEN_VALUES[value];
  }

  return value;
};

const DynListItemComponent = <E extends React.ElementType = 'div'>(
  props: DynListItemProps<E>,
  ref: React.ForwardedRef<DynListItemRef<E>>
) => {
  const {
    as,
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
    display,
    direction,
    align,
    justify,
    wrap,
    className,
    style,
    children,
    'data-testid': dataTestId,
    ...rest
  } = props;

  const Component = (as ?? 'div') as React.ElementType;
  const basePadding = p ?? padding;

  const styleVars: React.CSSProperties = {};

  const setVar = (name: string, value?: string) => {
    if (value !== undefined) {
      (styleVars as Record<string, string>)[name] = value;
    }
  };

  setVar('--dyn-list-item-padding', resolveSpacingValue(basePadding));
  if (px !== undefined) {
    const resolved = resolveSpacingValue(px);
    setVar('--dyn-list-item-padding-left', resolved);
    setVar('--dyn-list-item-padding-right', resolved);
  }
  if (py !== undefined) {
    const resolved = resolveSpacingValue(py);
    setVar('--dyn-list-item-padding-top', resolved);
    setVar('--dyn-list-item-padding-bottom', resolved);
  }
  setVar('--dyn-list-item-padding-top', resolveSpacingValue(pt) ?? styleVars['--dyn-list-item-padding-top']);
  setVar('--dyn-list-item-padding-right', resolveSpacingValue(pr) ?? styleVars['--dyn-list-item-padding-right']);
  setVar('--dyn-list-item-padding-bottom', resolveSpacingValue(pb) ?? styleVars['--dyn-list-item-padding-bottom']);
  setVar('--dyn-list-item-padding-left', resolveSpacingValue(pl) ?? styleVars['--dyn-list-item-padding-left']);

  setVar('--dyn-list-item-margin', resolveSpacingValue(m, { allowAuto: true }));
  if (mx !== undefined) {
    const resolved = resolveSpacingValue(mx, { allowAuto: true });
    setVar('--dyn-list-item-margin-left', resolved);
    setVar('--dyn-list-item-margin-right', resolved);
  }
  if (my !== undefined) {
    const resolved = resolveSpacingValue(my, { allowAuto: true });
    setVar('--dyn-list-item-margin-top', resolved);
    setVar('--dyn-list-item-margin-bottom', resolved);
  }
  setVar('--dyn-list-item-margin-top', resolveSpacingValue(mt, { allowAuto: true }) ?? styleVars['--dyn-list-item-margin-top']);
  setVar('--dyn-list-item-margin-right', resolveSpacingValue(mr, { allowAuto: true }) ?? styleVars['--dyn-list-item-margin-right']);
  setVar('--dyn-list-item-margin-bottom', resolveSpacingValue(mb, { allowAuto: true }) ?? styleVars['--dyn-list-item-margin-bottom']);
  setVar('--dyn-list-item-margin-left', resolveSpacingValue(ml, { allowAuto: true }) ?? styleVars['--dyn-list-item-margin-left']);

  setVar('--dyn-list-item-gap', resolveSpacingValue(gap ?? undefined));
  setVar('--dyn-list-item-row-gap', resolveSpacingValue(rowGap ?? undefined));
  setVar('--dyn-list-item-column-gap', resolveSpacingValue(columnGap ?? undefined));

  if (display) {
    setVar('--dyn-list-item-display', display);
  }
  if (direction) {
    setVar('--dyn-list-item-direction', direction);
  }
  if (align) {
    setVar('--dyn-list-item-align', align);
  }
  if (justify) {
    setVar('--dyn-list-item-justify', justify);
  }
  if (wrap) {
    setVar('--dyn-list-item-wrap', wrap);
  }

  const finalStyle = style
    ? ({ ...styleVars, ...style } as React.CSSProperties)
    : styleVars;

  return (
    <Component
      ref={ref as React.Ref<any>}
      className={cn(styles.root, className)}
      data-testid={dataTestId ?? DYN_LIST_ITEM_DEFAULT_PROPS['data-testid']}
      style={finalStyle}
      {...rest}
    >
      {children}
    </Component>
  );
};

const DynListItem = forwardRef(DynListItemComponent) as <
  E extends React.ElementType = 'div'
>(
  props: DynListItemProps<E> & { ref?: DynListItemRef<E> }
) => React.ReactElement | null;

DynListItem.displayName = 'DynListItem';

export { DynListItem };
export default DynListItem;
