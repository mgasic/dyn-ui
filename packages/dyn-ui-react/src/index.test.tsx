/**
 * Root-level integration test
 * Ensures the main entry point exports work correctly
 */
import * as DynUI from './index';

describe('DYN UI Library', () => {
  it('exports basic components', () => {
    expect(DynUI.DynButton).toBeDefined();
    const dynButtonType = typeof DynUI.DynButton;
    expect(['function', 'object']).toContain(dynButtonType);

    if (dynButtonType === 'object') {
      expect(DynUI.DynButton).toHaveProperty(
        '$$typeof',
        Symbol.for('react.forward_ref')
      );
    }
  });
  
  it('exports display components', () => {
    expect(DynUI.DynBadge).toBeDefined();
    expect(DynUI.DynAvatar).toBeDefined();
    expect(DynUI.DynLabel).toBeDefined();
    expect(DynUI.DynIcon).toBeDefined();
  });
  
  it('exports form components', () => {
    expect(DynUI.DynInput).toBeDefined();
    expect(DynUI.DynSelect).toBeDefined();
    expect(DynUI.DynCheckbox).toBeDefined();
    expect(DynUI.DynDatePicker).toBeDefined();
    expect(DynUI.DynFieldContainer).toBeDefined();
  });
  
  it('exports layout components', () => {
    expect(DynUI.DynContainer).toBeDefined();
    expect(DynUI.DynDivider).toBeDefined();
    expect(DynUI.DynGrid).toBeDefined();
    expect(DynUI.DynPage).toBeDefined();
  });
  
  it('exports theme system', () => {
    expect(DynUI.ThemeProvider).toBeDefined();
    expect(typeof DynUI.useTheme).toBe('function');
  });
  
  it('exports utilities', () => {
    expect(typeof DynUI.classNames).toBe('function');
    expect(typeof DynUI.generateInitials).toBe('function');
  });
});