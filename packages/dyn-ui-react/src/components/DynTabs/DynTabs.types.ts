import type { ComponentPropsWithoutRef, ElementType, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { BaseComponentProps, ComponentSize, AccessibilityProps } from '../../types';

export type DynTabsSize = ComponentSize;
export type DynTabsPosition = 'top' | 'bottom' | 'left' | 'right';
export type DynTabsVariant = 'default' | 'underlined' | 'pills' | 'bordered';
export type DynTabsOrientation = 'horizontal' | 'vertical';
export type DynTabsActivation = 'auto' | 'manual';

/**
 * Content function type for tab items
 */
export type TabContentFunction = (params: { value: string; selected: boolean }) => ReactNode;

/**
 * Individual tab item configuration
 */
export interface DynTabItem {
  /** Unique identifier for the tab (legacy support) */
  id?: string;
  
  /** Value for the tab - preferred over id */
  value?: string | number;
  
  /** Display label for the tab */
  label: string;
  
  /** Content to display when tab is active - can be ReactNode or function */
  content: ReactNode | TabContentFunction;
  
  /** Whether the tab is disabled */
  disabled?: boolean;
  
  /** Whether this specific tab can be closed */
  closable?: boolean;
  
  /** Optional icon element or component */
  icon?: ReactNode;
  
  /** Badge content (number or string) */
  badge?: string | number;
  
  /** Tooltip text for the tab */
  tooltip?: string;
  
  /** Additional CSS class name for the tab */
  className?: string;
  
  /** Additional data attributes */
  'data-testid'?: string;
}

type PolymorphicComponentProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P | 'children'>;

/**
 * Props interface for DynTabs component following DynAvatar standards.
 */
export interface DynTabsOwnProps extends BaseComponentProps, AccessibilityProps {
  /** Optional element type override for polymorphic rendering */
  as?: ElementType;

  /** Array of tab items to display */
  items: DynTabItem[];

  /** Currently active tab ID/value (controlled) */
  value?: string | number;

  /** Currently active tab ID (controlled - alias for value) */
  activeTab?: string | number;

  /** Default active tab ID (uncontrolled) */
  defaultValue?: string | number;

  /** Default active tab ID (uncontrolled - alias for defaultValue) */
  defaultActiveTab?: string | number;

  /** Position of tabs relative to content */
  position?: DynTabsPosition;

  /** Orientation of tabs */
  orientation?: DynTabsOrientation;

  /** Activation mode */
  activation?: DynTabsActivation;

  /** Visual variant of the tabs */
  variant?: DynTabsVariant;

  /** Size of the tab elements */
  size?: DynTabsSize;

  /** Whether tabs should fit container width */
  fitted?: boolean;

  /** Enable horizontal scrolling for overflow tabs */
  scrollable?: boolean;

  /** Allow tabs to be closed */
  closable?: boolean;

  /** Enable lazy loading of tab content */
  lazy?: boolean;

  /** Mount tab panels on demand the first time they are activated */
  lazyMount?: boolean;

  /** Enable tab transition animations */
  animated?: boolean;

  /** Disables the entire tab set */
  disabled?: boolean;

  /** Show add new tab button */
  addable?: boolean;

  /** Custom className for the tab list container */
  tabListClassName?: string;

  /** Custom className for the content container */
  contentClassName?: string;

  /** Custom loading component for lazy tabs */
  loadingComponent?: ReactNode;

  /** Called when active tab changes */
  onChange?: (tabId: string, event: TabChangeEvent) => void;

  /** Called when a tab is closed */
  onTabClose?: (tabId: string) => void;

  /** Called when add tab button is clicked */
  onTabAdd?: () => void;

  /** Called when a tab is clicked (before onChange) */
  onTabClick?: (tabId: string, event: ReactMouseEvent) => boolean | void;
}

export type DynTabsProps<E extends ElementType = 'div'> = PolymorphicComponentProps<
  E,
  DynTabsOwnProps & { as?: E }
>;

/**
 * Ref type for DynTabs component
 * Includes imperative methods following DynAvatar pattern
 */
export interface DynTabsRef {
  /** Focus the tabs container */
  focus: () => void;
  
  /** Blur the tabs container */
  blur: () => void;
  
  /** Focus specific tab by ID */
  focusTab: (tabId: string) => void;
  
  /** Get currently active tab ID */
  getActiveTab: () => string | undefined;
  
  /** Programmatically set active tab */
  setActiveTab: (tabId: string) => void;
  
  /** Get all tab elements */
  getTabs: () => HTMLButtonElement[];
  
  /** Get tab element by ID */
  getTabElement: (tabId: string) => HTMLButtonElement | null;
  
  /** Get active tab element */
  getActiveTabElement: () => HTMLButtonElement | null;
  
  /** Get tab panel element by ID */
  getTabPanel: (tabId: string) => HTMLDivElement | null;
  
  /** Get active tab panel element */
  getActiveTabPanel: () => HTMLDivElement | null;
}

/**
 * Extended tab item with processed values for internal use
 */
export interface ProcessedTabItem extends DynTabItem {
  /** Processed value ensuring string type */
  processedValue: string;
  
  /** Processed key for React rendering */
  processedKey: string;
}

/**
 * Tab navigation event types
 */
export type TabNavigationDirection = 'next' | 'previous' | 'first' | 'last';

/**
 * Tab change event data
 */
export interface TabChangeEvent {
  /** The new active tab ID */
  activeTab: string;
  
  /** The previous active tab ID */
  previousTab?: string;
  
  /** The tab item data */
  tabData: DynTabItem;
  
  /** Navigation method used */
  trigger: 'click' | 'keyboard' | 'programmatic';
}

/**
 * Default props for DynTabs component
 */
export const DYN_TABS_DEFAULT_PROPS = {
  position: 'top' as const,
  orientation: 'horizontal' as const,
  activation: 'auto' as const,
  variant: 'default' as const,
  size: 'medium' as const,
  fitted: false,
  scrollable: false,
  closable: false,
  lazy: false,
  animated: true,
  addable: false,
} as const;

/**
 * Tab keyboard navigation keys
 */
export const TAB_NAVIGATION_KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  HOME: 'Home',
  END: 'End',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
} as const;

/**
 * CSS class names used by DynTabs
 */
export const DYN_TABS_CLASSES = {
  root: 'dyn-tabs',
  tablist: 'dyn-tabs__list',
  tab: 'dyn-tabs__tab',
  tabIcon: 'dyn-tabs__tab-icon',
  tabLabel: 'dyn-tabs__tab-label',
  tabBadge: 'dyn-tabs__tab-badge',
  tabpanel: 'dyn-tabs__panel',
  // States
  selected: 'dyn-tabs__tab--selected',
  disabled: 'dyn-tabs__tab--disabled',
  active: 'dyn-tabs__panel--active',
  // Variants
  horizontal: 'dyn-tabs--horizontal',
  vertical: 'dyn-tabs--vertical',
  fitted: 'dyn-tabs--fitted',
  scrollable: 'dyn-tabs--scrollable',
} as const;