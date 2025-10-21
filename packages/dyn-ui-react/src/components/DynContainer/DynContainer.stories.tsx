import type { Meta, StoryObj } from '@storybook/react';
import { DynContainer } from './DynContainer';
import { DynButton } from '../DynButton';

const meta: Meta<typeof DynContainer> = {
  title: 'Components/Layout/DynContainer',
  component: DynContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          DynContainer is a flexible container component for grouping related content.
          It provides consistent spacing, optional borders and shadows, as well as layout controls
          for alignment, direction, and background styling.

          **Key capabilities:**
          - Optional title and subtitle rendering
          - Size variants that control internal padding
          - Spacing tokens for content gap management
          - Background, border, and shadow styling options
          - Layout alignment and direction controls
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'text',
      description: 'HTML element to render (e.g., div, section, main).',
    },
    title: {
      control: 'text',
      description: 'Optional container title',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle displayed below the title',
    },
    direction: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction for the content area',
    },
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spacing token applied between content elements',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Size variant that controls padding',
    },
    bordered: {
      control: 'boolean',
      description: 'Display a border around the container',
    },
    shadow: {
      control: 'boolean',
      description: 'Display an elevated shadow',
    },
    background: {
      control: 'radio',
      options: ['none', 'surface', 'card'],
      description: 'Background style variant',
    },
    layout: {
      control: 'radio',
      options: ['fluid', 'fixed'],
      description: 'Layout behavior controlling how the container width is constrained',
    },
    align: {
      control: 'radio',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Cross-axis alignment for content',
    },
    justify: {
      control: 'radio',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Main-axis alignment for content',
    },
    height: {
      control: { type: 'number', min: 100, max: 800, step: 50 },
      description: 'Fixed height in pixels',
    },
    maxWidth: {
      control: 'text',
      description:
        'Optional maximum width constraint. Accepts CSS values or responsive tokens (xs, sm, md, lg, xl, full).',
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Override internal padding using spacing tokens',
    },
    margin: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Apply outer margin using spacing tokens',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    spacing: 'md',
    size: 'medium',
    bordered: true,
    background: 'surface',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <p>This is the default container with standard styling, borders, and padding.</p>
        <DynButton label="Sample Button" kind="primary" />
      </div>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Container Title',
    subtitle: 'Optional supporting information',
    children: (
      <div>
        <p>This container includes both a title and subtitle in the header area.</p>
        <p>The content region inherits spacing tokens for consistent layout.</p>
      </div>
    ),
  },
};

export const NoBorder: Story = {
  args: {
    bordered: false,
    shadow: false,
    background: 'none',
    title: 'Borderless Container',
    children: (
      <div>
        <p>This container has no border or shadow for a lightweight appearance.</p>
        <DynButton label="Action Button" kind="secondary" />
      </div>
    ),
  },
};

export const CardBackground: Story = {
  args: {
    background: 'card',
    shadow: true,
    title: 'Card Surface',
    children: (
      <div>
        <p>Use the card background variant to mimic elevated surfaces.</p>
        <DynButton label="Primary" kind="primary" />
      </div>
    ),
  },
};

export const HorizontalLayout: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'lg',
    align: 'center',
    justify: 'between',
    title: 'Horizontal Layout',
    children: (
      <>
        <div>
          <strong>Left Column</strong>
          <p>Content aligns center vertically and spreads across.</p>
        </div>
        <DynButton label="Primary Action" kind="primary" />
      </>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    noPadding: true,
    title: 'No Padding Container',
    background: 'none',
    bordered: false,
    children: (
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <p>This container has no internal padding. Content spans the full width.</p>
        <p>You can add custom padding to the content if needed.</p>
      </div>
    ),
  },
};

export const SemanticMain: Story = {
  args: {
    as: 'main',
    title: 'Main Content Area',
    subtitle: 'Rendered using a semantic <main> element',
    spacing: 'lg',
    children: (
      <>
        <p>
          DynContainer can render as semantic HTML elements to better match the structure of your page.
          This example renders using a <code>&lt;main&gt;</code> tag.
        </p>
        <DynButton label="Learn more" kind="secondary" />
      </>
    ),
  },
};

export const FixedHeight: Story = {
  args: {
    height: 300,
    title: 'Fixed Height Container',
    children: (
      <div>
        <p>This container has a fixed height of 300px.</p>
        <p>Content will scroll if it exceeds the container height.</p>
        <p>Additional content to demonstrate height constraints.</p>
        <p>More content to show scrolling behavior.</p>
        <p>Even more content for testing.</p>
      </div>
    ),
  },
};

export const FixedLayout: Story = {
  args: {
    layout: 'fixed',
    maxWidth: 'lg',
    title: 'Fixed Layout Container',
    subtitle: 'Centers content and constrains width using design tokens.',
    spacing: 'lg',
    children: (
      <div>
        <p>
          Fixed layout keeps content centered while respecting responsive max-width tokens. Resize the viewport to
          observe adaptive behavior.
        </p>
        <DynButton label="Learn more" kind="secondary" />
      </div>
    ),
  },
};

export const CustomSpacing: Story = {
  args: {
    padding: 'lg',
    margin: 'md',
    spacing: 'sm',
    background: 'card',
    shadow: true,
    title: 'Custom Spacing Tokens',
    children: (
      <>
        <p>
          Use spacing tokens to coordinate internal padding, external margin, and child spacing while staying aligned with
          the design system scale.
        </p>
        <DynButton label="Primary Action" kind="primary" />
      </>
    ),
  },
};

export const CustomCombination: Story = {
  args: {
    height: 250,
    spacing: 'lg',
    background: 'card',
    shadow: true,
    title: 'Custom Configuration',
    subtitle: 'Combining multiple layout tokens',
    className: 'custom-container-demo',
    children: (
      <div>
        <p>This container combines multiple features:</p>
        <ul>
          <li>Fixed height (250px)</li>
          <li>Card background with elevation</li>
          <li>Large internal spacing</li>
          <li>Custom CSS class</li>
        </ul>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <DynButton label="Primary" kind="primary" />
          <DynButton label="Secondary" kind="secondary" />
        </div>
      </div>
    ),
  },
};

export const NestedContainers: Story = {
  args: {
    title: 'Parent Container',
    spacing: 'md',
    children: (
      <div style={{ display: 'grid', gap: '16px' }}>
        <DynContainer title="Child Container 1" bordered={false} background="none">
          <p>First nested container content.</p>
        </DynContainer>
        <DynContainer title="Child Container 2" bordered={false} background="none">
          <p>Second nested container content.</p>
          <DynButton label="Nested Action" kind="tertiary" />
        </DynContainer>
      </div>
    ),
  },
};

export const Showcase: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: 'Comprehensive showcase of DynContainer variants and configurations.',
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        width: '100%',
      }}
    >
      <DynContainer title="Default Container">
        <p>Standard container with all default settings.</p>
        <DynButton label="Default" kind="primary" />
      </DynContainer>

      <DynContainer bordered={false} background="none" title="No Border">
        <p>Container without borders or shadow.</p>
        <DynButton label="No Border" kind="secondary" />
      </DynContainer>

      <DynContainer noPadding title="No Padding">
        <div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
          <p>Container with custom content padding.</p>
          <DynButton label="Custom" kind="tertiary" />
        </div>
      </DynContainer>

      <DynContainer height={200} title="Fixed Height" spacing="sm">
        <p>Container with fixed height constraint.</p>
        <p>Content will be constrained to the specified height.</p>
        <DynButton label="Fixed" kind="primary" />
      </DynContainer>
    </div>
  ),
};
