import React, { forwardRef, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '../../utils/classNames';
import { tokens } from '../../tokens';
import {
  DYN_CONTAINER_DEFAULT_PROPS,
  type DynContainerBaseProps,
  DynContainerProps,
  DynContainerRef,
  type DynContainerMaxWidthToken,
  type DynContainerSpaceValue,
} from './DynContainer.types';
import styles from './DynContainer.module.css';

const toPascalCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const spacingValues = tokens.spacing as Record<string, string>;
const spacingVar = (key: keyof typeof spacingValues) =>
  `var(--dyn-spacing-${key}, var(--spacing-${key}, ${spacingValues[key]}))`;

const SPACING_TOKENS: Record<string, string> = {
  none: '0',
  xs: spacingVar('xs'),
  sm: spacingVar('sm'),
  md: spacingVar('md'),
  lg: spacingVar('lg'),
  xl: spacingVar('xl'),
};

const MAX_WIDTH_TOKENS: Record<DynContainerMaxWidthToken, string> = {
  xs: 'min(100%, var(--dyn-container-max-width-xs))',
  sm: 'min(100%, var(--dyn-container-max-width-sm))',
  md: 'min(100%, var(--dyn-container-max-width-md))',
  lg: 'min(100%, var(--dyn-container-max-width-lg))',
  xl: 'min(100%, var(--dyn-container-max-width-xl))',
  full: '100%',
};

type CSSVarProperties = CSSProperties & Record<string, string | number | undefined>;

const resolveSpacingValue = (value?: DynContainerSpaceValue): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  const normalized = value.trim();

  if (normalized in SPACING_TOKENS) {
    return SPACING_TOKENS[normalized];
  }

  return normalized;
};

const resolveMaxWidth = (
  value?: DynContainerBaseProps['maxWidth']
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  const normalized = value.trim();

  if (normalized in MAX_WIDTH_TOKENS) {
    return MAX_WIDTH_TOKENS[normalized as DynContainerMaxWidthToken];
  }

  return normalized;
};

const DynContainerComponent = <E extends React.ElementType = 'div'>(
  {
    as,
    title,
    subtitle,
    direction = DYN_CONTAINER_DEFAULT_PROPS.direction,
    align,
    justify,
    spacing = DYN_CONTAINER_DEFAULT_PROPS.spacing,
    size = DYN_CONTAINER_DEFAULT_PROPS.size,
    bordered = DYN_CONTAINER_DEFAULT_PROPS.bordered,
    shadow = DYN_CONTAINER_DEFAULT_PROPS.shadow,
    background = DYN_CONTAINER_DEFAULT_PROPS.background,
    height,
    maxWidth,
    layout = DYN_CONTAINER_DEFAULT_PROPS.layout,
    padding,
    margin,
    noBorder,
    noPadding,
    className,
    children,
    style,
    'data-testid': dataTestId = DYN_CONTAINER_DEFAULT_PROPS['data-testid'],
    ...rest
  }: DynContainerProps<E>,
  ref: React.ForwardedRef<DynContainerRef<E>>
) => {
  const resolvedBordered = noBorder ? false : bordered;
  const hasTitleContent = Boolean(title || subtitle);
  const resolvedMaxWidth = resolveMaxWidth(maxWidth);
  const resolvedPadding = resolveSpacingValue(padding);
  const resolvedMargin = resolveSpacingValue(margin);
  const Component = (as ?? 'div') as React.ElementType;

  const containerStyle = useMemo<CSSProperties | undefined>(() => {
    const next: CSSVarProperties = { ...(style as CSSVarProperties) };

    if (typeof height === 'number') {
      next.height = `${height}px`;
    } else if (typeof height === 'string') {
      next.height = height;
    }

    if (resolvedMaxWidth) {
      next.maxWidth = resolvedMaxWidth;
      next['--dyn-container-max-width'] = resolvedMaxWidth;
    }

    if (resolvedPadding) {
      next['--dyn-container-padding'] = resolvedPadding;
    }

    if (resolvedMargin) {
      next['--dyn-container-margin'] = resolvedMargin;
    }

    return Object.keys(next).length > 0 ? next : undefined;
  }, [height, resolvedMargin, resolvedMaxWidth, resolvedPadding, style]);

  const directionClass = styles[`direction${toPascalCase(direction)}` as keyof typeof styles];
  const spacingClass = spacing
    ? styles[`spacing${toPascalCase(spacing)}` as keyof typeof styles]
    : undefined;
  const sizeClass = size
    ? styles[`size${toPascalCase(size)}` as keyof typeof styles]
    : undefined;
  const backgroundClass = background
    ? styles[`background${toPascalCase(background)}` as keyof typeof styles]
    : undefined;
  const alignClass = align
    ? styles[`align${toPascalCase(align)}` as keyof typeof styles]
    : undefined;
  const justifyClass = justify
    ? styles[`justify${toPascalCase(justify)}` as keyof typeof styles]
    : undefined;

  const containerClassName = cn(
    styles.root,
    directionClass,
    spacingClass,
    sizeClass,
    backgroundClass,
    alignClass,
    justifyClass,
    layout === 'fixed' && styles.layoutFixed,
    resolvedBordered && styles.bordered,
    shadow && styles.shadow,
    noPadding && styles.noPadding,
    hasTitleContent && styles.withTitle,
    className
  );

  return (
    <Component
      ref={ref as React.Ref<any>}
      className={containerClassName}
      style={containerStyle}
      data-testid={dataTestId}
      {...rest}
    >
      {hasTitleContent && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </Component>
  );
};

type DynContainerForwardRef = <E extends React.ElementType = 'div'>(
  props: DynContainerProps<E> & { ref?: DynContainerRef<E> }
) => React.ReactElement | null;

const DynContainer = forwardRef(DynContainerComponent as unknown as DynContainerForwardRef);

DynContainer.displayName = 'DynContainer';

export { DynContainer };
export default DynContainer;
