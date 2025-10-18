/**
 * Base types for form field components
 * Part of DYN UI Form Components Group - SCOPE 6
 */

import type { ReactNode } from 'react';
import type { BaseComponentProps } from './theme';
export type { DynFieldContainerProps } from '../components/DynFieldContainer/DynFieldContainer.types';

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
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'currency';
export type InputSize = 'small' | 'medium' | 'large';

export interface DynCurrencyConfig {
  symbol?: string;
  currencyCode?: string;
  showCurrencyCode?: boolean;
  precision?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
}

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
  showSpinButtons?: boolean;
  step?: number;
  min?: number;
  max?: number;
  showSpinButtons?: boolean;
  currencyConfig?: DynCurrencyConfig;
}

// Select specific types
export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
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

// // FieldContainer specific types
// export interface DynFieldContainerProps {
//   children: React.ReactElement;
//   label?: string;
//   required?: boolean;
//   optional?: boolean;
//   helpText?: string;
//   errorText?: string;
//   showValidation?: boolean;
//   className?: string;
//   htmlFor?: string;
// }

