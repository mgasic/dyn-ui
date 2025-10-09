/**
 * Utility functions for formatting data in DYN UI components
 */
//import type { BadgeThemeColor } from '../components/DynBadge/DynBadge.types';
import { DYN_BADGE_COLORS } from '../components/DynBadge/DynBadge.types';
import type { IconDictionary, ProcessedIcon } from '../types/icon.types';

/**
 * Generates initials from a full name
 * @param name - Full name (e.g., "John Doe")
 * @returns Initials (e.g., "JD")
 */
export const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }

  const [firstWord, ...restWords] = words;
  if (!firstWord) {
    return '';
  }

  if (restWords.length === 0) {
    return firstWord.charAt(0).toUpperCase();
  }

  const lastWord = restWords[restWords.length - 1];
  if (!lastWord) {
    return firstWord.charAt(0).toUpperCase();
  }

  return (firstWord.charAt(0) + lastWord.charAt(0)).toUpperCase();
};

/**
 * Formats badge value for display (9+ for values > 9)
 * @param value - Numeric value
 * @returns Formatted string
 */
export const formatBadgeValue = (value: number): string => {
  if (value <= 0) return '0';
  if (value > 99) return '99+';
  return value.toString();
};

/**
 * Checks if a color is a theme color from DYN palette
 * @param color - Color string
 * @returns Boolean indicating if it's a theme color
 */
export const isThemeColor = (color: string): boolean => {
  return (DYN_BADGE_COLORS as readonly string[]).includes(color);
};

/**
 * Processes icon string with dictionary lookup
 * @param iconStr - Icon string (may contain dictionary keys)
 * @param dictionary - Icon dictionary mapping
 * @returns Processed icon classes
 */
export const processIconString = (
  iconStr: string,
  dictionary: IconDictionary
): ProcessedIcon => {
  const iconTokens = iconStr
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  let processedClass = '';
  let baseClass: string | undefined;

  iconTokens.forEach((token, index) => {
    if (dictionary[token]) {
      const dictValue = dictionary[token];
      processedClass = index === 0 ? dictValue : `${processedClass} ${dictValue}`;
      if (!baseClass && dictValue.startsWith('dyn-icon')) {
        baseClass = 'dyn-icon';
      }
    } else if (token.startsWith('dyn-icon-')) {
      processedClass = index === 0 ? token : `${processedClass} ${token}`;
      if (!baseClass) {
        baseClass = 'dyn-icon';
      }
    } else if (token.startsWith('fa') || token.startsWith('fas') || token.startsWith('far')) {
      baseClass = 'dyn-fonts-icon';
      processedClass = index === 0 ? token : `${processedClass} ${token}`;
    } else {
      processedClass = index === 0 ? token : `${processedClass} ${token}`;
    }
  });

  return {
    baseClass: baseClass ?? 'dyn-icon',
    iconClass: processedClass.trim()
  };
};
