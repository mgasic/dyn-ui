import type {
  ForwardRefExoticComponent,
  RefAttributes,
  TextareaHTMLAttributes,
} from 'react';
import type { DynFieldBase, DynFieldRef } from '../../types/field.types';

export type DynTextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export type DynTextAreaStatus = 'default' | 'error' | 'warning' | 'success' | 'loading';

export interface DynTextAreaProps
  extends DynFieldBase,
    Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      | 'value'
      | 'defaultValue'
      | 'onChange'
      | 'onBlur'
      | 'onFocus'
      | 'rows'
      | 'cols'
      | 'defaultValue'
      | keyof DynFieldBase
    > {
  /** Number of visible text lines */
  rows?: number;
  /** Number of visible columns */
  cols?: number;
  /** Controls the resize behavior of the textarea */
  resize?: DynTextAreaResize;
  /** Automatically grow the height based on the content */
  autoResize?: boolean;
  /** Initial uncontrolled value for the textarea */
  defaultValue?: string;
  /** Controlled value for the textarea */
  value?: string;
  /** Change handler returning the textarea value */
  onChange?: (value: string) => void;
  /** Visual status of the textarea */
  status?: DynTextAreaStatus;
  /** Message associated with the current status */
  statusMessage?: string;
  /** Display a live character counter when maxLength is provided */
  showCharacterCount?: boolean;
}

export type DynTextAreaRef = DynFieldRef & {
  /** Blur the textarea element */
  blur: () => void;
  /** Get the native textarea element */
  getElement: () => HTMLTextAreaElement | null;
};

export type DynTextAreaComponent = ForwardRefExoticComponent<
  DynTextAreaProps & RefAttributes<DynTextAreaRef>
>;

export interface DynTextAreaDefaultProps {
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  optional: boolean;
  visible: boolean;
  resize: DynTextAreaResize;
  rows: number;
  autoResize: boolean;
  status: DynTextAreaStatus;
  statusMessage: string;
  showCharacterCount: boolean;
  defaultValue: string;
  'data-testid': string;
}

export const DYN_TEXT_AREA_DEFAULT_PROPS: DynTextAreaDefaultProps = {
  disabled: false,
  readonly: false,
  required: false,
  optional: false,
  visible: true,
  resize: 'vertical',
  rows: 4,
  autoResize: false,
  status: 'default',
  statusMessage: '',
  showCharacterCount: false,
  defaultValue: '',
  'data-testid': 'dyn-textarea',
};
