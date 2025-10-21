import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import { DynIcon } from '../DynIcon';
import type { DynButtonProps, DynButtonRef } from './DynButton.types';
import { DYN_BUTTON_DEFAULT_PROPS } from './DynButton.types';
import styles from './DynButton.module.css';

const getStyleClass = (className: string): string => {
  return (styles as Record<string, string>)[className] || '';
};

const normalizeAriaLabel = (value: string | undefined): string | undefined =>
  value?.trim() ? value.trim() : undefined;

const generateIconAriaLabel = (icon: string | React.ReactNode | undefined): string | undefined => {
  if (typeof icon !== 'string') return undefined;
  return icon
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === 'object' && value !== null && typeof (value as PromiseLike<unknown>).then === 'function';

type ElementProps<E extends ElementType> = React.ComponentPropsWithoutRef<E> & {
  ref?: React.Ref<DynButtonRef<E>>;
};

type DynButtonComponent = <E extends ElementType = 'button'>(
  props: DynButtonProps<E> & { ref?: React.Ref<DynButtonRef<E>> }
) => React.ReactElement | null;

const DynButtonInner = <E extends ElementType = 'button'>(
  props: DynButtonProps<E>,
  forwardedRef: React.Ref<DynButtonRef<E>>
) => {
  const {
    as,
    label,
    startIcon,
    endIcon,
    type: typeProp = DYN_BUTTON_DEFAULT_PROPS.type,
    variant = DYN_BUTTON_DEFAULT_PROPS.variant,
    size = DYN_BUTTON_DEFAULT_PROPS.size,
    loading: loadingProp,
    loadingText = DYN_BUTTON_DEFAULT_PROPS.loadingText,
    danger = DYN_BUTTON_DEFAULT_PROPS.danger,
    disabled = DYN_BUTTON_DEFAULT_PROPS.disabled,
    fullWidth = DYN_BUTTON_DEFAULT_PROPS.fullWidth,
    hideOnMobile = DYN_BUTTON_DEFAULT_PROPS.hideOnMobile,
    iconOnlyOnMobile = DYN_BUTTON_DEFAULT_PROPS.iconOnlyOnMobile,
    preventDuplicateClicks = DYN_BUTTON_DEFAULT_PROPS.preventDuplicateClicks,
    onClick,
    onBlur,
    onKeyDown: userOnKeyDown,
    children,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-pressed': ariaPressed,
    'data-testid': dataTestId,
    role,
    tabIndex,
    ...rest
  } = props;

  const Component = (as || 'button') as ElementType;
  const internalId = id || generateId('button');
  const isNativeButton = typeof Component === 'string' && Component === 'button';

  const [internalLoading, setInternalLoading] = useState(false);
  const loadingIsControlled = loadingProp !== undefined;
  const loading = loadingIsControlled ? Boolean(loadingProp) : internalLoading;
  const isDisabled = disabled || loading;

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const trimmedLabel = useMemo(() => (typeof label === 'string' ? label.trim() : ''), [label]);
  const hasLabel = trimmedLabel.length > 0;
  const childrenCount = React.Children.count(children);
  const hasChildrenContent = childrenCount > 0;
  const hasStartIcon = Boolean(startIcon);
  const hasEndIcon = Boolean(endIcon);
  const isIconOnly = (hasStartIcon || hasEndIcon) && !hasLabel && !hasChildrenContent;

  const iconAriaLabel = useMemo(() => {
    return normalizeAriaLabel(
      generateIconAriaLabel(startIcon) ?? generateIconAriaLabel(endIcon) ?? undefined
    );
  }, [startIcon, endIcon]);

  const computedAriaLabel = useMemo(
    () =>
      normalizeAriaLabel(
        ariaLabel ?? (isIconOnly ? trimmedLabel || iconAriaLabel || 'Button' : undefined)
      ),
    [ariaLabel, iconAriaLabel, isIconOnly, trimmedLabel]
  );

  const normalizedLoadingText = useMemo(() => {
    if (typeof loadingText !== 'string') return DYN_BUTTON_DEFAULT_PROPS.loadingText;
    const trimmed = loadingText.trim();
    return trimmed || DYN_BUTTON_DEFAULT_PROPS.loadingText;
  }, [loadingText]);

  const iconSizeToken = useMemo(() => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  }, [size]);

  const renderIcon = useMemo(
    () =>
      (icon: string | React.ReactNode | undefined, slot: 'iconStart' | 'iconEnd') => {
        if (!icon) return null;
        const slotClass = getStyleClass(slot);
        const iconClass = cn(getStyleClass('icon'), slotClass);
        if (typeof icon === 'string') {
          return (
            <DynIcon icon={icon} aria-hidden="true" className={iconClass} size={iconSizeToken} />
          );
        }
        return (
          <span className={iconClass} aria-hidden="true">
            {icon}
          </span>
        );
      },
    [iconSizeToken]
  );

  const startIconElement = useMemo(() => renderIcon(startIcon, 'iconStart'), [renderIcon, startIcon]);
  const endIconElement = useMemo(() => renderIcon(endIcon, 'iconEnd'), [endIcon, renderIcon]);

  const childrenContent = useMemo(() => {
    if (!hasChildrenContent) return null;
    if (typeof children === 'string') {
      const trimmedChildren = children.trim();
      if (!trimmedChildren) return null;
      return <span className={getStyleClass('label')}>{trimmedChildren}</span>;
    }
    return children;
  }, [children, hasChildrenContent]);

  const labelElement = hasLabel ? <span className={getStyleClass('label')}>{trimmedLabel}</span> : null;

  const variantClass = getStyleClass(`kind${variant.charAt(0).toUpperCase() + variant.slice(1)}`);
  const sizeClass = getStyleClass(`size${size.charAt(0).toUpperCase() + size.slice(1)}`);
  const dangerClass = getStyleClass('danger');
  const loadingClass = getStyleClass('loading');
  const iconOnlyClass = getStyleClass('iconOnly');
  const fullWidthClass = getStyleClass('fullWidth');
  const hideOnMobileClass = getStyleClass('hideOnMobile');
  const iconOnlyOnMobileClass = getStyleClass('iconOnlyOnMobile');

  const buttonClassName = cn(
    getStyleClass('root'),
    variantClass,
    sizeClass,
    {
      [dangerClass]: danger && dangerClass,
      [loadingClass]: loading && loadingClass,
      [iconOnlyClass]: isIconOnly && iconOnlyClass,
      [fullWidthClass]: fullWidth && fullWidthClass,
      [hideOnMobileClass]: hideOnMobile && hideOnMobileClass,
      [iconOnlyOnMobileClass]: iconOnlyOnMobile && iconOnlyOnMobileClass,
    },
    className
  );

  const state = loading ? 'loading' : isDisabled ? 'disabled' : 'idle';

  const handleClick = async (event: MouseEvent<Element>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const result = onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!loadingIsControlled && preventDuplicateClicks && isPromiseLike(result)) {
      setInternalLoading(true);
      try {
        await result;
      } catch (error) {
        throw error;
      } finally {
        if (isMountedRef.current) {
          setInternalLoading(false);
        }
      }
    }
  };

  const handleBlur = (event: FocusEvent<Element>) => {
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<Element>) => {
    const key = event.key;
    const isSpace = key === ' ' || key === 'Spacebar';
    const isEnter = key === 'Enter';
    const shouldSimulateClick = !isNativeButton && (isSpace || isEnter);

    if (isSpace || shouldSimulateClick) {
      event.preventDefault();
      if (!isDisabled) {
        (event.currentTarget as HTMLElement).click();
      }
      userOnKeyDown?.(event);
      return;
    }

    userOnKeyDown?.(event);
  };

  const resolvedRole = role ?? (!isNativeButton ? 'button' : undefined);
  const resolvedTabIndex = typeof tabIndex === 'number'
    ? tabIndex
    : !isNativeButton
    ? isDisabled
      ? -1
      : 0
    : undefined;

  const componentProps = {
    ref: forwardedRef,
    id: internalId,
    className: buttonClassName,
    'data-testid': dataTestId ?? 'dyn-button',
    'data-state': state,
    'data-variant': variant,
    'data-size': size,
    'data-danger': danger ? 'true' : undefined,
    'data-disabled': isDisabled ? 'true' : undefined,
    'aria-label': computedAriaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-pressed': typeof ariaPressed === 'boolean' ? ariaPressed : undefined,
    'aria-busy': loading || undefined,
    'aria-disabled': isDisabled || undefined,
    role: resolvedRole,
    tabIndex: resolvedTabIndex,
    onClick: handleClick,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    ...rest,
  } as ElementProps<E>;

  if (isNativeButton || typeof Component !== 'string') {
    (componentProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = typeProp;
    (componentProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = isDisabled;
  }

  return (
    <>
      <Component {...componentProps}>
        <span className={getStyleClass('content')}>
          {startIconElement}
          {labelElement}
          {childrenContent}
          {endIconElement}
        </span>
        {loading && (
          <>
            <span className={getStyleClass('spinner')} aria-hidden="true" data-state="visible" />
            <span
              className="dyn-sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              aria-hidden="true"
            >
              {normalizedLoadingText}
            </span>
          </>
        )}
      </Component>
      {loading && (
        <span className="dyn-sr-only" role="status" aria-live="polite" aria-atomic="true">
          {normalizedLoadingText}
        </span>
      )}
    </>
  );
};

export const DynButton = React.forwardRef(DynButtonInner) as DynButtonComponent;

DynButton.displayName = 'DynButton';

export default DynButton;
