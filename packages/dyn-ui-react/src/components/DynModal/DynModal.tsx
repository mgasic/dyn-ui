import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType
} from 'react';
import { cn } from '../../utils/classNames';
import { getFocusableElements, setElementRef } from '../../utils/focus';
import { activateFocusTrap } from '../../utils/focusTrap';
import { DynModalPlacement } from '../DynModalPlacement';
import type { DynModalPlacementProps } from '../DynModalPlacement';
import styles from './DynModal.module.css';
import type { DynModalProps, DynModalRef } from './DynModal.types';

const buildContentStyle = (
  base: CSSProperties | undefined,
  maxWidth: DynModalProps['maxWidth'],
  minWidth: DynModalProps['minWidth']
): CSSProperties | undefined => {
  if (!base && maxWidth == null && minWidth == null) return base;
  return {
    ...base,
    ...(maxWidth != null ? { maxWidth } : {}),
    ...(minWidth != null ? { minWidth } : {})
  };
};

const DynModalComponent = forwardRef(function DynModal<E extends ElementType = 'div'>(
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
) {
  const contentRef = useRef<HTMLElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const trapCleanupRef = useRef<(() => void) | null>(null);
  const wasOpenRef = useRef(false);

  const Component = (as ?? 'div') as ElementType;

  const requestClose = useCallback(() => {
    if (disabled) return;
    onClose?.();
  }, [disabled, onClose]);

  useEffect(() => {
    const element = contentRef.current;
    if (!isOpen || !element) return undefined;

    const ownerDocument = element.ownerDocument ?? document;
    const active = ownerDocument.activeElement as HTMLElement | null;
    if (active && !element.contains(active)) {
      openerRef.current = active;
    }

    const cleanup = activateFocusTrap(element, {
      initialFocus: () => {
        if (disabled) return element;
        const [first] = getFocusableElements(element);
        return first ?? element;
      },
      returnFocus: () => returnFocusElement ?? openerRef.current ?? null
    });

    trapCleanupRef.current = cleanup;
    wasOpenRef.current = true;

    return () => {
      cleanup();
      trapCleanupRef.current = null;
    };
  }, [disabled, isOpen, returnFocusElement]);

  useEffect(() => {
    if (isOpen) return;
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    trapCleanupRef.current?.();
    trapCleanupRef.current = null;
    openerRef.current = null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !lockScroll) return;
    const ownerDocument = contentRef.current?.ownerDocument ?? document;
    const body = ownerDocument.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen, lockScroll]);

  const handleBackdropMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!closeOnBackdropClick || disabled) return;
    if (event.target !== event.currentTarget) return;
    event.stopPropagation();
    requestClose();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    userOnKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === 'Escape' && closeOnEsc && !disabled) {
      event.preventDefault();
      event.stopPropagation();
      requestClose();
    }
  };

  useEffect(() => () => {
    trapCleanupRef.current?.();
    trapCleanupRef.current = null;
  }, []);

  const {
    placement: placementFromConfig,
    alignment: alignmentFromConfig,
    strategy: strategyFromConfig,
    wrapperClassName: placementWrapperClassName,
    ...restPlacement
  } = placementProps ?? {};

  const effectivePlacement = placementOverride ?? placementFromConfig ?? 'center';
  const effectiveAlignment = alignmentOverride ?? alignmentFromConfig ?? 'center';
  const effectiveStrategy = strategyOverride ?? strategyFromConfig ?? 'fixed';

  const placementConfiguration: DynModalPlacementProps = {
    ...restPlacement,
    placement: effectivePlacement,
    alignment: effectiveAlignment,
    strategy: effectiveStrategy,
    wrapperClassName: cn(styles.wrapper, placementWrapperClassName, wrapperClassName)
  };

  const contentStyle = useMemo(
    () => buildContentStyle(style, maxWidth, minWidth),
    [style, maxWidth, minWidth]
  );

  if (!isOpen) {
    return null;
  }

  const isFullscreen = effectivePlacement === 'fullscreen';

  return (
    <DynModalPlacement {...placementConfiguration}>
      <div className={styles.container}>
        <div
          className={cn(styles.backdrop, backdropClassName)}
          style={backdropStyle}
          onMouseDown={handleBackdropMouseDown}
          data-testid="dyn-modal-backdrop"
        />
        <Component
          {...(rest as Record<string, unknown>)}
          ref={(node: DynModalRef<E> | null) => {
            contentRef.current = node as HTMLElement | null;
            setElementRef(forwardedRef, node);
          }}
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
          onKeyDown={handleKeyDown}
        >
          {children}
        </Component>
      </div>
    </DynModalPlacement>
  );
});

DynModalComponent.displayName = 'DynModal';

export const DynModal = DynModalComponent as unknown as <
  E extends ElementType = 'div'
>(props: DynModalProps<E> & { ref?: React.Ref<DynModalRef<E>> }) => React.ReactElement | null;

export default DynModal;

