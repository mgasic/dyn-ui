import type { FC } from 'react';
import { expectAssignable, expectType } from 'tsd';
import {
  DynButton,
  type DynButtonProps,
  ThemeProvider,
  type ThemeProviderProps,
  classNames,
  generateInitials,
  useTheme,
} from '@dyn-ui/react';

expectAssignable<FC<DynButtonProps>>(DynButton);
expectAssignable<FC<ThemeProviderProps>>(ThemeProvider);

expectType<string>(classNames('demo', { active: true }));
expectType<string>(generateInitials('Dyn UI Library'));

const theme = useTheme();
expectType<'light' | 'dark'>(theme.theme);
