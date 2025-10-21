import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import type { CSSProperties, ElementType, MutableRefObject } from 'react';
import { cn } from '../../utils/classNames';
import { DynModalPlacement } from '../DynModalPlacement';
import type { DynModalPlacementProps } from '../DynModalPlacement';
import styles from './DynModal.module.css';
import type { DynModalProps, DynModalRef } from './DynModal.types';
import { DYN_MODAL_DEFAULT_PROPS } from './DynModal.types';
import styles from './DynModal.module.css';

const getStyleClass = (className: string) => (styles as Record<string, string>)[className] || '';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const focusElement = (element: HTMLElement | null) => {
  if (!element) return;
  try {
    element.focus();
  } catch (error) {
    // Intentionally swallow errors that occur when the element cannot be focused.
  }
};

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const getFocusableElements = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) return [];
  const elements = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  return elements.filter(element => {
    if (element.hasAttribute('disabled')) return false;
    if (element.getAttribute('tabindex') === '-1') return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    return true;
  });
};

type DynModalComponent = <E extends ElementType = 'div'>(
  props: DynModalProps<E>,
  ref: React.ForwardedRef<DynModalRef<E>>
) => React.ReactElement | null;

export const DynModal = forwardRef(
  (<E extends ElementType = 'div'>(
    {
      as,
      isOpen,
      onClose,
      placement: placementOverride,
      alignment: alignmentOverride,
      strategy: strategyOverride,
      placementProps,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      lockScroll = true,
      disabled = false,
      wrapperClassName,
      backdropClassName,
      backdropStyle,
      className,
      style,
      maxWidth,
      minWidth,
      returnFocusElement,
      children,
      role = 'dialog',
      'aria-modal': ariaModal = true,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId = 'dyn-modal',
      onKeyDown: userOnKeyDown,
      tabIndex: userTabIndex,
      ...rest
    }: DynModalProps<E>,
    forwardedRef: React.ForwardedRef<DynModalRef<E>>
  ) => {
    const internalRef = useRef<HTMLElement | null>(null);
    const previousActiveRef = useRef<HTMLElement | null>(null);
    const wasOpenRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        internalRef.current = node;

        if (typeof forwardedRef === 'function') {
          forwardedRef(node as DynModalRef<E> | null);
        } else if (forwardedRef) {
          (forwardedRef as MutableRefObject<DynModalRef<E> | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const requestClose = useCallback(() => {
      if (disabled) return;
      onClose?.();
    }, [disabled, onClose]);

    const {
      placement: placementFromConfig,
      alignment: alignmentFromConfig,
      strategy: strategyFromConfig,
      wrapperClassName: placementWrapperClassName,
      ...restPlacementOptions
    } = placementProps ?? {};

    const effectivePlacement = placementOverride ?? placementFromConfig ?? 'center';
    const effectiveAlignment = alignmentOverride ?? alignmentFromConfig ?? 'center';
    const effectiveStrategy = strategyOverride ?? strategyFromConfig ?? 'fixed';

    useEffect(() => {
      if (!isOpen) return;
      if (typeof document !== 'undefined') {
        previousActiveRef.current =
          (document.activeElement as HTMLElement | null) ?? null;
      }
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen || !closeOnEsc || disabled) return;
      if (typeof document === 'undefined') return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          requestClose();
        }
        focusElement(contentRef.current as HTMLElement);
      }
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(focusTask);
    } else {
      setTimeout(focusTask, 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !contentRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!contentRef.current) return;

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeOnEsc, disabled, requestClose]);

    useEffect(() => {
      if (!isOpen || !lockScroll) return;
      if (typeof document === 'undefined') return;
      const { body } = document;
      if (!body) return;

      const previousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';

      return () => {
        body.style.overflow = previousOverflow;
      };
    }, [isOpen, lockScroll]);

    useEffect(() => {
      if (isOpen) {
        wasOpenRef.current = true;
        return;
      }

      if (!wasOpenRef.current) return;
      wasOpenRef.current = false;

      const fallback = returnFocusElement ?? previousActiveRef.current;
      fallback?.focus?.();
    }, [isOpen, returnFocusElement]);

    useEffect(() => {
      if (!isOpen) return;
      const element = internalRef.current;
      if (!element) return;

      const focusables = getFocusableElements(element);
      const firstFocusable = focusables[0] ?? element;
      firstFocusable.focus?.({ preventScroll: true });
    }, [isOpen, disabled]);

    useEffect(() => {
      if (!isOpen) return;
      if (typeof document === 'undefined') return;
      const element = internalRef.current;
      if (!element) return;

      const enforceFocus = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        if (element.contains(target)) return;

        const focusables = getFocusableElements(element);
        const fallback = focusables[0] ?? element;
        fallback.focus?.({ preventScroll: true });
      };

      document.addEventListener('focusin', enforceFocus);
      return () => document.removeEventListener('focusin', enforceFocus);
    }, [isOpen, disabled]);

    const placementConfiguration: DynModalPlacementProps = {
      ...restPlacementOptions,
      placement: effectivePlacement,
      alignment: effectiveAlignment,
      strategy: effectiveStrategy,
      wrapperClassName: cn(
        styles.wrapper,
        placementWrapperClassName,
        wrapperClassName
      )
    };

      const focusable = getFocusableElements();

      if (focusable.length === 0) {
        event.preventDefault();
        focusElement(contentRef.current);
        return;
      }

      const current = document.activeElement as HTMLElement | null;
      const currentIndex = current ? focusable.indexOf(current) : -1;

      if (event.shiftKey) {
        if (currentIndex <= 0) {
          event.preventDefault();
          focusElement(focusable[focusable.length - 1]);
        }
        return;
      }

      if (currentIndex === -1 || currentIndex === focusable.length - 1) {
        event.preventDefault();
        focusElement(focusable[0]);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!contentRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (contentRef.current.contains(target)) return;
      const [firstFocusable] = getFocusableElements();
      focusElement(firstFocusable ?? contentRef.current);
    };

    const handleBackdropClick = () => {
      if (!closeOnBackdropClick) return;
      requestClose();
    };
  }, [open, closeOnEscape, disabled, onClose]);

    const isFullscreen = effectivePlacement === 'fullscreen';
    const Component = (as ?? 'div') as ElementType;

    return (
      <DynModalPlacement {...placementConfiguration}>
        <div className={styles.container}>
          <div
            className={cn(styles.backdrop, backdropClassName)}
            style={backdropStyle}
            onClick={handleBackdropClick}
            data-testid="dyn-modal-backdrop"
          />
          <Component
            ref={setRefs as React.Ref<any>}
            role={role}
            aria-modal={ariaModal}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? 'true' : undefined}
            className={cn(styles.modal, isFullscreen && styles.fullscreen, className)}
            style={contentStyle}
            data-testid={dataTestId}
            tabIndex={userTabIndex ?? -1}
            onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
              if (event.key === 'Tab') {
                const element = internalRef.current;
                if (!element) return;
                const focusables = getFocusableElements(element);

                if (focusables.length === 0) {
                  event.preventDefault();
                  element.focus?.({ preventScroll: true });
                  return;
                }

                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement as HTMLElement | null;

                if (event.shiftKey) {
                  if (active === first || !element.contains(active)) {
                    event.preventDefault();
                    last.focus?.({ preventScroll: true });
                  }
                } else if (active === last) {
                  event.preventDefault();
                  first.focus?.({ preventScroll: true });
                }
              }

              userOnKeyDown?.(event);
            }}
            {...rest}
          >
            {children}
          </Component>
        </div>
      </DynModalPlacement>
    );
  }
  ) as DynModalComponent
);

  const handleOverlayMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!closeOnOverlayClick || disabled) return;
    if (event.target !== event.currentTarget) return;
    event.stopPropagation();
    onClose?.();
  };

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    userOnKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === 'Escape' && closeOnEscape && !disabled) {
      event.preventDefault();
      event.stopPropagation();
      onClose?.();
    }
  };

  const overlayClasses = cn(getStyleClass('overlay'), overlayClassName, {
    [getStyleClass('disabled')]: disabled,
  });

  const contentClasses = cn(getStyleClass('content'), className);

  return (
    <div
      ref={overlayRef}
      className={overlayClasses}
      onMouseDown={handleOverlayMouseDown}
      data-testid={`${dataTestId}-overlay`}
      role="presentation"
    >
      <Component
        {...(rest as Record<string, unknown>)}
        ref={setContentRef}
        id={id}
        role={role}
        className={contentClasses}
        aria-modal="true"
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        data-testid={dataTestId}
        tabIndex={tabIndex ?? -1}
        onKeyDown={handleKeyDown}
      >
        {children}
      </Component>
    </div>
  );
}

const DynModalComponent = forwardRef(DynModalInner) as unknown as <
  E extends React.ElementType = 'div'
>(
  props: DynModalProps<E> & { ref?: React.Ref<DynModalRef<E>> }
) => React.ReactElement | null;

DynModalComponent.displayName = 'DynModal';

export const DynModal = DynModalComponent;

