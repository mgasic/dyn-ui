import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DynTreeView from './DynTreeView';
import { DynTreeNode } from './DynTreeView.types';

const meta: Meta<typeof DynTreeView> = {
  title: 'Data Display/DynTreeView',
  component: DynTreeView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A hierarchical tree component for displaying and managing nested data structures with selection, checking, and search capabilities.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    checkable: {
      control: 'boolean',
      description: 'Show checkboxes for node selection'
    },
    selectable: {
      control: 'boolean',
      description: 'Allow node selection by clicking'
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple node selection'
    },
    showIcon: {
      control: 'boolean',
      description: 'Show node icons'
    },
    showLine: {
      control: 'boolean',
      description: 'Show connecting lines between nodes'
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality'
    },
    defaultExpandAll: {
      control: 'boolean',
      description: 'Expand all nodes by default'
    },
    height: {
      control: { type: 'number' },
      description: 'Fixed height for scrollable tree'
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynTreeView>;

// Sample tree data
const fileSystemData: DynTreeNode[] = [
  {
    key: 'documents',
    title: 'Documents',
    icon: '📁',
    children: [
      { key: 'doc1', title: 'Report.pdf', icon: '📄' },
      { key: 'doc2', title: 'Presentation.pptx', icon: '📊' },
      {
        key: 'projects',
        title: 'Projects',
        icon: '📁',
        children: [
          {
            key: 'project1',
            title: 'Website Redesign',
            icon: '🌐',
            children: [
              { key: 'wireframes', title: 'Wireframes.fig', icon: '🎨' },
              { key: 'assets', title: 'Assets', icon: '📁' },
              { key: 'code', title: 'Source Code', icon: '💻' },
            ],
          },
          {
            key: 'project2',
            title: 'Mobile App',
            icon: '📱',
            children: [
              { key: 'mockups', title: 'Mockups.sketch', icon: '🎨' },
              { key: 'prototype', title: 'Prototype.html', icon: '🔗' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'images',
    title: 'Images',
    icon: '🖼️',
    children: [
      { key: 'photo1', title: 'Vacation.jpg', icon: '📸' },
      { key: 'photo2', title: 'Profile.png', icon: '🖼️' },
      {
        key: 'screenshots',
        title: 'Screenshots',
        icon: '📁',
        children: [
          { key: 'screen1', title: 'Dashboard.png', icon: '🖥️' },
          { key: 'screen2', title: 'Settings.png', icon: '⚙️' },
        ],
      },
    ],
  },
  {
    key: 'downloads',
    title: 'Downloads',
    icon: '⬇️',
    children: [
      { key: 'software1', title: 'VSCode-Setup.exe', icon: '💾' },
      { key: 'software2', title: 'Chrome-Installer.dmg', icon: '💾' },
      { key: 'archive', title: 'Archive.zip', icon: '🗄️', disabled: true },
    ],
  },
  { key: 'readme', title: 'README.md', icon: '📝' },
];

const organizationData: DynTreeNode[] = [
  {
    key: 'ceo',
    title: 'CEO - John Smith',
    icon: '👨‍💼',
    children: [
      {
        key: 'engineering',
        title: 'Engineering',
        icon: '⚙️',
        children: [
          {
            key: 'frontend',
            title: 'Frontend Team',
            icon: '💻',
            children: [
              { key: 'dev1', title: 'Alice Johnson - Senior Developer', icon: '👩‍💻' },
              { key: 'dev2', title: 'Bob Wilson - Developer', icon: '👨‍💻' },
              { key: 'dev3', title: 'Carol Davis - Junior Developer', icon: '👩‍💻' },
            ],
          },
          {
            key: 'backend',
            title: 'Backend Team',
            icon: '🔧',
            children: [
              { key: 'dev4', title: 'David Brown - Lead Developer', icon: '👨‍💻' },
              { key: 'dev5', title: 'Emma Taylor - Developer', icon: '👩‍💻' },
            ],
          },
        ],
      },
      {
        key: 'design',
        title: 'Design',
        icon: '🎨',
        children: [
          { key: 'designer1', title: 'Frank Miller - UI Designer', icon: '🎨' },
          { key: 'designer2', title: 'Grace Lee - UX Designer', icon: '🎨' },
        ],
      },
      {
        key: 'marketing',
        title: 'Marketing',
        icon: '📢',
        children: [
          { key: 'marketer1', title: 'Henry White - Marketing Manager', icon: '📈' },
          { key: 'marketer2', title: 'Ivy Chen - Content Creator', icon: '✍️' },
        ],
      },
    ],
  },
];

const simpleData: DynTreeNode[] = [
  {
    key: 'parent1',
    title: 'Parent Node 1',
    children: [
      { key: 'child1-1', title: 'Child 1-1' },
      { key: 'child1-2', title: 'Child 1-2' },
      {
        key: 'child1-3',
        title: 'Child 1-3',
        children: [
          { key: 'grandchild1', title: 'Grandchild 1' },
          { key: 'grandchild2', title: 'Grandchild 2' },
        ],
      },
    ],
  },
  {
    key: 'parent2',
    title: 'Parent Node 2',
    children: [
      { key: 'child2-1', title: 'Child 2-1' },
      { key: 'child2-2', title: 'Child 2-2' },
    ],
  },
  { key: 'leaf', title: 'Leaf Node' },
];

// Default story
export const Default: Story = {
  args: {
    treeData: fileSystemData,
    checkable: false,
    selectable: true,
    multiple: false,
    showIcon: true,
    showLine: false,
    searchable: false,
    defaultExpandAll: false,
  },
};

// With Checkboxes
export const WithCheckboxes: Story = {
  args: {
    ...Default.args,
    checkable: true,
    checkedKeys: ['documents', 'doc1'],
    onCheck: (checkedKeys, info) => {
      console.log('Checked:', { checkedKeys, info });
    },
  },
};

// Multiple Selection
export const MultipleSelection: Story = {
  args: {
    ...Default.args,
    multiple: true,
    selectedKeys: ['documents', 'images'],
    onSelect: (selectedKeys, info) => {
      console.log('Selected:', { selectedKeys, info });
    },
  },
};

// With Search
export const WithSearch: Story = {
  args: {
    ...Default.args,
    searchable: true,
    onSearch: (value) => {
      console.log('Search:', value);
    },
  },
};

// Expand All by Default
export const ExpandedByDefault: Story = {
  args: {
    ...Default.args,
    defaultExpandAll: true,
  },
};

// With Connecting Lines
export const WithLines: Story = {
  args: {
    ...Default.args,
    showLine: true,
    expandedKeys: ['documents', 'projects'],
  },
};

// Without Icons
export const WithoutIcons: Story = {
  args: {
    treeData: simpleData,
    showIcon: false,
    expandedKeys: ['parent1'],
  },
};

export const KeyboardNavigation: Story = {
  args: {
    treeData: simpleData,
    selectable: true,
    checkable: true,
    showIcon: true,
  },
  render: (args) => (
    <div>
      <p style={{ marginBottom: 12 }}>
        Focus the tree and use the Arrow keys, Home/End, and Enter/Space to traverse and interact with
        nodes.
      </p>
      <DynTreeView {...args} />
    </div>
  ),
};

// Organization Chart
export const OrganizationChart: Story = {
  args: {
    treeData: organizationData,
    checkable: true,
    selectable: true,
    showIcon: true,
    defaultExpandAll: true,
    onSelect: (selectedKeys, info) => {
      console.log('Employee selected:', info.node.title);
    },
  },
};

// Fixed Height (Scrollable)
export const FixedHeight: Story = {
  args: {
    ...Default.args,
    height: 300,
    defaultExpandAll: true,
  },
};

// Empty State
export const Empty: Story = {
  args: {
    ...Default.args,
    treeData: [],
  },
};

export const WithinForm: Story = {
  args: {
    treeData: simpleData,
    selectable: true,
    multiple: true,
    checkable: false,
  },
  render: (args) => {
    const FormExample: React.FC = () => {
      const [selected, setSelected] = React.useState<string[]>([]);
      const [submitted, setSubmitted] = React.useState<string>('');

      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(selected.join(', '));
          }}
          style={{ display: 'grid', gap: 12 }}
        >
          <DynTreeView
            {...args}
            selectable
            multiple
            selectedKeys={selected}
            onSelect={setSelected}
          />
          <input type="hidden" name="selection" value={selected.join(',')} />
          <button type="submit">Submit</button>
          <p>Last submitted selection: {submitted || 'None'}</p>
        </form>
      );
    };

    return <FormExample />;
  },
};

// All Features Combined
export const AllFeatures: Story = {
  args: {
    treeData: fileSystemData,
    checkable: true,
    selectable: true,
    multiple: true,
    showIcon: true,
    showLine: true,
    searchable: true,
    height: 400,
    expandedKeys: ['documents'],
    checkedKeys: ['doc1', 'photo1'],
    selectedKeys: ['projects'],
    onExpand: (expandedKeys) => {
      console.log('Expanded:', expandedKeys);
    },
    onCheck: (checkedKeys, info) => {
      console.log('Checked:', { checkedKeys, info });
    },
    onSelect: (selectedKeys, info) => {
      console.log('Selected:', { selectedKeys, info });
    },
    onSearch: (value) => {
      console.log('Search:', value);
    },
  },
};

export const WithDynTreeNodeLayout: Story = {
  args: {
    treeData: fileSystemData,
    useDynTreeNodeLayout: true,
    nodeLayoutProps: {
      gap: 'sm',
      p: 'xs',
      direction: 'row',
    },
    showIcon: true,
    selectable: true,
    checkable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Wraps each rendered node with the DynTreeNode layout primitive to align DynTreeView with the new layout semantics.',
      },
    },
  },
};
