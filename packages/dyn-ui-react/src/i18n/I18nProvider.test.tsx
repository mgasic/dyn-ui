import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { I18nProvider, useI18n } from './I18nProvider';

describe('I18nProvider', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('data-locale');
    document.documentElement.removeAttribute('data-direction');
    document.documentElement.classList.remove('dyn-rtl');
    document.documentElement.style.removeProperty('--dyn-direction');
    if (document.body) {
      document.body.removeAttribute('dir');
    }
  });

  it('translates messages and updates locale at runtime', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <I18nProvider
        initialLocale="en-US"
        messages={{
          'en-US': { 'demo.greeting': 'Hello {name}' },
          'sr-RS': { 'demo.greeting': 'Zdravo {name}' },
        }}
      >
        {children}
      </I18nProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.locale).toBe('en-US');
    expect(result.current.t({ id: 'demo.greeting', values: { name: 'Ana' } })).toBe('Hello Ana');

    act(() => {
      result.current.setLocale('sr-RS');
    });

    expect(result.current.locale).toBe('sr-RS');
    expect(result.current.t({ id: 'demo.greeting', values: { name: 'Ana' } })).toBe('Zdravo Ana');
    expect(result.current.availableLocales).toEqual(expect.arrayContaining(['en-US', 'sr-RS']));
  });

  it('handles pluralization and formatting helpers', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <I18nProvider
        initialLocale="en-US"
        messages={{
          'en-US': {
            'cart.items': {
              one: '{count} item',
              other: '{count} items',
            },
          },
        }}
      >
        {children}
      </I18nProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.t({ id: 'cart.items', count: 1 })).toBe('1 item');
    expect(result.current.t({ id: 'cart.items', count: 5 })).toBe('5 items');
    expect(result.current.formatNumber(12345.6, { minimumFractionDigits: 1 })).toBe('12,345.6');
    expect(
      result.current.formatDate(new Date(Date.UTC(2024, 2, 15)), {
        dateStyle: 'medium',
        timeZone: 'UTC',
      }),
    ).toBe('Mar 15, 2024');
  });

  it('applies RTL direction metadata when locale is rtl', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <I18nProvider initialLocale="ar-EG" messages={{ 'ar-EG': { greeting: 'مرحبا' } }}>
        {children}
      </I18nProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.direction).toBe('rtl');
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    });
    expect(document.documentElement.classList.contains('dyn-rtl')).toBe(true);
  });
});
