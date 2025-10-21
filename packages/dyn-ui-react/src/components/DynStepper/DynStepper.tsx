import React, { forwardRef, useImperativeHandle, useState, useCallback, useEffect } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import styles from './DynStepper.module.css';
import { DynIcon } from '../DynIcon';
import type { DynStepperProps, DynStepperRef, DynStep, StepItem } from './DynStepper.types';

const getStyleClass = (n: string) => (styles as Record<string, string>)[n] || '';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Convert value to step index
 */
function valueToIndex(value: string | number | undefined, steps: StepItem[]): number {
  if (value === undefined) return 0;

  if (typeof value === 'number') {
    return Math.max(0, Math.min(value, steps.length - 1));
  }

  // String value - find by step id
  const index = steps.findIndex(step => step.id === value);
  return index >= 0 ? index : 0;
}

/**
 * DynStepper — standardized: ids, a11y, predictable events, linear/non-linear.
 * Complete implementation with backward compatibility for legacy value/defaultValue props.
 */
export const DynStepper = forwardRef<DynStepperRef, DynStepperProps>(
  (
    {
      steps = [],
      // New API
      activeStep: controlledActiveStep,
      defaultActiveStep = 0,
      // Legacy API - maintain backward compatibility
      value: controlledValue,
      defaultValue = 0,
      // Common props
      linear = true,
      onChange,
      onStepChange,
      onStepClick,
      clickableSteps = true,
  orientation = 'horizontal',
  variant = 'tabs',
      size = 'medium',
  showLabels = true,
  showDescription = false,
      className,
      contentClassName,
      renderStepContent,
      renderStepIcon,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'data-testid': dataTestId,
      stepClassName,
      ...rest
    },
    ref
  ) => {
    const [internalId] = useState(() => id || generateId('stepper'));

    // Determine controlled state and initial value with proper priority:
    // 1. activeStep (new API) takes precedence
    // 2. value (legacy API) as fallback
    // 3. defaultActiveStep (new API default)
    // 4. defaultValue (legacy API default)
    const isControlledByActiveStep = controlledActiveStep !== undefined;
    const isControlledByValue = controlledValue !== undefined;
    const isControlled = isControlledByActiveStep || isControlledByValue;

    const getInitialStep = () => {
      if (isControlledByActiveStep) return controlledActiveStep;
      if (isControlledByValue) return valueToIndex(controlledValue, steps);
      if (defaultActiveStep !== 0) return defaultActiveStep;
      return valueToIndex(defaultValue, steps);
    };

    const [internalActiveStep, setInternalActiveStep] = useState(getInitialStep);

    // Get current active step with proper priority
    const getCurrentActiveStep = () => {
      if (isControlledByActiveStep) return controlledActiveStep as number;
      if (isControlledByValue) return valueToIndex(controlledValue, steps);
      return internalActiveStep;
    };

    const activeStep = getCurrentActiveStep();

    // Handle controlled value changes (both new and legacy API)
    useEffect(() => {
      if (isControlledByActiveStep) {
        // New API - direct numeric control
        return; // activeStep is already handled above
      }
      if (isControlledByValue) {
        // Legacy API - value can be string (step id) or number (index)
        const newIndex = valueToIndex(controlledValue, steps);
        if (newIndex !== internalActiveStep) {
          setInternalActiveStep(newIndex);
        }
      }
    }, [controlledValue, isControlledByActiveStep, isControlledByValue, steps, internalActiveStep]);

    if (!steps || steps.length === 0) return null;

    const maxIndex = steps.length - 1;
    const clampedActiveStep = clamp(activeStep, 0, maxIndex);

    // Enhanced change handler that supports both APIs
    const notifyChange = useCallback((newIndex: number, step: StepItem) => {
      // Call legacy onChange with both value formats
      if (onChange) {
        if (isControlledByValue && typeof controlledValue === 'string') {
          // If controlled by string value, callback with step id
          onChange(step.id, step, newIndex);
        } else {
          // Otherwise callback with numeric index
          onChange(newIndex, step, newIndex);
        }
      }

      // Call legacy onStepChange
      onStepChange?.(newIndex, step);
    }, [onChange, onStepChange, controlledValue, isControlledByValue]);

    // Imperative API methods
    const nextStep = useCallback((): boolean => {
      if (clampedActiveStep >= steps.length - 1) return false;

      const newStep = clampedActiveStep + 1;
      if (!isControlled) setInternalActiveStep(newStep);
      notifyChange(newStep, steps[newStep]);
      return true;
    }, [clampedActiveStep, steps.length, isControlled, notifyChange, steps]);

    const prevStep = useCallback((): boolean => {
      if (clampedActiveStep <= 0) return false;

      const newStep = clampedActiveStep - 1;
      if (!isControlled) setInternalActiveStep(newStep);
      notifyChange(newStep, steps[newStep]);
      return true;
    }, [clampedActiveStep, isControlled, notifyChange, steps]);

    const goToStep = useCallback((stepIndex: number): boolean => {
      const clampedIndex = clamp(stepIndex, 0, maxIndex);
      if (linear && clampedIndex > clampedActiveStep + 1) return false;
      if (isStepDisabled(clampedIndex)) return false;

      if (!isControlled) setInternalActiveStep(clampedIndex);
      notifyChange(clampedIndex, steps[clampedIndex]);
      return true;
    }, [clampedActiveStep, maxIndex, linear, isControlled, notifyChange, steps]);

    const getCurrentStep = useCallback((): number => {
      return clampedActiveStep;
    }, [clampedActiveStep]);

    const getStepData = useCallback((stepIndex: number): StepItem | undefined => {
      return steps[stepIndex];
    }, [steps]);

    const validateStep = useCallback((stepIndex: number): boolean => {
      const step = steps[stepIndex];
      if (!step) return false;

      // Use custom validator if provided
      if (step.validator) {
        return step.validator(step);
      }

      // Default validation
      return !step.error && !step.disabled;
    }, [steps]);

    const completeStep = useCallback((stepIndex: number): void => {
      const step = steps[stepIndex];
      if (step) {
        step.completed = true;
        step.status = 'completed';
        step.state = 'completed';
      }
    }, [steps]);

    const errorStep = useCallback((stepIndex: number, hasError: boolean): void => {
      const step = steps[stepIndex];
      if (step) {
        step.error = hasError;
        step.status = hasError ? 'error' : 'inactive';
        step.state = hasError ? 'error' : 'pending';
      }
    }, [steps]);

    useImperativeHandle(ref, () => ({
      nextStep,
      prevStep,
      goToStep,
      getCurrentStep,
      getStepData,
      validateStep,
      completeStep,
      errorStep,
    }), [nextStep, prevStep, goToStep, getCurrentStep, getStepData, validateStep, completeStep, errorStep]);

    // Helper functions
    const isStepDisabled = (index: number): boolean => {
      const step = steps[index];
      if (step?.disabled) return true;
      if (linear && index > clampedActiveStep + 1) return true;
      return false;
    };

    const getRootRole = () => {
      if (variant === 'tabs') return 'tablist';
      return 'group';
    };

    const getRootClassName = () => {
      const classes = [getStyleClass('root')];

      // Add semantic classes for tests
      if (orientation) classes.push(`orientation-${orientation}`);
      if (variant) classes.push(`variant-${variant}`);
      if (size) classes.push(`size-${size}`);
      if (className) classes.push(className);

      return cn(...classes);
    };

    const getItemClassName = (index: number) => {
      const classes = [getStyleClass('item'), 'step'];
      const step = steps[index];

      if (index === clampedActiveStep) {
        classes.push(getStyleClass('item--current'), 'item--current', 'status-active');
      }
      if (step?.completed || step?.state === 'completed' || index < clampedActiveStep) {
        classes.push(getStyleClass('item--completed'), 'item--completed', 'status-completed');
      }
      if (step?.error || step?.state === 'error') {
        classes.push(getStyleClass('item--error'), 'item--error', 'status-error');
      }
      if (step?.disabled || isStepDisabled(index)) {
        classes.push(getStyleClass('item--disabled'), 'item--disabled');
      }

      return cn(...classes);
    };

    const getButtonClassName = (index: number) => {
      const classes = [getStyleClass('button')];

      if (stepClassName) classes.push(stepClassName);

      if (isStepDisabled(index)) {
        classes.push(getStyleClass('button--disabled'), 'button--disabled');
      }

      return cn(...classes);
    };

    const getPanelClassName = (index: number) => {
      const classes = [getStyleClass('panel')];
      if (index !== clampedActiveStep) classes.push(getStyleClass('panel--hidden'));
      return cn(...classes);
    };

    const getStepLabel = (step: StepItem, index: number) => {
      return step.title || step.label || `Step ${index + 1}`;
    };

    const getStepAccessibleLabel = (step: StepItem, index: number) => {
      const normalize = (value?: string) => value?.trim() ?? '';
      const title = normalize(step.title);
      if (title) return title;

      const label = normalize(step.label);
      if (label) return label;

      return `Step ${index + 1}`;
    };

    const getStepId = (index: number) => `${internalId}-step-${index}`;
    const getPanelId = (index: number) => `${internalId}-panel-${index}`;
    const getStepDescId = (index: number) => `${internalId}-step-${index}-desc`;

    const handleStepClick = (index: number) => {
      if (!clickableSteps || isStepDisabled(index)) return;

      const step = steps[index];
      const clickResult = onStepClick?.(index, step);
      if (clickResult === false) return; // Allow onStepClick to prevent navigation

      if (linear && index > clampedActiveStep + 1) return;

      if (!isControlled) setInternalActiveStep(index);
      notifyChange(index, step);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevStep();
          break;
        case 'Home':
          e.preventDefault();
          goToStep(0);
          break;
        case 'End':
          e.preventDefault();
          goToStep(maxIndex);
          break;
      }
    };

    return (
      <div
        id={internalId}
        role={getRootRole()}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={getRootClassName()}
        data-testid={dataTestId || 'dyn-stepper'}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <ol className={getStyleClass('list')} role={variant === 'tabs' ? 'presentation' : undefined}>
          {steps.map((step, index) => (
            <li key={step.id || index} className={getItemClassName(index)}>
              <button
                aria-label={getStepAccessibleLabel(step, index)}
                aria-current={index === clampedActiveStep ? 'step' : undefined}
                aria-selected={variant === 'tabs' ? index === clampedActiveStep : undefined}
                className={getButtonClassName(index)}
                id={getStepId(index)}
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={isStepDisabled(index)}
                aria-describedby={step.description && showDescription ? getStepDescId(index) : undefined}
                title={step.tooltip}
              >
                {renderStepIcon ? renderStepIcon(step, index, index === clampedActiveStep) : (
                  <>
                    {/* Render icon from step data when provided */}
                    {step.icon && typeof step.icon === 'string' ? (
                      <DynIcon icon={step.icon} className={getStyleClass('icon')} />
                    ) : null}

                    <span aria-hidden="true" className={getStyleClass('button__index')}>
                      {index + 1}
                    </span>
                    {showLabels && (
                      <span className={getStyleClass('button__label')}>
                        {getStepLabel(step, index)}
                      </span>
                    )}
                  </>
                )}
              </button>
              {step.description && showDescription && (
                <div className={getStyleClass('description')} id={getStepDescId(index)}>
                  {step.description}
                </div>
              )}
              {step.optional && (
                <span className={getStyleClass('optional')}>(optional)</span>
              )}
            </li>
          ))}
        </ol>

        {variant === 'progress' && (
          <div
            role="progressbar"
            aria-valuenow={Math.round(((clampedActiveStep + 1) / steps.length) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={getStyleClass('progressBar')}
          >
            <div
              className={getStyleClass('progressFill')}
              style={{ width: `${((clampedActiveStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        )}

        {steps.map((step, index) => (
          <section
            key={step.id || index}
            className={cn(getPanelClassName(index), 'step-content', contentClassName || '')}
            id={getPanelId(index)}
            role={variant === 'tabs' ? 'tabpanel' : 'region'}
            /* avoid duplicating accessible name between the tab/button and the panel */
            /* aria-labelledby intentionally omitted to prevent duplicate accessible names in tests */
            tabIndex={-1}
            hidden={index !== clampedActiveStep}
          >
            {renderStepContent ?
              renderStepContent(step, index) :
              (typeof step.content === 'function' ?
                step.content({ index, selected: index === clampedActiveStep }) :
                step.content
              )
            }
          </section>
        ))}
      </div>
    );
  }
);

export default DynStepper;
DynStepper.displayName = 'DynStepper';
