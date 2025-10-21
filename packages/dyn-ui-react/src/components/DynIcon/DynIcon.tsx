import {
  cloneElement,
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
import type { IconDictionary } from '../../types';
import { iconRegistry } from './icons';
import type {
  DynIconProps,
  DynIconSemanticColor,
  DynIconSizeToken,
  DynIconVariant,
} from './DynIcon.types';
import { DYN_ICON_DEFAULT_PROPS } from './DynIcon.types';
import styles from './DynIcon.module.css';

type RegistryIcon = ReactElement | null;

const SIZE_CLASS_MAP: Record<DynIconSizeToken, string> = {
  small: styles['dyn-icon-size-small']!,
  medium: styles['dyn-icon-size-medium']!,
  large: styles['dyn-icon-size-large']!,
};

const VARIANT_CLASS_MAP: Record<DynIconVariant, string> = {
  default: styles['dyn-icon-variant-default']!,
  muted: styles['dyn-icon-variant-muted']!,
  subtle: styles['dyn-icon-variant-subtle']!,
  inverse: styles['dyn-icon-variant-inverse']!,
  accent: styles['dyn-icon-variant-accent']!,
};

const VARIANT_TOKEN_MAP: Record<DynIconVariant, string> = {
  default: 'var(--dyn-color-text-secondary)',
  muted: 'var(--dyn-color-text-tertiary)',
  subtle: 'var(--dyn-color-text-placeholder)',
  inverse: 'var(--dyn-color-text-inverse)',
  accent: 'var(--dyn-color-primary)',
};

const COLOR_TOKEN_MAP: Record<DynIconSemanticColor, string> = {
  neutral: 'var(--dyn-color-text-secondary)',
  primary: 'var(--dyn-color-primary)',
  success: 'var(--dyn-color-success)',
  warning: 'var(--dyn-color-warning)',
  danger: 'var(--dyn-color-danger)',
  info: 'var(--dyn-color-info)',
};

const SPRITE_PREFIX = 'sprite:';

const parseSpriteHref = (iconKey: string): string | null => {
  if (!iconKey) {
    return null;
  }

  const trimmed = iconKey.trim();
  if (!trimmed) {
    return null;
  }

  const withoutPrefix = trimmed.startsWith(SPRITE_PREFIX)
    ? trimmed.slice(SPRITE_PREFIX.length)
    : trimmed;

  if (!withoutPrefix.includes('#')) {
    return null;
  }

  const [spriteSource, symbol] = withoutPrefix.split('#');
  if (!symbol && spriteSource) {
    return `#${spriteSource}`;
  }

  if (!symbol) {
    return null;
  }

  if (!spriteSource) {
    return `#${symbol}`;
  }

  return `${spriteSource}#${symbol}`;
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
    variant = DYN_ICON_DEFAULT_PROPS.variant,
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
  } = props;

  const { tabIndex, ['aria-hidden']: ariaHiddenProp, ...domProps } = rest;

  let dictionary: IconDictionary;
  try {
    dictionary = useIconDictionary();
  } catch (error) {
    dictionary = DEFAULT_ICON_DICTIONARY;
  }
  const normalizedIcon = typeof icon === 'string' ? icon.trim() : '';
  const spriteHref = useMemo(() => parseSpriteHref(normalizedIcon), [normalizedIcon]);

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
    if (!normalizedIcon || iconTokens.length === 0 || spriteHref) {
      return false;
    }

    const hasDictionaryMatch = iconTokens.some(token => Boolean(dictionary[token]));
    const hasDirectClass = iconTokens.some(token => token.startsWith('dyn-icon-'));
    const hasFontClass = iconTokens.some(token => token.startsWith('fa'));

    if (hasDictionaryMatch || hasDirectClass || hasFontClass) {
      return false;
    }

    return Boolean(resolveRegistryIcon(normalizedIcon));
  }, [dictionary, iconTokens, normalizedIcon, spriteHref]);

  const registryIcon = useMemo(() => {
    if (!shouldUseRegistry) {
      return null;
    }

    return resolveRegistryIcon(normalizedIcon);
  }, [normalizedIcon, shouldUseRegistry]);

  const processedIconClasses = useMemo(() => {
    if (typeof icon !== 'string' || shouldUseRegistry || spriteHref) {
      return null;
    }

    return processIconString(icon, dictionary);
  }, [icon, dictionary, shouldUseRegistry, spriteHref]);

  const resolvedSizeClass =
    typeof size === 'string' && SIZE_CLASS_MAP[size as DynIconSizeToken];

  const inlineDimensionStyle: (Record<'--dyn-icon-size', string>) | undefined = useMemo(() => {
    if (typeof size === 'number') {
      return {
        '--dyn-icon-size': `${size}px`,
      };
    }

    if (typeof size === 'string' && !SIZE_CLASS_MAP[size as DynIconSizeToken]) {
      return {
        '--dyn-icon-size': size,
      };
    }

    return undefined;
  }, [size]);

  const resolvedIconColor = useMemo(() => {
    if (color) {
      const semanticToken = (COLOR_TOKEN_MAP as Record<string, string>)[color];
      return semanticToken ?? color;
    }

    return VARIANT_TOKEN_MAP[variant];
  }, [color, variant]);

  const iconColorStyle = useMemo(() => {
    if (!resolvedIconColor) {
      return undefined;
    }

    return {
      '--dyn-icon-color': resolvedIconColor,
    } as Record<'--dyn-icon-color', string>;
  }, [resolvedIconColor]);

  const mergedStyle: CSSProperties | undefined = useMemo(() => {
    if (!inlineDimensionStyle && !iconColorStyle && !style) {
      return undefined;
    }

    return {
      ...inlineDimensionStyle,
      ...style,
      ...iconColorStyle,
    } as CSSProperties | undefined;
  }, [iconColorStyle, inlineDimensionStyle, style]);

  const isInteractive = typeof onClick === 'function' && !disabled;

  const variantClassName = VARIANT_CLASS_MAP[variant];
  const isFontIcon = processedIconClasses?.baseClass === 'dyn-fonts-icon';

  const rootClassName = cn(
    styles.dynIcon,
    resolvedSizeClass,
    variantClassName,
    isFontIcon ? styles.fontIcon : undefined,
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
    !(domProps['aria-label'] || domProps['aria-labelledby']);
  const hasAccessibleLabel = Boolean(domProps['aria-label'] || domProps['aria-labelledby']);
  const ariaHidden = hasAccessibleLabel
    ? undefined
    : ariaHiddenProp ?? (shouldHideFromScreenReader ? true : undefined);

  const handleClick = (event: Parameters<NonNullable<typeof onClick>>[0]) => {
    if (!isInteractive || !onClick) {
      return;
    }

    onClick(event);
  };

  const content = (() => {
    if (spriteHref) {
      return (
        <span className={styles.dynIconSvg} aria-hidden="true">
          <svg aria-hidden="true" focusable="false">
            <use href={spriteHref} />
          </svg>
        </span>
      );
    }

    if (registryIcon) {
      const svgElement = cloneElement(registryIcon, {
        'aria-hidden': 'true',
        focusable: 'false',
      });

      return (
        <span className={styles.dynIconSvg} aria-hidden="true">
          {svgElement}
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
