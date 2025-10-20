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
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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

    const handleToggle = () => {
      if (!disabled && !readonly) {
        setIsOpen(prev => !prev);
        if (!isOpen) {
          inputRef.current?.focus();
        }
      }
    };

    const handleOptionSelect = (option: SelectOption) => {
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true);
          }
          break;
        default:
          break;
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
                  {filteredOptions.map((option) => {
                    const isSelected = multiple && Array.isArray(value)
                      ? value.includes(option.value)
                      : value === option.value;

                    return (
                      <div
                        key={option.value}
                        className={classNames(getStyleClass('option'), {
                          [getStyleClass('optionSelected')]: isSelected,
                          [getStyleClass('optionDisabled')]: option.disabled
                        })}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled || undefined}
                        onClick={() => handleOptionSelect(option)}
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
