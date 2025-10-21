import type React from 'react';

export type PluralForms = Partial<Record<Intl.LDMLPluralRule | 'other', string>>;

export interface LocaleMessages {
  [key: string]: string | PluralForms | LocaleMessages;
}

export type MessageDescriptor =
  | string
  | {
      id: string;
      defaultMessage?: string;
      values?: Record<string, unknown>;
      count?: number;
      locale?: string;
    };

export interface TranslateOptions {
  count?: number;
  values?: Record<string, unknown>;
  defaultMessage?: string;
  locale?: string;
}

export interface I18nProviderProps {
  /** Initial locale applied to the tree */
  initialLocale?: string;
  /** Controlled locale value */
  locale?: string;
  /** Locale used when no translation is available */
  fallbackLocale?: string;
  /** Dictionary of translations keyed by locale */
  messages?: Record<string, LocaleMessages>;
  /** Detect and apply RTL direction automatically */
  detectDirection?: boolean;
  /** Callback invoked when locale changes */
  onLocaleChange?: (locale: string) => void;
  children: React.ReactNode;
}

export interface I18nContextValue {
  locale: string;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
  availableLocales: string[];
  messages: LocaleMessages;
  t: (descriptor: MessageDescriptor | null | undefined, options?: TranslateOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions & { timeZone?: string }
  ) => string;
  setLocale: (locale: string) => void;
  registerMessages: (locale: string, dictionary: LocaleMessages) => void;
}
