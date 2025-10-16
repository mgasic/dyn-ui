import { fireEvent, render, screen } from '@testing-library/react';
import { testA11y } from '../../testing/accessibility';
import { describe, expect, it, vi } from 'vitest';
import { DynButton } from './DynButton';
import styles from './DynButton.module.css';

// `toHaveNoViolations` is registered globally in vitest.setup.ts

const classes = styles as Record<string, string>;

describe('DynButton', () => {
  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<DynButton label="Save" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveTextContent('Save');
      expect(button).toHaveClass(classes.root!);
      expect(button).toHaveClass(classes.kindPrimary!);
      expect(button).toHaveClass(classes.sizeMedium!);
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders without label when only icon is provided', () => {
      render(<DynButton icon="download" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.iconOnly!);
      expect(button.querySelector(`.${classes.icon}`)).toBeInTheDocument();
      expect(button.querySelector(`.${classes.label}`)).not.toBeInTheDocument();
    });

    it('renders children content when provided', () => {
      render(
        <DynButton>
          <span>Custom Content</span>
        </DynButton>
      );

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveTextContent('Custom Content');
    });

    it('generates unique ID when not provided', () => {
      const { rerender } = render(<DynButton label="Test" />);
      const firstButton = screen.getByTestId('dyn-button');
      const firstId = firstButton.id;

      rerender(<DynButton label="Test 2" />);
      const secondButton = screen.getByTestId('dyn-button');
      const secondId = secondButton.id;

      expect(firstId).toBeTruthy();
      expect(secondId).toBeTruthy();
      expect(firstId).not.toBe(secondId);
    });

    it('uses provided ID when specified', () => {
      render(<DynButton label="Test" id="custom-button" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveAttribute('id', 'custom-button');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      await testA11y(<DynButton label="Accessible Button" />);
    });

    it('provides proper ARIA labels for icon-only buttons', () => {
      render(<DynButton icon="download" aria-label="Download file" />);

      const button = screen.getByRole('button', { name: 'Download file' });
      expect(button).toHaveAttribute('aria-label', 'Download file');
    });

    it('auto-generates ARIA label from icon name when no label provided', () => {
      render(<DynButton icon="download" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveAttribute('aria-label', 'download');
    });

    it('supports ARIA expanded state for disclosure buttons', () => {
      render(
        <DynButton
          label="Menu"
          aria-expanded={false}
          aria-controls="main-menu"
        />
      );

      const button = screen.getByRole('button', { name: 'Menu' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', 'main-menu');
    });

    it('supports ARIA pressed state for toggle buttons', () => {
      render(<DynButton label="Toggle" aria-pressed={false} />);

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('announces loading state to screen readers', () => {
      render(<DynButton label="Submit" loading />);

      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toHaveAttribute('aria-busy', 'true');

      const announcement = button.querySelector('.dyn-sr-only');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent('Loading…');
    });

    it('announces custom loading text to screen readers', () => {
      render(
        <DynButton
          label="Save"
          loading
          loadingText="Saving your changes..."
        />
      );

      const button = screen.getByRole('button', { name: 'Save' });
      const announcement = button.querySelector('.dyn-sr-only');
      expect(announcement).toHaveTextContent('Saving your changes...');
    });

    it('properly disables button when loading or disabled', () => {
      const { rerender } = render(<DynButton label="Test" disabled />);
      let button = screen.getByRole('button', { name: 'Test' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');

      rerender(<DynButton label="Test" loading />);
      button = screen.getByRole('button', { name: 'Test' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onClick handler when clicked', () => {
      const onClick = vi.fn();
      render(<DynButton label="Click me" onClick={onClick} />);

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('prevents onClick when disabled', () => {
      const onClick = vi.fn();
      render(<DynButton label="Disabled" disabled onClick={onClick} />);

      fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('prevents onClick when loading', () => {
      const onClick = vi.fn();
      render(<DynButton label="Loading" loading onClick={onClick} />);

      fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('activates on Space key press', () => {
      const onClick = vi.fn();
      render(<DynButton label="Space test" onClick={onClick} />);

      const button = screen.getByRole('button', { name: 'Space test' });
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Spacebar key press (legacy)', () => {
      const onClick = vi.fn();
      render(<DynButton label="Spacebar test" onClick={onClick} />);

      const button = screen.getByRole('button', { name: 'Spacebar test' });
      fireEvent.keyDown(button, { key: 'Spacebar' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate on Space when disabled', () => {
      const onClick = vi.fn();
      render(<DynButton label="Disabled" disabled onClick={onClick} />);

      const button = screen.getByRole('button', { name: 'Disabled' });
      fireEvent.keyDown(button, { key: ' ' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not activate on Space when loading', () => {
      const onClick = vi.fn();
      render(<DynButton label="Loading" loading onClick={onClick} />);

      const button = screen.getByRole('button', { name: 'Loading' });
      fireEvent.keyDown(button, { key: ' ' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('calls custom onKeyDown handler', () => {
      const onKeyDown = vi.fn();
      render(<DynButton label="Key test" onKeyDown={onKeyDown} />);

      const button = screen.getByRole('button', { name: 'Key test' });
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur handler when focus is lost', () => {
      const onBlur = vi.fn();
      render(<DynButton label="Blur test" onBlur={onBlur} />);

      const button = screen.getByRole('button', { name: 'Blur test' });
      fireEvent.blur(button);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variants and States', () => {
    it('renders primary kind by default', () => {
      render(<DynButton label="Primary" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.kindPrimary!);
    });

    it('renders secondary kind correctly', () => {
      render(<DynButton label="Secondary" kind="secondary" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.kindSecondary!);
    });

    it('renders tertiary kind correctly', () => {
      render(<DynButton label="Tertiary" kind="tertiary" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.kindTertiary!);
    });

    it('renders small size correctly', () => {
      render(<DynButton label="Small" size="small" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.sizeSmall!);
    });

    it('renders medium size by default', () => {
      render(<DynButton label="Medium" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.sizeMedium!);
    });

    it('renders large size correctly', () => {
      render(<DynButton label="Large" size="large" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.sizeLarge!);
    });

    it('renders danger state correctly', () => {
      render(<DynButton label="Delete" danger />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.danger!);
    });

    it('renders loading state with spinner', () => {
      render(<DynButton label="Loading" loading />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.loading!);
      expect(button.querySelector(`.${classes.spinner}`)).toBeInTheDocument();
      expect(button.querySelector(`.${classes.content}`)).toHaveStyle({ opacity: '0' });
    });

    it('renders full width correctly', () => {
      render(<DynButton label="Full Width" fullWidth />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.fullWidth!);
    });

    it('renders mobile utilities correctly', () => {
      render(
        <DynButton
          label="Mobile test"
          icon="settings"
          hideOnMobile
          iconOnlyOnMobile
        />
      );

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass(classes.hideOnMobile!);
      expect(button).toHaveClass(classes.iconOnlyOnMobile!);
    });
  });

  describe('Props and Customization', () => {
    it('accepts custom className', () => {
      render(<DynButton label="Custom" className="custom-class" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass(classes.root!);
    });

    it('accepts custom data-testid', () => {
      render(<DynButton label="Test" data-testid="custom-button" />);

      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });

    it('accepts custom role', () => {
      render(<DynButton label="Custom role" role="menuitem" />);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveAttribute('role', 'menuitem');
    });

    it('supports submit and reset button types', () => {
      const { rerender } = render(<DynButton label="Submit" type="submit" />);
      let button = screen.getByTestId('dyn-button');
      expect(button).toHaveAttribute('type', 'submit');

      rerender(<DynButton label="Reset" type="reset" />);
      button = screen.getByTestId('dyn-button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('handles string children correctly', () => {
      render(<DynButton>String child</DynButton>);

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveTextContent('String child');
      expect(button.querySelector(`.${classes.label}`)).toHaveTextContent('String child');
    });

    it('handles empty string children', () => {
      render(<DynButton>   </DynButton>);

      const button = screen.getByTestId('dyn-button');
      expect(button.querySelector(`.${classes.label}`)).not.toBeInTheDocument();
    });

    it('renders ReactNode icon correctly', () => {
      const CustomIcon = () => <span data-testid="custom-icon">🎯</span>;
      render(<DynButton icon={<CustomIcon />} label="Custom icon" />);

      const button = screen.getByTestId('dyn-button');
      const icon = screen.getByTestId('custom-icon');
      expect(button).toContainElement(icon);
      expect(button.querySelector(`.${classes.icon}`)).toContainElement(icon);
    });

    it('passes through additional HTML attributes', () => {
      render(
        <DynButton
          label="Test"
          tabIndex={-1}
          title="Button tooltip"
        />
      );

      const button = screen.getByTestId('dyn-button');
      expect(button).toHaveAttribute('tabIndex', '-1');
      expect(button).toHaveAttribute('title', 'Button tooltip');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty label gracefully', () => {
      render(<DynButton label="" />);

      const button = screen.getByTestId('dyn-button');
      expect(button.querySelector(`.${classes.label}`)).not.toBeInTheDocument();
    });

    it('handles whitespace-only label', () => {
      render(<DynButton label="   " />);

      const button = screen.getByTestId('dyn-button');
      expect(button.querySelector(`.${classes.label}`)).not.toBeInTheDocument();
    });

    it('handles empty loadingText gracefully', () => {
      render(<DynButton label="Test" loading loadingText="" />);

      const button = screen.getByTestId('dyn-button');
      const announcement = button.querySelector('.dyn-sr-only');
      expect(announcement).toHaveTextContent('Loading…'); // Falls back to default
    });

    it('handles undefined loadingText', () => {
      render(<DynButton label="Test" loading loadingText={undefined} />);

      const button = screen.getByTestId('dyn-button');
      const announcement = button.querySelector('.dyn-sr-only');
      expect(announcement).toHaveTextContent('Loading…'); // Falls back to default
    });

    it('handles non-string loadingText', () => {
      render(<DynButton label="Test" loading loadingText={123 as any} />);

      const button = screen.getByTestId('dyn-button');
      const announcement = button.querySelector('.dyn-sr-only');
      expect(announcement).toHaveTextContent('Loading…'); // Falls back to default
    });
  });
});
