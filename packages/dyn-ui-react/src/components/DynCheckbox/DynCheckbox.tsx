import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, ForwardedRef, KeyboardEvent } from 'react';
import { DynFieldContainer } from '../DynFieldContainer';
import type { DynFieldContainerProps } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { cn } from '../../utils/classNames';
import type { DynCheckboxProps, DynCheckboxRef } from './DynCheckbox.types';
import { DYN_CHECKBOX_DEFAULT_PROPS } from './DynCheckbox.types';
import styles from './DynCheckbox.module.css';

const DynCheckboxComponent = (
  {
    name,
    label,
    help,
    disabled = DYN_CHECKBOX_DEFAULT_PROPS.disabled,
    readonly = DYN_CHECKBOX_DEFAULT_PROPS.readonly,
    required = DYN_CHECKBOX_DEFAULT_PROPS.required,
    optional = DYN_CHECKBOX_DEFAULT_PROPS.optional,
    visible = DYN_CHECKBOX_DEFAULT_PROPS.visible,
    checked: checkedProp = DYN_CHECKBOX_DEFAULT_PROPS.checked,
    indeterminate = DYN_CHECKBOX_DEFAULT_PROPS.indeterminate,
    errorMessage,
    validation,
    className,
    size = DYN_CHECKBOX_DEFAULT_PROPS.size,
    onChange,
    onBlur,
    onFocus,
    id,
    loading = DYN_CHECKBOX_DEFAULT_PROPS.loading,
    'data-testid': dataTestId = DYN_CHECKBOX_DEFAULT_PROPS['data-testid'],
  }: DynCheckboxProps,
  ref: ForwardedRef<DynCheckboxRef>
) => {
  const [checked, setChecked] = useState<boolean>(Boolean(checkedProp));
  const checkboxRef = useRef<HTMLInputElement>(null);
  const fallbackId = useId();
  const fieldId = id ?? name ?? `${fallbackId}-checkbox`;

  const validationOptions: Parameters<typeof useDynFieldValidation>[0] = {
    value: checked ? 'checked' : '',
    required,
  };

  if (validation) {
    validationOptions.validation = validation;
  }

  if (errorMessage) {
    validationOptions.customError = errorMessage;
  }

  const { error, validate, clearError } = useDynFieldValidation(validationOptions);

  const resolvedError = errorMessage ?? (error || undefined);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => checkboxRef.current?.focus(),
      validate: () => validate(),
      clear: () => {
        setChecked(false);
        onChange?.(false);
        clearError();
        if (checkboxRef.current) {
          checkboxRef.current.indeterminate = false;
        }
      },
      getValue: () => checked,
      setValue: (newValue: unknown) => {
        const booleanValue = Boolean(newValue);
        setChecked(booleanValue);
        onChange?.(booleanValue);
        if (checkboxRef.current) {
          checkboxRef.current.indeterminate = false;
        }
      },
      element: checkboxRef.current,
    }),
    [checked, clearError, onChange, validate]
  );

  useEffect(() => {
    setChecked(Boolean(checkedProp));
  }, [checkedProp]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const isInteractive = !(disabled || readonly || loading);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isInteractive) {
      event.preventDefault();
      return;
    }

    const nextValue = event.target.checked;
    setChecked(nextValue);
    onChange?.(nextValue);
    clearError();
  };

  const handleBlur = () => {
    void validate();
    onBlur?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();

      if (!isInteractive) {
        return;
      }

      const nextValue = !checked;
      setChecked(nextValue);
      onChange?.(nextValue);
      clearError();
    }
  };

  if (!visible) {
    return null;
  }

  const sizeClassMap: Record<NonNullable<DynCheckboxProps['size']>, string | undefined> = {
    small: styles.boxSmall,
    medium: undefined,
    large: styles.boxLarge,
  };

  const checkboxClasses = cn(
    styles.box,
    sizeClassMap[size],
    checked && !indeterminate && styles.boxChecked,
    indeterminate && styles.boxIndeterminate,
    resolvedError && styles.boxError,
    (disabled || loading) && styles.boxDisabled,
    readonly && styles.boxReadonly,
    loading && styles.boxLoading
  );

  const containerClasses = cn(
    styles.container,
    (disabled || loading) && styles.containerDisabled,
    readonly && styles.containerReadonly,
    className
  );

  const wrapperClasses = cn(
    styles.wrapper,
    (disabled || loading) && styles.wrapperDisabled,
    readonly && styles.wrapperReadonly,
    loading && styles.wrapperLoading
  );

  const errorId = resolvedError ? `${fieldId}-error` : undefined;
  const helpId = !resolvedError && help ? `${fieldId}-help` : undefined;

  const describedById = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  const visualState = loading
    ? 'loading'
    : indeterminate
    ? 'indeterminate'
    : checked
    ? 'checked'
    : 'unchecked';

  const fieldContainerProps: Omit<DynFieldContainerProps, 'children'> = {
    required,
    optional,
    className: containerClasses,
    htmlFor: fieldId,
  };

  if (help) {
    fieldContainerProps.helpText = help;
  }

  if (resolvedError) {
    fieldContainerProps.errorText = resolvedError;
  }

  return (
    <DynFieldContainer {...fieldContainerProps}>
      <label className={wrapperClasses} htmlFor={fieldId}>
        <input
          ref={checkboxRef}
          type="checkbox"
          id={fieldId}
          name={name}
          className={styles.input}
          checked={checked}
          disabled={disabled || loading}
          readOnly={readonly}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          aria-invalid={Boolean(resolvedError)}
          aria-describedby={describedById}
          aria-required={required || undefined}
          aria-busy={loading || undefined}
          data-testid={dataTestId}
        />

        <span
          className={checkboxClasses}
          aria-hidden="true"
          data-state={visualState}
          data-size={size}
          data-loading={loading || undefined}
        >
          <span className={styles.checkmark}>
            {loading ? (
              <span className={styles.loadingSpinner} />
            ) : indeterminate ? (
              <span className={styles.indeterminateMark}>-</span>
            ) : checked ? (
              <span className={styles.checkMark}>✓</span>
            ) : null}
          </span>
        </span>
        {label && (
          <span className={styles.label}>
            {label}
            {required && (
              <span className={styles.requiredIndicator} aria-hidden="true">
                *
              </span>
            )}
            {optional && !required && (
              <span className={styles.optionalIndicator} aria-label="opcional">
                (opcional)
              </span>
            )}
          </span>
        )}
      </label>
    </DynFieldContainer>
  );
};

const DynCheckbox = forwardRef<DynCheckboxRef, DynCheckboxProps>(DynCheckboxComponent);

DynCheckbox.displayName = 'DynCheckbox';

export { DynCheckbox };
export default DynCheckbox;
