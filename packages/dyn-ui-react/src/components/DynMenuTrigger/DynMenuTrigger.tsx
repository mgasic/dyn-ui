import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/classNames';
import type { DynMenuTriggerProps, DynMenuTriggerRef } from './DynMenuTrigger.types';
import styles from './DynMenuTrigger.module.css';

const getStyleClass = (className: string): string =>
  (styles as Record<string, string>)[className] || '';

const DynMenuTriggerInner = <E extends React.ElementType = 'button'>(
  props: DynMenuTriggerProps<E>,
  ref: DynMenuTriggerRef<E>
) => {
  const {
    as,
    children,
    className,
    disabled = false,
    isOpen = false,
    onClick,
    'data-testid': dataTestId = 'dyn-menu-trigger',
    ...rest
  } = props as DynMenuTriggerProps & Record<string, unknown>;

  const [isPressed, setIsPressed] = useState(false);

  const {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onBlur,
    onKeyDown,
    onKeyUp,
    tabIndex,
    ...restProps
  } = rest as Record<string, any>;

  const Component = (as ?? 'button') as React.ElementType;
  const isButtonElement = typeof Component === 'string' && Component === 'button';

  const handlePointerDown: React.PointerEventHandler<Element> = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setIsPressed(true);
    onPointerDown?.(event);
  };

  const releasePress = (event: React.SyntheticEvent<Element>) => {
    setIsPressed(false);
    return event;
  };

  const handlePointerUp: React.PointerEventHandler<Element> = (event) => {
    releasePress(event);
    onPointerUp?.(event);
  };

  const handlePointerLeave: React.PointerEventHandler<Element> = (event) => {
    releasePress(event);
    onPointerLeave?.(event);
  };

  const handlePointerCancel: React.PointerEventHandler<Element> = (event) => {
    releasePress(event);
    onPointerCancel?.(event);
  };

  const handleBlur: React.FocusEventHandler<Element> = (event) => {
    releasePress(event);
    onBlur?.(event);
  };

  const isActivationKey = (key: string) => key === ' ' || key === 'Spacebar' || key === 'Enter';

  const handleKeyDown: React.KeyboardEventHandler<Element> = (event) => {
    if (disabled && isActivationKey(event.key)) {
      event.preventDefault();
      return;
    }

    if (event.key === ' ' || event.key === 'Spacebar') {
      if (!isButtonElement) {
        event.preventDefault();
      }
      setIsPressed(true);
    }

    if (!isButtonElement && event.key === 'Enter') {
      event.preventDefault();
      setIsPressed(true);
      const target = event.currentTarget as HTMLElement;
      const scheduleClick = () => {
        try {
          target.click();
        } catch {
          /* ignore */
        }
      };
      if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
        window.setTimeout(scheduleClick);
      } else {
        scheduleClick();
      }
    }

    onKeyDown?.(event);
  };

  const handleKeyUp: React.KeyboardEventHandler<Element> = (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      releasePress(event);
      if (!isButtonElement && !disabled) {
        const target = event.currentTarget as HTMLElement;
        const scheduleClick = () => {
          try {
            target.click();
          } catch {
            /* ignore */
          }
        };
        if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
          window.setTimeout(scheduleClick);
        } else {
          scheduleClick();
        }
      }
    } else if (event.key === 'Enter') {
      releasePress(event);
    }

    onKeyUp?.(event);
  };

  const handleClick: React.MouseEventHandler<Element> = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event as any);
  };

  const ariaDisabled = !isButtonElement && disabled ? true : undefined;
  const computedTabIndex =
    tabIndex !== undefined ? tabIndex : !isButtonElement && disabled ? -1 : undefined;

  const elementProps = {
    ...restProps,
    ref,
    className: cn(
      getStyleClass('root'),
      isOpen && getStyleClass('open'),
      isPressed && getStyleClass('pressed'),
      disabled && getStyleClass('disabled'),
      'dyn-menu-trigger',
      isOpen && 'dyn-menu-trigger-active',
      disabled && 'dyn-menu-trigger-disabled',
      className
    ),
    'data-testid': dataTestId,
    'data-state': isOpen ? 'open' : 'closed',
    'data-pressed': isPressed ? 'true' : undefined,
    'data-disabled': disabled ? 'true' : undefined,
    onClick: handleClick,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave,
    onPointerCancel: handlePointerCancel,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    tabIndex: computedTabIndex,
    'aria-disabled': ariaDisabled,
  } as Record<string, unknown>;

  if (isButtonElement) {
    elementProps.type = (restProps as Record<string, unknown>).type ?? 'button';
    elementProps.disabled = disabled;
    if (disabled) {
      delete elementProps['aria-disabled'];
    }
  }

  return React.createElement(Component as any, elementProps, children);
};

export const DynMenuTrigger = forwardRef(DynMenuTriggerInner) as <
  E extends React.ElementType = 'button'
>(
  props: DynMenuTriggerProps<E> & { ref?: DynMenuTriggerRef<E> }
) => React.ReactElement | null;

(DynMenuTrigger as React.NamedExoticComponent).displayName = 'DynMenuTrigger';

export default DynMenuTrigger;
