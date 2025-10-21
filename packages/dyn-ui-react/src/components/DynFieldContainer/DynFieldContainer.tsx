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
      background: backgroundProp,
      border: borderProp,
      radius: radiusProp,
      'data-testid': dataTestIdProp,
      'aria-describedby': ariaDescribedByProp,
      'aria-labelledby': ariaLabelledByProp,
      ...rest
    } = props;

    const generatedId = useId();
    const baseId = htmlFor ?? generatedId;
    const dataTestId = dataTestIdProp ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS['data-testid'];
    const Component = (as ?? DYN_FIELD_CONTAINER_DEFAULT_PROPS.as) as ElementType;

    const containerClasses = cn(
      styles.container,
      errorText && styles.containerError,
      required && styles.containerRequired,
      optional && styles.containerOptional,
      className
    );

    const errorId = errorText ? `${baseId}-error` : undefined;
    const helpId = helpText ? `${baseId}-help` : undefined;
    const labelId = label ? `${baseId}-label` : undefined;

    const activeFeedbackId =
      showValidation && (errorText || helpText)
        ? errorText
          ? errorId
          : helpText
            ? helpId
            : undefined
        : undefined;

    const containerDescribedBy = mergeAriaIds(ariaDescribedByProp, activeFeedbackId);
    const containerLabelledBy = mergeAriaIds(
      ariaLabelledByProp,
      !htmlFor && labelId ? labelId : undefined
    );

    let hasAugmentedChild = false;
    const augmentedChildren = Children.map(children, (child) => {
      if (!isNativeFieldElement(child)) {
        return child;
      }

      const elementId = child.props.id;
      const shouldAugment = htmlFor ? elementId === htmlFor : Boolean(elementId);

      if (!shouldAugment) {
        return child;
      }

      hasAugmentedChild = true;

      const describedBy = mergeAriaIds(child.props['aria-describedby'], containerDescribedBy);
      const labelledBy = labelId ? mergeAriaIds(child.props['aria-labelledby'], labelId) : undefined;

      return cloneElement(child, {
        'aria-describedby': describedBy,
        ...(labelId ? { 'aria-labelledby': labelledBy } : {}),
      });
    });

    const labelElement = label ? (
      <label className={styles.label} htmlFor={htmlFor} id={labelId}>
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
    ) : null;

    const feedback =
      showValidation && (helpText || errorText) ? (
        <div className={styles.feedback}>
          {errorText ? (
            <div className={styles.error} id={errorId} role="alert" aria-live="polite">
              {errorText}
            </div>
          ) : helpText ? (
            <div className={styles.help} id={helpId}>
              {helpText}
            </div>
          ) : null}
        </div>
      ) : null;

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
        background={backgroundProp ?? 'none'}
        border={borderProp ?? 'none'}
        radius={radiusProp ?? 'none'}
      >
        {labelElement}
        {hasAugmentedChild ? augmentedChildren : children}
        {feedback}
      </DynBox>
    );
  }
);

DynFieldContainer.displayName = 'DynFieldContainer';

export default DynFieldContainer;
