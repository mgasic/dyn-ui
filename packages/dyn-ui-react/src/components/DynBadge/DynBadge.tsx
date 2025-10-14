import {
  forwardRef,
  useCallback,
  useMemo,
  useState
} from 'react';
import type { CSSProperties, ForwardedRef, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/classNames';
import { generateId } from '../../utils/accessibility';
import type {
  DynBadgeProps,
  DynBadgeRef
} from './DynBadge.types';
import styles from './DynBadge.module.css';

const sizeClassNameMap = {
  small: styles['badge--small'],
  medium: styles['badge--medium'],
  large: styles['badge--large']
} as const;

const variantClassNameMap = {
  solid: styles['badge--solid'],
  soft: styles['badge--soft'],
  outline: styles['badge--outline'],
  dot: styles['badge--dot']
} as const;

const colorClassNameMap = {
  primary: styles['badge--primary'],
  secondary: styles['badge--secondary'],
  success: styles['badge--success'],
  warning: styles['badge--warning'],
  danger: styles['badge--danger'],
  info: styles['badge--info'],
  neutral: styles['badge--neutral']
} as const;

const positionClassNameMap = {
  topRight: styles['badge--topRight'],
  topLeft: styles['badge--topLeft'],
  bottomRight: styles['badge--bottomRight'],
  bottomLeft: styles['badge--bottomLeft']
} as const;

const DEFAULT_MAX_COUNT = 99;

/**
 * Safely access CSS module classes
 */
const getStyleClass = (className: string): string => {
  return (styles as Record<string, string>)[className] || '';
};

const DynBadgeComponent = (
  props: DynBadgeProps,
  ref: ForwardedRef<DynBadgeRef>
) => {
  const {
    children,
    variant = 'solid',
    color = 'neutral',
    size = 'medium',
    position,
    onClick,
    startIcon,
    endIcon,
    maxCount = DEFAULT_MAX_COUNT,
    count,
    value,
    showZero = false,
    animated = false,
    pulse = false,
    countDescription,
    ariaLabel,
    ariaDescribedBy,
    ariaLive,
    className,
    'data-testid': dataTestId,
    id,
    onKeyDown: userOnKeyDown,
    role: roleProp,
    tabIndex: tabIndexProp,
    ...rest
  } = props;

  const { style: inlineStyle, ...restProps } = rest;

  const [internalId] = useState(() => id || generateId('badge'));
  
  const numericCount = typeof count === 'number' ? count : typeof value === 'number' ? value : undefined;
  const hasCount = typeof numericCount === 'number';
  const hasChildren = children !== undefined && children !== null;
  const shouldHideBadge = hasCount && numericCount === 0 && !showZero && !hasChildren;

  if (shouldHideBadge) {
    return null;
  }

  const isInteractive = typeof onClick === 'function';

  const displayCount = useMemo(() => {
    if (!hasCount) {
      return undefined;
    }

    if (typeof maxCount === 'number' && numericCount! > maxCount) {
      return `${maxCount}+`;
    }

    return String(numericCount);
  }, [hasCount, maxCount, numericCount]);

  const displayContent = useMemo(() => {
    if (hasChildren) {
      return children;
    }

    if (hasCount) {
      return displayCount;
    }

    return undefined;
  }, [children, displayCount, hasChildren, hasCount]);

  const semanticColorClass =
    color && Object.prototype.hasOwnProperty.call(colorClassNameMap, color)
      ? colorClassNameMap[color as keyof typeof colorClassNameMap]
      : undefined;

  const badgeClasses = cn(
    getStyleClass('badge'),
    sizeClassNameMap[size],
    variantClassNameMap[variant],
    semanticColorClass,
    position && getStyleClass('badge--positioned'),
    position ? positionClassNameMap[position] : undefined,
    isInteractive && getStyleClass('badge--clickable'),
    hasCount && getStyleClass('badge--count'),
    animated && getStyleClass('badge--animated'),
    pulse && getStyleClass('badge--pulse'),
    className
  );

  const ariaLabelValue = ariaLabel ?? (hasCount ? `${countDescription || 'Count'}: ${displayCount}` : undefined);
  const ariaLiveValue = ariaLive ?? (hasCount ? 'polite' : undefined);
  const roleValue = roleProp ?? (isInteractive ? 'button' : undefined);
  const tabIndexValue = tabIndexProp ?? (isInteractive ? 0 : undefined);
  const dataTestIdValue = dataTestId ?? 'dyn-badge';
  const customColorStyle = !semanticColorClass && typeof color === 'string'
    ? ({
        '--badge-accent': color,
        '--badge-outline-color': color,
        '--badge-soft-fallback': color
      } as CSSProperties)
    : undefined;
  const badgeStyle = customColorStyle
    ? { ...customColorStyle, ...(inlineStyle as CSSProperties | undefined) }
    : inlineStyle;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      onClick?.(event);
    },
    [onClick]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>) => {
      userOnKeyDown?.(event);

      if (!isInteractive || event.defaultPrevented) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (event.key === ' ') {
          event.preventDefault();
        }

        event.currentTarget.click();
      }
    },
    [isInteractive, userOnKeyDown]
  );

  const showTextContent = displayContent !== undefined && variant !== 'dot';

  return (
    <span
      ref={ref}
      id={internalId}
      className={badgeClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={roleValue}
      tabIndex={tabIndexValue}
      aria-label={ariaLabelValue}
      aria-describedby={ariaDescribedBy}
      aria-live={ariaLiveValue}
      data-testid={dataTestIdValue}
      style={badgeStyle}
      {...restProps}
    >
      <span className={getStyleClass('badge__content')}>
        {startIcon && (
          <span className={getStyleClass('badge__icon')} aria-hidden="true">
            {startIcon}
          </span>
        )}

        {showTextContent && (
          <span className={getStyleClass('badge__text')}>
            {displayContent}
          </span>
        )}

        {endIcon && (
          <span className={getStyleClass('badge__icon')} aria-hidden="true">
            {endIcon}
          </span>
        )}
      </span>

      {hasCount && Number(numericCount) > 0 && (
        <span className="dyn-sr-only">
          {countDescription || 'Notifications'}: {displayCount}
        </span>
      )}
    </span>
  );
};

const DynBadge = forwardRef<DynBadgeRef, DynBadgeProps>(DynBadgeComponent);

DynBadge.displayName = 'DynBadge';

export { DynBadge };
export default DynBadge;