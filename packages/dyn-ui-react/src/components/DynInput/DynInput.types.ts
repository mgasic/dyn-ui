import type {
  InputHTMLAttributes,
  FocusEventHandler,
  ChangeEventHandler,
  ReactNode,
} from 'react';
import type { BaseComponentProps, AccessibilityProps } from '../../types';

/**
 * Input size variants using design token scale
 */
export type DynInputSize = 'small' | 'medium' | 'large';

/**
 * Input type variants
 */
export type DynInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'currency';

/**
 * Validation rule function type
 */
export type DynInputValidationRule = (value: string) => string | null | undefined;

/**
 * Input mask configuration
 */
export interface DynInputMask {
  /** Mask pattern (e.g., '(99) 9999-9999' for phone) */
  pattern: string;
  /** Whether to format the model value with mask */
  formatModel?: boolean;
  /** Custom mask character definitions */
  definitions?: Record<string, RegExp>;
}

/**
 * Currency input configuration
 */
export interface CurrencyInputConfig {
  /** ISO 4217 currency code */
  currencyCode: string;
  /** Number of decimal places */
  precision?: number;
  /** Character used to group thousands */
  thousandSeparator?: string;
  /** Character used for decimal separation */
  decimalSeparator?: string;
  /** Whether to render the currency symbol */
  showSymbol?: boolean;
  /** Custom currency symbol override */
  symbol?: string;
  /** Placement of the currency symbol */
  symbolPosition?: 'prefix' | 'suffix';
  /** Whether to automatically format values */
  autoFormat?: boolean;
}

/**
 * Props interface for DynInput component
 * Follows DynAvatar's standardized pattern with BaseComponentProps and AccessibilityProps
 */
export interface DynInputProps
  extends BaseComponentProps,
    AccessibilityProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | 'size'
      | 'value'
      | 'onChange'
      | 'onBlur'
      | 'onFocus'
      | 'type'
      | keyof BaseComponentProps
      | keyof AccessibilityProps
    > {

  /** Input name attribute (also used as ID if not provided) */
  name?: string;

  /** Label text for the input */
  label?: string;

  /** Help text displayed below the input */
  help?: string;
  
  /** Help text displayed below the input (alias for help) */
  helpText?: string;

  /** Input type */
  type?: DynInputType;

  /** Input size */
  size?: DynInputSize;

  /** Input value */
  value?: string | number;

  /** Placeholder text */
  placeholder?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input is readonly */
  readOnly?: boolean;
  
  /** Whether the input is readonly (alias) */
  readonly?: boolean;

  /** Whether the input is required */
  required?: boolean;

  /** Whether to show optional indicator */
  optional?: boolean;

  /** Whether the input is visible */
  visible?: boolean;

  /** Whether the input is in invalid state */
  invalid?: boolean;
  
  /** Whether the input is in valid state */
  valid?: boolean;

  /** Custom error message */
  errorMessage?: string;
  
  /** Success message when valid */
  successMessage?: string;

  /** Validation rule function or array of functions */
  validation?: DynInputValidationRule | DynInputValidationRule[];
  
  /** Validation rules array (alias) */
  validationRules?: DynInputValidationRule[];
  
  /** Whether to validate on change */
  validateOnChange?: boolean;
  
  /** Whether to validate on blur */
  validateOnBlur?: boolean;

  /** Icon to display inside the input */
  icon?: string | ReactNode;

  /** Whether to show clear button when input has value */
  showClearButton?: boolean;

  /** Whether to show spin buttons for numeric inputs */
  showSpinButtons?: boolean;

  /** Input mask configuration */
  mask?: string | DynInputMask;

  /** Whether to format the model value with mask */
  maskFormatModel?: boolean;
  
  /** Loading state */
  loading?: boolean;

  /** Minimum value for number inputs */
  min?: number;

  /** Maximum value for number inputs */
  max?: number;

  /** Step value for number inputs */
  step?: number;

  /** Currency input behaviour configuration */
  currencyConfig?: CurrencyInputConfig;

  /** Change event handler */
  onChange?: (value: string) => void;

  /** Blur event handler */
  onBlur?: FocusEventHandler<HTMLInputElement>;

  /** Focus event handler */
  onFocus?: FocusEventHandler<HTMLInputElement>;

  /** Validation event handler */
  onValidate?: (isValid: boolean, errorMessage?: string) => void;
  
  /** Key down event handler */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

/**
 * Ref type for DynInput component
 */
export interface DynInputRef {
  /** Focus the input element */
  focus: () => void;
  
  /** Blur the input element */
  blur: () => void;
  
  /** Clear the input value */
  clear: () => void;
  
  /** Get the current input value */
  getValue: () => string | number;
  
  /** Set the input value programmatically */
  setValue: (value: string | number) => void;
  
  /** Validate the input and return validation result (async for compatibility) */
  validate: () => Promise<boolean>;
  
  /** Clear any validation errors */
  clearError: () => void;
  
  /** Get the native input element */
  getElement: () => HTMLInputElement | null;
}

/**
 * Default props type for DynInput
 */
export type DynInputDefaultProps = Required<
  Pick<
    DynInputProps,
    | 'type'
    | 'size'
    | 'disabled'
    | 'readOnly'
    | 'required'
    | 'optional'
    | 'visible'
    | 'showClearButton'
    | 'maskFormatModel'
  >
>;

/**
 * Default props values for DynInput component
 */
export const DYN_INPUT_DEFAULT_PROPS: DynInputDefaultProps = {
  type: 'text',
  size: 'medium',
  disabled: false,
  readOnly: false,
  required: false,
  optional: false,
  visible: true,
  showClearButton: false,
  maskFormatModel: false,
} as const;

/**
 * Input validation states
 */
export type DynInputValidationState = 'valid' | 'invalid' | 'pending' | 'initial';

/**
 * Input validation result
 */
export interface DynInputValidationResult {
  /** Whether the input is valid */
  isValid: boolean;
  
  /** Error message if invalid */
  errorMessage?: string;
  
  /** Validation state */
  state: DynInputValidationState;
}