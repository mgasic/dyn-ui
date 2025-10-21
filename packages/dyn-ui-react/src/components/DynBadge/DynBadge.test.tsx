import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynBadge } from './DynBadge';
import styles from './DynBadge.module.css';

const classes = styles as Record<string, string>;

describe('DynBadge', () => {
  describe('Basic Functionality', () => {
    it('renders badge with text content', () => {
      render(<DynBadge>New</DynBadge>);
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByTestId('dyn-badge')).toBeInTheDocument();
    });

    it('renders count badges correctly', () => {
      render(<DynBadge count={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows maxCount+ when count exceeds maximum', () => {
      render(<DynBadge count={150} maxCount={99} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('hides badge when count is 0 and showZero is false', () => {
      const { container } = render(<DynBadge count={0} />);
      expect(container.firstChild).toBeNull();
    });

    it('shows badge when count is 0 and showZero is true', () => {
      render(<DynBadge count={0} showZero />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders with count prop', () => {
      render(<DynBadge count={7} />);
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByTestId('dyn-badge')).toBeInTheDocument();
    });

    it('supports legacy value prop alias', () => {
      render(<DynBadge value={7} />);
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByTestId('dyn-badge')).toBeInTheDocument();
    });

    it('uses generateId for internal id when not provided', () => {
      render(<DynBadge>Test</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');
      expect(badge).toHaveAttribute('id');
      expect(badge.id).toMatch(/^badge-\d+$/);
    });

    it('uses provided id when given', () => {
      render(<DynBadge id="custom-badge">Test</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');
      expect(badge).toHaveAttribute('id', 'custom-badge');
    });
  });

  describe('Accessibility', () => {
    it('announces count to screen readers', () => {
      render(<DynBadge count={3} countDescription="Notifications" />);
      expect(screen.getByText('Notifications: 3')).toBeInTheDocument();
    });

    it('has aria-live for dynamic counts', () => {
      render(<DynBadge count={5} />);
      expect(screen.getByTestId('dyn-badge')).toHaveAttribute('aria-live', 'polite');
    });

    it('supports custom aria-label', () => {
      render(<DynBadge aria-label="Status indicator">Active</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveAttribute('aria-label', 'Status indicator');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <DynBadge aria-describedby="badge-description">Status</DynBadge>
          <div id="badge-description">Current user status</div>
        </>
      );
      expect(screen.getByTestId('dyn-badge')).toHaveAttribute('aria-describedby', 'badge-description');
    });

    it('generates automatic aria-label for count badges', () => {
      render(<DynBadge count={5} />);
      expect(screen.getByTestId('dyn-badge')).toHaveAttribute('aria-label', 'Count: 5');
    });

    it('uses custom countDescription in aria-label', () => {
      render(<DynBadge count={3} countDescription="Messages" />);
      expect(screen.getByTestId('dyn-badge')).toHaveAttribute('aria-label', 'Messages: 3');
    });

    it('supports icon-only usage with aria-label', () => {
      render(
        <DynBadge aria-label="3 unread mentions" startIcon={<span data-testid="badge-icon">@</span>} />
      );

      expect(screen.getByLabelText('3 unread mentions')).toBeInTheDocument();
      expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    });
  });

  describe('Interactive Behavior', () => {
    it('handles click events when clickable', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<DynBadge onClick={handleClick}>Clickable</DynBadge>);

      const badge = screen.getByRole('button');
      expect(badge).toHaveAttribute('tabIndex', '0');
      expect(badge).toHaveClass(classes['badge--clickable']!);

      await user.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<DynBadge onClick={handleClick}>Keyboard</DynBadge>);

      const badge = screen.getByRole('button');
      badge.focus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('is not interactive without onClick', () => {
      render(<DynBadge>Non-interactive</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');

      expect(badge).not.toHaveAttribute('role', 'button');
      expect(badge).not.toHaveAttribute('tabIndex');
      expect(badge).not.toHaveClass(classes['badge--clickable']!);
    });

    it('handles custom onKeyDown event', async () => {
      const handleClick = vi.fn();
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();

      render(
        <DynBadge onClick={handleClick} onKeyDown={handleKeyDown}>
          Custom KeyDown
        </DynBadge>
      );

      // Badge is interactive because it has onClick -> role="button" and tabIndex=0
      const badge = screen.getByRole('button');
      badge.focus();
      await user.keyboard('{Enter}');

      expect(handleKeyDown).toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Variants and Colors', () => {
    it('applies variant classes correctly', () => {
      const { rerender } = render(<DynBadge variant="solid">Solid</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--solid']!);

      rerender(<DynBadge variant="soft">Soft</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--soft']!);

      rerender(<DynBadge variant="outline">Outline</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--outline']!);

      rerender(<DynBadge variant="dot" />);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--dot']!);
    });

    it('applies color classes correctly', () => {
      const { rerender } = render(<DynBadge color="primary">Primary</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--primary']!);

      rerender(<DynBadge color="danger">Danger</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--danger']!);

      rerender(<DynBadge color="success">Success</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--success']!);
    });

    it('applies state classes including default neutral', () => {
      const { rerender } = render(<DynBadge>Default</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--state-neutral']!);

      rerender(
        <DynBadge state="success" color="warning">
          Success State
        </DynBadge>
      );
      const badge = screen.getByTestId('dyn-badge');
      expect(badge).toHaveClass(classes['badge--state-success']!);
      expect(badge).toHaveClass(classes['badge--warning']!);
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(<DynBadge size="small">Small</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--small']!);

      rerender(<DynBadge size="large">Large</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--large']!);
    });

    it('handles custom color values with CSS variables', () => {
      render(<DynBadge color="#ff0000">Custom Color</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');

      expect(badge.style.getPropertyValue('--badge-accent')).toBe('#ff0000');
      expect(badge.style.getPropertyValue('--badge-outline-color')).toBe('#ff0000');
    });

    it('renders dot variant correctly', () => {
      render(<DynBadge variant="dot" color="danger" />);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--dot']!);
    });
  });

  describe('Icons', () => {
    it('renders start icon', () => {
      render(
        <DynBadge startIcon={<span data-testid="start-icon">🔥</span>}>
          Hot
        </DynBadge>
      );
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      render(
        <DynBadge endIcon={<span data-testid="end-icon">→</span>}>
          Next
        </DynBadge>
      );
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('icons have aria-hidden attribute', () => {
      render(
        <DynBadge
          startIcon={<span data-testid="start-icon">🔥</span>}
          endIcon={<span data-testid="end-icon">→</span>}
        >
          Test
        </DynBadge>
      );

      const startIcon = screen.getByTestId('start-icon').parentElement;
      const endIcon = screen.getByTestId('end-icon').parentElement;

      expect(startIcon).toHaveAttribute('aria-hidden', 'true');
      expect(endIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Positioning', () => {
    it('applies position classes correctly', () => {
      const { rerender } = render(<DynBadge position="topRight">Positioned</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');
      expect(badge).toHaveClass(classes['badge--positioned']!);
      expect(badge).toHaveClass(classes['badge--topRight']!);

      rerender(<DynBadge position="topLeft">Positioned</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--topLeft']!);

      rerender(<DynBadge position="bottomRight">Positioned</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--bottomRight']!);

      rerender(<DynBadge position="bottomLeft">Positioned</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--bottomLeft']!);
    });
  });

  describe('Animation', () => {
    it('applies animated class when animated prop is true', () => {
      render(<DynBadge animated>Animated</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--animated']!);
    });

    it('applies pulse class when pulse prop is true', () => {
      render(<DynBadge pulse>Pulsing</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass(classes['badge--pulse']!);
    });

    it('can combine animated and pulse classes', () => {
      render(<DynBadge animated pulse>Both</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');
      expect(badge).toHaveClass(classes['badge--animated']!);
      expect(badge).toHaveClass(classes['badge--pulse']!);
    });
  });

  describe('CSS Module Safety', () => {
    it('handles missing CSS classes gracefully', () => {
      // This test ensures getStyleClass returns empty string for missing classes
      render(<DynBadge className="test-badge">Safe</DynBadge>);
      const badge = screen.getByTestId('dyn-badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards custom data attributes', () => {
      render(<DynBadge data-custom="test-value">Custom Data</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveAttribute('data-custom', 'test-value');
    });

    it('forwards custom className', () => {
      render(<DynBadge className="custom-class">Custom Class</DynBadge>);
      expect(screen.getByTestId('dyn-badge')).toHaveClass('custom-class');
    });

    it('uses custom data-testid when provided', () => {
      render(<DynBadge data-testid="custom-badge">Custom TestID</DynBadge>);
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
      expect(screen.queryByTestId('dyn-badge')).not.toBeInTheDocument();
    });
  });
});
