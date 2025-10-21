import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DynListView from './DynListView';
import { DynListViewProps, DynListViewRef, ListAction } from './DynListView.types';
import styles from './DynListView.module.css';

const getDisplayLabel = (item: Record<string, any>): string => {
  return (
    item.title ??
    item.label ??
    item.name ??
    item.value ??
    (item.id !== undefined ? `Item ${item.id}` : 'Selected item')
  );
};

const getItemKey = (
  item: Record<string, any>,
  index: number,
  itemKey?: DynListViewProps['itemKey']
): string => {
  if (typeof itemKey === 'function') {
    const key = itemKey(item);
    if (key !== undefined && key !== null) {
      return String(key);
    }
  } else if (typeof itemKey === 'string') {
    const value = item[itemKey];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }

  if (item.id !== undefined && item.id !== null) {
    return String(item.id);
  }

  if (item.value !== undefined && item.value !== null) {
    return String(item.value);
  }

  return String(index);
};

const meta: Meta<typeof DynListView> = {
  title: 'Data Display/DynListView',
  component: DynListView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible list component for displaying and managing collections of data with built-in selection, actions, and expansion capabilities.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data items to display in the list'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the list items'
    },
    selectable: {
      control: 'boolean',
      description: 'Enable item selection with checkboxes'
    },
    bordered: {
      control: 'boolean',
      description: 'Show borders around the list'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state'
    },
    height: {
      control: { type: 'number' },
      description: 'Fixed height for scrollable list'
    },
  },
  decorators: [
    (StoryComponent) => (
      <div
        style={{
          maxWidth: 640,
          width: '100%',
          display: 'grid',
          gap: '1rem',
        }}
      >
        <StoryComponent />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DynListView>;

// Sample data
const sampleData = [
  { id: 1, title: 'Task 1', description: 'Complete project documentation', priority: 'High', status: 'In Progress' },
  { id: 2, title: 'Task 2', description: 'Review code changes', priority: 'Medium', status: 'Pending' },
  { id: 3, title: 'Task 3', description: 'Update dependencies', priority: 'Low', status: 'Completed' },
  { id: 4, title: 'Task 4', description: 'Fix reported bugs', priority: 'High', status: 'In Progress' },
  { id: 5, title: 'Task 5', description: 'Optimize performance', priority: 'Medium', status: 'Pending' },
];

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', active: false },
];

const sampleActions: ListAction[] = [
  {
    key: 'edit',
    title: 'Edit',
    onClick: (item) => alert(`Edit ${item.title || item.name}`),
  },
  {
    key: 'delete',
    title: 'Delete',
    type: 'danger',
    onClick: (item) => alert(`Delete ${item.title || item.name}`),
  },
];

// Default story
export const Default: Story = {
  args: {
    data: sampleData,
    size: 'medium',
    bordered: true,
    selectable: false,
    loading: false,
  },
};

// With Selection
export const WithSelection: Story = {
  args: {
    ...Default.args,
    selectable: true,
    defaultValue: ['1', '3'],
  },
  render: (args) => {
    const listRef = useRef<DynListViewRef | null>(null);
    const dataSet = useMemo(
      () => (Array.isArray(args.items) && args.items.length ? args.items : args.data ?? []),
      [args.data, args.items]
    );

    const createKeyToItemMap = useCallback(() => {
      const pairs = dataSet.map((item, index) => [getItemKey(item as any, index, args.itemKey), item] as const);
      return new Map<string, any>(pairs);
    }, [dataSet, args.itemKey]);

    const keyToItem = useMemo(() => createKeyToItemMap(), [createKeyToItemMap]);

    const initialKeys = useMemo(() => {
      const value = args.defaultValue;
      if (Array.isArray(value)) {
        return value.map(String);
      }
      if (value !== undefined && value !== null && value !== '') {
        return [String(value)];
      }
      return [];
    }, [args.defaultValue]);

    const computeLabels = useCallback(
      (keys: string[]) =>
        keys
          .map((key) => {
            const item = keyToItem.get(key);
            if (!item) return undefined;
            return getDisplayLabel(item as any);
          })
          .filter((value): value is string => Boolean(value)),
      [keyToItem]
    );

    const [selectionState, setSelectionState] = useState(() => ({
      keys: initialKeys,
      labels: computeLabels(initialKeys),
    }));

    useEffect(() => {
      setSelectionState({
        keys: initialKeys,
        labels: computeLabels(initialKeys),
      });
    }, [computeLabels, initialKeys]);

    const controlButtonStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      padding: '0.375rem 0.75rem',
      borderRadius: 'var(--dyn-border-radius-sm)',
      border: '1px solid var(--dyn-color-border)',
      background: 'var(--dyn-color-background)',
      color: 'var(--dyn-color-text-primary)',
      fontSize: 'var(--dyn-font-size-sm)',
      fontWeight: 500,
      cursor: 'pointer',
    };

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            style={controlButtonStyle}
            onClick={() => listRef.current?.selectAll()}
          >
            Select all
          </button>
          <button
            type="button"
            style={{ ...controlButtonStyle, color: 'var(--dyn-color-danger, #dc2626)', borderColor: 'var(--dyn-color-border)' }}
            onClick={() => listRef.current?.clearSelection()}
          >
            Clear selection
          </button>
        </div>
        <DynListView
          {...args}
          ref={listRef}
          onSelectionChange={(keys, items) => {
            setSelectionState({
              keys,
              labels: items.map((item) => getDisplayLabel(item as any)),
            });
            args.onSelectionChange?.(keys, items);
          }}
        />
        <div
          style={{ fontSize: '0.875rem', color: 'var(--dyn-color-text-secondary)' }}
          aria-live="polite"
        >
          {selectionState.keys.length
            ? `Selected (${selectionState.keys.length}): ${selectionState.labels.join(', ')}`
            : 'No items selected'}
        </div>
      </div>
    );
  },
};

export const CompactList: Story = {
  args: {
    data: sampleData.slice(0, 4),
    as: 'ul',
    size: 'small',
    bordered: true,
    p: 'sm',
    gap: 'xs',
  },
};

export const ZebraVariant: Story = {
  args: {
    data: sampleData,
    as: 'ul',
    size: 'medium',
    bordered: true,
    className: styles.rootZebra,
    p: 'md',
    gap: 'sm',
  },
};

export const InteractiveItems: Story = {
  args: {
    data: sampleData,
    as: 'ol',
    selectable: true,
    bordered: true,
    actions: sampleActions,
    p: 'md',
    gap: 'sm',
  },
};

// With Actions
export const WithActions: Story = {
  args: {
    ...Default.args,
    actions: sampleActions,
  },
};

// Small Size
export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
    data: users,
  },
};

// Large Size
export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'large',
    data: users,
  },
};

// Loading State
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

// Empty State
export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
};

// Custom Empty Text
export const CustomEmptyText: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyText: 'No tasks found. Create your first task to get started!',
  },
};

// Fixed Height (Scrollable)
export const FixedHeight: Story = {
  args: {
    ...Default.args,
    height: 300,
    data: [...sampleData, ...sampleData, ...sampleData], // More data to show scrolling
  },
};

// Custom Render Item
export const CustomRenderItem: Story = {
  args: {
    ...Default.args,
    data: users,
    renderItem: (user) => (
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: user.active ? '#22c55e' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>{user.name}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>{user.email}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {user.role} • {user.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

// All Features Combined
export const AllFeatures: Story = {
  args: {
    data: sampleData,
    size: 'medium',
    selectable: true,
    bordered: true,
    actions: sampleActions,
    height: 400,
    onSelectionChange: (keys, items) => {
      console.log('Selection changed:', { keys, items });
    },
  },
};
