import { createContext, useEffect, useMemo, useState } from 'react';
import type { IconDictionary } from '../types/icon.types';

export type IconDictionaryContextValue = IconDictionary;

const DEFAULT_ICON_DICTIONARY: IconDictionary = Object.freeze({
  'user': 'dyn-icon-user',
  'home': 'dyn-icon-home',
  'settings': 'dyn-icon-settings',
  'ok': 'dyn-icon-ok',
  'close': 'dyn-icon-close',
  'warning': 'dyn-icon-warning',
  'minus': 'dyn-icon-minus',
  'plus': 'dyn-icon-plus',
  'search': 'dyn-icon-search',
  'edit': 'dyn-icon-edit',
  'delete': 'dyn-icon-delete',
  'arrow-up': 'dyn-icon-arrow-up',
  'arrow-down': 'dyn-icon-arrow-down',
  'arrow-left': 'dyn-icon-arrow-left',
  'arrow-right': 'dyn-icon-arrow-right',
  'menu': 'dyn-icon-menu',
  'info': 'dyn-icon-info',
  'calendar': 'dyn-icon-calendar',
  'clock': 'dyn-icon-clock',
  'mail': 'dyn-icon-mail',
});

export const IconDictionaryContext = createContext<IconDictionaryContextValue | undefined>(undefined);

interface IconDictionaryProviderProps {
  children: React.ReactNode;
  customDictionary?: IconDictionary;
}

export const IconDictionaryProvider: React.FC<IconDictionaryProviderProps> = ({
  children,
  customDictionary,
}: IconDictionaryProviderProps) => {
  const [dictionary, setDictionary] = useState<IconDictionaryContextValue>(DEFAULT_ICON_DICTIONARY);

  useEffect(() => {
    if (!customDictionary || Object.keys(customDictionary).length === 0) {
      setDictionary(DEFAULT_ICON_DICTIONARY);
      return;
    }

    setDictionary({
      ...DEFAULT_ICON_DICTIONARY,
      ...customDictionary,
    });
  }, [customDictionary]);

  const value = useMemo<IconDictionaryContextValue>(
    () => ({ ...dictionary }),
    [dictionary]
  );

  return (
    <IconDictionaryContext.Provider value={value}>
      {children}
    </IconDictionaryContext.Provider>
  );
};

export { DEFAULT_ICON_DICTIONARY };
