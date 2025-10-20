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
  useMemo,
  useCallback
} from 'react';
import styles from './DynInput.module.css';
import { cn } from '../../utils/classNames';

import type {
  DynInputProps,
  DynInputRef,
  CurrencyInputConfig,
} from './DynInput.types';
import type { ValidationRule } from '../../types/field.types';
import type { DynCurrencyConfig } from '../../utils/dynFormatters';
import { DynFieldContainer } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { useDynMask } from '../../hooks/useDynMask';
import { DynIcon } from '../DynIcon';
// NOTE: DynInput implements its own formatting helpers; do not import formatCurrencyValue
// from utils to avoid name collision with local implementations.

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

const DEFAULT_CURRENCY_CODE = 'BRL';
const DEFAULT_PRECISION = 2;

const getStyleClass = (className: string): string => styles[className] ?? className;

export const DynInput = forwardRef<DynInputRef, DynInputProps>(
  (
    {
      name,
      id,
      label,
      help,
      helpText,
      placeholder,
      disabled = false,
      readOnly,
      readonly,
      required = false,
      optional = false,
      visible = true,
      value: propValue = '',
      showSpinButtons = false,
      errorMessage,
      validation,
      validationRules,
      className,
      type = 'text',
      size = 'medium',
      maxLength,
      minLength,
      mask,
      maskFormatModel = false,
      pattern,
      icon,
      showClearButton,
      showCleanButton,
      step,
      min,
      max,
      currencyConfig,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref
  ) => {
    const isReadOnly = (readOnly ?? readonly) ?? false;
    const shouldShowClearButton = (showClearButton ?? showCleanButton) ?? false;
    const fieldHelpText = help ?? helpText;
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

    const normalizedValidationRules = useMemo<ValidationRule[] | undefined>(() => {
      const collected: ValidationRule[] = [];

      const pushRules = (rules?: DynInputProps['validation']) => {
        if (!rules) {
          return;
        }

        if (Array.isArray(rules)) {
          collected.push(...rules);
        } else {
          collected.push(rules);
        }
      };

      pushRules(validation);
      if (validationRules?.length) {
        collected.push(...validationRules);
      }

      return collected.length > 0 ? collected : undefined;
    }, [validation, validationRules]);

    const { error, validate, clearError: clearValidationError } = useDynFieldValidation({
      value: inputValue,
      required,
      validation: normalizedValidationRules,
      customError: errorMessage
    });

    const resolvedMaskPattern = typeof mask === 'string' ? mask : mask?.pattern;
    const resolvedMaskFormatModel =
      typeof mask === 'object' && mask !== null
        ? mask.formatModel ?? maskFormatModel
        : maskFormatModel;

    const { maskedValue, unmaskValue, handleMaskedChange } = useDynMask(
      resolvedMaskPattern,
      inputValue,
      resolvedMaskFormatModel
    );

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      validate: () => validate(),
      clear: () => {
        setInputValue('');
        onChange?.('');
        clearValidationError();
      },
      clearError: () => {
        clearValidationError();
      },
      getValue: () => {
        if (isCurrencyType) {
          const numericValue = parseCurrencyLikeValue(inputValue, resolvedCurrencyConfig);
          return numericValue ?? '';
        }
        return mask && !resolvedMaskFormatModel ? unmaskValue(inputValue) : inputValue;
      },
      setValue: (newValue: string | number | null | undefined) => {
        if (isCurrencyType) {
          const numericValue = parseCurrencyLikeValue(newValue, resolvedCurrencyConfig);
          if (numericValue == null) {
            setInputValue('');
            onChange?.('');
            return;
          }

          const normalizedValue = roundToPrecision(numericValue, resolvedCurrencyConfig.precision);
          const formattedValue = resolvedCurrencyConfig.autoFormat
            ? formatCurrencyValue(normalizedValue, { ...resolvedCurrencyConfig, showSymbol: false })
            : formatPlainCurrencyValue(normalizedValue, resolvedCurrencyConfig);

          setInputValue(formattedValue);
          onChange?.(normalizedValue);
          return;
        }

        const stringValue = newValue == null ? '' : String(newValue);
        setInputValue(stringValue);
        onChange?.(stringValue);
      },
      getElement: () => inputRef.current
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
          sanitized = sanitized.replace(new RegExp(escapeRegExp(symbol), 'g'), '');
        }

        if (currencyCode) {
          sanitized = sanitized.replace(new RegExp(escapeRegExp(currencyCode), 'gi'), '');
        }

        const allowedSeparator = decimalSeparator ?? '.';
        sanitized = sanitized.replace(
          new RegExp(`[^0-9${escapeRegExp(allowedSeparator)}\\.\\-]`, 'g'),
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
          sanitized = sanitized.replace(new RegExp(escapeRegExp(thousandSeparator), 'g'), '');
        }

        if (decimalMarker) {
          const escapedDecimal = escapeRegExp(decimalMarker);
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
        onChange?.(
          resolvedMaskFormatModel ? processedValue : unmaskValue(processedValue)
        );
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

      clearValidationError();
    };

    const handleStepChange = useCallback(
      (direction: 1 | -1) => {
        if (disabled || isReadOnly) return;

        const stepValue = step ?? 1;
        const currentNumeric = type === 'currency'
          ? (parseCurrencyLikeValue(inputValue, resolvedCurrencyConfig) ?? 0)
          : Number(inputValue || 0);

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
          const normalizedNext = roundToPrecision(nextValue, resolvedCurrencyConfig.precision);
          const formatted = resolvedCurrencyConfig.autoFormat
            ? formatCurrencyValue(normalizedNext, { ...resolvedCurrencyConfig, showSymbol: false })
            : formatPlainCurrencyValue(normalizedNext, resolvedCurrencyConfig);
          setInputValue(formatted);
          onChange?.(normalizedNext);
        } else {
          setInputValue(nextValueString);
          onChange?.(type === 'number' ? nextValue : nextValueString);
        }

        clearValidationError();
      },
      [
        clearValidationError,
        disabled,
        inputValue,
        isReadOnly,
        max,
        min,
        onChange,
        resolvedCurrencyConfig,
        step,
        type
      ]
    );

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      validate();
      onBlur?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      clearValidationError();
      onFocus?.(event);
    };

    const handleClean = () => {
      setInputValue('');
      onChange?.('');
      clearValidationError();
      inputRef.current?.focus();
    };

    if (!visible) return null;

    const showSpin = showSpinButtons && (type === 'number' || type === 'currency');

    const inputClasses = cn(
      getStyleClass('dyn-input'),
      getStyleClass(`dyn-input--${size}`),
      focused && getStyleClass('dyn-input--focused'),
      !!error && getStyleClass('dyn-input--error'),
      disabled && getStyleClass('dyn-input--disabled'),
      isReadOnly && getStyleClass('dyn-input--readonly'),
      !!icon && getStyleClass('dyn-input--with-icon'),
      !!(shouldShowClearButton && inputValue && !isReadOnly && !disabled) &&
        getStyleClass('dyn-input--cleanable')
    );

    const displayValue = mask ? maskedValue : inputValue;

    const containerDivClass = cn(
      getStyleClass('dyn-input-container'),
      className,
      type === 'currency' && getStyleClass('dyn-input-container--currency'),
      showSpin && getStyleClass('dyn-input-container--with-spin-buttons')
    );

    return (
      <DynFieldContainer
        label={label}
        helpText={fieldHelpText}
        required={required}
        optional={optional}
        errorText={error}
        className={className}
        htmlFor={inputId}
        id={id}
      >
        <div className={containerDivClass}>
          {type === 'currency' && resolvedCurrencyConfig.symbol && (
            <span className={getStyleClass('dyn-input-currency-symbol')} aria-hidden="true">
              {resolvedCurrencyConfig.symbol}
            </span>
          )}

          {icon && (
            <div className={getStyleClass('dyn-input-icon-container')}>
              <DynIcon icon={icon} />
            </div>
          )}

          <input
            {...restProps}
            ref={inputRef}
            id={inputId}
            name={name}
            type={type === 'number' || isCurrencyType ? 'text' : type}
            className={inputClasses}
            placeholder={placeholder}
            value={displayValue}
            disabled={disabled}
            readOnly={isReadOnly}
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
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />

          {shouldShowClearButton && inputValue && !isReadOnly && !disabled && (
            <button
              type="button"
              className={getStyleClass('dyn-input-clean-button')}
              onClick={handleClean}
              tabIndex={-1}
              aria-label="Limpar campo"
            >
              <DynIcon icon="dyn-icon-close" />
            </button>
          )}

          {showSpin && (
            <div
              className={getStyleClass('dyn-input-spin-buttons')}
              aria-hidden={disabled || isReadOnly}
            >
              <button
                type="button"
                className={cn(
                  getStyleClass('dyn-input-spin-button'),
                  getStyleClass('dyn-input-spin-button--increment')
                )}
                onClick={() => handleStepChange(1)}
                tabIndex={-1}
                aria-label="Increase value"
                disabled={disabled || isReadOnly}
              >
                ▲
              </button>
              <button
                type="button"
                className={cn(
                  getStyleClass('dyn-input-spin-button'),
                  getStyleClass('dyn-input-spin-button--decrement')
                )}
                onClick={() => handleStepChange(-1)}
                tabIndex={-1}
                aria-label="Decrease value"
                disabled={disabled || isReadOnly}
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
    // Input should not include the currency symbol (it's rendered separately)
    return config.autoFormat
      ? formatCurrencyValue(normalizedValue, { ...config, showSymbol: false })
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
    ? formatCurrencyValue(normalizedValue, { ...config, showSymbol: false })
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
