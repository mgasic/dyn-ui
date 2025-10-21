import { Children, cloneElement, forwardRef, isValidElement, useId } from 'react';
import type { ElementType, ForwardedRef, ReactElement } from 'react';
import { DynBox } from '../DynBox';
import type { DynBoxRef } from '../DynBox';
import { cn } from '../../utils/classNames';
import {
  DYN_FIELD_CONTAINER_DEFAULT_PROPS,
  type DynFieldContainerProps,
  type DynFieldContainerRef,
} from './DynFieldContainer.types';
import styles from './DynFieldContainer.module.css';

type NativeFieldElement = ReactElement<
  {
    id?: string;
    'aria-describedby'?: string;
    'aria-labelledby'?: string;
  },
  'input' | 'select' | 'textarea'
>;

const NATIVE_FIELD_TAGS = new Set(['input', 'select', 'textarea']);

const mergeAriaIds = (...values: Array<string | undefined>) => {
  const tokens = values
    .flatMap((value) => (value ? value.split(' ') : []))
    .map((token) => token.trim())
    .filter(Boolean);

  const unique = Array.from(new Set(tokens));
  return unique.length > 0 ? unique.join(' ') : undefined;
};

const isNativeFieldElement = (child: unknown): child is NativeFieldElement => {
  return isValidElement(child) && typeof child.type === 'string' && NATIVE_FIELD_TAGS.has(child.type);
};

export const DynFieldContainer = forwardRef(
  <E extends ElementType = typeof DYN_FIELD_CONTAINER_DEFAULT_PROPS.as>(
    props: DynFieldContainerProps<E>,
    ref: ForwardedRef<DynFieldContainerRef<E>>
  ) => {
    const {
      as,
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
      gap: gapProp = DYN_FIELD_CONTAINER_DEFAULT_PROPS.gap,
      rowGap,
      columnGap,
      padding,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb: marginBottomProp = DYN_FIELD_CONTAINER_DEFAULT_PROPS.mb,
      ml,
      'data-testid': dataTestIdProp,
      'aria-describedby': ariaDescribedByProp,
      'aria-labelledby': ariaLabelledByProp,
      ...rest
    } = props;

    const generatedId = useId();
    const baseId = htmlFor ?? generatedId;
    const dataTestId = dataTestIdProp ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS['data-testid'];
    const Component = (as ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS.as) as ElementType;

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
      <DynBox
        {...rest}
        ref={ref as ForwardedRef<DynBoxRef<E>>}
        as={Component as E}
        id={id}
        className={containerClasses}
        data-testid={dataTestId}
        aria-describedby={containerDescribedBy}
        aria-labelledby={containerLabelledBy}
        display="flex"
        direction="column"
        gap={gapProp}
        rowGap={rowGap}
        columnGap={columnGap}
        padding={padding}
        p={p}
        px={px}
        py={py}
        pt={pt}
        pr={pr}
        pb={pb}
        pl={pl}
        m={m}
        mx={mx}
        my={my}
        mt={mt}
        mr={mr}
        mb={marginBottomProp}
        ml={ml}
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
