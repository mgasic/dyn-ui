import { forwardRef, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import classNames from 'classnames';
import type { DynSelectOptionProps } from './DynSelectOption.types';
import styles from '../DynSelect/DynSelect.module.css';
import { DynIcon } from '../DynIcon';

export const DynSelectOption = forwardRef<HTMLDivElement, DynSelectOptionProps>(
  (
    {
      id,
      option,
      isSelected,
      isActive,
      multiple = false,
      onSelect,
      onActivate,
      classNames: classNameOverrides,
      children,
    },
    ref,
  ) => {
    const { label, disabled, value } = option;

    const handleClick = useCallback(
      (event: ReactMouseEvent<HTMLDivElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onSelect(option, event);
      },
      [disabled, onSelect, option],
    );

    const handleActivate = useCallback(
      (event: ReactMouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        onActivate?.(option, event);
      },
      [disabled, onActivate, option],
    );

    const rootClassName = classNames(
      styles.option,
      {
        [styles.optionSelected]: isSelected,
        [styles.optionActive]: isActive,
        [styles.optionDisabled]: disabled,
      },
      classNameOverrides?.root,
      isSelected && classNameOverrides?.selected,
      isActive && classNameOverrides?.active,
      disabled && classNameOverrides?.disabled,
    );

    const checkboxClassName = classNames(
      styles.checkbox,
      classNameOverrides?.checkbox,
      {
        [styles.checkboxChecked]: isSelected,
      },
      isSelected ? classNameOverrides?.checkboxChecked : undefined,
    );

    const textClassName = classNames(
      styles.optionText,
      classNameOverrides?.text,
    );

    return (
      <div
        id={id}
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-value={value}
        className={rootClassName}
        onClick={handleClick}
        onMouseEnter={handleActivate}
        onMouseDown={(event) => event.preventDefault()}
      >
        {multiple && (
          <span className={checkboxClassName} aria-hidden="true">
            {isSelected && <DynIcon icon="dyn-icon-check" />}
          </span>
        )}
        <span className={textClassName}>{children ?? label}</span>
      </div>
    );
  },
);

DynSelectOption.displayName = 'DynSelectOption';

export default DynSelectOption;
