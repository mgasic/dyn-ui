import { forwardRef, useId } from 'react';
import type { ForwardedRef } from 'react';
import { cn } from '../../utils/classNames';
import {
  DYN_DIVIDER_DEFAULT_PROPS,
  DynDividerProps,
  DynDividerRef,
} from './DynDivider.types';
import styles from './DynDivider.module.css';

const toPascalCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const DynDividerComponent = (
  {
    label,
    labelPosition = DYN_DIVIDER_DEFAULT_PROPS.labelPosition,
    variant = DYN_DIVIDER_DEFAULT_PROPS.variant,
    size = DYN_DIVIDER_DEFAULT_PROPS.size,
    color = DYN_DIVIDER_DEFAULT_PROPS.color,
    children,
    className,
    id,
    'aria-label': ariaLabelProp,
    'aria-labelledby': ariaLabelledByProp,
    'aria-describedby': ariaDescribedByProp,
    role: _role,
    'data-testid': dataTestId = DYN_DIVIDER_DEFAULT_PROPS['data-testid'],
    ...rest
  }: DynDividerProps,
  ref: ForwardedRef<DynDividerRef>
) => {
  const generatedId = useId();
  const orientation = variant === 'vertical' ? 'vertical' : 'horizontal';
  const labelContent = children ?? label;
  const labelId = labelContent ? `${id ?? `dyn-divider-${generatedId}`}-label` : undefined;
  const ariaLabel =
    ariaLabelProp ?? (!labelId && typeof labelContent === 'string' ? labelContent : undefined);

  const variantClass = styles[`variant${toPascalCase(variant)}` as keyof typeof styles];
  const sizeClass = styles[`size${toPascalCase(size)}` as keyof typeof styles];
  const colorClass = styles[`color${toPascalCase(color)}` as keyof typeof styles];
  const labelPositionClass = labelContent
    ? styles[`label${toPascalCase(labelPosition)}` as keyof typeof styles]
    : undefined;

  const dividerClassName = cn(
    styles.root,
    variantClass,
    sizeClass,
    colorClass,
    Boolean(labelContent) && styles.withLabel,
    labelPositionClass,
    className
  );

  return (
    <div
      ref={ref}
      id={id}
      role="separator"
      aria-orientation={orientation}
      aria-labelledby={ariaLabelledByProp ?? labelId}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedByProp}
      className={dividerClassName}
      data-testid={dataTestId}
      {...rest}
    >
      {variant !== 'text' ? <span className={styles.line} aria-hidden="true" /> : null}
      {labelContent ? (
        <span className={styles.label} id={labelId}>
          {labelContent}
        </span>
      ) : null}
      {variant !== 'text' ? <span className={styles.line} aria-hidden="true" /> : null}
    </div>
  );
};

const DynDivider = forwardRef<DynDividerRef, DynDividerProps>(DynDividerComponent);

DynDivider.displayName = 'DynDivider';

export { DynDivider };
export default DynDivider;
