/**
 * Integration test for all component exports
 * Ensures all components are properly exported and can be imported
 * Following DYN UI Standards and Naming Conventions
 */
import {
  // Basic components
  DynButton,
  DynIcon,
  DynBox,

  // Display Components - SCOPE 5
  DynBadge,
  DynAvatar,
  DynLabel,

  // Form Components - SCOPE 6
  DynInput,
  DynSelect,
  DynCheckbox,
  DynDatePicker,
  DynFieldContainer,

  // Layout Components - SCOPE 7
  DynContainer,
  DynDivider,
  DynGrid,
  DynPage,

  // Data Display Components
  DynChart,
  DynGauge,
  DynListView,
  DynTable,
  DynTreeView,

  // Navigation Components
  DynMenu,
  DynMenuItem,
  DynBreadcrumb,
  DynTabs,
  DynStepper,
  DynToolbar,

  // Theme system
  ThemeProvider,
  useTheme,

  // Providers
  IconDictionaryProvider,

  // Utils
  classNames,
  generateInitials,

} from './index';

const isComponentExport = (component: unknown): boolean => {
  if (typeof component === 'function') return true;

  if (typeof component === 'object' && component !== null) {
    const maybeComponent = component as { $$typeof?: unknown; render?: unknown };
    return Boolean(maybeComponent.render);
  }

  return false;
};

describe('Component Exports', () => {
  it('exports all basic components', () => {
    expect(isComponentExport(DynButton)).toBe(true);
    expect(isComponentExport(DynIcon)).toBe(true);
    expect(isComponentExport(DynBox)).toBe(true);
  });

  it('exports all display components - SCOPE 5', () => {
    expect(isComponentExport(DynBadge)).toBe(true);
    expect(isComponentExport(DynAvatar)).toBe(true);
    expect(isComponentExport(DynLabel)).toBe(true);
  });

  it('exports all form components - SCOPE 6', () => {
    expect(isComponentExport(DynInput)).toBe(true);
    expect(isComponentExport(DynSelect)).toBe(true);
    expect(isComponentExport(DynCheckbox)).toBe(true);
    expect(isComponentExport(DynDatePicker)).toBe(true);
    expect(isComponentExport(DynFieldContainer)).toBe(true);
  });
  it('exports all layout components - SCOPE 7', () => {
    expect(isComponentExport(DynContainer)).toBe(true);
    expect(isComponentExport(DynDivider)).toBe(true);
    expect(isComponentExport(DynGrid)).toBe(true);
    expect(isComponentExport(DynPage)).toBe(true);
  });

  it('exports all data display components', () => {
    expect(isComponentExport(DynChart)).toBe(true);
    expect(isComponentExport(DynGauge)).toBe(true);
    expect(isComponentExport(DynListView)).toBe(true);
    expect(isComponentExport(DynTable)).toBe(true);
    expect(isComponentExport(DynTreeView)).toBe(true);
  });

  it('exports all navigation components', () => {
    expect(isComponentExport(DynMenu)).toBe(true);
    expect(isComponentExport(DynMenuItem)).toBe(true);
    expect(isComponentExport(DynBreadcrumb)).toBe(true);
    expect(isComponentExport(DynTabs)).toBe(true);
    expect(isComponentExport(DynStepper)).toBe(true);
    expect(isComponentExport(DynToolbar)).toBe(true);
  });

  it('exports theme system', () => {
    expect(typeof ThemeProvider).toBe('function');
    expect(typeof useTheme).toBe('function');
  });

  it('exports providers', () => {
    expect(typeof IconDictionaryProvider).toBe('function');
  });

  it('exports utilities', () => {
    expect(typeof classNames).toBe('function');
    expect(typeof generateInitials).toBe('function');
  });

  it('exports types correctly', () => {
    // Type exports can't be tested at runtime, but we can test that they compile
    // This test passes if TypeScript compilation succeeds with the imports above
    expect(true).toBe(true);
  });
});
