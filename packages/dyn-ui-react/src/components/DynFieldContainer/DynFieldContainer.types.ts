import type { HTMLAttributes, ReactNode } from 'react';
import type { BaseComponentProps } from '../../types';

export interface DynFieldContainerOwnProps {
  /** Form field element that should be wrapped */
  children: ReactNode;
  /** Optional label to display above the field */
  label?: string;
  /** Indicates the field is required */
  required?: boolean;
  /** Indicates the field is optional */
  optional?: boolean;
  /** Informational helper text displayed below the field */
  helpText?: string;
  /** Error message displayed below the field */
  errorText?: string;
  /** Validation state that controls tone and semantics for the feedback message */
  validationState?: 'default' | 'error' | 'warning' | 'success' | 'loading';
  /** Message rendered for the current validation state */
  validationMessage?: string;
  /** Optional id applied to the validation message element */
  validationMessageId?: string;
  /** Controls whether validation messages are shown */
  showValidation?: boolean;
  /** Id of the input element for the label association */
  htmlFor?: string;
}

export type DynFieldContainerProps = Omit<BaseComponentProps, 'children'> &
  DynFieldContainerOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export interface DynFieldContainerDefaultProps {
  showValidation: boolean;
  'data-testid': string;
}

export const DYN_FIELD_CONTAINER_DEFAULT_PROPS: DynFieldContainerDefaultProps = {
  showValidation: true,
  'data-testid': 'dyn-field-container',
};
