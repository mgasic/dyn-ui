import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import {
  DYN_FIELD_CONTAINER_DEFAULT_PROPS,
  type DynFieldContainerProps,
} from './DynFieldContainer.types';
import styles from './DynFieldContainer.module.css';

export const DynFieldContainer = forwardRef<HTMLDivElement, DynFieldContainerProps>(
  (props, ref) => {
    const {
      children,
      label,
      required = false,
      optional = false,
      helpText,
      errorText,
      validationState,
      validationMessage,
      validationMessageId,
      showValidation = DYN_FIELD_CONTAINER_DEFAULT_PROPS.showValidation,
      className,
      htmlFor,
      id,
      'data-testid': dataTestIdProp,
      ...rest
    } = props;

    const dataTestId =
      dataTestIdProp ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS['data-testid'];

    const resolvedValidationState = validationState ?? (errorText ? 'error' : 'default');
    const resolvedValidationMessage =
      validationMessage ?? (resolvedValidationState === 'error' ? errorText : undefined);

    const containerClasses = cn(
      styles.container,
      resolvedValidationState === 'error' && styles.containerError,
      resolvedValidationState === 'warning' && styles.containerWarning,
      resolvedValidationState === 'success' && styles.containerSuccess,
      resolvedValidationState === 'loading' && styles.containerLoading,
      required && styles.containerRequired,
      optional && styles.containerOptional,
      className
    );

    const errorId = htmlFor ? `${htmlFor}-error` : undefined;
    const helpId = htmlFor ? `${htmlFor}-help` : undefined;
    const labelId = label && htmlFor ? `${htmlFor}-label` : undefined;
    const validationId = validationMessageId ?? (resolvedValidationState === 'error' ? errorId : undefined);

    const validationRole = resolvedValidationState === 'error' ? 'alert' : 'status';
    const validationAriaLive = resolvedValidationState === 'error' ? 'assertive' : 'polite';

    return (
      <div
        {...rest}
        ref={ref}
        id={id}
        className={containerClasses}
        data-testid={dataTestId}
      >
        {label && (
          <label
            className={styles.label}
            htmlFor={htmlFor}
            id={labelId}
          >
            {label}
            {required && (
              <span className={styles.required} aria-label="obrigatório">
                *
              </span>
            )}
            {optional && (
              <span className={styles.optional} aria-label="opcional">
                (opcional)
              </span>
            )}
          </label>
        )}

        {children}

        {showValidation && (helpText || resolvedValidationMessage) && (
          <div className={styles.feedback}>
            {resolvedValidationMessage ? (
              <div
                className={cn(
                  styles.validation,
                  resolvedValidationState === 'error' && styles.error,
                  resolvedValidationState === 'warning' && styles.validationWarning,
                  resolvedValidationState === 'success' && styles.validationSuccess,
                  resolvedValidationState === 'loading' && styles.validationLoading
                )}
                id={validationId}
                role={validationRole}
                aria-live={validationAriaLive}
              >
                {resolvedValidationMessage}
              </div>
            ) : helpText ? (
              <div className={styles.help} id={helpId}>
                {helpText}
              </div>
            ) : null}

            {helpText && resolvedValidationMessage && (
              <div className={styles.help} id={helpId}>
                {helpText}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

DynFieldContainer.displayName = 'DynFieldContainer';

export default DynFieldContainer;
