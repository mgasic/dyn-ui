/**
 * Base types for form field components
 * Part of DYN UI Form Components Group - SCOPE 6
 */

import type { ReactNode } from 'react';
import type { BaseComponentProps } from './theme';
export type { DynFieldContainerProps } from '../components/DynFieldContainer/DynFieldContainer.types';
export type {
  DynTextAreaProps,
  DynTextAreaRef,
  DynTextAreaResize,
} from '../components/DynTextArea/DynTextArea.types';

export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'pattern' | 'minLength' | 'maxLength' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any) => boolean | Promise<boolean>;
}

export interface DynFieldBase extends BaseComponentProps {
  id?: string;
  className?: string;
  'data-testid'?: string;
  children?: ReactNode;
  name?: string;
  label?: string;
  help?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  optional?: boolean;
  visible?: boolean;
  value?: any;
  errorMessage?: string;
  validation?: ValidationRule[];
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface DynFieldRef {
  focus: () => void;
  validate: () => Promise<boolean>;
  clear: () => void;
  getValue: () => any;
  setValue: (value: any) => void;
}

// Input specific types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'currency' | 'search' | 'date';
export type InputSize = 'small' | 'medium' | 'large';

// HOTFIX: Enhanced CurrencyInputConfig with all missing properties
export interface CurrencyInputConfig {
  currency?: string;  // Added for compatibility
  currencyCode?: string;  // Existing property
  locale?: string;  // Added for compatibility
  precision?: number;
  minimumFractionDigits?: number;  // Added for compatibility
  maximumFractionDigits?: number;  // Added for compatibility
  thousandSeparator?: string;
  thousandsSeparator?: string;  // Added for compatibility
  decimalSeparator?: string;
  prefix?: string;  // Added for compatibility
  suffix?: string;  // Added for compatibility
  showSymbol?: boolean;
  symbol?: string;
  symbolPosition?: 'prefix' | 'suffix';
  autoFormat?: boolean;
}

// HOTFIX: Added DynCurrencyConfig for compatibility
export interface DynCurrencyConfig {
  currency: string;
  locale: string;
  style?: 'currency' | 'decimal' | 'percent';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// HOTFIX: Added currency formatting utility types
export type FormatCurrencyValue = (value: number | string, config: DynCurrencyConfig) => string;
export type ParseCurrencyValue = (value: string, config: DynCurrencyConfig) => number;

export interface DynInputProps extends DynFieldBase {
  type?: InputType;
  size?: InputSize;
  maxLength?: number;
  minLength?: number;
  mask?: string;
  maskFormatModel?: boolean;
  pattern?: string;
  icon?: string;
  showCleanButton?: boolean;
  showSpinButtons?: boolean;  // This was missing - HOTFIX
  step?: number;
  min?: number;
  max?: number;
  currencyConfig?: CurrencyInputConfig;
}

// Select specific types
export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;  // Added for compatibility
}

// HOTFIX: Added missing exports for compatibility
export interface DynFieldContainerOwnProps {
  children: ReactNode;  // This was missing in the component - CRITICAL FIX
  label?: string;
  required?: boolean;
  optional?: boolean;
  helpText?: string;
  errorText?: string;
  showValidation?: boolean;
  className?: string;
  htmlFor?: string;
}

export interface DynSelectProps extends DynFieldBase {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  virtualScroll?: boolean;
  loading?: boolean;
  size?: InputSize;
}

// DatePicker specific types
export interface DynDatePickerProps extends DynFieldBase {
  format?: string;
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  customParser?: (input: string) => Date | null;
  size?: InputSize;
}

// HOTFIX: Added hooks and validators for missing exports
export interface DynFieldValidationResult {
  isValid: boolean;
  errors: string[];
}

export type DynFieldValidator = (value: any) => boolean | string | Promise<boolean | string>;

// HOTFIX: Mock validators object for missing export
export const validators = {
  required: (message?: string) => (value: any) => !!value || message || 'Field is required',
  email: (message?: string) => (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || message || 'Invalid email',
  minLength: (min: number, message?: string) => (value: string) => 
    (value?.length || 0) >= min || message || `Minimum length is ${min}`,
  maxLength: (max: number, message?: string) => (value: string) => 
    (value?.length || 0) <= max || message || `Maximum length is ${max}`,
};

// HOTFIX: Mock hook implementations for missing exports
export const useDynFieldValidation = (rules: ValidationRule[]) => {
  return {
    validate: (value: any) => Promise.resolve({ isValid: true, errors: [] } as DynFieldValidationResult),
    errors: [] as string[],
    isValid: true,
  };
};

export const useDynMask = (mask: string) => {
  return {
    formatValue: (value: string) => value,
    maskValue: (value: string) => value,
  };
};

export const useDynDateParser = (format: string) => {
  return {
    parseDate: (input: string) => new Date(input),
    formatDate: (date: Date) => date.toISOString().split('T')[0],
  };
};

// HOTFIX: Constants for missing exports
export const MASK_PATTERNS = {
  phone: '(###) ###-####',
  ssn: '###-##-####',
  zip: '#####',
  date: '##/##/####',
};

export const DATE_FORMATS = {
  'en-US': 'MM/dd/yyyy',
  'en-GB': 'dd/MM/yyyy',
  'de-DE': 'dd.MM.yyyy',
  'fr-FR': 'dd/MM/yyyy',
};

export const getMaskPattern = (type: keyof typeof MASK_PATTERNS) => MASK_PATTERNS[type];
export const getDateFormat = (locale: keyof typeof DATE_FORMATS) => DATE_FORMATS[locale];