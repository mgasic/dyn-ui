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

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

const isSameDay = (a: Date | null, b: Date | null): boolean => {
  if (!a || !b) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const getDateKey = (date: Date): string => {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')]
    .join('-');
};

const getFirstDayOfWeek = (locale: string): number => {
  try {
    const LocaleCtor = (Intl as unknown as { Locale?: typeof Intl.Locale }).Locale;
    if (typeof LocaleCtor === 'function') {
      const localeInstance = new LocaleCtor(locale);
      const weekInfo = (localeInstance as unknown as { weekInfo?: { firstDay?: number } }).weekInfo;
      if (weekInfo && typeof weekInfo.firstDay === 'number') {
        return weekInfo.firstDay % 7;
      }
    }
  } catch {
    // Fallback to heuristics below when Intl.Locale is not available.
  }

  const normalized = locale.toLowerCase();
  if (normalized.startsWith('en-us') || normalized.startsWith('pt')) {
    return 0;
  }

  return 1;
};

const createAccessibleFormatter = (locale: string) => {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'full' });
  } catch {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });
  }
};

const createMonthFormatter = (locale: string) => {
  try {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  } catch {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  }
};

interface CalendarDay {
  date: Date;
  isOutsideMonth: boolean;
  isDisabled: boolean;
}

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

  const [value, setValue] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [liveMessage, setLiveMessage] = useState('');

  const activeDayRef = useRef<HTMLButtonElement | null>(null);

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

  const firstDayOfWeek = useMemo(() => getFirstDayOfWeek(locale), [locale]);
  const accessibleFormatter = useMemo(() => createAccessibleFormatter(locale), [locale]);
  const monthFormatter = useMemo(() => createMonthFormatter(locale), [locale]);
  const today = useMemo(() => startOfDay(new Date()), []);

  const minDateStart = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);
  const maxDateStart = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      const candidate = startOfDay(date).getTime();

      if (minDateStart && candidate < minDateStart.getTime()) {
        return true;
      }

      if (maxDateStart && candidate > maxDateStart.getTime()) {
        return true;
      }

      return false;
    },
    [minDateStart, maxDateStart]
  );

  const clampDateToRange = useCallback(
    (date: Date) => {
      let candidate = startOfDay(date);

      if (minDateStart && candidate.getTime() < minDateStart.getTime()) {
        candidate = new Date(minDateStart);
      }

      if (maxDateStart && candidate.getTime() > maxDateStart.getTime()) {
        candidate = new Date(maxDateStart);
      }

      return candidate;
    },
    [minDateStart, maxDateStart]
  );

  const getFirstFocusableDay = useCallback(
    (monthDate: Date) => {
      const firstOfMonth = startOfMonth(monthDate);

      for (let dayOffset = 0; dayOffset < 31; dayOffset += 1) {
        const candidate = new Date(firstOfMonth);
        candidate.setDate(firstOfMonth.getDate() + dayOffset);

        if (candidate.getMonth() !== firstOfMonth.getMonth()) {
          break;
        }

        if (!isDateDisabled(candidate)) {
          return candidate;
        }
      }

      return null;
    },
    [isDateDisabled]
  );

  const parseExternalValue = useCallback(
    (input: DynDatePickerProps['value']): Date | null => {
      if (!input) {
        return null;
      }

      const candidate = input instanceof Date ? input : new Date(input);
      return isValidDate(candidate) ? candidate : null;
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
    if (nextValue) {
      const normalized = startOfDay(nextValue);
      setCurrentMonth(prev => {
        const nextMonth = startOfMonth(normalized);
        return prev.getTime() === nextMonth.getTime() ? prev : nextMonth;
      });
      setActiveDate(normalized);
    }
  }, [propValue, formatDate, parseExternalValue, setDisplayValue]);

  const calendarDays = useMemo(() => {
    const firstOfMonth = startOfMonth(currentMonth);
    const start = new Date(firstOfMonth);
    const offset = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;
    start.setDate(firstOfMonth.getDate() - offset);

    const days: CalendarDay[] = [];
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      days.push({
        date,
        isOutsideMonth: date.getMonth() !== firstOfMonth.getMonth(),
        isDisabled: isDateDisabled(date),
      });
    }

    return days;
  }, [currentMonth, firstDayOfWeek, isDateDisabled]);

  const weekdayLabels = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
      const reference = new Date(Date.UTC(2024, 0, 7));
      const labels: string[] = [];

      for (let index = 0; index < 7; index += 1) {
        const date = new Date(reference);
        const diff = ((firstDayOfWeek + index) % 7) - reference.getUTCDay();
        date.setUTCDate(reference.getUTCDate() + diff);
        labels.push(formatter.format(date));
      }

      return labels;
    } catch {
      return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    }
  }, [firstDayOfWeek, locale]);

  const canGoPrev = useMemo(() => {
    if (!minDateStart) {
      return true;
    }

    const lastDayOfPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    return !isDateDisabled(lastDayOfPrevMonth);
  }, [currentMonth, isDateDisabled, minDateStart]);

  const canGoNext = useMemo(() => {
    if (!maxDateStart) {
      return true;
    }

    const firstDayOfNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return !isDateDisabled(firstDayOfNextMonth);
  }, [currentMonth, isDateDisabled, maxDateStart]);

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

  useEffect(() => {
    if (!isOpen) {
      activeDayRef.current = null;
      setLiveMessage('');
      return;
    }

    if (activeDate && !isDateDisabled(activeDate)) {
      setCurrentMonth(prev => {
        const monthDate = startOfMonth(activeDate);
        return prev.getTime() === monthDate.getTime() ? prev : monthDate;
      });
      return;
    }

    const preferredValue = value && !isDateDisabled(value) ? startOfDay(value) : null;
    let baselineMonth = preferredValue ? startOfMonth(preferredValue) : startOfMonth(currentMonth);
    let focusTarget = preferredValue;

    if (!focusTarget) {
      const todayCandidate = !isDateDisabled(today) ? today : null;
      if (todayCandidate) {
        focusTarget = todayCandidate;
        baselineMonth = startOfMonth(todayCandidate);
      }
    }

    if (!focusTarget) {
      focusTarget = getFirstFocusableDay(baselineMonth);
    }

    if (!focusTarget) {
      focusTarget = clampDateToRange(new Date());
    }

    const normalizedTarget = clampDateToRange(focusTarget);
    setCurrentMonth(prev => {
      const monthDate = startOfMonth(normalizedTarget);
      return prev.getTime() === monthDate.getTime() ? prev : monthDate;
    });
    setActiveDate(normalizedTarget);
  }, [
    activeDate,
    clampDateToRange,
    currentMonth,
    getFirstFocusableDay,
    isDateDisabled,
    isOpen,
    today,
    value,
  ]);

  useEffect(() => {
    if (isOpen && activeDate) {
      setLiveMessage(accessibleFormatter.format(activeDate));
    }
  }, [activeDate, accessibleFormatter, isOpen]);

  useEffect(() => {
    if (isOpen && activeDayRef.current) {
      activeDayRef.current.focus();
    }
  }, [activeDate, isOpen]);

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
      const normalizedValue = nextValue ? startOfDay(nextValue) : null;

      setValue(normalizedValue);
      setDisplayValue(normalizedValue ? formatDate(normalizedValue) : '');
      if (normalizedValue) {
        const monthDate = startOfMonth(normalizedValue);
        setCurrentMonth(prev => (prev.getTime() === monthDate.getTime() ? prev : monthDate));
        setActiveDate(normalizedValue);
      } else {
        setActiveDate(null);
      }
      onChange?.(normalizedValue);
    },
    [formatDate, onChange, setDisplayValue]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setDisplayValue(inputValue);

      const parsedDate = parseDate(inputValue);
      if (parsedDate && isValidDate(parsedDate)) {
        if (minDate && parsedDate < minDate) {
          return;
        }
        if (maxDate && parsedDate > maxDate) {
          return;
        }

        emitChange(parsedDate);
        clearError();
      } else if (!inputValue) {
        emitChange(null);
        clearError();
      }
    },
    [parseDate, isValidDate, minDate, maxDate, emitChange, clearError]
  );

  const focusDate = useCallback(
    (target: Date) => {
      const normalized = clampDateToRange(target);
      if (isDateDisabled(normalized)) {
        return;
      }

      setCurrentMonth(prev => {
        const monthDate = startOfMonth(normalized);
        return prev.getTime() === monthDate.getTime() ? prev : monthDate;
      });
      setActiveDate(normalized);
    },
    [clampDateToRange, isDateDisabled]
  );

  const handleDaySelection = useCallback(
    (day: Date) => {
      if (isDateDisabled(day)) {
        return;
      }

      const normalized = clampDateToRange(day);
      emitChange(normalized);
      clearError();
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [clampDateToRange, clearError, emitChange, isDateDisabled]
  );

  const handleMonthNavigation = useCallback(
    (offset: number) => {
      if ((offset < 0 && !canGoPrev) || (offset > 0 && !canGoNext)) {
        return;
      }

      setCurrentMonth(prevMonth => {
        const nextMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + offset, 1);
        const focusTarget = getFirstFocusableDay(nextMonth) ?? clampDateToRange(nextMonth);
        const normalized = clampDateToRange(focusTarget);
        setActiveDate(normalized);
        return startOfMonth(normalized);
      });
    },
    [canGoNext, canGoPrev, clampDateToRange, getFirstFocusableDay]
  );

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, day: Date) => {
      switch (event.key) {
        case 'Enter':
        case ' ': {
          event.preventDefault();
          handleDaySelection(day);
          break;
        }
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
          event.preventDefault();
          const movementMap: Record<string, number> = {
            ArrowUp: -7,
            ArrowDown: 7,
            ArrowLeft: -1,
            ArrowRight: 1,
          };
          const delta = movementMap[event.key];
          const nextDate = new Date(day);
          nextDate.setDate(day.getDate() + delta);
          focusDate(nextDate);
          break;
        }
        case 'Home': {
          event.preventDefault();
          const weekdayIndex = (day.getDay() - firstDayOfWeek + 7) % 7;
          const nextDate = new Date(day);
          nextDate.setDate(day.getDate() - weekdayIndex);
          focusDate(nextDate);
          break;
        }
        case 'End': {
          event.preventDefault();
          const weekdayIndex = (day.getDay() - firstDayOfWeek + 7) % 7;
          const nextDate = new Date(day);
          nextDate.setDate(day.getDate() + (6 - weekdayIndex));
          focusDate(nextDate);
          break;
        }
        case 'PageUp': {
          event.preventDefault();
          handleMonthNavigation(-1);
          break;
        }
        case 'PageDown': {
          event.preventDefault();
          handleMonthNavigation(1);
          break;
        }
        case 'Escape': {
          event.preventDefault();
          setIsOpen(false);
          inputRef.current?.focus();
          break;
        }
        default:
          break;
      }
    },
    [focusDate, firstDayOfWeek, handleDaySelection, handleMonthNavigation]
  );

  const handleCalendarToggle = useCallback(() => {
    if (disabled || readonly) {
      return;
    }

    setIsOpen(prev => {
      const next = !prev;
      if (!next) {
        inputRef.current?.focus();
      }
      return next;
    });
  }, [disabled, readonly]);

  const handleTodayClick = useCallback(() => {
    handleDaySelection(new Date());
  }, [handleDaySelection]);

  const handleClearClick = useCallback(() => {
    emitChange(null);
    clearError();
    setIsOpen(false);
    inputRef.current?.focus();
  }, [clearError, emitChange]);

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

  const monthLabel = monthFormatter.format(currentMonth);
  const monthLabelId = `${dropdownId}-month`;

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
          <div id={dropdownId} className={styles.dropdown} role="dialog" aria-modal="false">
            <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
              {liveMessage}
            </div>

            <div className={styles.shortcuts}>
              <button type="button" className={styles.shortcut} onClick={handleTodayClick}>
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
                  onClick={() => handleMonthNavigation(-1)}
                  aria-label="Mês anterior"
                  disabled={!canGoPrev}
                >
                  ‹
                </button>
                <div id={monthLabelId} className={styles.monthLabel} aria-live="polite">
                  {monthLabel}
                </div>
                <button
                  type="button"
                  className={styles.monthButton}
                  onClick={() => handleMonthNavigation(1)}
                  aria-label="Próximo mês"
                  disabled={!canGoNext}
                >
                  ›
                </button>
              </div>

              <div className={styles.weekdayRow} role="row">
                {weekdayLabels.map((weekday, index) => (
                  <div key={`${weekday}-${index}`} className={styles.weekday} role="columnheader" aria-label={weekday}>
                    {weekday}
                  </div>
                ))}
              </div>

              <div className={styles.calendarGrid} role="grid" aria-labelledby={monthLabelId}>
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <div key={weekIndex} className={styles.weekRow} role="row">
                    {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(day => {
                      const isSelected = isSameDay(value, day.date);
                      const isActive = isSameDay(activeDate, day.date);
                      const isToday = isSameDay(today, day.date);
                      const dayClasses = cn(
                        styles.day,
                        day.isOutsideMonth && styles.dayOutside,
                        day.isDisabled && styles.dayDisabled,
                        isSelected && styles.daySelected,
                        isActive && styles.dayActive,
                        isToday && styles.dayToday
                      );

                      return (
                        <button
                          key={getDateKey(day.date)}
                          type="button"
                          className={dayClasses}
                          role="gridcell"
                          aria-selected={isSelected}
                          aria-disabled={day.isDisabled || undefined}
                          aria-current={isToday ? 'date' : undefined}
                          aria-label={accessibleFormatter.format(day.date)}
                          tabIndex={isActive && !day.isDisabled ? 0 : -1}
                          data-date={getDateKey(day.date)}
                          disabled={day.isDisabled}
                          onClick={() => handleDaySelection(day.date)}
                          onKeyDown={event => handleDayKeyDown(event, day.date)}
                          ref={node => {
                            if (isActive) {
                              activeDayRef.current = node;
                            } else if (activeDayRef.current === node) {
                              activeDayRef.current = null;
                            }
                          }}
                        >
                          {day.date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                ))}
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
