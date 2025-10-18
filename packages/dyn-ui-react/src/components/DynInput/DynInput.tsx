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
  useMemo
} from 'react';

function classNames(
  ...args: Array<string | Record<string, boolean> | undefined | null | any[]>
): string {
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

import type { DynInputProps, DynFieldRef, CurrencyInputConfig } from '../../types/field.types';
import { DynFieldContainer } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { useDynMask } from '../../hooks/useDynMask';
import { DynIcon } from '../DynIcon';
import { formatCurrencyValue } from '../../utils/dynFormatters';

interface ResolvedCurrencyConfig {
  currencyCode: string;
  precision: number;
  thousandSeparator: string;
  decimalSeparator: string;
  showSymbol: boolean;
  symbol: string;
  symbolPosition: 'prefix' | 'suffix';
  autoFormat: boolean;
  symbolSpacing: string;
}

const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_PRECISION = 2;

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
      currencyConfig,
      onChange,
      onBlur,
      onFocus
    },
    ref
  ) => {
    const isCurrencyType = type === 'currency';
    const resolvedCurrencyConfig = useMemo(
      () => resolveCurrencyConfig(currencyConfig, type),
      [currencyConfig, type]
    );

    const [inputValue, setInputValue] = useState<string>(() =>
      initializeInputValue(propValue, type, resolvedCurrencyConfig)
    );
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    // generate stable id for the input when not provided
    const generatedIdRef = useRef<string>(`dyn-input-${Math.random().toString(36).slice(2, 9)}`);
    const inputId = id ?? name ?? generatedIdRef.current;

    const { error, validate, clearError } = useDynFieldValidation({
      value: inputValue,
      required,
      validation,
      customError: errorMessage
    });

    const { maskedValue, unmaskValue, handleMaskedChange } = useDynMask(
      mask,
      inputValue,
      maskFormatModel
    );

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      validate: () => validate(),
      clear: () => {
        setInputValue('');
        onChange?.('');
        clearError();
      },
      getValue: () => {
        if (isCurrencyType) {
          const numericValue = parseCurrencyLikeValue(inputValue, resolvedCurrencyConfig);
          return numericValue ?? '';
        }
        return mask && !maskFormatModel ? unmaskValue(inputValue) : inputValue;
      },
      setValue: (newValue: any) => {
        if (isCurrencyType) {
          const numericValue = parseCurrencyLikeValue(newValue, resolvedCurrencyConfig);
          if (numericValue == null) {
            setInputValue('');
            onChange?.('');
            return;
          }

          const normalizedValue = roundToPrecision(numericValue, resolvedCurrencyConfig.precision);
          const formattedValue = resolvedCurrencyConfig.autoFormat
            ? formatCurrencyValue(normalizedValue, resolvedCurrencyConfig)
            : formatPlainCurrencyValue(normalizedValue, resolvedCurrencyConfig);

          setInputValue(formattedValue);
          onChange?.(normalizedValue);
          return;
        }

        const stringValue = newValue == null ? '' : String(newValue);
        setInputValue(stringValue);
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
      if (isCurrencyType) {
        const formattedValue = initializeInputValue(propValue, type, resolvedCurrencyConfig);
        setInputValue(formattedValue);
      } else {
        const stringValue = propValue == null ? '' : String(propValue);
        setInputValue(stringValue);
      }
    }, [propValue, isCurrencyType, type, resolvedCurrencyConfig]);

    const handleCurrencyChange = (rawValue: string) => {
      processCurrencyChange(rawValue, resolvedCurrencyConfig, setInputValue, onChange);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (mask) {
        const processedValue = handleMaskedChange(newValue);
        setInputValue(processedValue);
        onChange?.(maskFormatModel ? processedValue : unmaskValue(processedValue));
      } else if (isCurrencyType) {
        handleCurrencyChange(newValue);
      } else {
        setInputValue(newValue);

        if (type === 'number') {
          if (newValue === '' || newValue === '-' || newValue === '.') {
            onChange?.('');
          } else {
            const numericValue = Number(newValue);
            onChange?.(Number.isNaN(numericValue) ? newValue : numericValue);
          }
        } else {
          onChange?.(newValue);
        }
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
      setInputValue('');
      onChange?.('');
      clearError();
      inputRef.current?.focus();
    };

    if (!visible) return null;

    const inputClasses = classNames(
      'dyn-input',
      `dyn-input--${size}`,
      {
        'dyn-input--focused': focused,
        'dyn-input--error': !!error,
        'dyn-input--disabled': disabled,
        'dyn-input--readonly': readonly,
        'dyn-input--with-icon': !!icon,
        'dyn-input--cleanable': !!(showCleanButton && inputValue && !readonly && !disabled)
      }
    );

    const displayValue = mask ? maskedValue : inputValue;

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
            type={type === 'number' || isCurrencyType ? 'text' : type}
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
            step={type === 'number' ? step : undefined}
            min={type === 'number' ? min : undefined}
            max={type === 'number' ? max : undefined}
            inputMode={type === 'number' || isCurrencyType ? 'decimal' : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />

          {showCleanButton && inputValue && !readonly && !disabled && (
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

function resolveCurrencyConfig(
  config: CurrencyInputConfig | undefined,
  type: DynInputProps['type']
): ResolvedCurrencyConfig {
  const precision = Math.max(0, config?.precision ?? DEFAULT_PRECISION);
  const currencyCode = config?.currencyCode ?? DEFAULT_CURRENCY_CODE;

  if (type !== 'currency') {
    return {
      currencyCode,
      precision,
      thousandSeparator: config?.thousandSeparator ?? ',',
      decimalSeparator: config?.decimalSeparator ?? '.',
      showSymbol: config?.showSymbol ?? true,
      symbol: config?.symbol ?? currencyCode,
      symbolPosition: config?.symbolPosition ?? 'prefix',
      autoFormat: config?.autoFormat ?? true,
      symbolSpacing: ' '
    };
  }

  const defaults = deriveCurrencyDefaults(currencyCode, precision);

  return {
    currencyCode,
    precision,
    thousandSeparator: config?.thousandSeparator ?? defaults.group,
    decimalSeparator: config?.decimalSeparator ?? defaults.decimal,
    showSymbol: config?.showSymbol ?? true,
    symbol: config?.symbol ?? defaults.symbol,
    symbolPosition: config?.symbolPosition ?? 'prefix',
    autoFormat: config?.autoFormat ?? true,
    symbolSpacing: defaults.spacing
  };
}

function initializeInputValue(
  value: string | number,
  type: DynInputProps['type'],
  config: ResolvedCurrencyConfig
): string {
  if (type === 'currency') {
    const numericValue = parseCurrencyLikeValue(value, config);
    if (numericValue == null) {
      return typeof value === 'string' ? value : '';
    }

    const normalizedValue = roundToPrecision(numericValue, config.precision);
    return config.autoFormat
      ? formatCurrencyValue(normalizedValue, config)
      : formatPlainCurrencyValue(normalizedValue, config);
  }

  if (value == null) return '';
  return typeof value === 'string' ? value : String(value);
}

function parseCurrencyLikeValue(
  value: unknown,
  config: ResolvedCurrencyConfig
): number | null {
  if (value == null || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const sanitized = sanitizeCurrencyInput(value, config);
    if (!/[0-9]/.test(sanitized)) {
      return null;
    }

    const numericValue = Number(sanitized);
    return Number.isNaN(numericValue) ? null : numericValue;
  }

  return null;
}

function processCurrencyChange(
  rawValue: string,
  config: ResolvedCurrencyConfig,
  setValue: (value: string) => void,
  notifyChange?: DynInputProps['onChange']
) {
  const sanitizedValue = sanitizeCurrencyInput(rawValue, config);

  if (!/[0-9]/.test(sanitizedValue)) {
    setValue(rawValue);
    notifyChange?.('');
    return;
  }

  const numericValue = Number(sanitizedValue);

  if (Number.isNaN(numericValue)) {
    setValue(rawValue);
    notifyChange?.(sanitizedValue);
    return;
  }

  const normalizedValue = roundToPrecision(numericValue, config.precision);
  const formattedValue = config.autoFormat
    ? formatCurrencyValue(normalizedValue, config)
    : formatPlainCurrencyValue(normalizedValue, config);

  setValue(formattedValue);
  notifyChange?.(normalizedValue);
}

function roundToPrecision(value: number, precision: number): number {
  if (!Number.isFinite(value)) return value;
  return Number(value.toFixed(precision));
}

function formatCurrencyValue(value: number, config: ResolvedCurrencyConfig): string {
  const {
    precision,
    thousandSeparator,
    decimalSeparator,
    showSymbol,
    symbol,
    symbolPosition,
    symbolSpacing,
    currencyCode
  } = config;

  const absoluteValue = Math.abs(value);
  const [integerPartRaw, fractionalPartRaw = ''] = absoluteValue
    .toFixed(precision)
    .split('.');

  const groupedInteger =
    thousandSeparator && thousandSeparator.length > 0
      ? integerPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
      : integerPartRaw;

  let formatted = groupedInteger;
  if (precision > 0) {
    formatted += `${decimalSeparator}${fractionalPartRaw}`;
  }

  if (showSymbol) {
    const symbolValue = symbol || currencyCode;
    const spacing = symbolSpacing ?? '';

    if (symbolPosition === 'suffix') {
      formatted = `${formatted}${spacing}${symbolValue}`;
    } else {
      formatted = `${symbolValue}${spacing}${formatted}`;
    }
  }

  if (value < 0) {
    formatted = `-${formatted}`;
  }

  return formatted;
}

function formatPlainCurrencyValue(value: number, config: ResolvedCurrencyConfig): string {
  const { precision, decimalSeparator } = config;
  const absoluteValue = Math.abs(value);
  const [integerPart, fractionalPart = ''] = absoluteValue.toFixed(precision).split('.');

  let formatted = integerPart;
  if (precision > 0) {
    formatted += `${decimalSeparator}${fractionalPart}`;
  }

  if (value < 0) {
    formatted = `-${formatted}`;
  }

  return formatted;
}

function sanitizeCurrencyInput(value: string, config: ResolvedCurrencyConfig): string {
  if (!value) return '';

  let normalized = value;

  if (config.thousandSeparator) {
    normalized = normalized.replace(new RegExp(escapeRegExp(config.thousandSeparator), 'g'), '');
  }

  if (config.symbolSpacing) {
    normalized = normalized.replace(new RegExp(escapeRegExp(config.symbolSpacing), 'g'), '');
  }

  if (config.symbol) {
    normalized = normalized.replace(new RegExp(escapeRegExp(config.symbol), 'g'), '');
  }

  if (config.currencyCode) {
    normalized = normalized.replace(new RegExp(escapeRegExp(config.currencyCode), 'gi'), '');
  }

  normalized = normalized.replace(/\s+/g, '');

  if (config.decimalSeparator && config.decimalSeparator !== '.') {
    normalized = normalized.replace(new RegExp(escapeRegExp(config.decimalSeparator), 'g'), '.');
  }

  normalized = normalized.replace(/[^0-9.-]/g, '');

  const hasNegative = normalized.includes('-');
  normalized = normalized.replace(/-/g, '');
  if (hasNegative) {
    normalized = normalized.length > 0 ? `-${normalized}` : '-';
  }

  const firstDecimalIndex = normalized.indexOf('.');
  if (firstDecimalIndex !== -1) {
    const before = normalized.slice(0, firstDecimalIndex + 1);
    const after = normalized.slice(firstDecimalIndex + 1).replace(/\./g, '');
    normalized = before + after;
  }

  return normalized;
}

function deriveCurrencyDefaults(currencyCode: string, precision: number) {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    });
    const parts = formatter.formatToParts(1234567.89);
    const group = parts.find((part) => part.type === 'group')?.value ?? ',';
    const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
    const symbol = parts.find((part) => part.type === 'currency')?.value ?? currencyCode;

    let spacing = '';
    const currencyIndex = parts.findIndex((part) => part.type === 'currency');
    if (currencyIndex !== -1) {
      const nextPart = parts[currencyIndex + 1];
      const previousPart = parts[currencyIndex - 1];
      if (nextPart?.type === 'literal') {
        spacing = nextPart.value;
      } else if (previousPart?.type === 'literal') {
        spacing = previousPart.value;
      }
    }

    return { group, decimal, symbol, spacing };
  } catch (error) {
    return { group: ',', decimal: '.', symbol: currencyCode, spacing: ' ' };
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
