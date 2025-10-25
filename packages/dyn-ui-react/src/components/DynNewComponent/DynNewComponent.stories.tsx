import type { Meta, StoryObj } from '@storybook/react';
import { DynNewComponent } from './DynNewComponent';
import { ThemeProvider } from '../../theme/ThemeProvider';

const meta: Meta<typeof DynNewComponent> = {
  title: 'Components/DynNewComponent',
  component: DynNewComponent,
  decorators: [Story => (
    <ThemeProvider initialTheme="light">
      <Story />
    </ThemeProvider>
  )],
  argTypes: {
    children: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof DynNewComponent>;

export const WrapperExample: Story = {
  args: {
    gap: 'md',
    p: 'lg',
    m: 'sm',
    as: 'section',
    children: (
      <>
        <div style={{ background: 'var(--dyn-color-surface, #f5f5f5)', padding: '0.5rem' }}>Header content</div>
        <div style={{ background: 'var(--dyn-color-surface, #f5f5f5)', padding: '0.5rem' }}>Body content</div>
        <div style={{ background: 'var(--dyn-color-surface, #f5f5f5)', padding: '0.5rem' }}>Footer content</div>
      </>
    ),
  },
  parameters: {
    layout: 'centered',
  },
};
