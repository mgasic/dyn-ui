# Changelog

All notable changes to the DYN UI React library will be documented in this file.

## [Unreleased] - DYN UI Standards Compliance

### ✨ Major Improvements
- **Test Framework Migration**: Migrated all tests from Jest to Vitest for improved performance and modern testing
- **CSS Module Standardization**: Replaced all SCSS files with CSS modules for consistent styling approach
- **Type Safety Enhancements**: Fixed TypeScript errors and improved component type definitions
- **Export Consistency**: Standardized component exports with both named and default exports
- **Hook Export Clarity**: Exposed form-related hooks (`useDynFieldValidation`, `useDynMask`, `useDynDateParser`) directly from their hook modules for clearer public imports
- **Lint Automation**: Added custom ESLint rules to enforce export patterns and verify the presence of Storybook stories and Vitest suites for every component

### 🔧 Component Fixes

#### DynChart
- Migrated test suite from Jest to Vitest
- Added proper mock typing for Canvas API
- Implemented comprehensive test coverage for all chart types

#### DynButton
- Enhanced test suite with Vitest framework
- Added tests for all button variants and states
- Removed duplicate optimized files (.optimized.css, .optimized.scss, .optimized.tsx)

#### DynInput
- Converted SCSS to CSS modules
- Updated import statements to use CSS instead of SCSS
- Maintained comprehensive Vitest test coverage

#### DynBadge
- Added missing .types.ts file for proper type exports
- Removed SCSS files in favor of CSS modules
- Cleaned up backup files (.bak extensions)
- Enhanced test coverage with proper provider wrapping

#### DynGauge
- Fixed test suite with correct type values (arc, circle, line)
- Added comprehensive test coverage for all gauge properties
- Improved type safety with proper prop validation

#### DynDivider & DynLabel
- Added missing default exports for consistency
- Ensured proper component API standardization
- Removed deprecated SCSS module and leftover backup file now that DynLabel uses CSS modules exclusively

### 📁 File Structure Improvements
- Removed all .scss files and standardized on .module.css
- Eliminated backup files (.bak) throughout the project
- Consolidated type definitions in dedicated .types.ts files
- Improved index.ts exports for better tree-shaking

### 🧪 Testing Enhancements
- All tests now use Vitest instead of Jest
- Improved mock implementations with proper TypeScript typing
- Added comprehensive test coverage for edge cases
- Enhanced accessibility testing in component suites

### 🎯 Type Safety
- Fixed TypeScript strict mode compatibility
- Resolved export/import type mismatches
- Added proper BaseComponentProps inheritance
- Enhanced prop validation across all components

### 📈 Developer Experience
- Improved error messages and debugging
- Better IDE support with proper type definitions
- Consistent naming conventions across components
- Enhanced documentation in component props

---

**Migration Notes**: 
- All SCSS imports should be updated to CSS module imports
- Jest test configurations can be removed in favor of Vitest
- Component imports now support both named and default exports
- TypeScript strict mode is now fully supported