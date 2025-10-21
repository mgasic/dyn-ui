import React, { forwardRef, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import type { DynMenuItemProps, DynMenuItemRef } from './DynMenuItem.types';

const normalizeLabel = (value?: string) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const isStringElement = (component: ElementType): component is keyof JSX.IntrinsicElements => {
  return typeof component === 'string';
};

function DynMenuItemInner<E extends ElementType = 'button'>(
  props: DynMenuItemProps<E>,
  ref: DynMenuItemRef<E>
) {
  const {
    as,
    label,
    children,
    className,
    id,
    disabled = false,
    loading = false,
    active = false,
    'aria-label': ariaLabelProp,
    ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    role: roleProp,
    tabIndex: tabIndexProp,
    onClick: userOnClick,
    onKeyDown: userOnKeyDown,
    onKeyUp: userOnKeyUp,
    onFocus: userOnFocus,
    onBlur: userOnBlur,
    'data-testid': dataTestId = 'dyn-menu-item',
    style,
    ...rest
  } = props;

  const Component = (as ?? 'button') as ElementType;
  const isNativeButton = isStringElement(Component) && Component === 'button';
  const isDisabled = disabled || loading;
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const internalId = useMemo(() => id || generateId('dyn-menu-item'), [id]);

  const computedAriaLabel = useMemo(
    () => normalizeLabel(ariaLabelProp ?? ariaLabel),
    [ariaLabel, ariaLabelProp]
  );

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    type ClickHandler = NonNullable<typeof userOnClick>;
    (userOnClick as ClickHandler | undefined)?.(
      event as Parameters<ClickHandler>[0]
    );
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    type KeyHandler = NonNullable<typeof userOnKeyDown>;
    (userOnKeyDown as KeyHandler | undefined)?.(
      event as Parameters<KeyHandler>[0]
    );
    if (event.defaultPrevented) return;

    if (isDisabled) {
      if (!isNativeButton && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(true);
      if (!isNativeButton) {
        event.preventDefault();
      }
    }
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLElement> = (event) => {
    type KeyHandler = NonNullable<typeof userOnKeyUp>;
    (userOnKeyUp as KeyHandler | undefined)?.(
      event as Parameters<KeyHandler>[0]
    );
    if (event.defaultPrevented) return;

    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(false);
      if (!isNativeButton && !isDisabled) {
        event.preventDefault();
        event.currentTarget.click();
      }
    }
  };

  const handleFocus: React.FocusEventHandler<HTMLElement> = (event) => {
    setIsFocusVisible(true);
    type FocusHandler = NonNullable<typeof userOnFocus>;
    (userOnFocus as FocusHandler | undefined)?.(
      event as Parameters<FocusHandler>[0]
    );
  };

  const handleBlur: React.FocusEventHandler<HTMLElement> = (event) => {
    setIsFocusVisible(false);
    setIsPressed(false);
    type FocusHandler = NonNullable<typeof userOnBlur>;
    (userOnBlur as FocusHandler | undefined)?.(
      event as Parameters<FocusHandler>[0]
    );
  };

  const { type: typeProp, style: restStyle, ...domProps } = rest as Record<string, unknown> & {
    type?: string;
    style?: React.CSSProperties;
  };

  const role = roleProp ?? 'menuitem';
  const tabIndex = isNativeButton
    ? tabIndexProp
    : tabIndexProp ?? (isDisabled ? -1 : 0);

  const ariaDisabled = !isNativeButton && isDisabled ? true : undefined;
  const ariaBusy = loading ? true : undefined;

  const elementStyle = style || restStyle;

  return (
    <Component
      {...domProps}
      ref={ref as any}
      id={internalId}
      role={role}
      tabIndex={tabIndex as number | undefined}
      aria-disabled={ariaDisabled}
      aria-busy={ariaBusy}
      aria-label={computedAriaLabel}
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy}
      data-testid={dataTestId}
      data-active={active ? 'true' : undefined}
      data-disabled={isDisabled ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
      data-pressed={isPressed ? 'true' : undefined}
      data-focus-visible={isFocusVisible ? 'true' : undefined}
      className={cn('dyn-menu-item', className)}
      style={elementStyle as React.CSSProperties | undefined}
      disabled={isNativeButton ? isDisabled : undefined}
      type={isNativeButton ? (typeProp ?? 'button') : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children ?? label}
    </Component>
  );
}

export const DynMenuItem = forwardRef(DynMenuItemInner) as <
  E extends ElementType = 'button'
>(
  props: DynMenuItemProps<E> & { ref?: DynMenuItemRef<E> }
) => React.ReactElement | null;
