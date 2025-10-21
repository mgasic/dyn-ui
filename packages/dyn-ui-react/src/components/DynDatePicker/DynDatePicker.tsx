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
// Helper utilities used by the component
const normalizeDate = (date: Date) => startOfDay(date);

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const addMonths = (date: Date, months: number) => {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
};

const isBeforeMonth = (a: Date, b: Date) => {
  return a.getFullYear() < b.getFullYear() || (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth());
};

const isAfterMonth = (a: Date, b: Date) => {
  return a.getFullYear() > b.getFullYear() || (a.getFullYear() === b.getFullYear() && a.getMonth() > b.getMonth());
};

const formatISODate = (date: Date) => getDateKey(date);

const getWeekStartsOn = (locale: string) => getFirstDayOfWeek(locale);

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
  const activeDayRef = useRef<HTMLButtonElement | null>(null);

  const { error, validate, clearError } = useDynFieldValidation({
    value: propValue as any,
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
  } = useDynDateParser({ format, locale, ...(customParser ? { customParser } : {}) });

  // Normalize min/max
  const normalizedMinDate = useMemo(() => (minDate ? normalizeDate(minDate) : null), [minDate]);
  const normalizedMaxDate = useMemo(() => (maxDate ? normalizeDate(maxDate) : null), [maxDate]);

  const today = useMemo(() => startOfDay(new Date()), []);

  // value state
  const [value, setValue] = useState<Date | null>(() => {
    if (!propValue) return null;
    const candidate = propValue instanceof Date ? propValue : new Date(propValue as any);
    return isValidDate(candidate) ? normalizeDate(candidate) : null;
  });

  useEffect(() => {
    const next = propValue ? (propValue instanceof Date ? propValue : new Date(propValue as any)) : null;
    const nextNorm = next && isValidDate(next) ? normalizeDate(next) : null;
    setValue(prev => {
      const prevTime = prev?.getTime();
      const nextTime = nextNorm?.getTime();
      return prevTime === nextTime ? prev : nextNorm;
    });
    setDisplayValue(nextNorm ? formatDate(nextNorm) : '');
  }, [propValue, formatDate, isValidDate, setDisplayValue]);

  const clampDateToRange = useCallback(
    (d: Date) => {
      let candidate = startOfDay(d);
      if (normalizedMinDate && candidate.getTime() < normalizedMinDate.getTime()) candidate = new Date(normalizedMinDate);
      if (normalizedMaxDate && candidate.getTime() > normalizedMaxDate.getTime()) candidate = new Date(normalizedMaxDate);
      return candidate;
    },
    [normalizedMinDate, normalizedMaxDate]
  );

  const isDateDisabled = useCallback(
    (d: Date) => {
      const t = startOfDay(d).getTime();
      if (normalizedMinDate && t < normalizedMinDate.getTime()) return true;
      if (normalizedMaxDate && t > normalizedMaxDate.getTime()) return true;
      return false;
    },
    [normalizedMinDate, normalizedMaxDate]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(clampDateToRange(today)));
  const [focusedDate, setFocusedDate] = useState<Date>(() => clampDateToRange(today));

  const normalizedValue = useMemo(() => (value ? normalizeDate(value) : null), [value]);

  const weekStartsOn = useMemo(() => getWeekStartsOn(locale), [locale]);

  const weekdayFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'short' }), [locale]);

  const weekDayOrder = useMemo(() => Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7), [weekStartsOn]);

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
      const isFocused = focusedDate ? date.getTime() === focusedDate.getTime() : false;
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

  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);
  const monthLabel = useMemo(() => monthFormatter.format(visibleMonth), [monthFormatter, visibleMonth]);

  const accessibleFormatter = useMemo(() => createAccessibleFormatter(locale), [locale]);

  // Navigation availability
  const prevMonthDisabled = useMemo(() => {
    if (!normalizedMinDate) return false;
    const prevMonth = addMonths(visibleMonth, -1);
    return isBeforeMonth(prevMonth, normalizedMinDate);
  }, [normalizedMinDate, visibleMonth]);

  const nextMonthDisabled = useMemo(() => {
    if (!normalizedMaxDate) return false;
    const nextMonth = addMonths(visibleMonth, 1);
    return isAfterMonth(nextMonth, normalizedMaxDate);
  }, [normalizedMaxDate, visibleMonth]);

  const todayDisabled = isDateDisabled(today);

  // Document click to close
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // ensure focused date & visible month when opening
      const base = normalizedValue ?? today;
      const baseClamped = clampDateToRange(base ?? new Date());
      setFocusedDate(baseClamped);
      setVisibleMonth(startOfMonth(baseClamped));
    }
  }, [isOpen, normalizedValue, clampDateToRange, today]);

  useEffect(() => {
    if (isOpen && calendarGridRef.current && focusedDate) {
      const target = calendarGridRef.current.querySelector<HTMLButtonElement>(`[data-date="${formatISODate(focusedDate)}"]`);
      target?.focus();
    }
  }, [isOpen, calendarGridRef, focusedDate]);

  // Imperative handle
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
      const candidate = newValue ? (newValue instanceof Date ? newValue : new Date(newValue)) : null;
      const nextValue = candidate && isValidDate(candidate) ? normalizeDate(candidate) : null;
      setValue(nextValue);
      setDisplayValue(nextValue ? formatDate(nextValue) : '');
      onChange?.(nextValue);
    },
  }));

  const emitChange = useCallback(
    (nextValue: Date | null) => {
      const normalizedVal = nextValue ? startOfDay(nextValue) : null;
      setValue(normalizedVal);
      setDisplayValue(normalizedVal ? formatDate(normalizedVal) : '');
      if (normalizedVal) {
        setVisibleMonth(startOfMonth(normalizedVal));
        setFocusedDate(normalizedVal);
      }
      onChange?.(normalizedVal);
    },
    [formatDate, onChange, setDisplayValue]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setDisplayValue(inputValue);
      const parsed = parseDate(inputValue);
      if (parsed && isValidDate(parsed)) {
        const normalizedParsed = startOfDay(parsed);
        if (normalizedMinDate && normalizedParsed < normalizedMinDate) return;
        if (normalizedMaxDate && normalizedParsed > normalizedMaxDate) return;
        emitChange(normalizedParsed);
        clearError();
      } else if (!inputValue) {
        emitChange(null);
        clearError();
      }
    },
    [parseDate, isValidDate, normalizedMinDate, normalizedMaxDate, emitChange, clearError]
  );

  const handleClearClick = useCallback(() => {
    emitChange(null);
    clearError();
    setIsOpen(false);
    inputRef.current?.focus();
  }, [emitChange, clearError]);

  const handleTodayClick = useCallback(() => {
    const todayClamped = clampDateToRange(new Date());
    emitChange(todayClamped);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [clampDateToRange, emitChange]);

  const handleDaySelection = useCallback(
    (d: Date) => {
      if (isDateDisabled(d)) return;
      const normalized = clampDateToRange(d);
      emitChange(normalized);
      clearError();
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [clampDateToRange, clearError, emitChange, isDateDisabled]
  );

  const handleMonthNavigation = useCallback(
    (offset: number) => {
      const next = addMonths(visibleMonth, offset === 0 ? 0 : offset);
      setVisibleMonth(prev => {
        const candidate = addMonths(prev, offset);
        if (normalizedMinDate && isBeforeMonth(candidate, normalizedMinDate)) return prev;
        if (normalizedMaxDate && isAfterMonth(candidate, normalizedMaxDate)) return prev;
        return candidate;
      });
    },
    [visibleMonth, normalizedMinDate, normalizedMaxDate]
  );

  const moveFocusBy = useCallback(
    (amount: number) => {
      setFocusedDate(prev => {
        const reference = prev ?? clampDateToRange(today);
        let next = addDays(reference, amount);
        next = clampDateToRange(next);
        let guard = 0;
        while (isDateDisabled(next) && guard < 31) {
          next = addDays(next, amount >= 0 ? 1 : -1);
          guard += 1;
        }
        setVisibleMonth(startOfMonth(next));
        return next;
      });
    },
    [clampDateToRange, isDateDisabled, today]
  );

  const focusStartOfWeek = useCallback(() => {
    setFocusedDate(prev => {
      const reference = prev ?? clampDateToRange(today);
      const currentDay = reference.getDay();
      const diff = (currentDay - weekStartsOn + 7) % 7;
      const next = clampDateToRange(addDays(reference, -diff));
      if (!isDateDisabled(next)) {
        setVisibleMonth(startOfMonth(next));
        return next;
      }
      return prev ?? reference;
    });
  }, [clampDateToRange, isDateDisabled, today, weekStartsOn]);

  const focusEndOfWeek = useCallback(() => {
    setFocusedDate(prev => {
      const reference = prev ?? clampDateToRange(today);
      const currentDay = reference.getDay();
      const diff = 6 - ((currentDay - weekStartsOn + 7) % 7);
      const next = clampDateToRange(addDays(reference, diff));
      if (!isDateDisabled(next)) {
        setVisibleMonth(startOfMonth(next));
        return next;
      }
      return prev ?? reference;
    });
  }, [clampDateToRange, isDateDisabled, today, weekStartsOn]);

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
          if (!day.isDisabled) handleDaySelection(day.date);
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
    [moveFocusBy, focusStartOfWeek, focusEndOfWeek, handleDaySelection]
  );

  const handleCalendarToggle = useCallback(() => {
    if (disabled || readonly) return;
    setIsOpen(prev => {
      const next = !prev;
      if (!next) inputRef.current?.focus();
      return next;
    });
  }, [disabled, readonly]);

  const handleInputKeyDown = useCallback(
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

  if (!visible) return null;

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

  const describedBy = [fieldError ? `${inputId}-error` : null, help ? `${inputId}-help` : null].filter(Boolean).join(' ') || undefined;

  const relativeText = useMemo(() => (value ? getRelativeDescription(value) : null), [value, getRelativeDescription]);

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
            onBlur={() => {
              setFocused(false);
              validate();
              onBlur?.();
            }}
            onFocus={() => {
              setFocused(true);
              clearError();
              onFocus?.();
            }}
            onKeyDown={handleInputKeyDown}
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
            <button type="button" className={styles.clearButton} onClick={handleClearClick} tabIndex={-1} aria-label="Limpar data">
              <DynIcon icon="dyn-icon-close" />
            </button>
          )}
        </div>

        {relativeText && <div className={styles.relativeText}>{relativeText}</div>}

        {isOpen && (
          <div id={dropdownId} className={styles.dropdown} role="dialog" aria-modal="false">
            <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
              {focusedDate ? accessibleFormatter.format(focusedDate) : ''}
            </div>

            <div className={styles.shortcuts}>
              <button type="button" className={styles.shortcut} onClick={handleTodayClick} disabled={todayDisabled}>
                Hoje
              </button>
              <button type="button" className={styles.shortcut} onClick={handleClearClick}>
                Limpar
              </button>
            </div>

            <div className={styles.calendarSection}>
              <div className={styles.calendarHeader}>
                <button type="button" className={styles.monthButton} onClick={() => handleMonthNavigation(-1)} aria-label="Mês anterior" disabled={prevMonthDisabled}>
                  ‹
                </button>
                <div className={styles.monthLabel} aria-live="polite">
                  {monthLabel}
                </div>
                <button type="button" className={styles.monthButton} onClick={() => handleMonthNavigation(1)} aria-label="Próximo mês" disabled={nextMonthDisabled}>
                  ›
                </button>
              </div>

              <div className={styles.weekdayRow} role="row">
                {weekDays.map((wd, i) => (
                  <div key={`${wd}-${i}`} className={styles.weekday} role="columnheader" aria-label={wd}>
                    {wd}
                  </div>
                ))}
              </div>

              <div className={styles.calendarGrid} role="grid" aria-labelledby={dropdownId} ref={calendarGridRef}>
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <div key={weekIndex} className={styles.weekRow} role="row">
                    {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(day => {
                      const dayClasses = cn(
                        styles.day,
                        !day.isCurrentMonth && styles.dayOutside,
                        day.isDisabled && styles.dayDisabled,
                        day.isSelected && styles.daySelected,
                        day.isFocused && styles.dayActive,
                        day.isToday && styles.dayToday
                      );

                      return (
                        <button
                          key={day.iso}
                          type="button"
                          className={dayClasses}
                          role="gridcell"
                          aria-selected={day.isSelected}
                          aria-disabled={day.isDisabled || undefined}
                          aria-current={day.isToday ? 'date' : undefined}
                          aria-label={accessibleFormatter.format(day.date)}
                          tabIndex={day.isFocused && !day.isDisabled ? 0 : -1}
                          data-date={day.iso}
                          disabled={day.isDisabled}
                          onClick={() => handleDaySelection(day.date)}
                          onKeyDown={event => handleDayKeyDown(event, day)}
                          ref={node => {
                            if (day.isFocused) {
                              activeDayRef.current = node;
                            } else if (activeDayRef.current === node) {
                              activeDayRef.current = null;
                            }
                          }}
                        >
                          {day.label}
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
