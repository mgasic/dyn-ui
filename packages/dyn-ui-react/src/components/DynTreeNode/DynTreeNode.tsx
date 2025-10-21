import React, { forwardRef } from 'react';
import classNames from 'classnames';
import type { DynTreeNodeComponent, DynTreeNodeProps, DynTreeNodeSpacing } from './DynTreeNode.types';
import { tokens } from '../../tokens';
import styles from './DynTreeNode.module.css';

const spacingValues = tokens.spacing as Record<string, string>;

const toSpacingVar = (token: string) => {
  if (token === '0' || token === 'none') return '0';
  const normalized = token.toLowerCase();
  const fallback = spacingValues[normalized] ?? spacingValues[token] ?? token;
  return `var(--dyn-spacing-${normalized}, var(--spacing-${normalized}, ${fallback}))`;
};

const hasSpacingToken = (token: string) => {
  const normalized = token.toLowerCase();
  return normalized in spacingValues || token in spacingValues;
};

const resolveSpacing = (value?: DynTreeNodeSpacing) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return undefined;
    return value === 0 ? '0px' : `${value}px`;
  }

  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed === 'auto') return 'auto';
  if (trimmed === '0' || trimmed.toLowerCase() === 'none') return '0';
  if (hasSpacingToken(trimmed)) {
    return toSpacingVar(trimmed);
  }
  return trimmed;
};

const DynTreeNodeInner = <E extends React.ElementType = 'div'>({
  as,
  children,
  className,
  style,
  direction = 'row',
  align,
  justify,
  gap,
  p,
  padding,
  m,
  margin,
  ...rest
}: DynTreeNodeProps<E>, ref: React.Ref<React.ElementRef<E>>) => {
  const Component = (as ?? 'div') as React.ElementType;

  const resolvedGap = resolveSpacing(gap);
  const resolvedPadding = resolveSpacing(p ?? padding);
  const resolvedMargin = resolveSpacing(m ?? margin);

  const styleOverrides: React.CSSProperties = {
    ...(resolvedGap !== undefined ? { gap: resolvedGap } : {}),
    ...(resolvedPadding !== undefined ? { padding: resolvedPadding } : {}),
    ...(resolvedMargin !== undefined ? { margin: resolvedMargin } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(justify ? { justifyContent: justify } : {}),
  };

  const element = (
    <Component
      ref={ref}
      className={classNames(
        styles.root,
        direction === 'column' ? styles.directionColumn : styles.directionRow,
        'dyn-tree-node',
        direction === 'column' ? 'dyn-tree-node--column' : 'dyn-tree-node--row',
        className
      )}
      style={{ ...styleOverrides, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );

  return element;
};

const DynTreeNodeForward = forwardRef(DynTreeNodeInner) as DynTreeNodeComponent;
DynTreeNodeForward.displayName = 'DynTreeNode';

export const DynTreeNode = DynTreeNodeForward;
