import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import { DynIcon } from '../DynIcon';
import { useI18n } from '../../i18n';
import type {
  DynButtonDefaultProps,
  DynButtonProps,
  DynButtonRef,
} from './DynButton.types';
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
  const { t } = useI18n();

    // Memoized computations
    const fallbackButtonLabel = useMemo(
      () => t({ id: 'button.fallback', defaultMessage: 'Button' }),
      [t]
    );
    const defaultLoadingMessage = useMemo(
      () => t({ id: DYN_BUTTON_DEFAULT_PROPS.loadingText, defaultMessage: DYN_BUTTON_DEFAULT_PROPS.loadingText }),
      [t]
    );
    const labelText = useMemo(() => {
      if (typeof label !== 'string') return '';
      const trimmed = label.trim();
      if (!trimmed) return '';
      return t({ id: trimmed, defaultMessage: trimmed }).trim();
    }, [label, t]);
    const hasLabel = labelText.length > 0;
    const childrenCount = React.Children.count(children);
    const hasChildrenContent = childrenCount > 0;
    const isIconOnly = Boolean(icon) && !hasLabel && !hasChildrenContent;
    const isDisabled = disabled || loading;

    // Generate appropriate ARIA label for accessibility
    const iconAriaLabel = useMemo(() => generateIconAriaLabel(icon), [icon]);
    const translatedAriaLabel = useMemo(() => {
      if (typeof ariaLabel !== 'string') return undefined;
      const trimmed = ariaLabel.trim();
      if (!trimmed) return undefined;
      return t({ id: trimmed, defaultMessage: trimmed });
    }, [ariaLabel, t]);
    const computedAriaLabel = useMemo(
      () =>
        normalizeAriaLabel(
          translatedAriaLabel ??
            (isIconOnly ? (labelText || iconAriaLabel || fallbackButtonLabel) : undefined)
        ),
      [translatedAriaLabel, isIconOnly, labelText, iconAriaLabel, fallbackButtonLabel]
    );
  }, [startIcon, endIcon]);

    // Normalize loading text
    const normalizedLoadingText = useMemo(() => {
      if (typeof loadingText !== 'string') return defaultLoadingMessage;
      const trimmed = loadingText.trim();
      if (!trimmed) return defaultLoadingMessage;
      return t({ id: trimmed, defaultMessage: trimmed });
    }, [defaultLoadingMessage, loadingText, t]);

    // Icon size mapping
    const iconSizeToken = useMemo(() => {
      switch (size) {
        case 'small': return 'small';
        case 'large': return 'large';
        default: return 'medium';
      }
    }, [size]);

    // Render icon element
    const iconElement = useMemo(() => {
      if (!icon) return null;
      if (typeof icon === 'string') {
        return <DynIcon icon={icon} aria-hidden="true" className={getStyleClass('icon')} size={iconSizeToken} />;
      }
      return <span className={getStyleClass('icon')} aria-hidden="true">{icon}</span>;
    }, [icon, iconSizeToken]);

    // Render children content
    const childrenContent = useMemo(() => {
      if (!hasChildrenContent) return null;
      if (typeof children === 'string') {
        const trimmedChildren = children.trim();
        if (!trimmedChildren) return null;
        const translatedChild = t({ id: trimmedChildren, defaultMessage: trimmedChildren });
        return <span className={getStyleClass('label')}>{translatedChild}</span>;
      }
      return children;
    }, [children, hasChildrenContent, t]);

    // Render label element (primary text)
    const labelElement = hasLabel ? (
      <span className={getStyleClass('label')}>{labelText}</span>
    ) : null;

    // Generate CSS classes safely (DynAvatar pattern)
    const kindClass = getStyleClass(`kind${kind.charAt(0).toUpperCase() + kind.slice(1)}`);
    const sizeClass = getStyleClass(`size${size.charAt(0).toUpperCase() + size.slice(1)}`);
    const dangerClass = getStyleClass('danger');
    const loadingClass = getStyleClass('loading');
    const iconOnlyClass = getStyleClass('iconOnly');
    const fullWidthClass = getStyleClass('fullWidth');
    const hideOnMobileClass = getStyleClass('hideOnMobile');
    const iconOnlyOnMobileClass = getStyleClass('iconOnlyOnMobile');

    const buttonClassName = cn(
      getStyleClass('root'),
      kindClass,
      sizeClass,
      {
        [dangerClass]: danger && dangerClass,
        [loadingClass]: loading && loadingClass,
        [iconOnlyClass]: isIconOnly && iconOnlyClass,
        [fullWidthClass]: fullWidth && fullWidthClass,
        [hideOnMobileClass]: hideOnMobile && hideOnMobileClass,
        [iconOnlyOnMobileClass]: iconOnlyOnMobile && iconOnlyOnMobileClass,
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

  if (isNativeButton) {
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
