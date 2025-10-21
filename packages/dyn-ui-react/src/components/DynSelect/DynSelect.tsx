/**
 * DynSelect - Advanced select component with search and virtual scrolling
 * Part of DYN UI Form Components Group - SCOPE 6
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useMemo,
  useId
} from 'react';
import classNames from 'classnames';
import type { DynSelectProps, DynFieldRef, SelectOption } from '../../types/field.types';
import { DynFieldContainer } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { DynIcon } from '../DynIcon';
import styles from './DynSelect.module.css';

const getStyleClass = (classKey: keyof typeof styles) => styles[classKey];

export const DynSelect = forwardRef<DynFieldRef, DynSelectProps>(
  (
    {
      id: idProp,
      name,
      label,
      help,
      placeholder = 'Selecione...',
      disabled = false,
      readonly = false,
      required = false,
      optional = false,
      visible = true,
      value: propValue,
      errorMessage,
      validation,
      className,
      options = [],
      multiple = false,
      searchable = false,
      virtualScroll = false,
      loading = false,
      size = 'medium',
      onChange,
      onBlur,
      onFocus
    },
    ref
  ) => {
    const [value, setValue] = useState<string | string[]>(propValue || (multiple ? [] : ''));
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focused, setFocused] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
    const typeaheadStateRef = useRef<{ query: string; timestamp: number }>({
      query: '',
      timestamp: 0
    });
    const selectRef = useRef<HTMLDivElement>(null);
    const comboboxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const typeaheadRef = useRef('');
    const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      return () => {
        if (typeaheadTimeoutRef.current) {
          clearTimeout(typeaheadTimeoutRef.current);
        }
      };
    }, []);
    const generatedId = useId();
    const sanitizedGeneratedId = generatedId.replace(/:/g, '');
    const fieldId = idProp ?? name ?? `dyn-select-${sanitizedGeneratedId}`;
    const labelId = label ? `${fieldId}-label` : undefined;
    const listboxId = `${fieldId}-listbox`;

    const { error, validate, clearError } = useDynFieldValidation({
      value,
      required,
      validation,
      customError: errorMessage
    });

    useImperativeHandle(ref, () => ({
      focus: () => comboboxRef.current?.focus(),
      validate: () => validate(),
      clear: () => {
        setValue(multiple ? [] : '');
        onChange?.(multiple ? [] : '');
        clearError();
      },
      getValue: () => value,
      setValue: (newValue: any) => {
        setValue(newValue);
        onChange?.(newValue);
      }
    }));

    const filteredOptions = useMemo(() => {
      if (!searchable || !searchTerm) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm, searchable]);

    const selectedOptions = useMemo(() => {
      if (multiple && Array.isArray(value)) {
        return options.filter(option => value.includes(option.value));
      } else if (!multiple) {
        return options.find(option => option.value === value) || null;
      }
      return null;
    }, [options, value, multiple]);

    useEffect(() => {
      setValue(propValue || (multiple ? [] : ''));
    }, [propValue, multiple]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const getFirstEnabledIndex = () =>
      filteredOptions.findIndex(option => !option.disabled);

    const getLastEnabledIndex = () => {
      for (let index = filteredOptions.length - 1; index >= 0; index -= 1) {
        if (!filteredOptions[index]?.disabled) {
          return index;
        }
      }
      return -1;
    };

    const resetTypeahead = () => {
      typeaheadStateRef.current = { query: '', timestamp: 0 };
    };

    const handleToggle = () => {
      if (!disabled && !readonly) {
        setIsOpen(prev => !prev);
        if (!isOpen) {
          comboboxRef.current?.focus();
        }
      }
    };

    const handleOptionSelect = (
      option: SelectOption,
      config: { focusCombobox?: boolean } = {}
    ) => {
      if (option.disabled) return;

      if (multiple && Array.isArray(value)) {
        const newValue = value.includes(option.value)
          ? value.filter(v => v !== option.value)
          : [...value, option.value];
        setValue(newValue);
        onChange?.(newValue);
      } else {
        setValue(option.value);
        onChange?.(option.value);
        setIsOpen(false);
        setSearchTerm('');
        if (config.focusCombobox) {
          comboboxRef.current?.focus();
        }
      }

      clearError();
    };

    const handleRemoveOption = (optionValue: any, event: React.MouseEvent) => {
      event.stopPropagation();
      if (multiple && Array.isArray(value)) {
        const newValue = value.filter(v => v !== optionValue);
        setValue(newValue);
        onChange?.(newValue);
      }
    };

    const handleBlur = () => {
      setFocused(false);
      validate();
      onBlur?.();
    };

    const handleFocus = () => {
      setFocused(true);
      clearError();
      onFocus?.();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    const findNextEnabledIndex = (
      startIndex: number,
      direction: 1 | -1
    ) => {
      if (!filteredOptions.length) return -1;

      if (direction > 0) {
        for (let index = Math.max(0, startIndex); index < filteredOptions.length; index += 1) {
          if (!filteredOptions[index]?.disabled) {
            return index;
          }
        }
      } else {
        for (let index = Math.min(filteredOptions.length - 1, startIndex); index >= 0; index -= 1) {
          if (!filteredOptions[index]?.disabled) {
            return index;
          }
        }
      }

      return -1;
    };

    const moveActiveBy = (delta: number) => {
      if (!filteredOptions.length) return;
      const firstEnabledIndex = getFirstEnabledIndex();
      const lastEnabledIndex = getLastEnabledIndex();

      if (firstEnabledIndex === -1 || lastEnabledIndex === -1) {
        setActiveOptionIndex(-1);
        return;
      }

      const direction: 1 | -1 = delta >= 0 ? 1 : -1;
      const steps = Math.abs(delta);

      setActiveOptionIndex(currentIndex => {
        let nextIndex = currentIndex;

        if (nextIndex === -1) {
          return direction > 0 ? firstEnabledIndex : lastEnabledIndex;
        }

        let candidate = nextIndex;
        let remainingSteps = steps;

        while (remainingSteps > 0) {
          const potentialIndex = findNextEnabledIndex(candidate + direction, direction);
          if (potentialIndex === -1) {
            break;
          }

          candidate = potentialIndex;
          nextIndex = candidate;
          remainingSteps -= 1;
        }

        return nextIndex;
      });
    };

    const handleTypeahead = (key: string) => {
      const now = Date.now();
      const { query, timestamp } = typeaheadStateRef.current;
      const isStale = now - timestamp > 500;
      const nextQuery = (isStale ? '' : query) + key.toLowerCase();
      typeaheadStateRef.current = { query: nextQuery, timestamp: now };

      if (!isOpen) {
        setIsOpen(true);
      }

      const startIndex = activeOptionIndex >= 0 ? activeOptionIndex + 1 : 0;
      const findMatch = (fromIndex: number) => {
        for (let index = fromIndex; index < filteredOptions.length; index += 1) {
          const option = filteredOptions[index];
          if (!option.disabled && option.label.toLowerCase().startsWith(nextQuery)) {
            return index;
          }
        }
        return -1;
      };

      let matchedIndex = findMatch(startIndex);
      if (matchedIndex === -1) {
        matchedIndex = findMatch(0);
      }

      if (matchedIndex !== -1) {
        setActiveOptionIndex(matchedIndex);
      }
    };

    const processKeyDown = (
      event: React.KeyboardEvent<HTMLElement>,
      options: { allowTypeahead: boolean; allowSpaceSelect: boolean }
    ) => {
      const { allowTypeahead, allowSpaceSelect } = options;
      if (disabled || readonly) return;

      const closeDropdown = () => {
        setIsOpen(false);
        setSearchTerm('');
        comboboxRef.current?.focus();
        resetTypeahead();
      };

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            const firstEnabledIndex = getFirstEnabledIndex();
            if (firstEnabledIndex !== -1) {
              setActiveOptionIndex(firstEnabledIndex);
            }
          } else {
            moveActiveBy(1);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            const lastEnabledIndex = getLastEnabledIndex();
            if (lastEnabledIndex !== -1) {
              setActiveOptionIndex(lastEnabledIndex);
            }
          } else {
            moveActiveBy(-1);
          }
          break;
        }
        case 'Home': {
          if (isOpen) {
            event.preventDefault();
            const firstEnabledIndex = getFirstEnabledIndex();
            if (firstEnabledIndex !== -1) {
              setActiveOptionIndex(firstEnabledIndex);
            }
          }
          break;
        }
        case 'End': {
          if (isOpen) {
            event.preventDefault();
            const lastEnabledIndex = getLastEnabledIndex();
            if (lastEnabledIndex !== -1) {
              setActiveOptionIndex(lastEnabledIndex);
            }
          }
          break;
        }
        case 'PageDown': {
          if (isOpen) {
            event.preventDefault();
            moveActiveBy(10);
          }
          break;
        }
        case 'PageUp': {
          if (isOpen) {
            event.preventDefault();
            moveActiveBy(-10);
          }
          break;
        }
        case 'Enter': {
          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
            const firstEnabledIndex = getFirstEnabledIndex();
            if (firstEnabledIndex !== -1) {
              setActiveOptionIndex(firstEnabledIndex);
            }
            break;
          }

          event.preventDefault();
          const option = filteredOptions[activeOptionIndex];
          if (option) {
            handleOptionSelect(option, { focusCombobox: true });
          }
          break;
        }
        case ' ': {
          if (!allowSpaceSelect) {
            return;
          }

          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
            const firstEnabledIndex = getFirstEnabledIndex();
            if (firstEnabledIndex !== -1) {
              setActiveOptionIndex(firstEnabledIndex);
            }
            break;
          }

          event.preventDefault();
          const option = filteredOptions[activeOptionIndex];
          if (option) {
            handleOptionSelect(option, { focusCombobox: true });
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            event.preventDefault();
            closeDropdown();
          }
          break;
        }
        default: {
          if (
            allowTypeahead &&
            event.key.length === 1 &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
          ) {
            handleTypeahead(event.key);
          }
          break;
        }
      }
    };

    const handleComboboxKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      processKeyDown(event as React.KeyboardEvent<HTMLElement>, {
        allowTypeahead: true,
        allowSpaceSelect: true
      });
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      processKeyDown(event as unknown as React.KeyboardEvent<HTMLElement>, {
        allowTypeahead: false,
        allowSpaceSelect: false
      });
    };

    const resolvedError = errorMessage ?? (error || undefined);

    useEffect(() => {
      if (!isOpen) {
        setActiveOptionIndex(-1);
        resetTypeahead();
        return;
      }

      const firstEnabledIndex = filteredOptions.findIndex(option => !option.disabled);
      let lastEnabledIndex = -1;
      for (let index = filteredOptions.length - 1; index >= 0; index -= 1) {
        if (!filteredOptions[index]?.disabled) {
          lastEnabledIndex = index;
          break;
        }
      }

      if (firstEnabledIndex === -1 || lastEnabledIndex === -1) {
        setActiveOptionIndex(-1);
        return;
      }

      setActiveOptionIndex(currentIndex => {
        if (
          currentIndex >= 0 &&
          currentIndex < filteredOptions.length &&
          !filteredOptions[currentIndex]?.disabled
        ) {
          return currentIndex;
        }

        if (!multiple && !Array.isArray(value)) {
          const selectedIndex = filteredOptions.findIndex(
            option => option.value === value
          );
          if (selectedIndex !== -1 && !filteredOptions[selectedIndex]?.disabled) {
            return selectedIndex;
          }
        }

        if (multiple && Array.isArray(value) && value.length > 0) {
          const selectedIndex = filteredOptions.findIndex(option =>
            value.includes(option.value)
          );
          if (selectedIndex !== -1 && !filteredOptions[selectedIndex]?.disabled) {
            return selectedIndex;
          }
        }

        return firstEnabledIndex;
      });
    }, [filteredOptions, isOpen, multiple, value]);

    useEffect(() => {
      if (!isOpen) {
        resetTypeahead();
      }
    }, [isOpen]);

    if (!visible) return null;

    const sizeClassName = (() => {
      const capitalizedSize = size.charAt(0).toUpperCase() + size.slice(1);
      const key = `selectSize${capitalizedSize}` as keyof typeof styles;
      return styles[key];
    })();

    const selectClasses = classNames(
      getStyleClass('select'),
      sizeClassName,
      {
        [getStyleClass('selectOpen')]: isOpen,
        [getStyleClass('selectFocused')]: focused,
        [getStyleClass('selectError')]: Boolean(resolvedError),
        [getStyleClass('selectDisabled')]: disabled,
        [getStyleClass('selectReadonly')]: readonly,
        [getStyleClass('selectSearchable')]: searchable,
        [getStyleClass('selectMultiple')]: multiple,
        [getStyleClass('selectLoading')]: loading
      }
    );

    const getDisplayText = () => {
      if (loading) return 'Carregando...';

      if (multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0) {
        return `${selectedOptions.length} selecionado(s)`;
      } else if (!multiple && selectedOptions) {
        return (selectedOptions as SelectOption).label;
      }

      return placeholder;
    };

    const showPlaceholder = !selectedOptions ||
      (multiple && Array.isArray(selectedOptions) && selectedOptions.length === 0);

    const getOptionId = (index: number) => `${listboxId}-option-${index}`;
    const activeOptionId = isOpen && activeOptionIndex >= 0
      ? getOptionId(activeOptionIndex)
      : undefined;

    return (
      <DynFieldContainer
        id={idProp}
        label={label}
        helpText={help}
        required={required}
        optional={optional}
        errorText={resolvedError}
        className={className}
        htmlFor={fieldId}
      >
        <div ref={selectRef} className={getStyleClass('container')}>
          <div
            ref={comboboxRef}
            className={selectClasses}
            onClick={handleToggle}
            onKeyDown={handleComboboxKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={Boolean(resolvedError)}
            aria-disabled={disabled || undefined}
            aria-readonly={readonly || undefined}
            aria-labelledby={labelId}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={activeOptionId}
            aria-describedby={
              resolvedError
                ? `${fieldId}-error`
                : help
                  ? `${fieldId}-help`
                  : undefined
            }
            onBlur={handleBlur}
            onFocus={handleFocus}
          >
            <input
              ref={inputRef}
              type="hidden"
              id={fieldId}
              name={name}
              value={multiple && Array.isArray(value) ? value.join(',') : value || ''}
            />

            <div className={getStyleClass('selectContent')}>
              {multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
                <div className={getStyleClass('tags')}>
                  {selectedOptions.map((option) => (
                    <span key={option.value} className={getStyleClass('tag')}>
                      {option.label}
                      <button
                        type="button"
                        className={getStyleClass('tagRemove')}
                        onClick={(e) => handleRemoveOption(option.value, e)}
                        aria-label={`Remover ${option.label}`}
                      >
                        <DynIcon icon="dyn-icon-close" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className={classNames(getStyleClass('selectText'), {
                  [getStyleClass('selectPlaceholder')]: showPlaceholder
                })}>
                  {getDisplayText()}
                </span>
              )}
            </div>

            <div className={getStyleClass('arrow')}>
              <DynIcon
                icon={loading ? "dyn-icon-loading" : "dyn-icon-arrow-down"}
                className={classNames({
                  [getStyleClass('arrowUp')]: isOpen && !loading
                })}
              />
            </div>
          </div>

          {isOpen && (
            <div className={getStyleClass('dropdown')}>
              {searchable && (
                <div className={getStyleClass('search')}>
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className={getStyleClass('searchInput')}
                    aria-label="Pesquisar opções"
                  />
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div
                  className={getStyleClass('emptyState')}
                  role="status"
                  aria-live="polite"
                >
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhuma opção disponível'}
                </div>
              ) : (
                <div
                  className={getStyleClass('options')}
                  role="listbox"
                  id={listboxId}
                  aria-multiselectable={multiple || undefined}
                >
                  {filteredOptions.map((option, index) => {
                    const isSelected = multiple && Array.isArray(value)
                      ? value.includes(option.value)
                      : value === option.value;
                    const isActive = index === activeOptionIndex;

                    return (
                      <div
                        key={option.value}
                        id={`${listboxId}-option-${optionIndex}`}
                        className={classNames(getStyleClass('option'), {
                          [getStyleClass('optionSelected')]: isSelected,
                          [getStyleClass('optionDisabled')]: option.disabled,
                          [getStyleClass('optionActive')]: isActive
                        })}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled || undefined}
                        id={getOptionId(index)}
                        data-active={isActive ? 'true' : undefined}
                        onMouseEnter={() => {
                          if (!option.disabled) {
                            setActiveOptionIndex(index);
                          }
                        }}
                        onClick={() => handleOptionSelect(option)}
                        ref={(element) => {
                          optionRefs.current[optionIndex] = element;
                        }}
                      >
                        {multiple && (
                          <span className={classNames(getStyleClass('checkbox'), {
                            [getStyleClass('checkboxChecked')]: isSelected
                          })}>
                            {isSelected && <DynIcon icon="dyn-icon-check" />}
                          </span>
                        )}
                        <span className={getStyleClass('optionText')}>{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </DynFieldContainer>
    );
  }
);

DynSelect.displayName = 'DynSelect';

export default DynSelect;
