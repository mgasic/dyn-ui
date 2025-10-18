import type { TextareaHTMLAttributes } from 'react';
import type { DynFieldBase, DynFieldRef } from '../../types/field.types';

export type DynTextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

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
      | keyof DynFieldBase
    > {
  /** Number of visible text lines */
  rows?: number;
  /** Number of visible columns */
  cols?: number;
  /** Controls the resize behavior of the textarea */
  resize?: DynTextAreaResize;
  /** Controlled value for the textarea */
  value?: string;
  /** Change handler returning the textarea value */
  onChange?: (value: string) => void;
}

export type DynTextAreaRef = DynFieldRef;

export interface DynTextAreaDefaultProps {
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  optional: boolean;
  visible: boolean;
  value: string;
  resize: DynTextAreaResize;
  rows: number;
  'data-testid': string;
}

export const DYN_TEXT_AREA_DEFAULT_PROPS: DynTextAreaDefaultProps = {
  disabled: false,
  readonly: false,
  required: false,
  optional: false,
  visible: true,
  value: '',
  resize: 'vertical',
  rows: 4,
  'data-testid': 'dyn-textarea',
};
