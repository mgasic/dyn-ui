/**
 * Utility functions for formatting data in DYN UI components
 */
import { DYN_BADGE_COLORS } from '../components/DynBadge/DynBadge.types';
import type { IconDictionary, ProcessedIcon } from '../types/icon.types';

/**
 * DynCurrencyConfig type: defined locally because it's not exported from '../types/field.types'
 * Fields are optional here; callers use Required<DynCurrencyConfig> where needed.
 */
export interface DynCurrencyConfig {
  precision?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  symbol?: string;
  currencyCode?: string;
}

/**
 * Generates initials from a full name
 * @param name - Full name (e.g., "John Doe")
 * @returns Initials (e.g., "JD")
 */
export const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }

  const [firstWord, ...restWords] = words;
  if (!firstWord) {
    return '';
  }

  if (restWords.length === 0) {
    return firstWord.charAt(0).toUpperCase();
  }

  const lastWord = restWords[restWords.length - 1];
  if (!lastWord) {
    return firstWord.charAt(0).toUpperCase();
  }

  return (firstWord.charAt(0) + lastWord.charAt(0)).toUpperCase();
};

/**
 * Formats badge value for display (9+ for values > 9)
 * @param value - Numeric value
 * @returns Formatted string
 */
export const formatBadgeValue = (value: number): string => {
  if (value <= 0) return '0';
  if (value > 99) return '99+';
  return value.toString();
};

/**
 * Checks if a color is a theme color from DYN palette
 * @param color - Color string
 * @returns Boolean indicating if it's a theme color
 */
export const isThemeColor = (color: string): boolean => {
  return (DYN_BADGE_COLORS as readonly string[]).includes(color);
};

/**
 * Processes icon string with dictionary lookup
 * @param iconStr - Icon string (may contain dictionary keys)
 * @param dictionary - Icon dictionary mapping
 * @returns Processed icon classes
 */
export const processIconString = (
  iconStr: string,
  dictionary: IconDictionary
): ProcessedIcon => {
  const iconTokens = iconStr
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  let processedClass = '';
  let baseClass: string | undefined;

  iconTokens.forEach((token, index) => {
    const dictValue = dictionary[token];

    if (dictValue) {
      processedClass = index === 0 ? dictValue : `${processedClass} ${dictValue}`;
      if (!baseClass && dictValue.startsWith('dyn-icon')) {
        baseClass = 'dyn-icon';
      }
      return;
    }

    if (token.startsWith('dyn-icon-')) {
      processedClass = index === 0 ? token : `${processedClass} ${token}`;
      if (!baseClass) {
        baseClass = 'dyn-icon';
      }
      return;
    }

    if (token.startsWith('fa') || token.startsWith('fas') || token.startsWith('far')) {
      baseClass = 'dyn-fonts-icon';
      processedClass = index === 0 ? token : `${processedClass} ${token}`;
      return;
    }

    processedClass = index === 0 ? token : `${processedClass} ${token}`;
  });

  return {
    baseClass: baseClass ?? 'dyn-icon',
    iconClass: processedClass.trim()
  };
};

export interface FormatCurrencyValueResult {
  formattedValue: string;
  symbol: string;
  currencyCode?: string;
  showCurrencyCode: boolean;
}

export const formatCurrencyValue = (
  value: string | number | null | undefined,
  config: Required<DynCurrencyConfig> & { showCurrencyCode: boolean }
): FormatCurrencyValueResult => {
  const {
    precision,
    decimalSeparator,
    thousandSeparator,
    symbol,
    currencyCode,
    showCurrencyCode
  } = config;

  const precisionValue = Math.max(0, precision ?? 2);

  if (value == null || value === '') {
    return {
      formattedValue: '',
      symbol,
      currencyCode,
      showCurrencyCode
    };
  }

  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value));

  if (Number.isNaN(numericValue)) {
    return {
      formattedValue: '',
      symbol,
      currencyCode,
      showCurrencyCode
    };
  }

  const sign = numericValue < 0 ? '-' : '';
  const absoluteValue = Math.abs(numericValue);
  const fixedValue = absoluteValue.toFixed(precisionValue);
  const [integerPartRaw, decimalPartRaw] = fixedValue.split('.');

  const integerWithSeparator = integerPartRaw.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator
  );

  const formattedWithoutSign =
    precisionValue > 0 && decimalPartRaw
      ? `${integerWithSeparator}${decimalSeparator}${decimalPartRaw}`
      : integerWithSeparator;

  return {
    formattedValue: `${sign}${formattedWithoutSign}`,
    symbol,
    currencyCode,
    showCurrencyCode
  };
};
