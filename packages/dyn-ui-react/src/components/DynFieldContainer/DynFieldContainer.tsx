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
      showValidation = DYN_FIELD_CONTAINER_DEFAULT_PROPS.showValidation,
      className,
      htmlFor,
      id,
      'data-testid': dataTestIdProp,
      ...rest
    } = props;

    const dataTestId =
      dataTestIdProp ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS['data-testid'];

    const containerClasses = cn(
      styles.container,
      errorText && styles.containerError,
      required && styles.containerRequired,
      optional && styles.containerOptional,
      className
    );

    const errorId = htmlFor ? `${htmlFor}-error` : undefined;
    const helpId = htmlFor ? `${htmlFor}-help` : undefined;
    const labelId = label && htmlFor ? `${htmlFor}-label` : undefined;

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

        {showValidation && (helpText || errorText) && (
          <div className={styles.feedback}>
            {errorText ? (
              <div
                className={styles.error}
                id={errorId}
                role="alert"
                aria-live="polite"
              >
                {errorText}
              </div>
            ) : helpText ? (
              <div className={styles.help} id={helpId}>
                {helpText}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

DynFieldContainer.displayName = 'DynFieldContainer';

export default DynFieldContainer;
