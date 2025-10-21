import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import {
  ThemeProvider,
  I18nProvider,
  useTheme,
  useI18n,
  ThemeSwitcher,
  type Theme,
} from '../packages/dyn-ui-react/src';
import '../packages/dyn-ui-react/src/styles/themes.css';

const THEME_OPTIONS: Theme[] = ['light', 'dark', 'high-contrast'];
const LOCALE_OPTIONS = ['en-US', 'sr-RS', 'ar-EG'] as const;

const messages = {
  'en-US': {
    'storybook.welcome': 'Welcome to Dyn UI',
    'storybook.instructions': 'Use the toolbar to change theme or locale',
    'theme.switcher': 'Theme switcher',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.high-contrast': 'High contrast',
    'demo.locale.en-US': 'English (US)',
    'demo.locale.sr-RS': 'Serbian',
    'demo.locale.ar-EG': 'Arabic',
    'input.clear': 'Clear field',
    'input.increment': 'Increase value',
    'input.decrement': 'Decrease value',
    'badge.count': 'Notifications',
  },
  'sr-RS': {
    'storybook.welcome': 'Dobrodošli u Dyn UI',
    'storybook.instructions': 'Koristite toolbar da promenite temu ili jezik',
    'theme.switcher': 'Prebacivanje teme',
    'theme.light': 'Svetla',
    'theme.dark': 'Tamna',
    'theme.high-contrast': 'Visoki kontrast',
    'demo.locale.en-US': 'Engleski',
    'demo.locale.sr-RS': 'Srpski',
    'demo.locale.ar-EG': 'Arapski',
    'input.clear': 'Obriši polje',
    'input.increment': 'Povećaj vrednost',
    'input.decrement': 'Smanji vrednost',
    'badge.count': 'Obaveštenja',
  },
  'ar-EG': {
    'storybook.welcome': 'مرحبًا بكم في Dyn UI',
    'storybook.instructions': 'استخدم شريط الأدوات لتغيير السمة أو اللغة',
    'theme.switcher': 'مبدّل السمة',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.high-contrast': 'تباين عالٍ',
    'demo.locale.en-US': 'الإنجليزية',
    'demo.locale.sr-RS': 'الصربية',
    'demo.locale.ar-EG': 'العربية',
    'input.clear': 'مسح الحقل',
    'input.increment': 'زيادة القيمة',
    'input.decrement': 'إنقاص القيمة',
    'badge.count': 'الإشعارات',
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: THEME_OPTIONS.map((value) => ({ value, title: value })),
      dynamicTitle: true,
    },
  },
  locale: {
    name: 'Locale',
    description: 'Active locale',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'globe',
      items: LOCALE_OPTIONS.map((value) => ({ value, title: value })),
      dynamicTitle: true,
    },
  },
};

const StoryContainer: React.FC<{ children: React.ReactNode; theme: Theme; locale: string }> = ({
  children,
  theme,
  locale,
}) => {
  const { setTheme } = useTheme();
  const { setLocale, t } = useI18n();

  React.useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  React.useEffect(() => {
    setLocale(locale);
  }, [setLocale, locale]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--dyn-color-background, var(--color-background, #fff))',
        color: 'var(--dyn-color-foreground, var(--color-foreground, #111))',
        padding: '1rem',
        transition: 'background-color 0.2s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <strong>{t({ id: 'storybook.welcome', defaultMessage: 'Welcome to Dyn UI' })}</strong>
        <span style={{ opacity: 0.75 }}>{t({ id: 'storybook.instructions', defaultMessage: 'Use the toolbar to change theme or locale' })}</span>
        <div style={{ marginLeft: 'auto' }}>
          <ThemeSwitcher themes={THEME_OPTIONS} size="sm" />
        </div>
      </div>
      {children}
    </div>
  );
};

const withProviders: Preview['decorators'][number] = (Story, context) => {
  const theme = (context.globals.theme as Theme) ?? 'light';
  const locale = (context.globals.locale as string) ?? 'en-US';

  return (
    <I18nProvider initialLocale={locale} messages={messages}>
      <ThemeProvider initialTheme={theme} storageKey={null}>
        <StoryContainer theme={theme} locale={locale}>
          <Story />
        </StoryContainer>
      </ThemeProvider>
    </I18nProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withProviders],
};

export default preview;
