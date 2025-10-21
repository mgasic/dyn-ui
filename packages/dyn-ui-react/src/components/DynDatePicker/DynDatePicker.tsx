/**
 * DynDatePicker - Advanced date picker with custom parsing
 * Part of DYN UI Form Components Group - SCOPE 6
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '../../utils/classNames';
import type { DynDatePickerProps, DynFieldRef, InputSize } from '../../types/field.types';
import { DynFieldContainer } from '../DynFieldContainer';
import { useDynFieldValidation } from '../../hooks/useDynFieldValidation';
import { useDynDateParser } from '../../hooks/useDynDateParser';
import { DynIcon } from '../DynIcon';
import styles from './DynDatePicker.module.css';

const MAX_DATE_LENGTH = 10;

const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const startOfMonth = (date: Date): Date => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  return monthStart;
};

const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setDate(date.getDate() + amount);
  return normalizeDate(next);
};

const addMonths = (date: Date, amount: number): Date => {
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  next.setHours(0, 0, 0, 0);
  return next;
};

const formatISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekStartsOn = (locale: string): number => {
  if (typeof Intl !== 'undefined' && 'Locale' in Intl) {
    try {
      const localeData = new Intl.Locale(locale);
      if (localeData.weekInfo?.firstDay) {
        return localeData.weekInfo.firstDay % 7;
      }
    } catch {
      // Ignore and fallback below
    }
  }

  return locale === 'en-US' ? 0 : 1;
};

const isBeforeMonth = (monthDate: Date, boundary: Date): boolean => {
  if (!boundary) {
    return false;
  }
  const normalizedMonth = startOfMonth(monthDate);
  const normalizedBoundary = startOfMonth(boundary);
  if (normalizedMonth.getFullYear() < normalizedBoundary.getFullYear()) {
    return true;
  }
  if (normalizedMonth.getFullYear() > normalizedBoundary.getFullYear()) {
    return false;
  }
  return normalizedMonth.getMonth() < normalizedBoundary.getMonth();
};

const isAfterMonth = (monthDate: Date, boundary: Date): boolean => {
  if (!boundary) {
    return false;
  }
  const normalizedMonth = startOfMonth(monthDate);
  const normalizedBoundary = startOfMonth(boundary);
  if (normalizedMonth.getFullYear() > normalizedBoundary.getFullYear()) {
    return true;
  }
  if (normalizedMonth.getFullYear() < normalizedBoundary.getFullYear()) {
    return false;
  }
  return normalizedMonth.getMonth() > normalizedBoundary.getMonth();
};

const sizeClassMap: Record<InputSize, string | undefined> = {
  small: styles.sizeSmall,
  medium: undefined,
  large: styles.sizeLarge,
};

export const DynDatePicker = forwardRef<DynFieldRef, DynDatePickerProps>((props, ref) => {
  const {
    id: idProp,
    name,
    label,
    help,
    placeholder = 'dd/mm/aaaa',
    disabled = false,
    readonly = false,
    required = false,
    optional = false,
    visible = true,
    value: propValue,
    errorMessage,
    validation,
    className,
    format = 'dd/MM/yyyy',
    locale = 'pt-BR',
    minDate,
    maxDate,
    customParser,
    size = 'medium',
    onChange,
    onBlur,
    onFocus,
    children: _children,
    'data-testid': dataTestId,
    ...rest
  } = props;

  const instanceId = useId();
  const inputId = idProp ?? name ?? instanceId;
  const dropdownId = `${inputId}-dropdown`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarGridRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const today = useMemo(() => normalizeDate(new Date()), []);

  const normalizedMinDate = useMemo(() => (minDate ? normalizeDate(minDate) : null), [minDate]);
  const normalizedMaxDate = useMemo(() => (maxDate ? normalizeDate(maxDate) : null), [maxDate]);

  const clampToRange = useCallback(
    (date: Date): Date => {
      let next = normalizeDate(date);
      if (normalizedMinDate && next < normalizedMinDate) {
        next = new Date(normalizedMinDate);
      }
      if (normalizedMaxDate && next > normalizedMaxDate) {
        next = new Date(normalizedMaxDate);
      }
      return next;
    },
    [normalizedMinDate, normalizedMaxDate]
  );

  const [focusedDate, setFocusedDate] = useState<Date>(() => clampToRange(today));
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(clampToRange(today)));

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      const normalized = normalizeDate(date);
      if (normalizedMinDate && normalized < normalizedMinDate) {
        return true;
      }
      if (normalizedMaxDate && normalized > normalizedMaxDate) {
        return true;
      }
      return false;
    },
    [normalizedMinDate, normalizedMaxDate]
  );

  const clampMonthToRange = useCallback(
    (month: Date): Date => {
      if (normalizedMinDate && isBeforeMonth(month, normalizedMinDate)) {
        return startOfMonth(normalizedMinDate);
      }
      if (normalizedMaxDate && isAfterMonth(month, normalizedMaxDate)) {
        return startOfMonth(normalizedMaxDate);
      }
      return month;
    },
    [normalizedMinDate, normalizedMaxDate]
  );

  const { error, validate, clearError } = useDynFieldValidation({
    value,
    ...(required ? { required } : {}),
    ...(validation ? { validation } : {}),
  });

  const {
    displayValue,
    setDisplayValue,
    formatDate,
    parseDate,
    isValidDate,
    getRelativeDescription,
  } = useDynDateParser({
    format,
    locale,
    ...(customParser ? { customParser } : {}),
  });

  const parseExternalValue = useCallback(
    (input: DynDatePickerProps['value']): Date | null => {
      if (!input) {
        return null;
      }

      const candidate = input instanceof Date ? input : new Date(input);
      return isValidDate(candidate) ? normalizeDate(candidate) : null;
    },
    [isValidDate]
  );

  useEffect(() => {
    const nextValue = parseExternalValue(propValue);
    setValue(prev => {
      const prevTime = prev?.getTime();
      const nextTime = nextValue?.getTime();
      return prevTime === nextTime ? prev : nextValue;
    });
    setDisplayValue(nextValue ? formatDate(nextValue) : '');
  }, [propValue, formatDate, parseExternalValue, setDisplayValue]);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isOpen, handleDocumentClick]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    validate: () => validate(),
    clear: () => {
      setValue(null);
      setDisplayValue('');
      onChange?.(null);
      clearError();
    },
    getValue: () => value,
    setValue: (newValue: any) => {
      const nextValue = parseExternalValue(newValue);
      setValue(nextValue);
      setDisplayValue(nextValue ? formatDate(nextValue) : '');
      onChange?.(nextValue);
    },
  }));

  const emitChange = useCallback(
    (nextValue: Date | null) => {
      setValue(nextValue);
      setDisplayValue(nextValue ? formatDate(nextValue) : '');
      onChange?.(nextValue);
    },
    [formatDate, onChange, setDisplayValue]
  );

  const normalizedValue = useMemo(() => (value ? normalizeDate(value) : null), [value]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setDisplayValue(inputValue);

      const parsedDate = parseDate(inputValue);
      if (parsedDate && isValidDate(parsedDate)) {
        const normalizedParsed = normalizeDate(parsedDate);
        if (normalizedMinDate && normalizedParsed < normalizedMinDate) {
          return;
        }
        if (normalizedMaxDate && normalizedParsed > normalizedMaxDate) {
          return;
        }

        emitChange(normalizedParsed);
        clearError();
      } else if (!inputValue) {
        emitChange(null);
        clearError();
      }
    },
    [
      parseDate,
      isValidDate,
      normalizedMinDate,
      normalizedMaxDate,
      emitChange,
      clearError,
    ]
  );

  const handleCalendarToggle = useCallback(() => {
    if (disabled || readonly) {
      return;
    }
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        const base = clampToRange(normalizedValue ?? today);
        setFocusedDate(base);
        setVisibleMonth(startOfMonth(base));
      }
      return next;
    });
    inputRef.current?.focus();
  }, [clampToRange, disabled, normalizedValue, readonly, today]);

  const handleDaySelection = useCallback(
    (selectedDate: Date) => {
      const next = clampToRange(selectedDate);
      if (isDateDisabled(next)) {
        return;
      }
      emitChange(new Date(next));
      clearError();
      setFocusedDate(next);
      setVisibleMonth(startOfMonth(next));
      setIsOpen(false);
      if (!disabled && !readonly) {
        inputRef.current?.focus();
      }
    },
    [clampToRange, clearError, disabled, emitChange, isDateDisabled, readonly]
  );

  const handleTodayClick = useCallback(() => {
    if (isDateDisabled(today)) {
      return;
    }
    handleDaySelection(today);
  }, [handleDaySelection, isDateDisabled, today]);

  const handleClearClick = useCallback(() => {
    emitChange(null);
    clearError();
    inputRef.current?.focus();
  }, [emitChange, clearError]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    validate();
    onBlur?.();
  }, [validate, onBlur]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    clearError();
    onFocus?.();
  }, [clearError, onFocus]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case 'Enter':
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true);
            event.preventDefault();
          }
          break;
        case 'Escape':
          if (isOpen) {
            setIsOpen(false);
            event.preventDefault();
          }
          break;
        default:
          break;
      }
    },
    [isOpen]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const base = clampToRange(normalizedValue ?? today);
    setFocusedDate(base);
    setVisibleMonth(startOfMonth(base));
  }, [clampToRange, isOpen, normalizedValue, today]);

  useEffect(() => {
    if (!isOpen || !calendarGridRef.current) {
      return;
    }
    const target = calendarGridRef.current.querySelector<HTMLButtonElement>(
      `[data-date="${formatISODate(focusedDate)}"]`
    );
    target?.focus();
  }, [focusedDate, isOpen]);

  const weekStartsOn = useMemo(() => getWeekStartsOn(locale), [locale]);

  const moveFocusBy = useCallback(
    (amount: number) => {
      setFocusedDate(prev => {
        const reference = prev ?? clampToRange(today);
        let next = addDays(reference, amount);
        next = clampToRange(next);
        const direction = amount >= 0 ? 1 : -1;
        let guard = 0;
        while (isDateDisabled(next) && guard < 31) {
          const boundary = direction > 0 ? normalizedMaxDate : normalizedMinDate;
          if (boundary && next.getTime() === boundary.getTime()) {
            return prev ?? reference;
          }
          next = addDays(next, direction);
          guard += 1;
        }
        setVisibleMonth(startOfMonth(next));
        return next;
      });
    },
    [clampToRange, isDateDisabled, normalizedMaxDate, normalizedMinDate, today]
  );

  const focusStartOfWeek = useCallback(() => {
    setFocusedDate(prev => {
      const reference = prev ?? clampToRange(today);
      const currentDay = reference.getDay();
      const diff = (currentDay - weekStartsOn + 7) % 7;
      const next = clampToRange(addDays(reference, -diff));
      if (!isDateDisabled(next)) {
        setVisibleMonth(startOfMonth(next));
        return next;
      }
      return prev ?? reference;
    });
  }, [clampToRange, isDateDisabled, today, weekStartsOn]);

  const focusEndOfWeek = useCallback(() => {
    setFocusedDate(prev => {
      const reference = prev ?? clampToRange(today);
      const currentDay = reference.getDay();
      const diff = 6 - ((currentDay - weekStartsOn + 7) % 7);
      const next = clampToRange(addDays(reference, diff));
      if (!isDateDisabled(next)) {
        setVisibleMonth(startOfMonth(next));
        return next;
      }
      return prev ?? reference;
    });
  }, [clampToRange, isDateDisabled, today, weekStartsOn]);

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, day: { date: Date; isDisabled: boolean }) => {
      switch (event.key) {
        case 'ArrowUp':
          moveFocusBy(-7);
          event.preventDefault();
          break;
        case 'ArrowDown':
          moveFocusBy(7);
          event.preventDefault();
          break;
        case 'ArrowLeft':
          moveFocusBy(-1);
          event.preventDefault();
          break;
        case 'ArrowRight':
          moveFocusBy(1);
          event.preventDefault();
          break;
        case 'Home':
          focusStartOfWeek();
          event.preventDefault();
          break;
        case 'End':
          focusEndOfWeek();
          event.preventDefault();
          break;
        case 'Enter':
        case ' ': {
          if (!day.isDisabled) {
            handleDaySelection(day.date);
          }
          event.preventDefault();
          break;
        }
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.focus();
          event.preventDefault();
          break;
        default:
          break;
      }
    },
    [focusEndOfWeek, focusStartOfWeek, handleDaySelection, moveFocusBy]
  );

  const weekDayOrder = useMemo(
    () => Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7),
    [weekStartsOn]
  );

  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale]
  );

  const weekDays = useMemo(
    () =>
      weekDayOrder.map(dayIndex => {
        const baseDate = new Date(2021, 7, 1);
        const baseDay = baseDate.getDay();
        baseDate.setDate(baseDate.getDate() - baseDay + dayIndex);
        return weekdayFormatter.format(baseDate);
      }),
    [weekDayOrder, weekdayFormatter]
  );

  const calendarStart = useMemo(() => {
    const firstOfMonth = startOfMonth(visibleMonth);
    const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
    return addDays(firstOfMonth, -offset);
  }, [visibleMonth, weekStartsOn]);

  const calendarDays = useMemo(() => {
    return Array.from({ length: 42 }, (_, index) => {
      const date = addDays(calendarStart, index);
      const iso = formatISODate(date);
      const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
      const isSelected = normalizedValue ? date.getTime() === normalizedValue.getTime() : false;
      const isFocused = date.getTime() === focusedDate.getTime();
      const isToday = date.getTime() === today.getTime();
      const disabledDate = isDateDisabled(date);

      return {
        date,
        iso,
        label: date.getDate(),
        isCurrentMonth,
        isSelected,
        isFocused,
        isToday,
        isDisabled: disabledDate,
      };
    });
  }, [calendarStart, focusedDate, isDateDisabled, normalizedValue, today, visibleMonth]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale]
  );

  const ariaLabelFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [locale]
  );

  const monthLabel = useMemo(() => monthFormatter.format(visibleMonth), [monthFormatter, visibleMonth]);

  const activeDateAnnouncement = useMemo(
    () => (isOpen ? ariaLabelFormatter.format(focusedDate) : ''),
    [ariaLabelFormatter, focusedDate, isOpen]
  );

  const prevMonthDisabled = useMemo(() => {
    if (!normalizedMinDate) {
      return false;
    }
    const prevMonth = addMonths(visibleMonth, -1);
    return isBeforeMonth(prevMonth, normalizedMinDate);
  }, [normalizedMinDate, visibleMonth]);

  const nextMonthDisabled = useMemo(() => {
    if (!normalizedMaxDate) {
      return false;
    }
    const nextMonth = addMonths(visibleMonth, 1);
    return isAfterMonth(nextMonth, normalizedMaxDate);
  }, [normalizedMaxDate, visibleMonth]);

  const todayDisabled = isDateDisabled(today);

  if (!visible) {
    return null;
  }

  const fieldError = errorMessage ?? (error || undefined);

  const inputClasses = cn(
    styles.input,
    sizeClassMap[size],
    focused && styles.stateFocused,
    Boolean(fieldError) && styles.stateError,
    disabled && styles.stateDisabled,
    readonly && styles.stateReadonly,
    isOpen && styles.stateOpen
  );

  const describedBy =
    [
      fieldError ? `${inputId}-error` : null,
      help ? `${inputId}-help` : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const relativeText = useMemo(
    () => (value ? getRelativeDescription(value) : null),
    [value, getRelativeDescription]
  );

  return (
    <DynFieldContainer
      {...(label !== undefined ? { label } : {})}
      {...(help !== undefined ? { helpText: help } : {})}
      {...(required ? { required } : {})}
      {...(optional ? { optional } : {})}
      {...(fieldError ? { errorText: fieldError } : {})}
      {...(className !== undefined ? { className } : {})}
      htmlFor={inputId}
    >
      <div ref={containerRef} className={styles.container} data-testid={dataTestId}>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            id={inputId}
            name={name ?? inputId}
            type="text"
            className={inputClasses}
            placeholder={placeholder}
            value={displayValue}
            disabled={disabled}
            readOnly={readonly}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={describedBy}
            aria-expanded={isOpen}
            aria-controls={isOpen ? dropdownId : undefined}
            maxLength={MAX_DATE_LENGTH}
            data-size={size}
            {...rest}
          />

          <button
            type="button"
            className={styles.calendarButton}
            onClick={handleCalendarToggle}
            disabled={disabled}
            tabIndex={-1}
            aria-label="Abrir calendário"
            aria-expanded={isOpen}
            aria-controls={isOpen ? dropdownId : undefined}
          >
            <DynIcon icon="dyn-icon-calendar" />
          </button>

          {displayValue && !readonly && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearClick}
              tabIndex={-1}
              aria-label="Limpar data"
            >
              <DynIcon icon="dyn-icon-close" />
            </button>
          )}
        </div>

        {relativeText && <div className={styles.relativeText}>{relativeText}</div>}

        {isOpen && (
          <div id={dropdownId} className={styles.dropdown} role="dialog">
            <div className={styles.shortcuts}>
              <button
                type="button"
                className={styles.shortcut}
                onClick={handleTodayClick}
                disabled={todayDisabled}
              >
                Hoje
              </button>
              <button type="button" className={styles.shortcut} onClick={handleClearClick}>
                Limpar
              </button>
            </div>

            <div className={styles.calendarSection}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  className={styles.monthButton}
                  onClick={() => {
                    if (!prevMonthDisabled) {
                      setVisibleMonth(prev => clampMonthToRange(addMonths(prev, -1)));
                      setFocusedDate(prev => {
                        const candidate = new Date(prev ?? clampToRange(today));
                        candidate.setMonth(candidate.getMonth() - 1);
                        return clampToRange(candidate);
                      });
                    }
                  }}
                  aria-label="Previous month"
                  disabled={prevMonthDisabled}
                >
                  ‹
                </button>
                <div className={styles.monthLabel} id={`${dropdownId}-month`}>
                  {monthLabel}
                </div>
                <button
                  type="button"
                  className={styles.monthButton}
                  onClick={() => {
                    if (!nextMonthDisabled) {
                      setVisibleMonth(prev => clampMonthToRange(addMonths(prev, 1)));
                      setFocusedDate(prev => {
                        const candidate = new Date(prev ?? clampToRange(today));
                        candidate.setMonth(candidate.getMonth() + 1);
                        return clampToRange(candidate);
                      });
                    }
                  }}
                  aria-label="Next month"
                  disabled={nextMonthDisabled}
                >
                  ›
                </button>
              </div>

              <div className={styles.weekHeader} aria-hidden>
                {weekDays.map(day => (
                  <span key={day} className={styles.weekday} data-testid="dyn-datepicker-weekday">
                    {day}
                  </span>
                ))}
              </div>

              <div
                ref={calendarGridRef}
                className={styles.calendarGrid}
                role="grid"
                aria-labelledby={`${dropdownId}-month`}
                aria-activedescendant={`${dropdownId}-day-${formatISODate(focusedDate)}`}
              >
                {calendarDays.map(day => (
                  <button
                    key={day.iso}
                    type="button"
                    className={cn(
                      styles.dayButton,
                      !day.isCurrentMonth && styles.dayOutside,
                      day.isToday && styles.dayToday,
                      day.isSelected && styles.daySelected,
                      day.isDisabled && styles.dayDisabled
                    )}
                    role="gridcell"
                    id={`${dropdownId}-day-${day.iso}`}
                    data-date={day.iso}
                    aria-selected={day.isSelected}
                    aria-current={day.isToday ? 'date' : undefined}
                    aria-label={ariaLabelFormatter.format(day.date)}
                    disabled={day.isDisabled}
                    tabIndex={day.isFocused ? 0 : -1}
                    onClick={() => handleDaySelection(day.date)}
                    onKeyDown={event => handleDayKeyDown(event, day)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <div className={styles.srOnly} aria-live="polite">
                {activeDateAnnouncement}
              </div>
            </div>

            <div>
              <div className={styles.helpTitle}>Formatos aceitos:</div>
              <ul className={styles.helpList}>
                <li className={styles.helpListItem}>dd/mm/aaaa (ex: 25/12/2023)</li>
                <li className={styles.helpListItem}>hoje, amanhã, ontem</li>
                <li className={styles.helpListItem}>Texto natural</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DynFieldContainer>
  );
});

DynDatePicker.displayName = 'DynDatePicker';

export default DynDatePicker;
