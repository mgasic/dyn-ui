import type { Theme } from '../../theme/ThemeProvider';

export type ThemeSwitcherSize = 'sm' | 'md';
export type ThemeSwitcherRounded = 'sm' | 'md' | 'lg' | 'full';

export interface ThemeSwitcherProps {
  themes?: Theme[];
  size?: ThemeSwitcherSize;
  rounded?: ThemeSwitcherRounded;
  onChange?: (theme: Theme) => void;
  labels?: Record<Theme, string>;
  className?: string;
  /** Additional class name applied to every toggle button */
  buttonClassName?: string;
  /** Optional class name appended to the active toggle button */
  activeButtonClassName?: string;
}
