import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  DynButton,
  ThemeProvider,
  I18nProvider,
  useTheme,
  useI18n,
  ThemeSwitcher,
  type Theme,
} from '@dyn-ui/react';

import '@dyn-ui/react/styles/dyn-ui.css';

const LOCALE_OPTIONS = ['en-US', 'sr-RS', 'ar-EG'] as const;
const THEME_OPTIONS: Theme[] = ['light', 'dark', 'high-contrast'];

const query = new URLSearchParams(window.location.search);
const initialTheme = (query.get('theme') as Theme) ?? 'light';
const initialLocale = query.get('locale') ?? 'en-US';

const messages = {
  'en-US': {
    'demo.title': '🎨 Dyn UI Demo',
    'demo.subtitle': 'Centralized styling with live theme & locale controls',
    'demo.locale': 'Locale',
    'demo.theme.label': 'Theme',
    'demo.section.buttonKinds': 'Button Kinds',
    'demo.section.buttonSizes': 'Button Sizes',
    'demo.section.dangerStates': 'Danger States',
    'demo.section.loadingStates': 'Loading States',
    'demo.section.disabledStates': 'Disabled States',
    'demo.section.icons': 'With Icons',
    'demo.section.interactive': 'Interactive Tests',
    'demo.section.combined': 'Combined States Demo',
    'demo.alert.clickSuccess': '🎉 DynButton clicked successfully!',
    'demo.notifications': {
      one: '{count} notification',
      other: '{count} notifications',
    },
    'demo.locale.en-US': 'English (US)',
    'demo.locale.sr-RS': 'Serbian',
    'demo.locale.ar-EG': 'Arabic',
    'theme.switcher': 'Theme switcher',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.high-contrast': 'High contrast',
    'input.clear': 'Clear field',
    'input.increment': 'Increase value',
    'input.decrement': 'Decrease value',
    'badge.count': 'Notifications',
    'Icon Button': 'Icon Button',
  },
  'sr-RS': {
    'demo.title': '🎨 Dyn UI demonstracija',
    'demo.subtitle': 'Centralizovani stilovi uz promenu teme i jezika u hodu',
    'demo.locale': 'Jezik',
    'demo.theme.label': 'Tema',
    'demo.section.buttonKinds': 'Vrste dugmadi',
    'demo.section.buttonSizes': 'Veličine dugmadi',
    'demo.section.dangerStates': 'Opasna stanja',
    'demo.section.loadingStates': 'Stanja učitavanja',
    'demo.section.disabledStates': 'Onemogućena stanja',
    'demo.section.icons': 'Sa ikonama',
    'demo.section.interactive': 'Interaktivni testovi',
    'demo.section.combined': 'Kombinovana stanja',
    'demo.alert.clickSuccess': '🎉 DynButton je uspešno kliknut!',
    'demo.notifications': {
      one: '{count} obaveštenje',
      few: '{count} obaveštenja',
      other: '{count} obaveštenja',
    },
    'demo.locale.en-US': 'Engleski',
    'demo.locale.sr-RS': 'Srpski',
    'demo.locale.ar-EG': 'Arapski',
    'theme.switcher': 'Prebacivanje teme',
    'theme.light': 'Svetla',
    'theme.dark': 'Tamna',
    'theme.high-contrast': 'Visoki kontrast',
    'input.clear': 'Obriši polje',
    'input.increment': 'Povećaj vrednost',
    'input.decrement': 'Smanji vrednost',
    'badge.count': 'Obaveštenja',
    'button.fallback': 'Dugme',
    'button.loading': 'Učitavanje…',
    'Icon Button': 'Dugme sa ikonom',
    'Loading…': 'Učitavanje…',
    'Loading Demo': 'Primer učitavanja',
    'Processing...': 'Obrada...',
    'Click to Test Loading': 'Klikni za test učitavanja',
    'Saving...': 'Čuvanje...',
    'Primary Button': 'Primarno dugme',
    'Secondary Button': 'Sekundarno dugme',
    'Tertiary Button': 'Tercijarno dugme',
    'Small': 'Malo',
    'Medium': 'Srednje',
    'Large': 'Veliko',
    'Delete': 'Obriši',
    'Remove': 'Ukloni',
    'Cancel': 'Otkaži',
    'Disabled': 'Onemogućeno',
    'Download': 'Preuzmi',
    'Settings': 'Podešavanja',
    'Click Me!': 'Klikni me!',
    'Hover & Focus Test': 'Test hover/focus',
    'Small Primary': 'Malo primarno',
    'Large Secondary': 'Veliko sekundarno',
    'Small Tertiary': 'Malo tercijarno',
    'Large Primary': 'Veliko primarno',
  },
  'ar-EG': {
    'demo.title': '🎨 عرض Dyn UI',
    'demo.subtitle': 'أنماط موحدة مع تبديل فوري للثيم واللغة',
    'demo.locale': 'اللغة',
    'demo.theme.label': 'السمة',
    'demo.section.buttonKinds': 'أنواع الأزرار',
    'demo.section.buttonSizes': 'أحجام الأزرار',
    'demo.section.dangerStates': 'حالات التحذير',
    'demo.section.loadingStates': 'حالات التحميل',
    'demo.section.disabledStates': 'حالات التعطيل',
    'demo.section.icons': 'مع الأيقونات',
    'demo.section.interactive': 'اختبارات تفاعلية',
    'demo.section.combined': 'عرض الحالات المجمعة',
    'demo.alert.clickSuccess': '🎉 تم النقر على DynButton بنجاح!',
    'demo.notifications': {
      zero: 'لا إشعارات',
      one: 'إشعار واحد',
      two: 'إشعاران',
      few: '{count} إشعارات',
      many: '{count} إشعارًا',
      other: '{count} إشعار',
    },
    'demo.locale.en-US': 'الإنجليزية',
    'demo.locale.sr-RS': 'الصربية',
    'demo.locale.ar-EG': 'العربية',
    'theme.switcher': 'مبدّل السمة',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.high-contrast': 'تباين عالٍ',
    'input.clear': 'مسح الحقل',
    'input.increment': 'زيادة القيمة',
    'input.decrement': 'إنقاص القيمة',
    'badge.count': 'الإشعارات',
    'button.fallback': 'زر',
    'button.loading': 'جارٍ التحميل…',
    'Icon Button': 'زر أيقونة',
    'Loading…': 'جارٍ التحميل…',
    'Loading Demo': 'عرض التحميل',
    'Processing...': 'جارٍ المعالجة...',
    'Click to Test Loading': 'اضغط لاختبار التحميل',
    'Saving...': 'جارٍ الحفظ...',
    'Primary Button': 'زر أساسي',
    'Secondary Button': 'زر ثانوي',
    'Tertiary Button': 'زر ثالث',
    'Small': 'صغير',
    'Medium': 'متوسط',
    'Large': 'كبير',
    'Delete': 'حذف',
    'Remove': 'إزالة',
    'Cancel': 'إلغاء',
    'Disabled': 'معطل',
    'Download': 'تنزيل',
    'Settings': 'الإعدادات',
    'Click Me!': 'اضغط علي!',
    'Hover & Focus Test': 'اختبار التحويم والتركيز',
    'Small Primary': 'أساسي صغير',
    'Large Secondary': 'ثانوي كبير',
    'Small Tertiary': 'ثالث صغير',
    'Large Primary': 'أساسي كبير',
  },
};

type LocaleOption = typeof LOCALE_OPTIONS[number];

const DemoApp: React.FC = () => {
  const { t, setLocale, locale, formatNumber } = useI18n();
  const { theme, setTheme, availableThemes } = useTheme();
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('theme', theme);
    params.set('locale', locale);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [locale, theme]);

  const themeOptions = useMemo(() => {
    const merged = new Set<Theme>([...availableThemes, ...THEME_OPTIONS]);
    return Array.from(merged);
  }, [availableThemes]);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotificationCount((current) => (current >= 5 ? 1 : current + 1));
    }, 1200);
  };

  const notificationLabel = t({ id: 'demo.notifications', count: notificationCount });

  return (
    <div className="demo-container">
      <header className="demo-header">
        <h1>{t({ id: 'demo.title', defaultMessage: 'Dyn UI Demo' })}</h1>
        <p>{t({ id: 'demo.subtitle', defaultMessage: 'Live tokens with runtime switches' })}</p>
        <div className="demo-controls">
          <label>
            <span>{t({ id: 'demo.locale', defaultMessage: 'Locale' })}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as LocaleOption)}
            >
              {LOCALE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t({ id: `demo.locale.${option}`, defaultMessage: option })}
                </option>
              ))}
            </select>
          </label>
          <div className="theme-switcher">
            <span>{t({ id: 'demo.theme.label', defaultMessage: 'Theme' })}</span>
            <ThemeSwitcher themes={themeOptions} size="sm" />
          </div>
        </div>
        <p className="demo-meta">
          {notificationLabel} · {t({ id: 'demo.theme.label', defaultMessage: 'Theme' })}: {theme} ·
          {' '}
          {formatNumber(12345.67)}
        </p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <section className="demo-section">
          <h2>{t({ id: 'demo.section.buttonKinds', defaultMessage: 'Button Kinds' })}</h2>
          <div className="demo-buttons">
            <DynButton kind="primary" label="Primary Button" />
            <DynButton kind="secondary" label="Secondary Button" />
            <DynButton kind="tertiary" label="Tertiary Button" />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.buttonSizes', defaultMessage: 'Button Sizes' })}</h2>
          <div className="demo-buttons">
            <DynButton kind="primary" label="Small" size="small" />
            <DynButton kind="primary" label="Medium" size="medium" />
            <DynButton kind="primary" label="Large" size="large" />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.dangerStates', defaultMessage: 'Danger States' })}</h2>
          <div className="demo-buttons">
            <DynButton kind="primary" label="Delete" danger />
            <DynButton kind="secondary" label="Remove" danger />
            <DynButton kind="tertiary" label="Cancel" danger />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.loadingStates', defaultMessage: 'Loading States' })}</h2>
          <div className="demo-buttons">
            <DynButton
              kind="primary"
              label={loading ? 'Saving...' : 'Click to Test Loading'}
              loading={loading}
              onClick={handleClick}
            />
            <DynButton kind="secondary" label="Loading Demo" loading={true} />
            <DynButton kind="tertiary" label="Processing..." loading={true} />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.disabledStates', defaultMessage: 'Disabled States' })}</h2>
          <div className="demo-buttons">
            <DynButton kind="primary" label="Disabled" disabled />
            <DynButton kind="secondary" label="Disabled" disabled />
            <DynButton kind="tertiary" label="Disabled" disabled />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.icons', defaultMessage: 'With Icons' })}</h2>
          <div className="demo-buttons">
            <DynButton kind="primary" icon="download" label="Download" />
            <DynButton kind="secondary" icon="settings" label="Settings" />
            <DynButton kind="tertiary" icon="help" aria-label="Icon Button" />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.interactive', defaultMessage: 'Interactive Tests' })}</h2>
          <div className="demo-buttons">
            <DynButton
              kind="primary"
              label="Click Me!"
              onClick={() =>
                alert(
                  t({
                    id: 'demo.alert.clickSuccess',
                    defaultMessage: '🎉 DynButton clicked successfully!',
                  }),
                )
              }
            />
            <DynButton
              kind="secondary"
              label="Hover & Focus Test"
              onBlur={() => console.log('Button blurred')}
            />
          </div>
        </section>

        <section className="demo-section">
          <h2>{t({ id: 'demo.section.combined', defaultMessage: 'Combined States Demo' })}</h2>
          <div className="demo-buttons">
            <DynButton kind="primary" size="small" label="Small Primary" />
            <DynButton kind="secondary" size="large" label="Large Secondary" />
            <DynButton kind="tertiary" size="small" label="Small Tertiary" danger />
            <DynButton kind="primary" size="large" label="Large Primary" danger />
          </div>
        </section>
      </div>
    </div>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider initialLocale={initialLocale} messages={messages}>
    <ThemeProvider initialTheme={initialTheme}>
      {children}
    </ThemeProvider>
  </I18nProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <DemoApp />
  </Providers>
);
