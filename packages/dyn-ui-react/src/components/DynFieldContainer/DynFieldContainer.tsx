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
import { useI18n } from '../../i18n';

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
      role,
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
      background: backgroundProp,
      border: borderProp,
      radius: radiusProp,
      'data-testid': dataTestIdProp,
      'aria-describedby': ariaDescribedByProp,
      'aria-labelledby': ariaLabelledByProp,
      ...rest
    } = props;

    const { t } = useI18n();
    const translate = (value?: string) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (!trimmed) return value;
      return t({ id: trimmed, defaultMessage: trimmed });
    };

    const generatedId = useId();
    const baseId = htmlFor ?? generatedId;
    const dataTestId = dataTestIdProp ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS['data-testid'];
    const Component = (as ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS.as) as ElementType;

    const translatedLabel = translate(label) as string | undefined;
    const translatedHelpText = translate(helpText) as string | undefined;

    const resolvedValidationState = validationState ?? (errorText ? 'error' : 'default');
    const rawValidationMessage = validationMessage ?? (resolvedValidationState === 'error' ? errorText : undefined);
    const translatedValidationMessage = translate(rawValidationMessage) as string | undefined;

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

    const fieldId = htmlFor ?? baseId;
    const errorId = translatedValidationMessage || validationMessageId ? `${fieldId}-error` : undefined;
    const helpId = translatedHelpText ? `${fieldId}-help` : undefined;
    const labelId = translatedLabel ? `${fieldId}-label` : undefined;
    const validationId =
      validationMessageId ?? (translatedValidationMessage && resolvedValidationState === 'error' ? errorId : undefined);

    const containerDescribedBy = mergeAriaIds(
      ariaDescribedByProp,
      validationId,
      translatedHelpText ? helpId : undefined,
    );
    const containerLabelledBy = mergeAriaIds(ariaLabelledByProp, labelId);
    const shouldLabelContainer = Boolean(containerLabelledBy && (role || ariaLabelledByProp));

    const validationRole = resolvedValidationState === 'error' ? 'alert' : 'status';
    const validationAriaLive = resolvedValidationState === 'error' ? 'assertive' : 'polite';

    const requiredLabel = t({ id: 'field.required', defaultMessage: 'required' });
    const optionalLabel = t({ id: 'field.optional', defaultMessage: '(optional)' });
    const optionalAria = t({ id: 'field.optional.aria', defaultMessage: 'optional' });

    const enhancedChildren = Children.map(children, (child) => {
      if (!isNativeFieldElement(child)) return child;

      const mergedDescribedBy = mergeAriaIds(
        child.props['aria-describedby'],
        translatedHelpText ? helpId : undefined,
        translatedValidationMessage ? validationId : undefined,
      );
      const mergedLabelledBy = mergeAriaIds(child.props['aria-labelledby'], labelId);

      return cloneElement(child, {
        id: child.props.id ?? fieldId,
        'aria-describedby': mergedDescribedBy,
        'aria-labelledby': mergedLabelledBy,
      });
    });

    return (
      <DynBox
        {...rest}
        ref={ref as ForwardedRef<DynBoxRef<E>>}
        as={Component as E}
        id={id}
        className={containerClasses}
        data-testid={dataTestId}
        aria-describedby={containerDescribedBy}
        aria-labelledby={shouldLabelContainer ? containerLabelledBy : undefined}
        role={role}
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
        background={backgroundProp ?? 'none'}
        border={borderProp ?? 'none'}
        radius={radiusProp ?? 'none'}
      >
        {translatedLabel && (
          <label className={styles.label} htmlFor={fieldId} id={labelId}>
            {translatedLabel}
            {required && (
              <span className={styles.required} aria-label={requiredLabel}>
                *
              </span>
            )}
            {optional && (
              <span className={styles.optional} aria-label={optionalAria}>
                {optionalLabel}
              </span>
            )}
          </label>
        )}

        {enhancedChildren}

        {showValidation && (translatedHelpText || translatedValidationMessage) && (
          <div className={styles.feedback}>
            {translatedValidationMessage ? (
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
                {translatedValidationMessage}
              </div>
            ) : translatedHelpText ? (
              <div className={styles.help} id={helpId}>
                {translatedHelpText}
              </div>
            ) : null}

            {translatedHelpText && translatedValidationMessage && (
              <div className={styles.help} id={helpId}>
                {translatedHelpText}
              </div>
            )}
          </div>
        )}
      </DynBox>
    );
  }
);

DynFieldContainer.displayName = 'DynFieldContainer';

export default DynFieldContainer;
