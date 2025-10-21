declare module '@dyn-ui/react' {
  import type { FC, ReactNode } from 'react';

  export interface DynButtonProps {
    label?: string;
    kind?: string;
  }
  export const DynButton: FC<DynButtonProps>;

  export interface ThemeProviderProps {
    children: ReactNode;
  }
  export const ThemeProvider: FC<ThemeProviderProps>;
  export function useTheme(): { theme: 'light' | 'dark' };

  export type ClassNamesInput =
    | string
    | null
    | undefined
    | false
    | Record<string, boolean>;
  export function classNames(...tokens: ClassNamesInput[]): string;
  export function generateInitials(input: string): string;
}
