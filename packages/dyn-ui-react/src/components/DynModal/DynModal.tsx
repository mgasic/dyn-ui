import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { cn } from '../../utils/classNames';
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

function DynModalInner<E extends React.ElementType = 'div'>(
  props: DynModalProps<E>,
  ref: React.ForwardedRef<DynModalRef<E>>
): React.ReactElement | null {
  const {
    as,
    open,
    onClose,
    closeOnOverlayClick = DYN_MODAL_DEFAULT_PROPS.closeOnOverlayClick,
    closeOnEscape = DYN_MODAL_DEFAULT_PROPS.closeOnEscape,
    disabled = DYN_MODAL_DEFAULT_PROPS.disabled,
    role = DYN_MODAL_DEFAULT_PROPS.role,
    className,
    overlayClassName,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'data-testid': dataTestId = DYN_MODAL_DEFAULT_PROPS['data-testid'],
    onKeyDown: userOnKeyDown,
    tabIndex,
    children,
    ...rest
  } = props as DynModalProps<E> & {
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    tabIndex?: number;
  };

  const Component = useMemo(() => (as ?? 'div') as React.ElementType, [as]);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef<boolean>(false);

  const setContentRef = (node: HTMLElement | null) => {
    contentRef.current = node;
    if (typeof ref === 'function') {
      ref(node as DynModalRef<E>);
    } else if (ref && 'current' in (ref as Record<string, unknown>)) {
      (ref as React.MutableRefObject<DynModalRef<E> | null>).current = node as DynModalRef<E>;
    }
  };

  const getFocusableElements = () => {
    if (!contentRef.current) return [] as HTMLElement[];
    const nodes = Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );
    return nodes.filter((node) => !node.hasAttribute('disabled') && !node.getAttribute('aria-hidden'));
  };

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        focusElement(previouslyFocusedRef.current);
      }
      wasOpenRef.current = false;
      previouslyFocusedRef.current = null;
      return;
    }

    wasOpenRef.current = true;
    if (typeof document !== 'undefined') {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    }

    const focusTask = () => {
      const [firstFocusable] = getFocusableElements();
      if (firstFocusable) {
        focusElement(firstFocusable);
        return;
      }
      if (contentRef.current) {
        if (!contentRef.current.hasAttribute('tabindex')) {
          contentRef.current.setAttribute('tabindex', '-1');
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

      if (event.key === 'Escape' && closeOnEscape && !disabled) {
        event.preventDefault();
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

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

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [open, closeOnEscape, disabled, onClose]);

  if (!open) {
    return null;
  }

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

