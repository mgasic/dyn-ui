import * as designTokens from '@dyn-ui/design-tokens';
import type { DynThemeTokens, TokenGroup } from './tokens';

const DEFAULT_SPACING: TokenGroup = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

const DEFAULT_RADIUS: TokenGroup = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  full: '9999px',
};

const DEFAULT_FONT_SIZE: TokenGroup = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
};

const DEFAULT_FONT_WEIGHT: TokenGroup = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

const DEFAULT_SHADOW: TokenGroup = {
  sm: '0 1px 3px rgba(0,0,0,0.12)',
  md: '0 4px 6px rgba(0,0,0,0.16)',
  lg: '0 10px 20px rgba(0,0,0,0.19)',
};

const REM_REGEX = /^(-?\d+(?:\.\d+)?)rem$/i;

const toRem = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  const match = value.match(REM_REGEX);
  if (!match) return value;
  const numeric = Number.parseFloat(match[1]);
  if (!Number.isFinite(numeric)) return fallback;
  const rem = numeric / 16;
  const rounded = Math.round(rem * 1000) / 1000;
  return `${rounded}rem`;
};

const withFallback = (value: string | undefined, fallback: string) =>
  value && value.trim().length > 0 ? value : fallback;

const buildSpacing = (): TokenGroup => ({
  xs: withFallback(toRem((designTokens as Record<string, string>).SizeSpacingXs, DEFAULT_SPACING.xs), DEFAULT_SPACING.xs),
  sm: withFallback(toRem((designTokens as Record<string, string>).SizeSpacingSm, DEFAULT_SPACING.sm), DEFAULT_SPACING.sm),
  md: withFallback(toRem((designTokens as Record<string, string>).SizeSpacingMd, DEFAULT_SPACING.md), DEFAULT_SPACING.md),
  lg: withFallback(toRem((designTokens as Record<string, string>).SizeSpacingLg, DEFAULT_SPACING.lg), DEFAULT_SPACING.lg),
  xl: DEFAULT_SPACING.xl,
});

const buildRadius = (): TokenGroup => ({
  none: DEFAULT_RADIUS.none,
  sm: withFallback(toRem((designTokens as Record<string, string>).SizeBorderRadiusSm, DEFAULT_RADIUS.sm), DEFAULT_RADIUS.sm),
  md: withFallback(toRem((designTokens as Record<string, string>).SizeBorderRadiusMd, DEFAULT_RADIUS.md), DEFAULT_RADIUS.md),
  lg: withFallback(toRem((designTokens as Record<string, string>).SizeBorderRadiusLg, DEFAULT_RADIUS.lg), DEFAULT_RADIUS.lg),
  full: DEFAULT_RADIUS.full,
});

const buildFontSize = (): TokenGroup => ({
  xs: withFallback(toRem((designTokens as Record<string, string>).SizeFontSmall, DEFAULT_FONT_SIZE.xs), DEFAULT_FONT_SIZE.xs),
  sm: withFallback(toRem((designTokens as Record<string, string>).SizeFontMedium, DEFAULT_FONT_SIZE.sm), DEFAULT_FONT_SIZE.sm),
  md: withFallback(toRem((designTokens as Record<string, string>).SizeFontLarge, DEFAULT_FONT_SIZE.md), DEFAULT_FONT_SIZE.md),
  lg: DEFAULT_FONT_SIZE.lg,
  xl: DEFAULT_FONT_SIZE.xl,
});

const buildShadow = (): TokenGroup => ({
  sm: withFallback((designTokens as Record<string, string>).ShadowElevationLow, DEFAULT_SHADOW.sm),
  md: withFallback((designTokens as Record<string, string>).ShadowElevationMedium, DEFAULT_SHADOW.md),
  lg: withFallback((designTokens as Record<string, string>).ShadowElevationHigh, DEFAULT_SHADOW.lg),
});

export const GLOBAL_TOKENS: DynThemeTokens = {
  spacing: buildSpacing(),
  radius: buildRadius(),
  fontSize: buildFontSize(),
  fontWeight: { ...DEFAULT_FONT_WEIGHT },
  shadow: buildShadow(),
  variants: ['primary', 'secondary', 'tertiary', 'ghost', 'link'],
  tones: ['neutral', 'info', 'success', 'warning', 'danger'],
};
