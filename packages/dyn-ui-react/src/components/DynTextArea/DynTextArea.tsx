import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, ForwardedRef } from 'react';
import { DynFieldContainer } from '../DynFieldContainer';
import type { DynFieldContainerProps } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { cn } from '../../utils/classNames';
import type {
  DynTextAreaProps,
  DynTextAreaRef,
  DynTextAreaStatus,
} from './DynTextArea.types';
import { DYN_TEXT_AREA_DEFAULT_PROPS } from './DynTextArea.types';
import styles from './DynTextArea.module.css';
import { useI18n } from '../../i18n';

const DynTextAreaComponent = (
  {
    name,
    id,
    label,
    help,
    placeholder,
    disabled = DYN_TEXT_AREA_DEFAULT_PROPS.disabled,
    readonly = DYN_TEXT_AREA_DEFAULT_PROPS.readonly,
    required = DYN_TEXT_AREA_DEFAULT_PROPS.required,
    optional = DYN_TEXT_AREA_DEFAULT_PROPS.optional,
    visible = DYN_TEXT_AREA_DEFAULT_PROPS.visible,
    value: valueProp,
    defaultValue = DYN_TEXT_AREA_DEFAULT_PROPS.defaultValue,
    errorMessage,
    status = DYN_TEXT_AREA_DEFAULT_PROPS.status,
    statusMessage = DYN_TEXT_AREA_DEFAULT_PROPS.statusMessage,
    validation,
    className,
    resize = DYN_TEXT_AREA_DEFAULT_PROPS.resize,
    rows = DYN_TEXT_AREA_DEFAULT_PROPS.rows,
    cols,
    autoResize = DYN_TEXT_AREA_DEFAULT_PROPS.autoResize,
    showCharacterCount = DYN_TEXT_AREA_DEFAULT_PROPS.showCharacterCount,
    onChange,
    onBlur,
    onFocus,
    'data-testid': dataTestId = DYN_TEXT_AREA_DEFAULT_PROPS['data-testid'],
    ...rest
  }: DynTextAreaProps,
  ref: ForwardedRef<DynTextAreaRef>
) => {
  const {
    maxLength,
    style,
    'aria-describedby': ariaDescribedByProp,
    ...restProps
  } = rest;

  const [value, setValue] = useState<string>(() => valueProp ?? defaultValue ?? '');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fallbackId = useId();
  const fieldId = id ?? name ?? `${fallbackId}-textarea`;

  const { t } = useI18n();

  const translatedPlaceholder = useMemo(() => {
    if (typeof placeholder !== 'string') return undefined;
    const trimmed = placeholder.trim();
    if (!trimmed) return undefined;
    return t({ id: trimmed, defaultMessage: trimmed });
  }, [placeholder, t]);

  const { error, validate, clearError } = useDynFieldValidation({
    value,
    required,
    validation,
    customError: errorMessage,
  });

  const adjustHeight = useCallback(() => {
    if (!autoResize) {
      return;
    }

    const element = textareaRef.current;

    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [autoResize]);

  const scheduleHeightAdjustment = useCallback(() => {
    if (!autoResize) {
      return;
    }

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(adjustHeight);
      return;
    }

    adjustHeight();
  }, [adjustHeight, autoResize]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      validate: () => validate(),
      clear: () => {
        setValue('');
        onChange?.('');
        clearError();
        scheduleHeightAdjustment();
        if (textareaRef.current) {
          textareaRef.current.value = '';
        }
      },
      getValue: () => textareaRef.current?.value ?? value,
      setValue: (newValue: unknown) => {
        const stringValue = String(newValue ?? '');
        setValue(stringValue);
        onChange?.(stringValue);
        scheduleHeightAdjustment();
        if (textareaRef.current) {
          textareaRef.current.value = stringValue;
        }
      },
      getElement: () => textareaRef.current,
    }),
    [adjustHeight, autoResize, clearError, onChange, scheduleHeightAdjustment, validate, value]
  );

  useEffect(() => {
    if (valueProp !== undefined) {
      setValue(valueProp);
    }
  }, [valueProp]);

  useEffect(() => {
    if (valueProp === undefined && defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue, valueProp]);

  useEffect(() => {
    if (!autoResize) {
      const element = textareaRef.current;
      if (element) {
        element.style.height = '';
        element.style.overflowY = '';
      }
      return;
    }

    const element = textareaRef.current;

    if (!element) {
      return;
    }

    element.style.overflowY = 'hidden';
    adjustHeight();

    return () => {
      element.style.overflowY = '';
      element.style.height = '';
    };
  }, [adjustHeight, autoResize, rows]);

  useEffect(() => {
    scheduleHeightAdjustment();
  }, [scheduleHeightAdjustment, value]);

  if (!visible) {
    return null;
  }

  const resolvedValidationError = errorMessage ?? (error || undefined);
  const hasValidationError = Boolean(resolvedValidationError);
  const resolvedStatus: DynTextAreaStatus = hasValidationError
    ? 'error'
    : status;

  const effectiveErrorMessage =
    resolvedStatus === 'error'
      ? resolvedValidationError ?? (status === 'error' ? statusMessage || undefined : undefined)
      : undefined;

  const resolvedStatusMessage =
    resolvedStatus !== 'error' && statusMessage ? statusMessage : undefined;

  const helpId = help ? `${fieldId}-help` : undefined;
  const errorId = effectiveErrorMessage ? `${fieldId}-error` : undefined;
  const statusId = resolvedStatusMessage ? `${fieldId}-status` : undefined;
  const hasMaxLength = typeof maxLength === 'number';
  const counterId = showCharacterCount && hasMaxLength ? `${fieldId}-counter` : undefined;

  const describedByIds = [
    ariaDescribedByProp,
    errorId,
    !errorId ? helpId : undefined,
    statusId,
    counterId,
  ].filter(Boolean);

  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  const textareaClasses = cn(
    styles.textarea,
    focused && styles.textareaFocused,
    resolvedStatus === 'error' && styles.textareaError,
    resolvedStatus === 'warning' && styles.textareaWarning,
    resolvedStatus === 'success' && styles.textareaSuccess,
    resolvedStatus === 'loading' && styles.textareaLoading,
    disabled && styles.textareaDisabled,
    readonly && styles.textareaReadonly,
    resize === 'none' && styles.textareaResizeNone,
    resize === 'horizontal' && styles.textareaResizeHorizontal,
    resize === 'both' && styles.textareaResizeBoth,
    autoResize && styles.textareaAutoResize
  );

  const containerClasses = cn(styles.container, className);
  const fieldWrapperClasses = cn(styles.fieldWrapper);
  const containerId = id ? `${id}-container` : undefined;

  const fieldContainerProps: Omit<DynFieldContainerProps, 'children'> = {
    label,
    required,
    optional,
    helpText: help,
    errorText: effectiveErrorMessage,
    className: containerClasses,
    htmlFor: fieldId,
    id: containerId,
    'data-status': resolvedStatus,
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    if (disabled || readonly) {
      event.preventDefault();
      return;
    }

    setValue(newValue);
    onChange?.(newValue);
    clearError();

    if (autoResize) {
      event.target.style.height = 'auto';
      event.target.style.height = `${event.target.scrollHeight}px`;
    }
  };

  const handleFocus = () => {
    if (disabled) {
      return;
    }

    setFocused(true);
    clearError();
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    void validate();
    onBlur?.();
  };

  const isErrorState = resolvedStatus === 'error';
  const isLoadingState = resolvedStatus === 'loading';

  return (
    <DynFieldContainer {...fieldContainerProps}>
      <textarea
        {...rest}
        ref={textareaRef}
        id={fieldId}
        name={name}
        className={textareaClasses}
        placeholder={translatedPlaceholder ?? placeholder}
        value={value}
        disabled={disabled}
        readOnly={readonly}
        required={required}
        rows={rows}
        cols={cols}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={Boolean(resolvedError)}
        aria-required={required || undefined}
        aria-describedby={describedById}
        data-testid={dataTestId}
      />
    </DynFieldContainer>
  );
};

const DynTextArea = forwardRef<DynTextAreaRef, DynTextAreaProps>(DynTextAreaComponent);

DynTextArea.displayName = 'DynTextArea';

export { DynTextArea };
export default DynTextArea;
