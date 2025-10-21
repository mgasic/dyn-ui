/**
 * DynTabs Component Test Suite
 * Following DynAvatar Vitest pattern exactly
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testA11y } from '../../testing/accessibility';
import { DynTabs } from './DynTabs';
import { DynTabItem } from './DynTabs.types';
import styles from './DynTabs.module.css';

// Helper function for safe CSS class access (following DynAvatar pattern)
const getStyleClass = (className: string): string => {
  return (styles as Record<string, string>)[className] || '';
};

// Mock data following DynAvatar test structure
const mockItems: DynTabItem[] = [
  {
    id: 'tab-1',
    label: 'First Tab',
    content: <div>First tab content</div>
  },
  {
    id: 'tab-2',
    label: 'Second Tab',
    content: <div>Second tab content</div>,
    icon: <span data-testid="tab-icon">📄</span>
  },
  {
    id: 'tab-3',
    label: 'Disabled Tab',
    content: <div>Disabled content</div>,
    disabled: true
  },
  {
    id: 'tab-4',
    label: 'Closable Tab',
    content: <div>Closable content</div>,
    closable: true,
    badge: '5'
  }
];

const defaultProps = {
  items: mockItems,
  'data-testid': 'test-tabs'
};

describe('DynTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    test('renders tabs with proper structure', () => {
      render(<DynTabs {...defaultProps} />);

      const tablist = screen.getByRole('tablist');
      const tabs = screen.getAllByRole('tab');
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toBeInTheDocument();
      expect(tabs).toHaveLength(4);
      expect(tabpanel).toBeInTheDocument();
    });

    test('shows first enabled tab as active by default', () => {
      render(<DynTabs {...defaultProps} />);

      const firstTab = screen.getByRole('tab', { name: /first tab/i });
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('First tab content')).toBeInTheDocument();
    });

    test('respects defaultActiveTab prop', () => {
      render(<DynTabs {...defaultProps} defaultActiveTab="tab-2" />);

      const secondTab = screen.getByRole('tab', { name: /second tab/i });
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Second tab content')).toBeInTheDocument();
    });

    test('switches tabs on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<DynTabs {...defaultProps} onChange={onChange} />);

      const secondTab = screen.getByRole('tab', { name: /second tab/i });
      await user.click(secondTab);

      expect(onChange).toHaveBeenCalledWith(
        'tab-2',
        expect.objectContaining({
          activeTab: 'tab-2',
          previousTab: 'tab-1',
          trigger: 'click',
          tabData: expect.objectContaining({ id: 'tab-2' }),
        })
      );
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ignores clicks on disabled tabs', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<DynTabs {...defaultProps} onChange={onChange} />);

      const disabledTab = screen.getByRole('tab', { name: /disabled tab/i });
      await user.click(disabledTab);

      expect(onChange).not.toHaveBeenCalled();
      expect(disabledTab).toHaveAttribute('aria-selected', 'false');
    });

    test('handles controlled activeTab prop changes', () => {
      const { rerender } = render(<DynTabs {...defaultProps} activeTab="tab-1" />);

      expect(screen.getByText('First tab content')).toBeInTheDocument();

      rerender(<DynTabs {...defaultProps} activeTab="tab-2" />);

      expect(screen.getByText('Second tab content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      await testA11y(<DynTabs {...defaultProps} />);
    });

    test('implements proper ARIA tablist pattern', () => {
      render(<DynTabs {...defaultProps} />);

      const tablist = screen.getByRole('tablist');
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toHaveAttribute('role', 'tablist');

      // Map tabs by their accessible name (label) instead of relying on DOM order.
      mockItems.forEach((item) => {
        // If a tab is disabled it may still exist, but some implementations omit aria-controls.
        // We try to locate the tab by name and then assert presence/shape of aria-controls when present.
        const tab = screen.queryByRole('tab', { name: new RegExp(item.label, 'i') });
        if (!tab) return;

        expect(tab).toHaveAttribute('role', 'tab');

        const ariaControls = tab.getAttribute('aria-controls');
        // Ensure aria-controls exists and references expected panel id when provided
        expect(ariaControls).toBeTruthy();
        expect(ariaControls).toContain(`panel-${item.id}`);
      });

      expect(tabpanel).toHaveAttribute('role', 'tabpanel');
    });

    test('manages tabIndex correctly for roving tabindex pattern', () => {
      render(<DynTabs {...defaultProps} />);

      const tabs = screen.getAllByRole('tab');

      // First tab should be focusable, others should not
      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[3]).toHaveAttribute('tabIndex', '-1');
    });

    test('supports custom aria-label on tablist', () => {
      render(<DynTabs {...defaultProps} aria-label="Navigation tabs" />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Navigation tabs');
    });

    test('supports aria-labelledby and aria-describedby', () => {
      render(
        <div>
          <h2 id="tabs-heading">Section Tabs</h2>
          <p id="tabs-description">Navigate between sections</p>
          <DynTabs
            {...defaultProps}
            aria-labelledby="tabs-heading"
            aria-describedby="tabs-description"
          />
        </div>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-labelledby', 'tabs-heading');
      expect(tablist).toHaveAttribute('aria-describedby', 'tabs-description');
    });

    test('sets data-status attribute correctly', () => {
      render(<DynTabs {...defaultProps} />);

      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveAttribute('data-status', 'active');

      const disabledTab = screen.getByRole('tab', { name: /disabled tab/i });
      expect(disabledTab).toHaveAttribute('data-status', 'disabled');

      const inactiveTab = screen.getByRole('tab', { name: /second tab/i });
      expect(inactiveTab).toHaveAttribute('data-status', 'inactive');
    });
  });

  describe('Interactive Behavior', () => {
    test('handles click events', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<DynTabs {...defaultProps} onChange={onChange} />);

      const secondTab = screen.getByRole('tab', { name: /second tab/i });
      await user.click(secondTab);

      expect(onChange).toHaveBeenCalledWith(
        'tab-2',
        expect.objectContaining({
          activeTab: 'tab-2',
          previousTab: 'tab-1',
          trigger: 'click',
        })
      );
    });

    test('handles keyboard navigation with ArrowLeft and ArrowRight', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<DynTabs {...defaultProps} onChange={onChange} />);

      const firstTab = screen.getByRole('tab', { name: /first tab/i });
      const lastTab = screen.getByRole('tab', { name: /closable tab/i });
      firstTab.focus();

      await user.keyboard('{ArrowLeft}');
      expect(onChange).toHaveBeenLastCalledWith(
        'tab-4',
        expect.objectContaining({
          activeTab: 'tab-4',
          previousTab: 'tab-1',
          trigger: 'keyboard',
        })
      );
      expect(document.activeElement).toBe(lastTab);

      await user.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenLastCalledWith(
        'tab-1',
        expect.objectContaining({
          activeTab: 'tab-1',
          previousTab: 'tab-4',
          trigger: 'keyboard',
        })
      );
      expect(document.activeElement).toBe(firstTab);
    });

    test('supports Home and End keys', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<DynTabs {...defaultProps} defaultActiveTab="tab-2" onChange={onChange} />);

      const secondTab = screen.getByRole('tab', { name: /second tab/i });
      secondTab.focus();

      await user.keyboard('{Home}');
      expect(onChange).toHaveBeenLastCalledWith(
        'tab-1',
        expect.objectContaining({
          activeTab: 'tab-1',
          previousTab: 'tab-2',
          trigger: 'keyboard',
        })
      );

      await user.keyboard('{End}');
      expect(onChange).toHaveBeenLastCalledWith(
        'tab-4',
        expect.objectContaining({
          activeTab: 'tab-4',
          previousTab: 'tab-1',
          trigger: 'keyboard',
        })
      );
    });

    test('handles tab closing', async () => {
      const user = userEvent.setup();
      const onTabClose = vi.fn();

      render(<DynTabs {...defaultProps} closable onTabClose={onTabClose} />);

      const closeButton = screen.getByTestId('test-tabs-close-tab-4');
      await user.click(closeButton);

      expect(onTabClose).toHaveBeenCalledWith('tab-4');
    });

    test('disables all interactions when disabled prop is set', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<DynTabs {...defaultProps} disabled onChange={onChange} />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-disabled', 'true');

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-disabled', 'true');
        expect(tab).toBeDisabled();
      });

      await user.click(screen.getByRole('tab', { name: /second tab/i }));
      expect(onChange).not.toHaveBeenCalled();
    });

    test('renders add button when addable and triggers onTabAdd', async () => {
      const user = userEvent.setup();
      const onTabAdd = vi.fn();

      render(<DynTabs {...defaultProps} addable onTabAdd={onTabAdd} />);

      const addButton = screen.getByTestId('test-tabs-add-button');
      expect(addButton).toBeInTheDocument();

      await user.click(addButton);

      expect(onTabAdd).toHaveBeenCalledTimes(1);
    });

    test('does not render add button when addable is false', () => {
      render(<DynTabs {...defaultProps} addable={false} />);

      expect(screen.queryByTestId('test-tabs-add-button')).not.toBeInTheDocument();
    });
  });

  describe('Sizes and Variants', () => {
    test('applies size classes correctly', () => {
      const { rerender } = render(<DynTabs {...defaultProps} size="small" />);

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveClass(getStyleClass('tab--small'));
      });

      rerender(<DynTabs {...defaultProps} size="large" />);

      const largeTabs = screen.getAllByRole('tab');
      largeTabs.forEach(tab => {
        expect(tab).toHaveClass(getStyleClass('tab--large'));
      });
    });

    test('applies variant classes correctly', () => {
      const { rerender } = render(<DynTabs {...defaultProps} variant="underlined" />);

      expect(screen.getByRole('tab', { name: /first tab/i })).toHaveClass(getStyleClass('tab--underlined'));

      rerender(<DynTabs {...defaultProps} variant="pills" />);

      expect(screen.getByRole('tab', { name: /first tab/i })).toHaveClass(getStyleClass('tab--pills'));
    });

    test('applies position classes correctly', () => {
      const { container, rerender } = render(<DynTabs {...defaultProps} position="left" />);

      expect(container.firstChild).toHaveClass(getStyleClass('tabs--left'));

      rerender(<DynTabs {...defaultProps} position="bottom" />);
      expect(container.firstChild).toHaveClass(getStyleClass('tabs--bottom'));
    });
  });

  describe('Loading and Lazy States', () => {
    test('shows loading state for lazy tabs', async () => {
      const user = userEvent.setup();
      render(<DynTabs {...defaultProps} lazy defaultActiveTab="tab-1" />);

      await user.click(screen.getByRole('tab', { name: /second tab/i }));

      expect(screen.getByLabelText('Loading content')).toBeInTheDocument();
      expect(screen.getByText('Loading tab content')).toBeInTheDocument();
    });

    test('loads content progressively', async () => {
      const user = userEvent.setup();

      render(<DynTabs {...defaultProps} lazy />);

      await user.click(screen.getByRole('tab', { name: /second tab/i }));

      await waitFor(() => {
        expect(screen.getByText('Second tab content')).toBeInTheDocument();
      });
    });

    test('mounts tab panels lazily when lazyMount is enabled', async () => {
      const user = userEvent.setup();

      render(<DynTabs {...defaultProps} lazyMount />);

      expect(screen.queryByText('Second tab content')).not.toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: /second tab/i }));

      await waitFor(() => {
        expect(screen.getByText('Second tab content')).toBeInTheDocument();
      });
    });
  });

  describe('Props and Customization', () => {
    test('supports polymorphic rendering via as prop', () => {
      const { container } = render(<DynTabs {...defaultProps} as="section" />);

      expect(container.firstElementChild?.tagName).toBe('SECTION');
    });

    test('applies custom className', () => {
      const { container } = render(
        <DynTabs {...defaultProps} className="custom-tabs" />
      );

      expect(container.firstChild).toHaveClass('custom-tabs');
    });

    test('sets custom id and testid', () => {
      render(<DynTabs {...defaultProps} id="custom-id" data-testid="custom-test" />);

      const tabsContainer = screen.getByTestId('custom-test');
      expect(tabsContainer).toHaveAttribute('id', 'custom-id');
    });

    test('forwards additional props', () => {
      render(<DynTabs {...defaultProps} data-custom="test-value" />);

      const tabsContainer = screen.getByTestId('test-tabs');
      expect(tabsContainer).toHaveAttribute('data-custom', 'test-value');
    });

    test('handles empty items array', () => {
      render(<DynTabs items={[]} />);
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });
  });
});
