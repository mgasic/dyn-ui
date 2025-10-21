import type { SelectOption } from '../../types/field.types';

export interface DynSelectOptionProps {
  /** DOM id used for aria-activedescendant wiring */
  id: string;
  /** Zero-based index of the option in the filtered collection */
  index: number;
  /** Option metadata provided by DynSelect */
  option: SelectOption;
  /** Indicates if the option represents the current selected value */
  isSelected: boolean;
  /** Indicates if the option is the active/focused item within the listbox */
  isActive: boolean;
  /** Enables checkbox affordance when the parent select is multiple */
  isMultiple: boolean;
  /** Called when the option should become the active item (hover/mouse move) */
  onActivate: (index: number) => void;
  /** Called when the option is requested to be selected */
  onSelect: (option: SelectOption) => void;
  /** Optional class names applied to the option container */
  className?: string;
  /** Optional class name overrides emitted by the parent */
  classes?: {
    option?: string;
    optionSelected?: string;
    optionDisabled?: string;
    optionActive?: string;
    optionText?: string;
    checkbox?: string;
    checkboxChecked?: string;
  };
}
