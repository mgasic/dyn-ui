import React, { forwardRef, useMemo } from 'react';
import { cn } from '../../utils/classNames';
import menuStyles from '../DynMenu/DynMenu.module.css';
import type { DynMenuItemProps, DynMenuItemRef } from './DynMenuItem.types';

const getMenuClass = (className: string) =>
  (menuStyles as Record<string, string>)[className] || '';

function DynMenuItemInner<E extends React.ElementType = 'button'>(
  props: DynMenuItemProps<E>,
  ref: DynMenuItemRef<E>
) {
  const {
    as,
    label,
    prefix,
    suffix,
    active,
    open,
    disabled: disabledProp,
    loading = false,
    children,
    className,
    onClick,
    onPress,
    onKeyDown,
    tabIndex,
    role = 'menuitem',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-haspopup': ariaHasPopup,
    id,
    'data-testid': dataTestId,
    ...rest
  } = props;

  const Component = (as ?? 'button') as React.ElementType;
  const isButtonElement = Component === 'button';
  const isDisabled = Boolean(disabledProp || loading);

  const computedLabel = useMemo(() => {
    if (typeof label === 'string') {
      const trimmed = label.trim();
      if (trimmed) return trimmed;
    }
    if (typeof children === 'string') {
      const trimmed = children.trim();
      if (trimmed) return trimmed;
    }
    return undefined;
  }, [children, label]);

  const normalizedAriaLabel = useMemo(() => {
    if (ariaLabel && typeof ariaLabel === 'string') {
      const trimmed = ariaLabel.trim();
      if (trimmed) return trimmed;
    }
    return computedLabel;
  }, [ariaLabel, computedLabel]);

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
    onPress?.(event);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (!isButtonElement && (event.key === ' ' || event.key === 'Enter')) {
      event.preventDefault();
      if (isDisabled) return;
      onPress?.(event);
      onClick?.(event as unknown as React.MouseEvent<HTMLElement>);
    }
    onKeyDown?.(event);
  };

  const resolvedTabIndex =
    tabIndex !== undefined
      ? tabIndex
      : isButtonElement
      ? undefined
      : isDisabled
      ? -1
      : 0;

  const stateClassNames = cn(
    'dyn-menu-item',
    active && 'dyn-menu-item-active',
    (isDisabled || loading) && 'dyn-menu-item-disabled',
    className
  );

  const dataState = loading
    ? 'loading'
    : isDisabled
    ? 'disabled'
    : open
    ? 'open'
    : active
    ? 'active'
    : 'closed';

  const componentProps: Record<string, unknown> = {
    ref,
    id,
    role,
    className: stateClassNames,
    tabIndex: resolvedTabIndex,
    'aria-label': normalizedAriaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-haspopup': ariaHasPopup,
    'aria-disabled': isDisabled ? true : undefined,
    'aria-busy': loading || undefined,
    disabled: isButtonElement ? isDisabled : undefined,
    'data-testid': dataTestId,
    'data-state': dataState,
    'data-open': open ? 'true' : undefined,
    'data-disabled': isDisabled ? 'true' : undefined,
    'data-loading': loading ? 'true' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...rest,
  };

  if (isButtonElement && componentProps.type === undefined) {
    componentProps.type = 'button';
  }

  return (
    <Component {...componentProps}>
      {prefix ? <span className={getMenuClass('menu__item-prefix')}>{prefix}</span> : null}
      {label ?? children}
      {suffix ? <span className={getMenuClass('menu__item-suffix')}>{suffix}</span> : null}
    </Component>
  );
}

export const DynMenuItem = forwardRef(DynMenuItemInner) as <
  E extends React.ElementType = 'button'
>(
  props: DynMenuItemProps<E> & { ref?: React.Ref<DynMenuItemRef<E>> }
) => React.ReactElement | null;

DynMenuItem.displayName = 'DynMenuItem';

export default DynMenuItem;
