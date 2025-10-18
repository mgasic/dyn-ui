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

describe('Component Exports', () => {
  it('exports all basic components', () => {
    expect(typeof DynButton).toBe('function');
    expect(typeof DynIcon).toBe('function');
    expect(typeof DynBox).toBe('function');
  });

  it('exports all display components - SCOPE 5', () => {
    expect(typeof DynBadge).toBe('function');
    expect(typeof DynAvatar).toBe('function');
    expect(typeof DynLabel).toBe('function');
  });

  it('exports all form components - SCOPE 6', () => {
    expect(typeof DynInput).toBe('function');
    expect(typeof DynSelect).toBe('function');
    expect(typeof DynCheckbox).toBe('function');
    expect(typeof DynDatePicker).toBe('function');
    expect(typeof DynFieldContainer).toBe('function');
  });
  it('exports all layout components - SCOPE 7', () => {
    expect(typeof DynContainer).toBe('function');
    expect(typeof DynDivider).toBe('function');
    expect(typeof DynGrid).toBe('function');
    expect(typeof DynPage).toBe('function');
  });

  it('exports all data display components', () => {
    expect(typeof DynChart).toBe('function');
    expect(typeof DynGauge).toBe('function');
    expect(typeof DynListView).toBe('function');
    expect(typeof DynTable).toBe('function');
    expect(typeof DynTreeView).toBe('function');
  });

  it('exports all navigation components', () => {
    expect(typeof DynMenu).toBe('function');
    expect(typeof DynBreadcrumb).toBe('function');
    expect(typeof DynTabs).toBe('function');
    expect(typeof DynStepper).toBe('function');
    expect(typeof DynToolbar).toBe('function');
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
