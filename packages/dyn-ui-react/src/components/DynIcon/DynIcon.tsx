import {
  forwardRef,
  isValidElement,
  useMemo,
} from 'react';
import type {
  CSSProperties,
  ForwardedRef,
  ReactElement,
} from 'react';
import { cn } from '../../utils/classNames';
import { processIconString } from '../../utils/dynFormatters';
import { useIconDictionary } from '../../hooks/useIconDictionary';
import { DEFAULT_ICON_DICTIONARY } from '../../providers/IconDictionaryProvider';
import { iconRegistry } from './icons';
import type {
  DynIconProps,
  DynIconSizeToken,
} from './DynIcon.types';
import { DYN_ICON_DEFAULT_PROPS } from './DynIcon.types';
import styles from './DynIcon.module.css';

type DynIconComponentProps = DynIconProps & Readonly<typeof DYN_ICON_DEFAULT_PROPS>;

type RegistryIcon = ReactElement | null;

const SIZE_CLASS_MAP: Record<DynIconSizeToken, string> = {
  small: styles['dyn-icon-size-small']!,
  medium: styles['dyn-icon-size-medium']!,
  large: styles['dyn-icon-size-large']!,
};

const TONE_CLASS_MAP: Partial<Record<NonNullable<DynIconProps['tone']>, string>> = {
  success: styles.success!,
  warning: styles.warning!,
  danger: styles.danger!,
  info: styles.info!,
};

const resolveRegistryIcon = (iconKey: string): RegistryIcon => {
  const normalizedKey = iconKey.trim();
  if (!normalizedKey) {
    return null;
  }

  const registryIcon = iconRegistry[normalizedKey as keyof typeof iconRegistry];
  if (!registryIcon) {
    return null;
  }

  return registryIcon;
};

const DynIconComponent = (
  props: DynIconProps,
  ref: ForwardedRef<HTMLSpanElement>
) => {
  const {
    icon,
    size = DYN_ICON_DEFAULT_PROPS.size,
    tone,
    color,
    spin = DYN_ICON_DEFAULT_PROPS.spin,
    disabled = DYN_ICON_DEFAULT_PROPS.disabled,
    onClick,
    className,
    style,
    id,
    'data-testid': dataTestId,
    role,
    children,
    ...rest
  } = props as DynIconComponentProps;

  const { tabIndex, ...domProps } = rest;

  let dictionary = DEFAULT_ICON_DICTIONARY;
  try {
    dictionary = useIconDictionary();
  } catch (error) {
    dictionary = DEFAULT_ICON_DICTIONARY;
  }
  const normalizedIcon = typeof icon === 'string' ? icon.trim() : '';

  const iconTokens = useMemo(() => {
    if (!normalizedIcon) {
      return [] as string[];
    }

    return normalizedIcon
      .split(/\s+/)
      .map(token => token.trim())
      .filter(Boolean);
  }, [normalizedIcon]);

  const shouldUseRegistry = useMemo(() => {
    if (!normalizedIcon || iconTokens.length === 0) {
      return false;
    }

    const hasDictionaryMatch = iconTokens.some(token => Boolean(dictionary[token]));
    const hasDirectClass = iconTokens.some(token => token.startsWith('dyn-icon-'));
    const hasFontClass = iconTokens.some(token => token.startsWith('fa'));

    if (hasDictionaryMatch || hasDirectClass || hasFontClass) {
      return false;
    }

    return Boolean(resolveRegistryIcon(normalizedIcon));
  }, [dictionary, iconTokens, normalizedIcon]);

  const registryIcon = useMemo(() => {
    if (!shouldUseRegistry) {
      return null;
    }

    return resolveRegistryIcon(normalizedIcon);
  }, [normalizedIcon, shouldUseRegistry]);

  const processedIconClasses = useMemo(() => {
    if (typeof icon !== 'string' || shouldUseRegistry) {
      return null;
    }

    return processIconString(icon, dictionary);
  }, [icon, dictionary, shouldUseRegistry]);

  const resolvedSizeClass =
    typeof size === 'string' && SIZE_CLASS_MAP[size as DynIconSizeToken];

  const inlineDimensionStyle: CSSProperties | undefined = useMemo(() => {
    if (typeof size === 'number') {
      return {
        width: size,
        height: size,
        fontSize: size,
      } satisfies CSSProperties;
    }

    if (typeof size === 'string' && !SIZE_CLASS_MAP[size as DynIconSizeToken]) {
      return {
        width: size,
        height: size,
        fontSize: size,
      } satisfies CSSProperties;
    }

    return undefined;
  }, [size]);

  const mergedStyle: CSSProperties | undefined = useMemo(() => {
    if (!color && !inlineDimensionStyle) {
      return style;
    }

    return {
      ...inlineDimensionStyle,
      ...style,
      ...(color ? { color } : null),
    } as CSSProperties | undefined;
  }, [color, inlineDimensionStyle, style]);

  const isInteractive = typeof onClick === 'function' && !disabled;

  const toneClass = tone ? TONE_CLASS_MAP[tone] : undefined;

  const rootClassName = cn(
    styles.dynIcon,
    resolvedSizeClass,
    toneClass,
    spin ? styles.spinning : undefined,
    disabled ? styles.disabled : undefined,
    isInteractive ? styles['dyn-icon-clickable'] : undefined,
    processedIconClasses?.baseClass,
    processedIconClasses?.iconClass,
    className
  );

  const ariaRole = role ?? (isInteractive ? 'button' : 'img');
  const shouldHideFromScreenReader =
    !isInteractive &&
    (ariaRole === 'img' || ariaRole === 'presentation' || ariaRole === 'none') &&
    !rest['aria-label'] &&
    !rest['aria-labelledby'];
  const ariaHidden = rest['aria-hidden'] ?? (shouldHideFromScreenReader ? true : undefined);

  const handleClick = (event: Parameters<NonNullable<typeof onClick>>[0]) => {
    if (!isInteractive || !onClick) {
      return;
    }

    onClick(event);
  };

  const content = (() => {
    if (registryIcon) {
      return (
        <span className={styles.dynIconSvg} aria-hidden="true">
          {registryIcon}
        </span>
      );
    }

    if (typeof icon === 'string') {
      if (!processedIconClasses?.iconClass && !processedIconClasses?.baseClass) {
        return (
          <span className={styles.dynIconFallback} aria-hidden="true">
            {icon}
          </span>
        );
      }

      return null;
    }

    if (isValidElement(icon)) {
      return (
        <span className={styles.dynIconCustom} aria-hidden="true">
          {icon}
        </span>
      );
    }

    if (icon) {
      return icon;
    }

    return children ?? null;
  })();

  return (
    <span
      ref={ref}
      id={id}
      data-testid={dataTestId}
      role={ariaRole}
      className={rootClassName}
      style={mergedStyle}
      onClick={disabled ? undefined : handleClick}
      aria-disabled={disabled || undefined}
      tabIndex={isInteractive ? tabIndex ?? 0 : tabIndex}
      {...domProps}
      aria-hidden={ariaHidden}
    >
      {content}
    </span>
  );
};

const DynIcon = forwardRef<HTMLSpanElement, DynIconProps>(DynIconComponent);

DynIcon.displayName = 'DynIcon';

export { DynIcon };
export default DynIcon;
