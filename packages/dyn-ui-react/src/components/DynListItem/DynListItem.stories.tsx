import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynListItem } from './DynListItem';
import { DynListView } from '../DynListView';

const meta: Meta<typeof DynListItem> = {
  title: 'Data Display/DynListItem',
  component: DynListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DynListItem is a lightweight wrapper for building custom DynListView rows with DynBox-aligned spacing props and polymorphic rendering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: { type: 'text' },
      description: 'Element type used for rendering the list item.',
    },
    p: {
      control: { type: 'select' },
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Padding token applied to the item.',
    },
    gap: {
      control: { type: 'select' },
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Gap token between child elements.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DynListItem>;

export const Basic: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '1rem' }}>
      <DynListItem as="li" p="md" gap="sm">
        <span style={{ fontWeight: 600 }}>Primary text</span>
        <span style={{ color: 'var(--dyn-color-text-subtle, #666)' }}>Supporting details</span>
      </DynListItem>
      <DynListItem as="li" p="sm" gap="xs" justify="space-between">
        <span>Another item</span>
        <span style={{ fontSize: '0.875rem' }}>Action</span>
      </DynListItem>
    </ul>
  ),
};

export const WithinDynListView: Story = {
  render: () => (
    <DynListView
      data={[
        { id: '1', title: 'Team Standup', description: 'Daily sync with the product team.' },
        { id: '2', title: 'Design Review', description: 'Review updated mockups for release.' },
      ]}
      renderItem={(item) => (
        <DynListItem as="div" key={item.id} p="md" gap="sm" direction="column">
          <strong>{item.title}</strong>
          <span style={{ color: 'var(--dyn-color-text-subtle, #666)' }}>{item.description}</span>
        </DynListItem>
      )}
    />
  ),
};

export const SemanticOverride: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <DynListItem as="article" p="lg" gap="sm" direction="column">
        <h3 style={{ margin: 0 }}>Article Heading</h3>
        <p style={{ margin: 0 }}>Rendered as a semantic article for screen readers.</p>
      </DynListItem>
      <DynListItem as="button" type="button" p="md" gap="sm" justify="space-between">
        <span>Button semantics</span>
        <span aria-hidden="true">→</span>
      </DynListItem>
    </div>
  ),
};
