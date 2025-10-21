import type { ReactElement } from 'react';

export interface PerfTarget<Props extends Record<string, unknown> = Record<string, unknown>> {
  /** Display name for reporting. */
  name: string;
  /** Relative path from repo root to the component module. */
  importPath: string;
  /** Named export to load from the module. */
  exportName: string;
  /** Props passed to the component for rendering. */
  props: Props;
  /** Optional iterations for React Profiler runs. */
  iterations?: number;
  /** Optional function that wraps the component (e.g. providers). */
  wrap?: (element: ReactElement) => ReactElement;
}

export const PERF_TARGETS: readonly PerfTarget[] = [
  {
    name: 'DynButton',
    importPath: 'packages/dyn-ui-react/src/components/DynButton/DynButton.tsx',
    exportName: 'DynButton',
    props: {
      label: 'Primary action',
      kind: 'primary',
      size: 'medium',
      icon: 'add',
    },
    iterations: 6,
  },
  {
    name: 'DynAvatar',
    importPath: 'packages/dyn-ui-react/src/components/DynAvatar/DynAvatar.tsx',
    exportName: 'DynAvatar',
    props: {
      name: 'Helena Martins',
      status: 'available',
      size: 'large',
      showStatusIndicator: true,
    },
    iterations: 6,
  },
  {
    name: 'DynBadge',
    importPath: 'packages/dyn-ui-react/src/components/DynBadge/DynBadge.tsx',
    exportName: 'DynBadge',
    props: {
      label: 'Active',
      variant: 'solid',
      color: 'success',
      size: 'medium',
      dismissible: true,
    },
    iterations: 6,
  },
] as const;
