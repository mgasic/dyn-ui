import { render } from '@testing-library/react';
import * as React from 'react';
import { DynIcon } from '../packages/dyn-ui-react/src/components/DynIcon/DynIcon';
import { describe, it, expect } from 'vitest';
describe('DynIcon', () => {
  it('exports a React component', () => {
    const dynIconType = typeof DynIcon;
    expect(['function', 'object']).toContain(dynIconType);
  });
  it('renders without crashing', () => { render(<DynIcon icon="check" />); });
});

