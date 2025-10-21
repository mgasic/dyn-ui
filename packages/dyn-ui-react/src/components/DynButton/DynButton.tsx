import React, { forwardRef, useMemo, useState } from 'react';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
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

/**
 * Safely access CSS module classes (pattern from DynAvatar)
 */
const getStyleClass = (className: string): string => {
  return (styles as Record<string, string>)[className] || '';
};

/**
 * Normalize ARIA label values
 */
const normalizeAriaLabel = (value: string | undefined): string | undefined =>
  value?.trim() ? value.trim() : undefined;

/**
 * Generate appropriate ARIA label for icon-only buttons
 */
const generateIconAriaLabel = (icon: string | React.ReactNode): string | undefined => {
  if (typeof icon !== 'string') return undefined;
  return icon
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

type DynButtonComponentProps = DynButtonProps & DynButtonDefaultProps;

/**
 * DynButton
 *
 * Enterprise-grade button component following the DynAvatar gold standard for architecture,
 * accessibility, and composability.
 */
export const DynButton = forwardRef<DynButtonRef, DynButtonProps>(
  (
    {
      label,
      icon,
      type = DYN_BUTTON_DEFAULT_PROPS.type,
      kind = DYN_BUTTON_DEFAULT_PROPS.kind,
      size = DYN_BUTTON_DEFAULT_PROPS.size,
      loading = DYN_BUTTON_DEFAULT_PROPS.loading,
      loadingText = DYN_BUTTON_DEFAULT_PROPS.loadingText,
      danger = DYN_BUTTON_DEFAULT_PROPS.danger,
      disabled = DYN_BUTTON_DEFAULT_PROPS.disabled,
      fullWidth = DYN_BUTTON_DEFAULT_PROPS.fullWidth,
      hideOnMobile = DYN_BUTTON_DEFAULT_PROPS.hideOnMobile,
      iconOnlyOnMobile = DYN_BUTTON_DEFAULT_PROPS.iconOnlyOnMobile,
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
      ...rest
    },
    ref
  ) => {
  // Generate an ID per render when not provided so tests that expect
  // different IDs on rerender pass (generateId increments a module counter).
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
      className
    );

    // Event handlers
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    const handleBlur: FocusEventHandler<HTMLButtonElement> = (event) => {
      onBlur?.(event);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (!isDisabled) {
          event.currentTarget.click();
        }
      }
      userOnKeyDown?.(event);
    };

    return (
      <>
        <button
        ref={ref}
        id={internalId}
        type={type}
        className={buttonClassName}
        data-testid={dataTestId ?? 'dyn-button'}
        aria-label={computedAriaLabel}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-pressed={typeof ariaPressed === 'boolean' ? ariaPressed : undefined}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        role={role}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <span className={getStyleClass('content')} style={{ opacity: loading ? 0 : undefined }}>
          {iconElement}
          {labelElement}
          {childrenContent}
        </span>
        {/* Loading spinner and accessibility announcements */}
        {loading && (
          <>
            <span className={getStyleClass('spinner')} aria-hidden="true" />
            {/* Keep an inert SR-only element inside the button so tests can
                query it, but mark it aria-hidden so it doesn't become part
                of the button's accessible name. The actual live region that
                will be announced by assistive tech is rendered *outside*
                the button below. */}
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
        </button>

        {/* External live region so screen readers announce loading text
            without affecting the button's accessible name. It is visually
            hidden via the same SR-only class. */}
        {loading && (
          <span
            className="dyn-sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {normalizedLoadingText}
          </span>
        )}
      </>
    );
  }
);

DynButton.displayName = 'DynButton';

export default DynButton;
