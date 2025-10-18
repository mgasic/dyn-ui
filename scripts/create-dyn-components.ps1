# DYN UI Navigation Components Creation Script
# This script creates all Navigation components (SCOPE 6) for the DYN UI system
# Run this script in your dyn-ui project root directory

param(
    [string]$ProjectPath = "packages/dyn-ui-react/src/components"
)

Write-Host "🚀 Creating DYN UI Navigation Components (SCOPE 6)..." -ForegroundColor Green
Write-Host "Target Directory: $ProjectPath" -ForegroundColor Yellow

# Create base directory if it doesn't exist
if (!(Test-Path $ProjectPath)) {
    New-Item -Path $ProjectPath -ItemType Directory -Force
    Write-Host "✅ Created base components directory" -ForegroundColor Cyan
}

# =============================================================================
# DYNMENU COMPONENT
# =============================================================================
Write-Host "`n📁 Creating DynMenu component..." -ForegroundColor Blue

$DynMenuPath = "$ProjectPath/DynMenu"
New-Item -Path $DynMenuPath -ItemType Directory -Force

# DynMenu.types.ts
$DynMenuTypes = @"
/**
 * DynMenu TypeScript type definitions
 * Navigation component types for hierarchical menu system
 */

export interface MenuBadge {
  value?: number;
  color?: string;
}

export interface MenuItem {
  label: string;
  icon?: string | React.ReactNode;
  shortLabel?: string;
  link?: string;
  action?: () => void;
  badge?: MenuBadge;
  subItems?: MenuItem[];
  disabled?: boolean;
  visible?: boolean;
  type?: 'divider' | 'item';
}

export interface MenuLiterals {
  collapse: string;
  expand: string;
  search: string;
}

export interface DynMenuProps {
  menus: MenuItem[];
  collapsed?: boolean;
  collapsedIcon?: string | React.ReactNode;
  filter?: boolean;
  shortLogo?: string;
  logo?: string;
  literals?: Partial<MenuLiterals>;
  automaticToggle?: boolean;
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
  onMenuClick?: (item: MenuItem) => void;
}

export interface DynMenuRef {
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
}

// Default literals
export const DEFAULT_MENU_LITERALS: MenuLiterals = {
  collapse: 'Retrair menu',
  expand: 'Expandir menu',
  search: 'Pesquisar'
};
"@

Set-Content -Path "$DynMenuPath/DynMenu.types.ts" -Value $DynMenuTypes

# DynMenu.tsx
$DynMenuTsx = @"
/**
 * DynMenu - Navigation Menu Component
 * Hierarchical menu system with collapse/expand functionality, search, and responsive design
 */

import React, { forwardRef, useImperativeHandle, useState, useEffect, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { DynMenuProps, MenuItem, MenuLiterals, DynMenuRef, DEFAULT_MENU_LITERALS } from './DynMenu.types';
import { DynIcon } from '../DynIcon';
import { DynBadge } from '../DynBadge';
import { DynInput } from '../DynInput';
import styles from './DynMenu.module.css';

const DynMenu = forwardRef<DynMenuRef, DynMenuProps>(({
  menus = [],
  collapsed: propCollapsed = false,
  collapsedIcon = 'dyn-icon-menu',
  filter = false,
  shortLogo,
  logo,
  literals: customLiterals = {},
  automaticToggle = true,
  className,
  onCollapse,
  onMenuClick
}, ref) => {
  const [collapsed, setCollapsed] = useState(propCollapsed);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState('');
  const [activeItem, setActiveItem] = useState<string>('');

  const literals = { ...DEFAULT_MENU_LITERALS, ...customLiterals };

  useImperativeHandle(ref, () => ({
    collapse: () => {
      setCollapsed(true);
      onCollapse?.(true);
    },
    expand: () => {
      setCollapsed(false);
      onCollapse?.(false);
    },
    toggle: () => {
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onCollapse?.(newCollapsed);
    }
  }));

  useEffect(() => {
    setCollapsed(propCollapsed);
  }, [propCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (automaticToggle) {
        setCollapsed(window.innerWidth < 768);
      }
    };

    if (automaticToggle) {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [automaticToggle]);

  const filteredMenus = useMemo(() => {
    if (!filterText) return menus;

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items.reduce<MenuItem[]>((acc, item) => {
        if (item.type === 'divider') {
          acc.push(item);
          return acc;
        }

        const matchesFilter =
          item.label.toLowerCase().includes(filterText.toLowerCase()) ||
          item.shortLabel?.toLowerCase().includes(filterText.toLowerCase());

        if (matchesFilter) {
          acc.push(item);
        } else if (item.subItems) {
          const filteredSubItems = filterItems(item.subItems);
          if (filteredSubItems.length > 0) {
            acc.push({ ...item, subItems: filteredSubItems });
          }
        }
        return acc;
      }, []);
    };

    return filterItems(menus);
  }, [menus, filterText]);

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleItemClick = useCallback((item: MenuItem, path: string) => {
    if (item.disabled) return;

    setActiveItem(path);

    if (item.subItems && item.subItems.length > 0) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
        return newSet;
      });
    } else {
      if (item.action) {
        item.action();
      } else if (item.link) {
        window.location.href = item.link;
      }
      onMenuClick?.(item);
    }
  }, [onMenuClick]);

  const renderMenuItem = (item: MenuItem, level = 0, parentPath = ''): React.ReactNode => {
    if (!item.visible && item.visible !== undefined) return null;

    const path = `{parentPath}/{item.label}`;
    const isExpanded = expandedItems.has(path);
    const isActive = activeItem === path;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    if (item.type === 'divider') {
      return <div key={path} className={styles['dyn-menu-divider']} />;
    }

    const itemClasses = classNames(
      styles['dyn-menu-item'],
      {
        [styles['dyn-menu-item-active']]: isActive,
        [styles['dyn-menu-item-expanded']]: isExpanded,
        [styles['dyn-menu-item-disabled']]: item.disabled,
        [styles['dyn-menu-item-with-sub']]: hasSubItems,
        [styles[`dyn-menu-item-level-{level}`]]: level > 0
      }
    );

    return (
      <div key={path} className={styles['dyn-menu-item-container']}>
        <div
          className={itemClasses}
          onClick={() => handleItemClick(item, path)}
          role="menuitem"
          tabIndex={item.disabled ? -1 : 0}
          aria-expanded={hasSubItems ? isExpanded : undefined}
        >
          <div className={styles['dyn-menu-item-content']}>
            {item.icon && (
              <div className={styles['dyn-menu-item-icon']}>
                {typeof item.icon === 'string' ? (
                  <DynIcon icon={item.icon} />
                ) : (
                  item.icon
                )}
              </div>
            )}
            <span className={styles['dyn-menu-item-label']}>
              {collapsed && item.shortLabel ? item.shortLabel : item.label}
            </span>
            {item.badge && (
              <div className={styles['dyn-menu-item-badge']}>
                <DynBadge
                  value={item.badge.value}
                  color={item.badge.color}
                  size="small"
                />
              </div>
            )}
            {hasSubItems && (
              <div className={styles['dyn-menu-item-arrow']}>
                <DynIcon
                  icon="dyn-icon-arrow-down"
                  className={classNames({
                    [styles['dyn-menu-arrow-expanded']]: isExpanded
                  })}
                />
              </div>
            )}
          </div>
        </div>
        {hasSubItems && isExpanded && (
          <div className={styles['dyn-menu-subitems']}>
            {item.subItems!.map(subItem =>
              renderMenuItem(subItem, level + 1, path)
            )}
          </div>
        )}
      </div>
    );
  };

  const menuClasses = classNames(
    styles['dyn-menu'],
    {
      [styles['dyn-menu-collapsed']]: collapsed
    },
    className
  );

  return (
    <nav className={menuClasses} role="navigation">
      <div className={styles['dyn-menu-header']}>
        <div className={styles['dyn-menu-logo']}>
          {collapsed && shortLogo ? (
            <img src={shortLogo} alt="Logo" className={styles['dyn-menu-logo-image']} />
          ) : logo ? (
            <img src={logo} alt="Logo" className={styles['dyn-menu-logo-image']} />
          ) : null}
        </div>
        <button
          className={styles['dyn-menu-toggle']}
          onClick={handleToggleCollapse}
          aria-label={collapsed ? literals.expand : literals.collapse}
        >
          {typeof collapsedIcon === 'string' ? (
            <DynIcon icon={collapsedIcon} />
          ) : (
            collapsedIcon
          )}
        </button>
      </div>
      {filter && !collapsed && (
        <div className={styles['dyn-menu-filter']}>
          <DynInput
            placeholder={literals.search}
            value={filterText}
            onChange={setFilterText}
            icon="dyn-icon-search"
            size="small"
          />
        </div>
      )}
      <div className={styles['dyn-menu-content']}>
        <div className={styles['dyn-menu-items']} role="menu">
          {filteredMenus.map(item => renderMenuItem(item))}
        </div>
      </div>
    </nav>
  );
});

DynMenu.displayName = 'DynMenu';

export default DynMenu;
export { DynMenu };
"@

Set-Content -Path "$DynMenuPath/DynMenu.tsx" -Value $DynMenuTsx

# DynMenu.module.css
$DynMenuCss = @"
/**
 * DynMenu CSS Styles
 * Responsive navigation menu with collapse animations and hover effects
 */

/* Menu Container */
.dyn-menu {
  --menu-width: 280px;
  --menu-width-collapsed: 64px;
  --menu-bg: var(--color-neutral-light-00, #fff);
  --menu-border: var(--color-neutral-light-20, #e0e0e0);
  --menu-item-height: 44px;
  --menu-item-color: var(--color-action-default, #0066cc);
  --menu-item-bg-hover: var(--color-brand-01-lighter, #e6f3ff);
  --menu-item-bg-active: var(--color-brand-01-light, #cce7ff);

  width: var(--menu-width);
  height: 100vh;
  background: var(--menu-bg);
  border-right: 1px solid var(--menu-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.dyn-menu-collapsed {
  width: var(--menu-width-collapsed);
}

/* Header */
.dyn-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--menu-border);
  min-height: 64px;
}

.dyn-menu-logo {
  flex: 1;
}

.dyn-menu-logo-image {
  max-height: 32px;
  max-width: 100%;
}

.dyn-menu-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  color: var(--color-neutral-mid-60, #999);
  cursor: pointer;
  border-radius: 50%;
}

.dyn-menu-toggle:hover {
  background: var(--color-neutral-light-10, #f0f0f0);
}

/* Filter */
.dyn-menu-filter {
  padding: 1rem;
  border-bottom: 1px solid var(--menu-border);
}

/* Content */
.dyn-menu-content {
  flex: 1;
  overflow-y: auto;
}

.dyn-menu-items {
  padding: 0.5rem 0;
}

/* Menu Item */
.dyn-menu-item-container {
  margin: 0;
  position: relative;
}

.dyn-menu-item {
  display: flex;
  align-items: center;
  height: var(--menu-item-height);
  padding: 0 1rem;
  color: var(--menu-item-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
}

.dyn-menu-item:hover:not(.dyn-menu-item-disabled) {
  background: var(--menu-item-bg-hover);
}

.dyn-menu-item-active {
  background: var(--menu-item-bg-active);
  font-weight: 600;
}

.dyn-menu-item-disabled {
  color: var(--color-neutral-mid-60, #999);
  cursor: not-allowed;
  opacity: 0.6;
}

.dyn-menu-item-content {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.dyn-menu-item-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dyn-menu-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
}

.dyn-menu-collapsed .dyn-menu-item-label {
  display: none;
}

.dyn-menu-item-badge {
  margin-left: auto;
  margin-right: 0.5rem;
}

.dyn-menu-collapsed .dyn-menu-item-badge {
  display: none;
}

.dyn-menu-item-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.dyn-menu-collapsed .dyn-menu-item-arrow {
  display: none;
}

.dyn-menu-arrow-expanded {
  transform: rotate(180deg);
}

/* Subitems */
.dyn-menu-item-level-1 {
  padding-left: 3rem;
}

.dyn-menu-item-level-2 {
  padding-left: 4rem;
}

.dyn-menu-subitems {
  background: var(--color-neutral-light-05, #f9f9f9);
}

/* Divider */
.dyn-menu-divider {
  height: 1px;
  background: var(--menu-border);
  margin: 0.5rem 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dyn-menu {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .dyn-menu-open {
    transform: translateX(0);
  }
}

/* Focus states */
.dyn-menu-item:focus-visible {
  outline: 2px solid var(--color-action-focus, #0066cc);
  outline-offset: -2px;
}

/* Animation for collapsing */
.dyn-menu-collapsed .dyn-menu-item-content {
  justify-content: center;
}

.dyn-menu-collapsed .dyn-menu-item {
  padding: 0 1rem;
  justify-content: center;
}

.dyn-menu-collapsed .dyn-menu-item-icon {
  margin-right: 0;
}

/* Scrollbar styling */
.dyn-menu-content::-webkit-scrollbar {
  width: 6px;
}

.dyn-menu-content::-webkit-scrollbar-track {
  background: var(--color-neutral-light-10, #f0f0f0);
}

.dyn-menu-content::-webkit-scrollbar-thumb {
  background: var(--color-neutral-mid-40, #999);
  border-radius: 3px;
}

.dyn-menu-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-mid-60, #666);
}
"@

Set-Content -Path "$DynMenuPath/DynMenu.module.css" -Value $DynMenuCss

# DynMenu.stories.tsx
$DynMenuStories = @"
/**
 * DynMenu Storybook Stories
 * Interactive examples and documentation for navigation menu component
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynMenu } from './DynMenu';
import { MenuItem } from './DynMenu.types';
import React from 'react';

const meta: Meta<typeof DynMenu> = {
  title: 'Navigation/DynMenu',
  component: DynMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The DynMenu component provides a hierarchical navigation menu system with collapse/expand functionality, search, and responsive design.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynMenu>;

// Sample menu data
const sampleMenus: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dyn-icon-dashboard',
    shortLabel: 'Dash',
    action: () => console.log('Dashboard clicked'),
    badge: { value: 3, color: 'color-01' }
  },
  {
    type: 'divider'
  },
  {
    label: 'Products',
    icon: 'dyn-icon-box',
    shortLabel: 'Prod',
    subItems: [
      {
        label: 'All Products',
        icon: 'dyn-icon-list',
        action: () => console.log('All Products clicked')
      },
      {
        label: 'Categories',
        icon: 'dyn-icon-folder',
        action: () => console.log('Categories clicked')
      }
    ]
  },
  {
    label: 'Settings',
    icon: 'dyn-icon-settings',
    shortLabel: 'Config',
    action: () => console.log('Settings clicked')
  }
];

export const Default: Story = {
  args: {
    menus: sampleMenus,
    collapsed: false,
    filter: true,
    automaticToggle: true,
    logo: 'https://via.placeholder.com/120x32/0066cc/ffffff?text=DynUI',
    shortLogo: 'https://via.placeholder.com/32x32/0066cc/ffffff?text=D'
  }
};

export const Collapsed: Story = {
  args: {
    menus: sampleMenus,
    collapsed: true,
    filter: false,
    automaticToggle: false,
    logo: 'https://via.placeholder.com/120x32/0066cc/ffffff?text=DynUI',
    shortLogo: 'https://via.placeholder.com/32x32/0066cc/ffffff?text=D'
  }
};
"@

Set-Content -Path "$DynMenuPath/DynMenu.stories.tsx" -Value $DynMenuStories

# DynMenu.test.tsx
$DynMenuTest = @"
/**
 * DynMenu Unit Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynMenu } from './DynMenu';
import { MenuItem } from './DynMenu.types';

// Mock child components
jest.mock('../DynIcon', () => ({
  DynIcon: ({ icon }: { icon: string }) => <i data-testid={`icon-{icon}`} />
}));

jest.mock('../DynBadge', () => ({
  DynBadge: ({ value }: { value?: number }) => <span data-testid="badge">{value}</span>
}));

jest.mock('../DynInput', () => ({
  DynInput: ({ placeholder, onChange }: any) => (
    <input data-testid="menu-search" placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  )
}));

const sampleMenus: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dyn-icon-dashboard',
    action: jest.fn()
  },
  {
    label: 'Products',
    icon: 'dyn-icon-box',
    subItems: [
      {
        label: 'All Products',
        action: jest.fn()
      }
    ]
  }
];

describe('DynMenu', () => {
  it('renders menu with items', () => {
    render(<DynMenu menus={sampleMenus} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('handles menu item clicks', () => {
    render(<DynMenu menus={sampleMenus} />);

    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);

    expect(sampleMenus[0].action).toHaveBeenCalled();
  });

  it('toggles collapsed state', () => {
    const onCollapse = jest.fn();
    render(<DynMenu menus={sampleMenus} onCollapse={onCollapse} />);

    const toggleButton = screen.getByLabelText('Retrair menu');
    fireEvent.click(toggleButton);

    expect(onCollapse).toHaveBeenCalledWith(true);
  });
});
"@

Set-Content -Path "$DynMenuPath/DynMenu.test.tsx" -Value $DynMenuTest

# DynMenu index.ts
$DynMenuIndex = @"
/**
 * DynMenu - Navigation Menu Component
 * Barrel export for clean API surface
 */

export { default as DynMenu, DynMenu } from './DynMenu';
export type {
  DynMenuProps,
  DynMenuRef,
  MenuItem,
  MenuBadge,
  MenuLiterals
} from './DynMenu.types';
export { DEFAULT_MENU_LITERALS } from './DynMenu.types';
"@

Set-Content -Path "$DynMenuPath/index.ts" -Value $DynMenuIndex

Write-Host "✅ DynMenu component created" -ForegroundColor Green

# =============================================================================
# DYNBREADCRUMB COMPONENT
# =============================================================================
Write-Host "`n📁 Creating DynBreadcrumb component..." -ForegroundColor Blue

$DynBreadcrumbPath = "$ProjectPath/DynBreadcrumb"
New-Item -Path $DynBreadcrumbPath -ItemType Directory -Force

# DynBreadcrumb.types.ts
$DynBreadcrumbTypes = @"
/**
 * DynBreadcrumb TypeScript type definitions
 * Navigation breadcrumb component types for path indication
 */

export interface BreadcrumbItem {
  label: string;
  link?: string;
  action?: () => void;
}

export interface DynBreadcrumbProps {
  items: BreadcrumbItem[];
  favorite?: boolean;
  favoriteService?: string;
  separator?: string | React.ReactNode;
  maxItems?: number;
  className?: string;
  onFavorite?: (favorited: boolean) => void;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export interface DynBreadcrumbRef {
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (index: number) => void;
  clear: () => void;
}

// Default separator
export const DEFAULT_SEPARATOR = 'dyn-icon-arrow-right';

// Default literals
export const BREADCRUMB_LITERALS = {
  addToFavorites: 'Adicionar aos favoritos',
  removeFromFavorites: 'Remover dos favoritos',
  showMore: 'Mostrar mais itens',
  home: 'Início'
};
"@

Set-Content -Path "$DynBreadcrumbPath/DynBreadcrumb.types.ts" -Value $DynBreadcrumbTypes

# DynBreadcrumb.tsx
$DynBreadcrumbTsx = @"
/**
 * DynBreadcrumb - Navigation Breadcrumb Component
 * Displays navigation path with favorites support and overflow handling
 */

import React, { forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { DynBreadcrumbProps, BreadcrumbItem, DynBreadcrumbRef, DEFAULT_SEPARATOR, BREADCRUMB_LITERALS } from './DynBreadcrumb.types';
import { DynIcon } from '../DynIcon';
import styles from './DynBreadcrumb.module.css';

const DynBreadcrumb = forwardRef<DynBreadcrumbRef, DynBreadcrumbProps>(({
  items = [],
  favorite = false,
  favoriteService,
  separator = DEFAULT_SEPARATOR,
  maxItems = 5,
  className,
  onFavorite,
  onItemClick
}, ref) => {
  const [isFavorited, setIsFavorited] = useState(favorite);
  const [internalItems, setInternalItems] = useState(items);
  const [showAllItems, setShowAllItems] = useState(false);

  useImperativeHandle(ref, () => ({
    addItem: (item: BreadcrumbItem) => {
      setInternalItems(prev => [...prev, item]);
    },
    removeItem: (index: number) => {
      setInternalItems(prev => prev.filter((_, i) => i !== index));
    },
    clear: () => {
      setInternalItems([]);
    }
  }));

  const displayItems = useMemo(() => {
    const currentItems = internalItems.length > 0 ? internalItems : items;

    if (showAllItems || currentItems.length <= maxItems) {
      return currentItems;
    }

    const firstItem = currentItems[0];
    const lastItems = currentItems.slice(-(maxItems - 2));

    return [
      firstItem,
      { label: '...', action: () => setShowAllItems(true) },
      ...lastItems
    ];
  }, [internalItems, items, maxItems, showAllItems]);

  const handleItemClick = useCallback((item: BreadcrumbItem, index: number, e: React.MouseEvent) => {
    if (item.action) {
      e.preventDefault();
      item.action();
    }
    onItemClick?.(item, index);
  }, [onItemClick]);

  const handleFavoriteToggle = useCallback(async () => {
    const newFavorited = !isFavorited;

    if (favoriteService) {
      try {
        const response = await fetch(favoriteService, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ favorited: newFavorited })
        });

        if (response.ok) {
          setIsFavorited(newFavorited);
          onFavorite?.(newFavorited);
        }
      } catch (error) {
        console.error('Failed to update favorite status:', error);
      }
    } else {
      setIsFavorited(newFavorited);
      onFavorite?.(newFavorited);
    }
  }, [isFavorited, favoriteService, onFavorite]);

  const breadcrumbClasses = classNames(
    styles['dyn-breadcrumb'],
    className
  );

  if (displayItems.length === 0) {
    return null;
  }

  const renderSeparator = () => {
    if (typeof separator === 'string') {
      return <DynIcon icon={separator} className={styles['dyn-breadcrumb-separator']} />;
    }
    return <span className={styles['dyn-breadcrumb-separator']}>{separator}</span>;
  };

  return (
    <nav className={breadcrumbClasses} aria-label="Breadcrumb">
      <ol className={styles['dyn-breadcrumb-list']}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={`{item.label}-{index}`} className={styles['dyn-breadcrumb-item']}>
              {item.link && !isLast && !isEllipsis ? (
                <a
                  href={item.link}
                  className={styles['dyn-breadcrumb-link']}
                  onClick={(e) => handleItemClick(item, index, e)}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={classNames(
                    styles['dyn-breadcrumb-text'],
                    {
                      [styles['dyn-breadcrumb-current']]: isLast,
                      [styles['dyn-breadcrumb-ellipsis']]: isEllipsis,
                      [styles['dyn-breadcrumb-clickable']]: isEllipsis || item.action
                    }
                  )}
                  onClick={isEllipsis || item.action ? (e) => handleItemClick(item, index, e) : undefined}
                  role={isEllipsis || item.action ? 'button' : undefined}
                  tabIndex={isEllipsis || item.action ? 0 : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && renderSeparator()}
            </li>
          );
        })}
      </ol>

      {(favorite !== undefined || favoriteService) && (
        <div className={styles['dyn-breadcrumb-favorite']}>
          <button
            className={classNames(
              styles['dyn-breadcrumb-favorite-button'],
              {
                [styles['dyn-breadcrumb-favorite-active']]: isFavorited
              }
            )}
            onClick={handleFavoriteToggle}
            aria-label={isFavorited ? BREADCRUMB_LITERALS.removeFromFavorites : BREADCRUMB_LITERALS.addToFavorites}
          >
            <DynIcon icon={isFavorited ? 'dyn-icon-star-filled' : 'dyn-icon-star'} />
          </button>
        </div>
      )}
    </nav>
  );
});

DynBreadcrumb.displayName = 'DynBreadcrumb';

export default DynBreadcrumb;
export { DynBreadcrumb };
"@

Set-Content -Path "$DynBreadcrumbPath/DynBreadcrumb.tsx" -Value $DynBreadcrumbTsx

# DynBreadcrumb.module.css
$DynBreadcrumbCss = @"
/**
 * DynBreadcrumb CSS Styles
 * Responsive navigation breadcrumb with hover effects and favorites
 */

.dyn-breadcrumb {
  --breadcrumb-font-size: 0.875rem;
  --breadcrumb-color: var(--color-neutral-dark-90, #333);
  --breadcrumb-link-color: var(--color-action-default, #0066cc);
  --breadcrumb-separator-color: var(--color-neutral-mid-60, #999);
  --breadcrumb-current-color: var(--color-neutral-dark-70, #666);
  --breadcrumb-hover-color: var(--color-action-hover, #0052a3);
  --breadcrumb-favorite-color: var(--color-warning-default, #ff9800);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: var(--breadcrumb-font-size);
  color: var(--breadcrumb-color);
}

.dyn-breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  min-width: 0;
}

.dyn-breadcrumb-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.dyn-breadcrumb-link {
  color: var(--breadcrumb-link-color);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.dyn-breadcrumb-link:hover {
  color: var(--breadcrumb-hover-color);
  background-color: var(--color-brand-01-lighter, #e6f3ff);
}

.dyn-breadcrumb-text {
  color: var(--breadcrumb-color);
  padding: 0.25rem 0.5rem;
}

.dyn-breadcrumb-current {
  color: var(--breadcrumb-current-color);
  font-weight: 600;
}

.dyn-breadcrumb-clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.dyn-breadcrumb-clickable:hover {
  background-color: var(--color-neutral-light-10, #f0f0f0);
}

.dyn-breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--breadcrumb-separator-color);
  font-size: 0.75rem;
}

.dyn-breadcrumb-favorite {
  margin-left: 1rem;
}

.dyn-breadcrumb-favorite-button {
  background: none;
  border: none;
  padding: 0.5rem;
  color: var(--color-neutral-mid-60, #999);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.dyn-breadcrumb-favorite-button:hover {
  background-color: var(--color-neutral-light-10, #f0f0f0);
  color: var(--breadcrumb-favorite-color);
}

.dyn-breadcrumb-favorite-active {
  color: var(--breadcrumb-favorite-color) !important;
}
"@

Set-Content -Path "$DynBreadcrumbPath/DynBreadcrumb.module.css" -Value $DynBreadcrumbCss

# DynBreadcrumb.stories.tsx
$DynBreadcrumbStories = @"
/**
 * DynBreadcrumb Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynBreadcrumb } from './DynBreadcrumb';
import { BreadcrumbItem } from './DynBreadcrumb.types';

const meta: Meta<typeof DynBreadcrumb> = {
  title: 'Navigation/DynBreadcrumb',
  component: DynBreadcrumb,
  parameters: {
    layout: 'padded'
  }
};

export default meta;
type Story = StoryObj<typeof DynBreadcrumb>;

const basicItems: BreadcrumbItem[] = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Laptops' }
];

export const Default: Story = {
  args: {
    items: basicItems
  }
};

export const WithFavorites: Story = {
  args: {
    items: basicItems,
    favorite: false
  }
};
"@

Set-Content -Path "$DynBreadcrumbPath/DynBreadcrumb.stories.tsx" -Value $DynBreadcrumbStories

# DynBreadcrumb.test.tsx
$DynBreadcrumbTest = @"
/**
 * DynBreadcrumb Unit Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { DynBreadcrumb } from './DynBreadcrumb';
import { BreadcrumbItem } from './DynBreadcrumb.types';

jest.mock('../DynIcon', () => ({
  DynIcon: ({ icon }: { icon: string }) => <i data-testid={`icon-{icon}`} />
}));

const basicItems: BreadcrumbItem[] = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Laptops' }
];

describe('DynBreadcrumb', () => {
  it('renders breadcrumb with items', () => {
    render(<DynBreadcrumb items={basicItems} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
  });

  it('renders separators between items', () => {
    render(<DynBreadcrumb items={basicItems} />);

    const separators = screen.getAllByTestId('icon-dyn-icon-arrow-right');
    expect(separators).toHaveLength(2);
  });

  it('shows favorite button when favorite prop is provided', () => {
    render(<DynBreadcrumb items={basicItems} favorite={false} />);

    const favoriteButton = screen.getByLabelText('Adicionar aos favoritos');
    expect(favoriteButton).toBeInTheDocument();
  });
});
"@

Set-Content -Path "$DynBreadcrumbPath/DynBreadcrumb.test.tsx" -Value $DynBreadcrumbTest

# DynBreadcrumb index.ts
$DynBreadcrumbIndex = @"
/**
 * DynBreadcrumb - Navigation Breadcrumb Component
 * Barrel export for clean API surface
 */

export { default as DynBreadcrumb, DynBreadcrumb } from './DynBreadcrumb';
export type {
  DynBreadcrumbProps,
  DynBreadcrumbRef,
  BreadcrumbItem
} from './DynBreadcrumb.types';
export { DEFAULT_SEPARATOR, BREADCRUMB_LITERALS } from './DynBreadcrumb.types';
"@

Set-Content -Path "$DynBreadcrumbPath/index.ts" -Value $DynBreadcrumbIndex

Write-Host "✅ DynBreadcrumb component created" -ForegroundColor Green

# =============================================================================
# UPDATE MAIN INDEX.TS
# =============================================================================
Write-Host "`n📝 Updating main components index.ts..." -ForegroundColor Blue

$MainIndexUpdate = @"
// Navigation Components (SCOPE 6) - NEWLY ADDED
export { DynMenu } from './DynMenu';
export type { DynMenuProps, MenuItem, DynMenuRef } from './DynMenu';

export { DynBreadcrumb } from './DynBreadcrumb';
export type { DynBreadcrumbProps, BreadcrumbItem, DynBreadcrumbRef } from './DynBreadcrumb';

// Add more navigation components here as they are created...
"@

Add-Content -Path "$ProjectPath/index.ts" -Value $MainIndexUpdate

Write-Host "✅ Main index.ts updated with Navigation components" -ForegroundColor Green

# =============================================================================
# COMPLETION MESSAGE
# =============================================================================
Write-Host "`n🎉 DYN UI Navigation Components Creation Complete!" -ForegroundColor Green
Write-Host "Created components:" -ForegroundColor Yellow
Write-Host "  ✅ DynMenu - Hierarchical navigation menu" -ForegroundColor Cyan
Write-Host "  ✅ DynBreadcrumb - Breadcrumb navigation" -ForegroundColor Cyan
Write-Host "`nComponents ready for:" -ForegroundColor Yellow
Write-Host "  📦 Development and testing" -ForegroundColor White
Write-Host "  📚 Storybook documentation" -ForegroundColor White
Write-Host "  🧪 Unit testing with Jest" -ForegroundColor White
Write-Host "  🔄 Git integration" -ForegroundColor White

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Complete remaining Navigation components (DynTabs, DynStepper, DynToolbar)" -ForegroundColor White
Write-Host "  2. Test components in your application" -ForegroundColor White
Write-Host "  3. Run Storybook to view interactive documentation" -ForegroundColor White
Write-Host "  4. Execute unit tests: npm test" -ForegroundColor White
Write-Host "  5. Commit changes to Git repository" -ForegroundColor White

Write-Host "`n🚀 Happy coding with DYN UI!" -ForegroundColor Green
