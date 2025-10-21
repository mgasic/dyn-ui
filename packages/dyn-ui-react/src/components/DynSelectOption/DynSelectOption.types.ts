import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import type { SelectOption } from '../../types/field.types';

export interface DynSelectOptionClassNames {
  /** Additional class applied to the option root element */
  root?: string;
  /** Additional class applied when the option is selected */
  selected?: string;
  /** Additional class applied when the option is the active (focused) option */
  active?: string;
  /** Additional class applied when the option is disabled */
  disabled?: string;
  /** Additional class applied to the option text container */
  text?: string;
  /** Additional class applied to the checkbox container when in multi-select mode */
  checkbox?: string;
  /** Additional class applied to the checkbox when the option is selected */
  checkboxChecked?: string;
}

export interface DynSelectOptionProps {
  /** Unique id for aria-activedescendant wiring */
  id: string;
  /** Option metadata representing the value rendered */
  option: SelectOption;
  /** Flag to indicate this option is currently selected */
  isSelected: boolean;
  /** Flag to indicate this option is the active option in the list */
  isActive: boolean;
  /** Whether the parent select is operating in multi-select mode */
  multiple?: boolean;
  /** Callback fired when the option is selected via click */
  onSelect: (
    option: SelectOption,
    event: ReactMouseEvent<HTMLDivElement>
  ) => void;
  /** Callback fired when the option becomes the active option through pointer focus */
  onActivate?: (
    option: SelectOption,
    event: ReactMouseEvent<HTMLDivElement>
  ) => void;
  /** Optional overrides to append styling hooks */
  classNames?: DynSelectOptionClassNames;
  /** Custom label renderer. Defaults to option.label */
  children?: ReactNode;
}
