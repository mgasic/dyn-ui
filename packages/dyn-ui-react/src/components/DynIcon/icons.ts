import * as React from 'react';

// Built-in icon registry with common SVG icons
export const iconRegistry = {
  check: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: React.createElement('path', {
      d: 'M20 6L9 17l-5-5',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    })
  }),
  
  close: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('path', {
        key: '1',
        d: 'M18 6L6 18',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('path', {
        key: '2', 
        d: 'M6 6l12 12',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    ]
  }),
  
  warning: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('path', {
        key: '1',
        d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'
      }),
      React.createElement('line', {
        key: '2',
        x1: '12',
        y1: '9',
        x2: '12',
        y2: '13',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('circle', { key: '3', cx: '12', cy: '17', r: '1' })
    ]
  }),
  
  info: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('path', {
        key: '2',
        d: 'M12 16v-4',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('path', {
        key: '3',
        d: 'M12 8h.01',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    ]
  }),
  
  ok: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('path', {
        key: '2',
        d: 'M9 12l2 2 4-4',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    ]
  }),
  
  minus: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: React.createElement('line', {
      x1: '5',
      y1: '12',
      x2: '19',
      y2: '12',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    })
  }),
  
  plus: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('line', {
        key: '1',
        x1: '12',
        y1: '5',
        x2: '12',
        y2: '19',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('line', {
        key: '2',
        x1: '5',
        y1: '12',
        x2: '19',
        y2: '12',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    ]
  }),
  
  download: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('path', {
        key: '1',
        d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('polyline', {
        key: '2',
        points: '7,10 12,15 17,10',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('line', {
        key: '3',
        x1: '12',
        y1: '15',
        x2: '12',
        y2: '3',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    ]
  }),
  
  settings: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '3' }),
      React.createElement('path', {
        key: '2',
        d: 'M12 1v6m0 6v6m11-7h-6m-6 0H1',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    ]
  }),
  
  help: React.createElement('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    children: [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('path', {
        key: '2',
        d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      React.createElement('circle', { key: '3', cx: '12', cy: '17', r: '1' })
    ]
  }),
};

export type IconName = keyof typeof iconRegistry;

export const getIcon = (name: string): React.ReactElement | null => {
  return iconRegistry[name as IconName] || null;
};
