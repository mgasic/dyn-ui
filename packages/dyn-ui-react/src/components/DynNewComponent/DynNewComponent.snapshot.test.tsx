import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynNewComponent } from './DynNewComponent';

describe('DynNewComponent snapshots', () => {
  it('matches the default wrapper snapshot', () => {
    const { container } = render(
      <DynNewComponent gap="md" p="lg" m="sm">
        <div>First block</div>
        <div>Second block</div>
      </DynNewComponent>
    );

    expect(container).toMatchSnapshot();
  });
});
