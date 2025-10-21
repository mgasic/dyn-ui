import '../../test-setup';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DynMenuItem } from './DynMenuItem';

describe('DynMenuItem', () => {
  it('renders an accessible button with provided label', () => {
    render(<DynMenuItem label="Dashboard" data-testid="menu-item" />);

    const item = screen.getByTestId('menu-item');
    expect(item).toHaveAttribute('role', 'menuitem');
    expect(item).toHaveTextContent('Dashboard');
    expect(item).toHaveAccessibleName('Dashboard');
    expect(item).toHaveAttribute('type', 'button');
  });

  it('supports focusing via refs for keyboard workflows', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<DynMenuItem ref={ref}>Profile</DynMenuItem>);

    ref.current?.focus();

    expect(ref.current).toHaveFocus();
  });

  it('prevents pointer activation when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <DynMenuItem disabled onClick={handleClick}>
        Settings
      </DynMenuItem>
    );

    await user.click(screen.getByRole('menuitem', { name: 'Settings' }));

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('marks loading state as busy and prevents activation', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <DynMenuItem loading onClick={handleClick}>
        Reports
      </DynMenuItem>
    );

    const item = screen.getByRole('menuitem', { name: 'Reports' });

    expect(item).toHaveAttribute('aria-busy', 'true');
    expect(item).toHaveAttribute('data-loading');

    await user.click(item);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('trims provided aria-label values for accessible names', () => {
    render(<DynMenuItem aria-label="  Insights  ">Hidden</DynMenuItem>);

    expect(screen.getByRole('menuitem', { name: 'Insights' })).toBeInTheDocument();
  });

  it('supports polymorphic rendering with keyboard activation', () => {
    const onPress = vi.fn();

    render(
      <DynMenuItem as="a" href="#" onPress={onPress}>
        Docs
      </DynMenuItem>
    );

    const item = screen.getByRole('menuitem', { name: 'Docs' });

    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyDown(item, { key: ' ' });

    expect(onPress).toHaveBeenCalledTimes(2);
  });
});
