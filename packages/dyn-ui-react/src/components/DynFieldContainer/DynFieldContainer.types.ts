import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  ReactNode,
} from 'react';
import type { AccessibilityProps, BaseComponentProps } from '../../types';
import type { DynBoxProps } from '../DynBox';

export type DynFieldContainerSpacingProps = Pick<
  DynBoxProps<'div'>,
  | 'padding'
  | 'p'
  | 'px'
  | 'py'
  | 'pt'
  | 'pr'
  | 'pb'
  | 'pl'
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mr'
  | 'mb'
  | 'ml'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
>;

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P>;

export interface DynFieldContainerBaseProps
  extends Omit<BaseComponentProps, 'children'>,
    AccessibilityProps,
    DynFieldContainerSpacingProps {
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

export type DynFieldContainerProps<E extends ElementType = 'div'> =
  PolymorphicComponentProps<
    E,
    DynFieldContainerBaseProps & {
      as?: E;
    }
  >;

export type DynFieldContainerRef<E extends ElementType = 'div'> = ComponentRef<E>;

export interface DynFieldContainerDefaultProps {
  showValidation: boolean;
  'data-testid': string;
  gap: DynFieldContainerSpacingProps['gap'];
  mb: DynFieldContainerSpacingProps['mb'];
  as: 'div';
}

export const DYN_FIELD_CONTAINER_DEFAULT_PROPS: DynFieldContainerDefaultProps = {
  showValidation: true,
  'data-testid': 'dyn-field-container',
  gap: 'xs',
  mb: 'md',
  as: 'div',
};
