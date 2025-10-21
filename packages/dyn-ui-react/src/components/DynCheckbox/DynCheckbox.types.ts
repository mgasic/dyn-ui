import type { BaseComponentProps } from '../../types';
import type { DynFieldRef, ValidationRule } from '../../types/field.types';

export type DynCheckboxSize = 'small' | 'medium' | 'large';

export interface DynCheckboxProps extends BaseComponentProps {
  /** Field name */
  name?: string;
  /** Label displayed next to the checkbox */
  label?: string;
  /** Helper text displayed below the field */
  help?: string;
  /** Disables user interaction */
  disabled?: boolean;
  /** Prevents value changes while keeping the field focusable */
  readonly?: boolean;
  /** Marks the field as required */
  required?: boolean;
  /** Shows the optional indicator */
  optional?: boolean;
  /** Controls visibility of the field */
  visible?: boolean;
  /** Controlled checked state */
  checked?: boolean;
  /** Shows the indeterminate state */
  indeterminate?: boolean;
  /** Displays loading spinner and disables interactions */
  loading?: boolean;
  /** Custom validation error message */
  errorMessage?: string;
  /** Validation rules */
  validation?: ValidationRule[];
  /** Size variant */
  size?: DynCheckboxSize;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Focus handler */
  onFocus?: () => void;
}

export interface DynCheckboxRef extends DynFieldRef {
  /** Direct reference to the underlying input element */
  element: HTMLInputElement | null;
}

export interface DynCheckboxDefaultProps
  extends Required<
      Pick<
        DynCheckboxProps,
        | 'disabled'
        | 'readonly'
        | 'required'
        | 'optional'
        | 'visible'
        | 'checked'
        | 'indeterminate'
        | 'loading'
        | 'size'
      >
    > {
  'data-testid': string;
}

export const DYN_CHECKBOX_DEFAULT_PROPS: DynCheckboxDefaultProps = {
  disabled: false,
  readonly: false,
  required: false,
  optional: false,
  visible: true,
  checked: false,
  indeterminate: false,
  loading: false,
  size: 'medium',
  'data-testid': 'dyn-checkbox',
};
