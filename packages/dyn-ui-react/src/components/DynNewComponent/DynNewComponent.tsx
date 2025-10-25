import { forwardRef } from 'react';
import type { ElementType, ReactElement } from 'react';
import { cn } from '../../utils/classNames';
import {
  DYN_NEW_COMPONENT_DEFAULT_PROPS,
  type DynNewComponentProps,
  type DynNewComponentRef,
  type DynNewComponentSpacingToken,
  type DynNewComponentSpacingValue,
} from './DynNewComponent.types';
import styles from './DynNewComponent.module.css';

type SpacingSlot = 'gap' | 'padding' | 'margin';

const SPACING_TOKENS: Record<Exclude<DynNewComponentSpacingToken, '0' | 'auto'>, string> = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

const resolveSpacingValue = (
  value: DynNewComponentSpacingValue | undefined,
  slot: SpacingSlot
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (value === 'auto') {
    return slot === 'margin' ? 'auto' : value;
  }

  if (value === '0') {
    return '0';
  }

  if (value in SPACING_TOKENS) {
    const token = SPACING_TOKENS[value as Exclude<DynNewComponentSpacingToken, '0' | 'auto'>];
    return `var(--dyn-spacing-${value}, var(--spacing-${value}, ${token}))`;
  }

  return value;
};

const setSpacingVariable = (
  stylesMap: Record<string, string | number>,
  variable: string,
  value: string | undefined
) => {
  if (value !== undefined) {
    stylesMap[variable] = value;
  }
};

const DynNewComponentInner = <E extends ElementType = 'div'>(
  {
    as,
    gap,
    p,
    m,
    className,
    style,
    children,
    'data-testid': dataTestId = DYN_NEW_COMPONENT_DEFAULT_PROPS['data-testid'],
    ...rest
  }: DynNewComponentProps<E>,
  ref: DynNewComponentRef<E>
) => {
  const Component = (as ?? 'div') as ElementType;

  const spacingStyle: Record<string, string | number> = {
    ...(style ?? {}),
  } as Record<string, string | number>;

  setSpacingVariable(spacingStyle, '--dyn-new-component-gap', resolveSpacingValue(gap, 'gap'));
  setSpacingVariable(spacingStyle, '--dyn-new-component-padding', resolveSpacingValue(p, 'padding'));
  setSpacingVariable(spacingStyle, '--dyn-new-component-margin', resolveSpacingValue(m, 'margin'));

  return (
    <Component
      ref={ref}
      className={cn(styles.root, className)}
      style={spacingStyle}
      data-testid={dataTestId}
      {...rest}
    >
      {children}
    </Component>
  );
};

type DynNewComponentForwardRef = <E extends ElementType = 'div'>(
  props: DynNewComponentProps<E> & { ref?: DynNewComponentRef<E> }
) => ReactElement | null;

const DynNewComponent = forwardRef(DynNewComponentInner as unknown as DynNewComponentForwardRef);

DynNewComponent.displayName = 'DynNewComponent';

export { DynNewComponent };
export default DynNewComponent;
