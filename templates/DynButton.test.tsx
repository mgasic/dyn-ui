import { render } from '@testing-library/react';
import * as React from 'react';
import { DynButton } from '../packages/dyn-ui-react/src/components/DynButton/DynButton';
describe('DynButton', () => {
  it('exports a React component', () => { expect(typeof DynButton).toBe('function'); });
  it('renders without crashing', () => { render(<DynButton>Click</DynButton>); });
});
