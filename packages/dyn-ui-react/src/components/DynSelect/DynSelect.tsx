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
import { DynSelectOption } from '../DynSelectOption';
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
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const selectRef = useRef<HTMLDivElement>(null);
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
      focus: () => inputRef.current?.focus(),
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

    const focusOption = (index: number) => {
      setActiveIndex(index);
    };

    const findNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
      if (filteredOptions.length === 0) return -1;

      let current = startIndex;
      for (let i = 0; i < filteredOptions.length; i += 1) {
        if (current === -1) {
          current = direction === 1 ? 0 : filteredOptions.length - 1;
        } else {
          current = (current + direction + filteredOptions.length) % filteredOptions.length;
        }

        const option = filteredOptions[current];
        if (!option.disabled) {
          return current;
        }
      }
      return -1;
    };

    const findFirstEnabledIndex = () => findNextEnabledIndex(filteredOptions.length - 1, 1);
    const findLastEnabledIndex = () => findNextEnabledIndex(0, -1);

    useEffect(() => {
      if (!isOpen) {
        focusOption(-1);
        typeaheadRef.current = '';
        if (typeaheadTimeoutRef.current) {
          clearTimeout(typeaheadTimeoutRef.current);
          typeaheadTimeoutRef.current = null;
        }
        return;
      }

      const hasValidActive =
        activeIndex !== -1 &&
        activeIndex < filteredOptions.length &&
        !filteredOptions[activeIndex]?.disabled;

      if (hasValidActive) {
        return;
      }

      let nextIndex = -1;

      if (multiple && Array.isArray(value) && value.length > 0) {
        nextIndex = filteredOptions.findIndex(
          option => value.includes(option.value) && !option.disabled
        );
      } else if (!multiple && value) {
        nextIndex = filteredOptions.findIndex(
          option => option.value === value && !option.disabled
        );
      }

      if (nextIndex === -1) {
        nextIndex = findFirstEnabledIndex();
      }

      focusOption(nextIndex);
    }, [activeIndex, filteredOptions, isOpen, multiple, value]);

    useEffect(() => {
      if (!isOpen) return;

      if (filteredOptions.length === 0) {
        focusOption(-1);
        return;
      }

      if (activeIndex >= filteredOptions.length) {
        focusOption(findLastEnabledIndex());
        return;
      }

      if (activeIndex === -1 || filteredOptions[activeIndex]?.disabled) {
        const next = findNextEnabledIndex(activeIndex, 1);
        focusOption(next);
      }
    }, [activeIndex, filteredOptions, isOpen]);

    useEffect(() => {
      optionRefs.current = optionRefs.current.slice(0, filteredOptions.length);
    }, [filteredOptions.length]);

    useEffect(() => {
      if (isOpen && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
      }
    }, [activeIndex, isOpen]);

    const handleToggle = () => {
      if (!disabled && !readonly) {
        setIsOpen(prev => !prev);
        if (!isOpen) {
          inputRef.current?.focus();
        }
      }
    };

    const handleOptionSelect = (
      option: SelectOption,
      _event?: React.MouseEvent<HTMLDivElement>
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

    const handleTypeahead = (key: string) => {
      const cleanedKey = key.toLowerCase();
      typeaheadRef.current = `${typeaheadRef.current}${cleanedKey}`;

      const query = typeaheadRef.current;
      const startIndex = activeIndex >= 0 ? activeIndex : -1;

      const matchFromIndex = (index: number) => {
        for (let i = index + 1; i < filteredOptions.length; i += 1) {
          const option = filteredOptions[i];
          if (!option.disabled && option.label.toLowerCase().startsWith(query)) {
            return i;
          }
        }
        return -1;
      };

      let matchIndex = matchFromIndex(startIndex);
      if (matchIndex === -1) {
        matchIndex = matchFromIndex(-1);
      }

      if (matchIndex !== -1) {
        focusOption(matchIndex);
      }

      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
      typeaheadTimeoutRef.current = setTimeout(() => {
        typeaheadRef.current = '';
        typeaheadTimeoutRef.current = null;
      }, 500);
    };

    const openListbox = () => {
      if (!isOpen) {
        setIsOpen(true);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || readonly) return;

      const { key } = e;
      const isPrintableKey = key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

      switch (key) {
        case 'ArrowDown': {
          e.preventDefault();
          const wasOpen = isOpen;
          openListbox();
          if (!wasOpen) {
            focusOption(findFirstEnabledIndex());
            break;
          }
          const next = findNextEnabledIndex(activeIndex, 1);
          focusOption(next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const wasOpen = isOpen;
          openListbox();
          if (!wasOpen) {
            focusOption(findLastEnabledIndex());
            break;
          }
          const prev = findNextEnabledIndex(activeIndex, -1);
          focusOption(prev);
          break;
        }
        case 'Home': {
          e.preventDefault();
          const wasOpen = isOpen;
          openListbox();
          const firstIndex = findFirstEnabledIndex();
          focusOption(firstIndex);
          if (!wasOpen) {
            break;
          }
          break;
        }
        case 'End': {
          e.preventDefault();
          const wasOpen = isOpen;
          openListbox();
          const lastIndex = findLastEnabledIndex();
          focusOption(lastIndex);
          if (!wasOpen) {
            break;
          }
          break;
        }
        case 'PageDown': {
          e.preventDefault();
          const wasOpen = isOpen;
          openListbox();
          if (!wasOpen) {
            focusOption(findFirstEnabledIndex());
            break;
          }
          if (filteredOptions.length === 0) break;
          const step = Math.max(Math.floor(filteredOptions.length / 10), 1);
          let target = activeIndex;
          for (let i = 0; i < step; i += 1) {
            const next = findNextEnabledIndex(target, 1);
            if (next === -1) break;
            target = next;
          }
          focusOption(target);
          break;
        }
        case 'PageUp': {
          e.preventDefault();
          const wasOpen = isOpen;
          openListbox();
          if (!wasOpen) {
            focusOption(findLastEnabledIndex());
            break;
          }
          if (filteredOptions.length === 0) break;
          const step = Math.max(Math.floor(filteredOptions.length / 10), 1);
          let target = activeIndex;
          for (let i = 0; i < step; i += 1) {
            const prev = findNextEnabledIndex(target, -1);
            if (prev === -1) break;
            target = prev;
          }
          focusOption(target);
          break;
        }
        case 'Enter':
        case ' ': {
          if (!isOpen) {
            e.preventDefault();
            openListbox();
            break;
          }

          e.preventDefault();
          if (activeIndex >= 0) {
            const option = filteredOptions[activeIndex];
            if (option) {
              handleOptionSelect(option);
            }
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            setSearchTerm('');
          }
          break;
        }
        default: {
          if (isPrintableKey) {
            e.preventDefault();
            openListbox();
            handleTypeahead(key);
          }
          break;
        }
      }
    };

    if (!visible) return null;

    const resolvedError = errorMessage ?? (error || undefined);

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
            className={selectClasses}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={Boolean(resolvedError)}
            aria-disabled={disabled || undefined}
            aria-readonly={readonly || undefined}
            aria-labelledby={labelId}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              isOpen && activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
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
                  {filteredOptions.map((option, optionIndex) => {
                    const isSelected = multiple && Array.isArray(value)
                      ? value.includes(option.value)
                      : value === option.value;
                    const isActive = optionIndex === activeIndex;

                    return (
                      <DynSelectOption
                        key={option.value}
                        id={`${listboxId}-option-${optionIndex}`}
                        option={option}
                        multiple={multiple}
                        isSelected={isSelected}
                        isActive={isActive}
                        onSelect={handleOptionSelect}
                        onActivate={() => focusOption(optionIndex)}
                        ref={(element) => {
                          optionRefs.current[optionIndex] = element;
                        }}
                      />
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
