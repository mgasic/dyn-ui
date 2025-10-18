import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, ForwardedRef } from 'react';
import { DynFieldContainer } from '../DynFieldContainer';
import type { DynFieldContainerProps } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { cn } from '../../utils/classNames';
import type { DynTextAreaProps, DynTextAreaRef } from './DynTextArea.types';
import { DYN_TEXT_AREA_DEFAULT_PROPS } from './DynTextArea.types';
import styles from './DynTextArea.module.css';

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
    value: valueProp = DYN_TEXT_AREA_DEFAULT_PROPS.value,
    errorMessage,
    validation,
    className,
    resize = DYN_TEXT_AREA_DEFAULT_PROPS.resize,
    rows = DYN_TEXT_AREA_DEFAULT_PROPS.rows,
    cols,
    onChange,
    onBlur,
    onFocus,
    'data-testid': dataTestId = DYN_TEXT_AREA_DEFAULT_PROPS['data-testid'],
    ...rest
  }: DynTextAreaProps,
  ref: ForwardedRef<DynTextAreaRef>
) => {
  const [value, setValue] = useState<string>(valueProp ?? '');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fallbackId = useId();
  const fieldId = id ?? name ?? `${fallbackId}-textarea`;

  const { error, validate, clearError } = useDynFieldValidation({
    value,
    required,
    validation,
    customError: errorMessage,
  });

  useImperativeHandle(
    ref,
    () => ({
      focus: () => textareaRef.current?.focus(),
      validate: () => validate(),
      clear: () => {
        setValue('');
        onChange?.('');
        clearError();
      },
      getValue: () => value,
      setValue: (newValue: unknown) => {
        const stringValue = String(newValue ?? '');
        setValue(stringValue);
        onChange?.(stringValue);
      },
    }),
    [clearError, onChange, validate, value]
  );

  useEffect(() => {
    setValue(valueProp ?? '');
  }, [valueProp]);

  if (!visible) {
    return null;
  }

  const resolvedError = errorMessage ?? (error || undefined);
  const describedById = resolvedError
    ? `${fieldId}-error`
    : help
      ? `${fieldId}-help`
      : undefined;

  const textareaClasses = cn(
    styles.textarea,
    focused && styles.textareaFocused,
    resolvedError && styles.textareaError,
    disabled && styles.textareaDisabled,
    readonly && styles.textareaReadonly,
    resize === 'none' && styles.textareaResizeNone,
    resize === 'horizontal' && styles.textareaResizeHorizontal,
    resize === 'both' && styles.textareaResizeBoth
  );

  const containerClasses = cn(styles.container, className);

  const fieldContainerProps: Omit<DynFieldContainerProps, 'children'> = {
    label,
    required,
    optional,
    helpText: help,
    errorText: resolvedError,
    className: containerClasses,
    htmlFor: fieldId,
    id,
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

  return (
    <DynFieldContainer {...fieldContainerProps}>
      <textarea
        {...rest}
        ref={textareaRef}
        id={fieldId}
        name={name}
        className={textareaClasses}
        placeholder={placeholder}
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
