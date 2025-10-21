import type { Meta, StoryObj } from '@storybook/react';
import { DynButton } from '../packages/dyn-ui-react/src/components/DynButton';

const meta: Meta<typeof DynButton> = {
  title: 'QA/Smoke Tests/DynButton',
  component: DynButton,
  tags: ['autotest'],
};

export default meta;

export const Primary: StoryObj<typeof DynButton> = {
  args: {
    children: 'Primary CTA',
    kind: 'primary',
  },
};

export const Loading: StoryObj<typeof DynButton> = {
  args: {
    children: 'Submitting',
    loading: true,
  },
};
