import { render } from '@testing-library/react';
import { DynButton } from './DynButton';
import { describe, it, expect } from 'vitest';

describe('DynButton snapshots', () => {
  it('matches visual states snapshot', () => {
    const { container } = render(
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <DynButton label="Default" />
        <DynButton label="Secondary" variant="secondary" />
        <DynButton label="Danger" danger />
        <DynButton label="Loading" loading />
        <DynButton startIcon="download" aria-label="Download" />
        <DynButton label="End" endIcon="arrow-right" />
      </div>
    );

    expect(container).toMatchSnapshot();
  });
});
