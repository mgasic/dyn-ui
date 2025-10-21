import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCssCustomProperties, cssVariables, tokenVar, tokens } from '..';

const tokensCssPath = path.resolve(__dirname, '..', 'tokens.css');

describe('design tokens build', () => {
  it('exposes canonical spacing values', () => {
    expect(tokens.spacing.xs).toBe('0.25rem');
    expect(tokens.spacing['2xl']).toBe('3rem');
  });

  it('syncs spacing values with CSS variables', () => {
    expect(cssVariables['--dyn-spacing-xs']).toBe(tokens.spacing.xs);
    expect(cssVariables['--dyn-spacing-2xl']).toBe(tokens.spacing['2xl']);
  });

  it('includes motion helpers', () => {
    expect(tokens.motion.duration.normal).toBe('200ms');
    expect(cssVariables['--dyn-duration-normal']).toBe('200ms');
  });

  it('builds CSS output that matches the generated file', () => {
    const cssFromHelper = buildCssCustomProperties(':root').trim();
    const cssFromFile = readFileSync(tokensCssPath, 'utf8').trim();
    expect(cssFromHelper).toBe(cssFromFile);
  });

  it('wraps css variables with tokenVar helper', () => {
    expect(tokenVar('--dyn-color-primary-default')).toBe('var(--dyn-color-primary-default)');
  });
});
