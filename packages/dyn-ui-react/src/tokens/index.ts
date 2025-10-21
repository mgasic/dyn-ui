export * from './generated';

/**
 * Convenience accessor for individual token values.
 * Returns the corresponding CSS custom property reference.
 */
export function getCssVar(name: string) {
  return `var(${name})`;
}
