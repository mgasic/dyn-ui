/**
 * DynInput - Advanced input component with validation and masking
 * Part of DYN UI Form Components Group - SCOPE 6
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';

function classNames(...args: Array<string | Record<string, boolean> | undefined | null | any[]>): string {
  const classes: string[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      const inner = classNames(...arg);
      if (inner) classes.push(inner);
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && (arg as any)[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(' ');
}

const escapeRegex = (valueToEscape: string) =>
  valueToEscape.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

import type {
  DynInputProps,
  DynFieldRef,
  DynCurrencyConfig
} from '../../types/field.types';
import { DynFieldContainer } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { useDynMask } from '../../hooks/useDynMask';
import { DynIcon } from '../DynIcon';
import { formatCurrencyValue } from '../../utils/dynFormatters';

export const DynInput = forwardRef<DynFieldRef, DynInputProps>(
  (
    {
      name,
      id,
      label,
      help,
      placeholder,
      disabled = false,
      readonly = false,
      required = false,
      optional = false,
      visible = true,
      value: propValue = '',
      errorMessage,
      validation,
      className,
      type = 'text',
      size = 'medium',
      maxLength,
      minLength,
      mask,
      maskFormatModel = false,
      pattern,
      icon,
      showCleanButton = false,
      step,
      min,
      max,
      showSpinButtons = false,
      currencyConfig,
      onChange,
      onBlur,
      onFocus
    },
    ref
  ) => {
    const [value, setValue] = useState<string>(
      propValue == null ? '' : String(propValue)
    );
    const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // generate stable id for the input when not provided
  const generatedIdRef = useRef<string>(`dyn-input-${Math.random().toString(36).slice(2, 9)}`);
  const inputId = id ?? name ?? generatedIdRef.current;

    const { error, validate, clearError } = useDynFieldValidation({
      value,
      required,
      validation,
      customError: errorMessage
    });

    const { maskedValue, unmaskValue, handleMaskedChange } = useDynMask(
      mask,
      value,
      maskFormatModel
    );

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      validate: () => validate(),
      clear: () => {
        setValue('');
        onChange?.('');
        clearError();
      },
      getValue: () => (mask && !maskFormatModel ? unmaskValue(value) : value),
      setValue: (newValue: any) => {
        const stringValue = String(newValue);
        setValue(stringValue);
        onChange?.(stringValue);
      }
    }));

    const mergedCurrencyConfig = useMemo<Required<DynCurrencyConfig> & {
      showCurrencyCode: boolean;
    }>(() => {
      const defaultConfig: Required<DynCurrencyConfig> & {
        showCurrencyCode: boolean;
      } = {
        symbol: 'R$',
        currencyCode: 'BRL',
        showCurrencyCode: false,
        precision: 2,
        decimalSeparator: ',',
        thousandSeparator: '.'
      };

      return {
        ...defaultConfig,
        ...(currencyConfig ?? {})
      };
    }, [currencyConfig]);

    const sanitizeCurrencyValue = useCallback(
      (rawValue: string | number | null | undefined) => {
        if (rawValue == null || rawValue === '') {
          return '';
        }

        const valueAsString = String(rawValue);
        const { decimalSeparator, thousandSeparator, symbol, currencyCode } =
          mergedCurrencyConfig;

        let sanitized = valueAsString.replace(/\s/g, '');

        if (symbol) {
          sanitized = sanitized.replace(new RegExp(escapeRegex(symbol), 'g'), '');
        }

        if (currencyCode) {
          sanitized = sanitized.replace(new RegExp(escapeRegex(currencyCode), 'gi'), '');
        }

        const allowedSeparator = decimalSeparator ?? '.';
        sanitized = sanitized.replace(
          new RegExp(`[^0-9${escapeRegex(allowedSeparator)}\\.\\-]`, 'g'),
          ''
        );

        const dotMatches = sanitized.match(/\./g) ?? [];
        let decimalMarker: string | null = null;

        if (sanitized.includes(allowedSeparator)) {
          decimalMarker = allowedSeparator;
        } else if (sanitized.includes('.')) {
          const digitsAfterLastDot = sanitized.length - sanitized.lastIndexOf('.') - 1;
          if (
            thousandSeparator === '.' &&
            (dotMatches.length > 1 || digitsAfterLastDot === 3)
          ) {
            decimalMarker = null;
          } else {
            decimalMarker = '.';
          }
        }

        if (thousandSeparator && thousandSeparator !== decimalMarker) {
          sanitized = sanitized.replace(new RegExp(escapeRegex(thousandSeparator), 'g'), '');
        }

        if (decimalMarker) {
          const escapedDecimal = escapeRegex(decimalMarker);
          const lastDecimalIndex = sanitized.lastIndexOf(decimalMarker);
          if (lastDecimalIndex !== -1) {
            const before = sanitized
              .slice(0, lastDecimalIndex)
              .replace(new RegExp(escapedDecimal, 'g'), '')
              .replace(/\./g, '');
            const after = sanitized
              .slice(lastDecimalIndex + 1)
              .replace(new RegExp(escapedDecimal, 'g'), '')
              .replace(/\./g, '');
            sanitized = `${before}.${after}`;
          }
        }

        sanitized = sanitized.replace(/[^0-9.\-]/g, '');

        const minusIndex = sanitized.indexOf('-');
        if (minusIndex > 0) {
          sanitized = sanitized.replace(/-/g, '');
        } else if (minusIndex === 0) {
          sanitized = `-${sanitized.slice(1).replace(/-/g, '')}`;
        } else {
          sanitized = sanitized.replace(/-/g, '');
        }

        if (sanitized.split('.').length > 2) {
          const [integerPart, ...decimalParts] = sanitized.split('.');
          sanitized = `${integerPart}.${decimalParts.join('')}`;
        }

        return sanitized;
      },
      [mergedCurrencyConfig]
    );

    useEffect(() => {
      if (type === 'currency') {
        setValue(sanitizeCurrencyValue(propValue));
        return;
      }

      setValue(propValue == null ? '' : String(propValue));
    }, [propValue, type, sanitizeCurrencyValue]);

    const formatCurrency = useCallback(
      (rawValue: string | number | null | undefined) => {
        if (type !== 'currency') {
          return {
            formattedValue: rawValue == null ? '' : String(rawValue),
            symbol: '',
            currencyCode: undefined,
            showCurrencyCode: false
          };
        }

        return formatCurrencyValue(rawValue, mergedCurrencyConfig);
      },
      [mergedCurrencyConfig, type]
    );

    const currencyFormatting = useMemo(() => {
      return formatCurrency(value);
    }, [formatCurrency, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (mask) {
        const processedValue = handleMaskedChange(newValue);
        setValue(processedValue);
        onChange?.(maskFormatModel ? processedValue : unmaskValue(processedValue));
      } else if (type === 'currency') {
        const sanitizedValue = sanitizeCurrencyValue(newValue);
        setValue(sanitizedValue);

        const numericValue = sanitizedValue === '' ? NaN : Number(sanitizedValue);

        if (sanitizedValue === '') {
          onChange?.('');
        } else if (Number.isNaN(numericValue)) {
          onChange?.(sanitizedValue);
        } else {
          onChange?.(numericValue);
        }
      } else {
        setValue(newValue);
        onChange?.(type === 'number' ? Number(newValue) : newValue);
      }

      clearError();
    };

    const handleStepChange = useCallback(
      (direction: 1 | -1) => {
        if (disabled || readonly) return;

        const stepValue = step ?? 1;
        const currentNumeric = Number(
          type === 'currency' ? value || 0 : value || 0
        );

        const baseValue = Number.isNaN(currentNumeric) ? 0 : currentNumeric;
        let nextValue = baseValue + direction * stepValue;

        if (typeof min === 'number') {
          nextValue = Math.max(nextValue, min);
        }

        if (typeof max === 'number') {
          nextValue = Math.min(nextValue, max);
        }

        const nextValueString = String(nextValue);

        if (type === 'currency') {
          setValue(nextValueString);
          onChange?.(nextValue);
        } else {
          setValue(nextValueString);
          onChange?.(type === 'number' ? nextValue : nextValueString);
        }

        clearError();
      },
      [clearError, disabled, max, min, onChange, readonly, step, type, value]
    );

    const handleBlur = () => {
      setFocused(false);
      validate();
      onBlur?.();
    };

    const handleFocus = () => {
      setFocused(true);
      clearError();
      onFocus?.();
    };

    const handleClean = () => {
      setValue('');
      onChange?.('');
      clearError();
      inputRef.current?.focus();
    };

    if (!visible) return null;

    const inputClasses = classNames('dyn-input', `dyn-input--${size}`, {
      'dyn-input--focused': focused,
      'dyn-input--error': !!error,
      'dyn-input--disabled': disabled,
      'dyn-input--readonly': readonly,
      'dyn-input--with-icon': !!icon,
      'dyn-input--cleanable': !!(showCleanButton && value && !readonly && !disabled),
      'dyn-input--number': type === 'number',
      'dyn-input--currency': type === 'currency',
      'dyn-input--with-spin-buttons':
        showSpinButtons && (type === 'number' || type === 'currency')
    });

    const displayValue = mask
      ? maskedValue
      : type === 'currency'
        ? currencyFormatting.formattedValue
        : value;

    const containerDivClass = classNames('dyn-input-container', className, {
      'dyn-input-container--currency': type === 'currency',
      'dyn-input-container--with-spin-buttons':
        showSpinButtons && (type === 'number' || type === 'currency')
    });

    const showSpin = showSpinButtons && (type === 'number' || type === 'currency');

    return (
      <DynFieldContainer
        label={label}
        helpText={help}
        required={required}
        optional={optional}
        errorText={error}
        className={className}
        htmlFor={inputId}
        id={id}
      >
        <div className={containerDivClass}>
          {type === 'currency' && currencyFormatting.symbol && (
            <span className="dyn-input-currency-symbol" aria-hidden="true">
              {currencyFormatting.symbol}
            </span>
          )}

          {icon && (
            <div className="dyn-input-icon-container">
              <DynIcon icon={icon} />
            </div>
          )}

          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type={type === 'number' || type === 'currency' ? 'text' : type}
            className={inputClasses}
            placeholder={placeholder}
            value={displayValue}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            aria-required={required}
            aria-disabled={disabled}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            step={type === 'currency' ? undefined : step}
            min={type === 'currency' ? undefined : min}
            max={type === 'currency' ? undefined : max}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />

          {type === 'currency' &&
            currencyFormatting.showCurrencyCode &&
            currencyFormatting.currencyCode && (
              <span className="dyn-input-currency-code" aria-hidden="true">
                {currencyFormatting.currencyCode}
              </span>
            )}

          {showCleanButton && value && !readonly && !disabled && (
            <button
              type="button"
              className="dyn-input-clean-button"
              onClick={handleClean}
              tabIndex={-1}
              aria-label="Limpar campo"
            >
              <DynIcon icon="dyn-icon-close" />
            </button>
          )}

          {showSpin && (
            <div className="dyn-input-spin-buttons" aria-hidden={disabled || readonly}>
              <button
                type="button"
                className="dyn-input-spin-button dyn-input-spin-button--increment"
                onClick={() => handleStepChange(1)}
                tabIndex={-1}
                aria-label="Increase value"
                disabled={disabled || readonly}
              >
                ▲
              </button>
              <button
                type="button"
                className="dyn-input-spin-button dyn-input-spin-button--decrement"
                onClick={() => handleStepChange(-1)}
                tabIndex={-1}
                aria-label="Decrease value"
                disabled={disabled || readonly}
              >
                ▼
              </button>
            </div>
          )}
        </div>
      </DynFieldContainer>
    );
  }
);

DynInput.displayName = 'DynInput';

export default DynInput;
