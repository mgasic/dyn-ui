import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { classNames } from '../../utils/classNames';
import { DynModalPlacement } from '../DynModalPlacement';
import type { DynModalPlacementProps } from '../DynModalPlacement';
import styles from './DynModal.module.css';
import type { DynModalProps, DynModalRef } from './DynModal.types';

const toCssValue = (value?: number | string): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
};

export const DynModal = forwardRef<DynModalRef, DynModalProps>(
  (
    {
      isOpen,
      onClose,
      placement: placementOverride,
      alignment: alignmentOverride,
      strategy: strategyOverride,
      placementProps,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      lockScroll = true,
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
      ...rest
    },
    ref
  ) => {
    const previousActiveRef = useRef<HTMLElement | null>(null);

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
        previousActiveRef.current = (document.activeElement as HTMLElement | null) ?? null;
      }

      if (!closeOnEsc) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose?.();
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('keydown', handleKeyDown);
        }
      };
    }, [isOpen, closeOnEsc, onClose]);

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
      if (isOpen) return;

      const fallback = returnFocusElement ?? previousActiveRef.current;
      fallback?.focus?.();
    }, [isOpen, returnFocusElement]);

    const placementConfiguration: DynModalPlacementProps = {
      ...restPlacementOptions,
      placement: effectivePlacement,
      alignment: effectiveAlignment,
      strategy: effectiveStrategy,
      wrapperClassName: classNames(
        styles.wrapper,
        placementWrapperClassName,
        wrapperClassName
      )
    };

    const contentStyle = useMemo(() => {
      const computed: Record<string, unknown> = { ...style };
      const maxWidthValue = toCssValue(maxWidth);
      const minWidthValue = toCssValue(minWidth);

      if (maxWidthValue !== undefined) {
        computed['--dyn-modal-max-width'] = maxWidthValue;
      }
      if (minWidthValue !== undefined) {
        computed['--dyn-modal-min-width'] = minWidthValue;
      }

      return computed as CSSProperties;
    }, [style, maxWidth, minWidth]);

    if (!isOpen) {
      return null;
    }

    const handleBackdropClick = () => {
      if (!closeOnBackdropClick) return;
      onClose?.();
    };

    const isFullscreen = effectivePlacement === 'fullscreen';

    return (
      <DynModalPlacement {...placementConfiguration}>
        <div className={styles.container}>
          <div
            className={classNames(styles.backdrop, backdropClassName)}
            style={backdropStyle}
            onClick={handleBackdropClick}
            data-testid="dyn-modal-backdrop"
          />
          <div
            ref={ref}
            role={role}
            aria-modal={ariaModal}
            className={classNames(styles.modal, isFullscreen && styles.fullscreen, className)}
            style={contentStyle}
            onClick={event => event.stopPropagation()}
            {...rest}
          >
            {children}
          </div>
        </div>
      </DynModalPlacement>
    );
  }
);

DynModal.displayName = 'DynModal';

export type { DynModalProps, DynModalRef } from './DynModal.types';
