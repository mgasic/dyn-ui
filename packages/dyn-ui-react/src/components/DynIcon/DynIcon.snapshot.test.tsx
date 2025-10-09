import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import DynIcon from './DynIcon';
import { IconDictionaryProvider } from '../../providers/IconDictionaryProvider';

const renderSnapshot = (element: React.ReactElement) =>
  render(<IconDictionaryProvider>{element}</IconDictionaryProvider>);

describe('DynIcon snapshots', () => {
  it('matches default render', () => {
    const { container } = renderSnapshot(<DynIcon icon="ok" />);
    expect(container).toMatchSnapshot();
  });

  it('matches registry icon render', () => {
    const { container } = renderSnapshot(<DynIcon icon="check" size="large" />);
    expect(container).toMatchSnapshot();
  });
});
