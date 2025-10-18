import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeProvider } from '../../theme/ThemeProvider';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Utilities/ThemeSwitcher',
  component: ThemeSwitcher,
  decorators: [ (Story) => <ThemeProvider>{<Story />}</ThemeProvider> ],
};
export default meta;

type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {
  args: { labels: { light: 'Light', dark: 'Dark' } },
};
