/**
 * DynToolbar Unit Tests
 * Comprehensive test coverage for toolbar component functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { DynToolbar } from './DynToolbar';
import { ToolbarItem, DynToolbarRef } from './DynToolbar.types';

const jest = vi;

// Mock child components
jest.mock('../DynIcon', () => {
  return {
    DynIcon: ({ icon, className }: { icon: string; className?: string }) => (
      <i data-testid={`icon-${icon}`} className={className} />
    )
  };
});

jest.mock('../DynBadge', () => {
  return {
    DynBadge: ({
      count,
      size,
      children
    }: { count?: number; size?: string; children?: React.ReactNode }) => (
      <span data-testid="badge" data-count={count} data-size={size}>
        {children ?? count}
      </span>
    )
  };
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock getBoundingClientRect
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: jest.fn(() => ({
    width: 100,
    height: 40,
    top: 0,
    left: 0,
    bottom: 40,
    right: 100,
    x: 0,
    y: 0,
    toJSON: jest.fn()
  }))
});

// Sample test data
const basicItems: ToolbarItem[] = [
  {
    id: 'item1',
    label: 'Item 1',
    icon: 'test-icon-1',
    action: jest.fn()
  },
  {
    id: 'item2',
    label: 'Item 2',
    icon: 'test-icon-2',
    disabled: true,
    action: jest.fn()
  },
  {
    id: 'sep1',
    type: 'separator'
  },
  {
    id: 'item3',
    label: 'Item 3',
    badge: 5,
    action: jest.fn()
  }
];

const dropdownItems: ToolbarItem[] = [
  {
    id: 'dropdown1',
    label: 'Dropdown',
    type: 'dropdown',
    items: [
      { id: 'sub1', label: 'Sub Item 1', action: jest.fn() },
      { id: 'sub2', label: 'Sub Item 2', action: jest.fn() }
    ]
  }
];

const defaultProps = {
  items: basicItems
};

describe('DynToolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toolbar with items', async () => {
    const user = userEvent.setup();
    render(<DynToolbar {...defaultProps} />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    const overflowButton = screen.getByLabelText('More actions');
    expect(overflowButton).toBeInTheDocument();
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument();

    await user.click(overflowButton);

    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('displays icons for items', () => {
    render(<DynToolbar {...defaultProps} />);

    expect(screen.getByTestId('icon-test-icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-test-icon-2')).toBeInTheDocument();
  });

  it('displays badges on items', async () => {
    const user = userEvent.setup();
    render(<DynToolbar {...defaultProps} />);

    await user.click(screen.getByLabelText('More actions'));

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-count', '5');
  });

  it('handles item clicks', async () => {
    const user = userEvent.setup();
    render(<DynToolbar {...defaultProps} />);

    const item1 = screen.getByText('Item 1');
    await user.click(item1);

    expect(basicItems[0].action).toHaveBeenCalled();
  });

  it('does not trigger action for disabled items', async () => {
    const user = userEvent.setup();
    render(<DynToolbar {...defaultProps} />);

    const item2 = screen.getByText('Item 2');
    await user.click(item2);

    expect(basicItems[1].action).not.toHaveBeenCalled();
  });

  it('calls onItemClick callback', async () => {
    const onItemClick = jest.fn();
    const user = userEvent.setup();
    render(<DynToolbar items={basicItems} onItemClick={onItemClick} />);

    const item1 = screen.getByText('Item 1');
    await user.click(item1);

    expect(onItemClick).toHaveBeenCalledWith(basicItems[0]);
  });

  it('renders separators', () => {
    render(<DynToolbar {...defaultProps} />);

    const separators = document.querySelectorAll('.toolbar-separator');
    expect(separators).toHaveLength(1);
  });

  it('renders search input', () => {
    const searchItems: ToolbarItem[] = [
      {
        id: 'search1',
        type: 'search',
        label: 'Search placeholder'
      }
    ];

    render(<DynToolbar items={searchItems} />);

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search placeholder');
  });

  it('renders custom components', () => {
    const customItems: ToolbarItem[] = [
      {
        id: 'custom1',
        type: 'custom',
        component: <div data-testid="custom-component">Custom Content</div>
      }
    ];

    render(<DynToolbar items={customItems} />);

    expect(screen.getByTestId('custom-component')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('handles dropdown items', async () => {
    const user = userEvent.setup();
    render(<DynToolbar items={dropdownItems} />);

    const dropdownButton = screen.getByText('Dropdown');
    expect(dropdownButton).toHaveAttribute('aria-haspopup', 'menu');
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(dropdownButton);

    expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
    expect(screen.getByText('Sub Item 2')).toBeInTheDocument();
  });

  it('handles dropdown sub-item clicks', async () => {
    const user = userEvent.setup();
    render(<DynToolbar items={dropdownItems} />);

    // Open dropdown
    const dropdownButton = screen.getByText('Dropdown');
    await user.click(dropdownButton);

    // Click sub-item
    const subItem1 = screen.getByText('Sub Item 1');
    await user.click(subItem1);

    expect(dropdownItems[0].items![0].action).toHaveBeenCalled();
  });

  it('applies different variants correctly', () => {
    const { container, rerender } = render(
      <DynToolbar items={basicItems} variant="minimal" />
    );

    expect(container.firstChild).toHaveClass('variant-minimal');

    rerender(<DynToolbar items={basicItems} variant="floating" />);
    expect(container.firstChild).toHaveClass('variant-floating');
  });

  it('applies different sizes correctly', () => {
    const { container, rerender } = render(
      <DynToolbar items={basicItems} size="small" />
    );

    expect(container.firstChild).toHaveClass('size-small');

    rerender(<DynToolbar items={basicItems} size="large" />);
    expect(container.firstChild).toHaveClass('size-large');
  });

  it('applies different positions correctly', () => {
    const { container, rerender } = render(
      <DynToolbar items={basicItems} position="fixed-top" />
    );

    expect(container.firstChild).toHaveClass('position-fixed-top');

    rerender(<DynToolbar items={basicItems} position="bottom" />);
    expect(container.firstChild).toHaveClass('position-bottom');
  });

  it('hides labels when showLabels is false', () => {
    const { container } = render(
      <DynToolbar items={basicItems} showLabels={false} />
    );

    expect(container.firstChild).not.toHaveClass('show-labels');
  });

  it('shows labels when showLabels is true', () => {
    const { container } = render(
      <DynToolbar items={basicItems} showLabels={true} />
    );

    expect(container.firstChild).toHaveClass('show-labels');
  });

  it('applies custom className', () => {
    const customClass = 'custom-toolbar-class';
    const { container } = render(
      <DynToolbar items={basicItems} className={customClass} />
    );

    expect(container.firstChild).toHaveClass(customClass);
  });

  it('applies custom itemClassName', () => {
    const customItemClass = 'custom-item-class';
    render(
      <DynToolbar items={basicItems} itemClassName={customItemClass} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass(customItemClass);
    });
  });

  it('filters out invisible items', () => {
    const itemsWithInvisible: ToolbarItem[] = [
      { id: 'visible', label: 'Visible Item', action: jest.fn() },
      { id: 'invisible', label: 'Invisible Item', visible: false, action: jest.fn() }
    ];

    render(<DynToolbar items={itemsWithInvisible} />);

    expect(screen.getByText('Visible Item')).toBeInTheDocument();
    expect(screen.queryByText('Invisible Item')).not.toBeInTheDocument();
  });

  it('handles overflow menu when responsive is enabled', async () => {
    const manyItems: ToolbarItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: `item${i}`,
      label: `Item ${i}`,
      action: jest.fn()
    }));

    // Mock toolbar width to be small
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 300
    });

    render(
      <DynToolbar
        items={manyItems}
        responsive={true}
        overflowMenu={true}
        overflowThreshold={3}
      />
    );

    // Should show overflow button
    expect(screen.getByLabelText('More actions')).toBeInTheDocument();
  });

  it('enforces overflow threshold even when width is sufficient', () => {
    const thresholdItems: ToolbarItem[] = Array.from({ length: 6 }, (_, i) => ({
      id: `threshold-${i}`,
      label: `Threshold ${i}`,
      action: jest.fn()
    }));

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 2000
    });

    render(
      <DynToolbar
        items={thresholdItems}
        responsive={true}
        overflowMenu={true}
        overflowThreshold={3}
      />
    );

    expect(screen.getByLabelText('More actions')).toBeInTheDocument();
    expect(screen.queryByText('Threshold 4')).not.toBeInTheDocument();
  });

  it('opens and closes overflow menu', async () => {
    const user = userEvent.setup();
    const manyItems: ToolbarItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: `item${i}`,
      label: `Item ${i}`,
      action: jest.fn()
    }));

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 300
    });

    const onOverflowToggle = jest.fn();
    render(
      <DynToolbar
        items={manyItems}
        responsive={true}
        overflowMenu={true}
        overflowThreshold={3}
        onOverflowToggle={onOverflowToggle}
      />
    );

    const overflowButton = screen.getByLabelText('More actions');

    // Open overflow menu
    await user.click(overflowButton);
    expect(onOverflowToggle).toHaveBeenCalledWith(true);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Close overflow menu
    await user.click(overflowButton);
    expect(onOverflowToggle).toHaveBeenCalledWith(false);
  });

  it('closes dropdown and overflow menus when clicking outside', async () => {
    const user = userEvent.setup();
    render(<DynToolbar items={dropdownItems} />);

    // Open dropdown
    const dropdownButton = screen.getByText('Dropdown');
    await user.click(dropdownButton);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click outside
    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<DynToolbar {...defaultProps} />);

    const firstButton = screen.getByText('Item 1');
    firstButton.focus();

    await user.keyboard('{Enter}');
    expect(basicItems[0].action).toHaveBeenCalled();

    jest.clearAllMocks();

    await user.keyboard(' ');
    expect(basicItems[0].action).toHaveBeenCalled();
  });

  describe('Imperative API', () => {
    it('provides openOverflow method', () => {
      const toolbarRef = React.createRef<DynToolbarRef>();
      const onOverflowToggle = jest.fn();

      render(
        <DynToolbar
          ref={toolbarRef}
          items={basicItems}
          onOverflowToggle={onOverflowToggle}
        />
      );

      act(() => {
        toolbarRef.current?.openOverflow();
      });

      expect(onOverflowToggle).toHaveBeenCalledWith(true);
    });

    it('provides closeOverflow method', () => {
      const toolbarRef = React.createRef<DynToolbarRef>();
      const onOverflowToggle = jest.fn();

      render(
        <DynToolbar
          ref={toolbarRef}
          items={basicItems}
          onOverflowToggle={onOverflowToggle}
        />
      );

      act(() => {
        toolbarRef.current?.closeOverflow();
      });

      expect(onOverflowToggle).toHaveBeenCalledWith(false);
    });

    it('provides toggleOverflow method', () => {
      const toolbarRef = React.createRef<DynToolbarRef>();
      const onOverflowToggle = jest.fn();

      render(
        <DynToolbar
          ref={toolbarRef}
          items={basicItems}
          onOverflowToggle={onOverflowToggle}
        />
      );

      act(() => {
        toolbarRef.current?.toggleOverflow();
      });

      expect(onOverflowToggle).toHaveBeenCalledWith(true);

      act(() => {
        toolbarRef.current?.toggleOverflow();
      });

      expect(onOverflowToggle).toHaveBeenCalledWith(false);
    });

    it('provides refreshLayout method', () => {
      const toolbarRef = React.createRef<DynToolbarRef>();

      render(
        <DynToolbar
          ref={toolbarRef}
          items={basicItems}
          responsive={true}
        />
      );

      expect(() => {
        act(() => {
          toolbarRef.current?.refreshLayout();
        });
      }).not.toThrow();
    });
  });

  it('handles empty items array', () => {
    render(<DynToolbar items={[]} />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows tooltip on items with tooltip property', () => {
    const itemsWithTooltip: ToolbarItem[] = [
      {
        id: 'tooltip-item',
        label: 'Item with Tooltip',
        tooltip: 'This is a tooltip',
        action: jest.fn()
      }
    ];

    render(<DynToolbar items={itemsWithTooltip} />);

    const button = screen.getByText('Item with Tooltip');
    expect(button).toHaveAttribute('title', 'This is a tooltip');
  });

  it('falls back to label for aria-label when tooltip is not provided', () => {
    const itemsWithoutTooltip: ToolbarItem[] = [
      {
        id: 'no-tooltip-item',
        label: 'Item without Tooltip',
        action: jest.fn()
      }
    ];

    render(<DynToolbar items={itemsWithoutTooltip} />);

    const button = screen.getByText('Item without Tooltip');
    expect(button).toHaveAttribute('aria-label', 'Item without Tooltip');
  });

  it('falls back to window resize events when ResizeObserver lacks required methods', async () => {
    const manyItems: ToolbarItem[] = Array.from({ length: 6 }, (_, index) => ({
      id: `item-${index}`,
      label: `Item ${index}`,
      action: jest.fn()
    }));

    (global.ResizeObserver as Mock).mockImplementationOnce(() => ({} as ResizeObserver));

    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    let offsetWidthValue = 0;

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return offsetWidthValue;
      }
    });

    try {
      render(
        <DynToolbar
          items={manyItems}
          responsive={true}
          overflowMenu={true}
          overflowThreshold={manyItems.length + 1}
        />
      );

      expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();

      offsetWidthValue = 200;

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(screen.getByLabelText('More actions')).toBeInTheDocument();
      });
    } finally {
      if (originalOffsetWidth) {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
      } else {
        delete (HTMLElement.prototype as unknown as { offsetWidth?: number }).offsetWidth;
      }
    }
  });

  it('handles ResizeObserver updates', () => {
    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    (global.ResizeObserver as Mock).mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: mockDisconnect
    }));

    const { unmount } = render(
      <DynToolbar items={basicItems} responsive={true} />
    );

    expect(mockObserve).toHaveBeenCalled();

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
