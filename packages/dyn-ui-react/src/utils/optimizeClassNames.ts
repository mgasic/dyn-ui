/**
 * Utility functions for optimizing CSS class names in DYN UI
 * Reduces bundle size and improves performance by using shorter class names
 */

// Mapping of long CSS Module names to short semantic names
const CLASS_NAME_MAP = {
  // Button component mappings
  'DynButton-module_root': 'dyn-btn',
  'DynButton-module_kindPrimary': 'dyn-btn--primary',
  'DynButton-module_kindSecondary': 'dyn-btn--secondary',
  'DynButton-module_kindTertiary': 'dyn-btn--tertiary',
  'DynButton-module_sizeSmall': 'dyn-btn--s',
  'DynButton-module_sizeMedium': 'dyn-btn--m',
  'DynButton-module_sizeLarge': 'dyn-btn--l',
  'DynButton-module_danger': 'dyn-btn--danger',
  'DynButton-module_loading': 'dyn-btn--loading',
  'DynButton-module_iconOnly': 'dyn-btn--icon-only',
  'DynButton-module_fullWidth': 'dyn-btn--full-width',
  'DynButton-module_content': 'dyn-btn__content',
  'DynButton-module_icon': 'dyn-btn__icon',
  'DynButton-module_iconStart': 'dyn-btn__icon--start',
  'DynButton-module_iconEnd': 'dyn-btn__icon--end',
  'DynButton-module_label': 'dyn-btn__label',
  'DynButton-module_spinner': 'dyn-spinner',
  
  // Container component mappings
  'DynContainer-module_root': 'dyn-container',
  'DynContainer-module_directionHorizontal': 'dyn-container--horizontal',
  'DynContainer-module_directionVertical': 'dyn-container--vertical',
  'DynContainer-module_alignStart': 'dyn-container--align-start',
  'DynContainer-module_alignCenter': 'dyn-container--align-center',
  'DynContainer-module_alignEnd': 'dyn-container--align-end',
  'DynContainer-module_alignStretch': 'dyn-container--align-stretch',
  'DynContainer-module_justifyStart': 'dyn-container--justify-start',
  'DynContainer-module_justifyCenter': 'dyn-container--justify-center',
  'DynContainer-module_justifyEnd': 'dyn-container--justify-end',
  'DynContainer-module_justifyBetween': 'dyn-container--justify-between',
  'DynContainer-module_justifyAround': 'dyn-container--justify-around',
  'DynContainer-module_justifyEvenly': 'dyn-container--justify-evenly',
  'DynContainer-module_spacingNone': 'dyn-container--spacing-none',
  'DynContainer-module_spacingXs': 'dyn-container--spacing-xs',
  'DynContainer-module_spacingSm': 'dyn-container--spacing-sm',
  'DynContainer-module_spacingMd': 'dyn-container--spacing-md',
  'DynContainer-module_spacingLg': 'dyn-container--spacing-lg',
  'DynContainer-module_spacingXl': 'dyn-container--spacing-xl',
  'DynContainer-module_sizeSmall': 'dyn-container--size-small',
  'DynContainer-module_sizeMedium': 'dyn-container--size-medium',
  'DynContainer-module_sizeLarge': 'dyn-container--size-large',
  'DynContainer-module_backgroundNone': 'dyn-container--bg-none',
  'DynContainer-module_backgroundSurface': 'dyn-container--bg-surface',
  'DynContainer-module_backgroundCard': 'dyn-container--bg-card',
  'DynContainer-module_bordered': 'dyn-container--bordered',
  'DynContainer-module_shadow': 'dyn-container--shadow',
  'DynContainer-module_noPadding': 'dyn-container--no-padding',
  'DynContainer-module_withTitle': 'dyn-container--with-title',
  'DynContainer-module_header': 'dyn-container__header',
  'DynContainer-module_title': 'dyn-container__title',
  'DynContainer-module_subtitle': 'dyn-container__subtitle',
  'DynContainer-module_content': 'dyn-container__content',
  
  // Icon component mappings
  'DynIcon-module_icon': 'dyn-icon',
  'DynIcon-module_small': 'dyn-icon--s',
  'DynIcon-module_medium': 'dyn-icon--m',
  'DynIcon-module_large': 'dyn-icon--l',
  
  // Add more component mappings as needed...
} as const;

/**
 * Optimizes CSS class names by replacing long CSS Module hashes with short semantic names
 * @param classNames - String of space-separated class names
 * @returns Optimized string with shorter class names
 */
export function optimizeClassNames(classNames: string): string {
  if (!classNames) return '';
  
  return classNames
    .split(' ')
    .map(className => {
      // Remove hash suffix from CSS Module classes (e.g., '__UNg0s')
      const baseClassName = className.replace(/__[a-zA-Z0-9]+$/g, '');
      
      // Return mapped short name or original if no mapping exists
      return CLASS_NAME_MAP[baseClassName as keyof typeof CLASS_NAME_MAP] || className;
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Advanced class name utility similar to clsx but with optimization
 * @param classes - Array or object of class names
 * @returns Optimized string of class names
 */
export function cn(...classes: Array<string | Record<string, boolean> | undefined | null>): string {
  const classNames: string[] = [];
  
  for (const cls of classes) {
    if (!cls) continue;
    
    if (typeof cls === 'string') {
      classNames.push(optimizeClassNames(cls));
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) {
          classNames.push(optimizeClassNames(key));
        }
      }
    }
  }
  
  return classNames.join(' ');
}

/**
 * Generate short hash for dynamic class names
 * Used when we need unique class names but want them short
 */
export function generateShortHash(input: string, length: number = 5): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to base64-like string and limit length
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let num = Math.abs(hash);
  
  for (let i = 0; i < length; i++) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }
  
  return result;
}

/**
 * CSS-in-JS style object to optimized class names
 * Useful for dynamic styling with short class names
 */
export function styleToClass(styles: Record<string, string | number>, prefix: string = 'dyn'): string {
  const hash = generateShortHash(JSON.stringify(styles));
  const className = `${prefix}-${hash}`;
  
  // In a real implementation, this would inject CSS into the document
  // For now, it returns the class name that should be defined elsewhere
  return className;
}

/**
 * Bundle size analysis - calculate potential savings
 */
export function analyzeBundleSavings(originalClasses: string): { 
  original: number; 
  optimized: number; 
  savings: number; 
  percentage: number 
} {
  const optimized = optimizeClassNames(originalClasses);
  const originalSize = originalClasses.length;
  const optimizedSize = optimized.length;
  const savings = originalSize - optimizedSize;
  const percentage = Math.round((savings / originalSize) * 100);
  
  return {
    original: originalSize,
    optimized: optimizedSize,
    savings,
    percentage
  };
}

// Export optimized classNames function as default
export { cn as classNames };
export default cn;