import React, { useCallback, useMemo, useState } from 'react';
import { cn } from '../../utils/classNames';
import styles from './DynMenuTrigger.module.css';

type ElementProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

type DynMenuTriggerBaseProps<T extends React.ElementType> = {
  as?: T;
  /**
   * Indicates that the trigger is representing an expanded/open menu state.
   */
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<Element>;
  children?: React.ReactNode;
};

type DynMenuTriggerProps<T extends React.ElementType = 'button'> = DynMenuTriggerBaseProps<T> &
  Omit<ElementProps<T>, keyof DynMenuTriggerBaseProps<T>>;

export type { DynMenuTriggerProps };

export type DynMenuTriggerComponent = <T extends React.ElementType = 'button'>(
  props: DynMenuTriggerProps<T> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

const isKeyboardActivation = (event: React.KeyboardEvent<Element>) =>
  event.key === ' ' || event.key === 'Enter';

const DynMenuTriggerInner = <T extends React.ElementType = 'button'>(
  props: DynMenuTriggerProps<T>,
  forwardedRef: React.Ref<Element>
) => {
  const {
    as,
    active = false,
    className,
    disabled = false,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onKeyDown,
    onKeyUp,
    onBlur,
    tabIndex,
    ...rest
  } = props;

  const Component = (as || 'button') as React.ElementType;
  const [pressed, setPressed] = useState(false);

  const isButtonElement = useMemo(() => Component === 'button', [Component]);

  const releasePress = useCallback(() => {
    setPressed(false);
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<Element>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      setPressed(true);
      onPointerDown?.(event);
    },
    [disabled, onPointerDown]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<Element>) => {
      releasePress();
      onPointerUp?.(event);
    },
    [onPointerUp, releasePress]
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<Element>) => {
      releasePress();
      onPointerLeave?.(event);
    },
    [onPointerLeave, releasePress]
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<Element>) => {
      releasePress();
      onPointerCancel?.(event);
    },
    [onPointerCancel, releasePress]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<Element>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;
      if (isKeyboardActivation(event)) {
        setPressed(true);
      }
    },
    [disabled, onKeyDown]
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<Element>) => {
      releasePress();
      onKeyUp?.(event);
    },
    [onKeyUp, releasePress]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<Element>) => {
      releasePress();
      onBlur?.(event);
    },
    [onBlur, releasePress]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<Element>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    },
    [disabled, onClick]
  );

  const resolvedTabIndex = useMemo(() => {
    if (typeof tabIndex === 'number') return tabIndex;
    if (disabled && !isButtonElement) return -1;
    return undefined;
  }, [disabled, isButtonElement, tabIndex]);

  const ariaDisabled = useMemo(() => {
    if (isButtonElement) return undefined;
    return disabled ? true : undefined;
  }, [disabled, isButtonElement]);

  const componentProps = {
    ref: forwardedRef,
    className: cn(styles.trigger, active && styles.triggerActive, className),
    'data-disabled': disabled ? 'true' : undefined,
    'data-pressed': pressed ? 'true' : undefined,
    'data-active': active ? 'true' : undefined,
    ...(isButtonElement ? { disabled } : { 'aria-disabled': ariaDisabled }),
    tabIndex: resolvedTabIndex,
    onClick: handleClick,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave,
    onPointerCancel: handlePointerCancel,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur,
    ...rest
  } as ElementProps<T> & {
    ref: React.Ref<Element>;
  };

  if (isButtonElement && !(rest as Record<string, unknown>).type) {
    (componentProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = 'button';
  }

  return <Component {...componentProps}>{children}</Component>;
};

export const DynMenuTrigger = React.forwardRef(DynMenuTriggerInner) as DynMenuTriggerComponent;
