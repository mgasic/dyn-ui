import classNames from 'classnames';
import { forwardRef } from 'react';
import type { DynSelectOptionProps } from './DynSelectOption.types';
import { DynIcon } from '../DynIcon';
import styles from '../DynSelect/DynSelect.module.css';

const getClassName = (key: keyof typeof styles) => styles[key];

export const DynSelectOption = forwardRef<HTMLDivElement, DynSelectOptionProps>(
  (
    {
      id,
      index,
      option,
      isSelected,
      isActive,
      isMultiple,
      onActivate,
      onSelect,
      className,
      classes,
    },
    ref
  ) => {
    const handleActivate = () => {
      if (!option.disabled) {
        onActivate(index);
      }
    };

    const handleClick = () => {
      if (!option.disabled) {
        onSelect(option);
      }
    };

    return (
      <div
        id={id}
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        className={classNames(
          getClassName('option'),
          className,
          classes?.option,
          {
            [getClassName('optionSelected')]: isSelected,
            [getClassName('optionDisabled')]: option.disabled,
            [getClassName('optionActive')]: isActive,
          },
          isSelected ? classes?.optionSelected : null,
          option.disabled ? classes?.optionDisabled : null,
          isActive ? classes?.optionActive : null
        )}
        data-active={isActive ? 'true' : undefined}
        onMouseEnter={handleActivate}
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        {isMultiple && (
          <span
            className={classNames(
              getClassName('checkbox'),
              classes?.checkbox,
              {
                [getClassName('checkboxChecked')]: isSelected,
              },
              isSelected ? classes?.checkboxChecked : null
            )}
            aria-hidden="true"
          >
            {isSelected && <DynIcon icon="dyn-icon-check" />}
          </span>
        )}
        <span className={classNames(getClassName('optionText'), classes?.optionText)}>
          {option.label}
        </span>
      </div>
    );
  }
);

DynSelectOption.displayName = 'DynSelectOption';

export default DynSelectOption;
