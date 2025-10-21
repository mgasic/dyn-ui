import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynComponentName } from './DynComponentName';

describe('DynComponentName', () => {
  it('matches snapshot with default settings', () => {
    const { container } = render(
      <DynComponentName p="md" gap="sm">
        <span>Snapshot content</span>
        <span>Secondary line</span>
      </DynComponentName>
    );

    expect(container).toMatchSnapshot();
  });

  it('supports polymorphic rendering and responsive spacing', () => {
    const { container } = render(
      <DynComponentName
        as="section"
        p={{ base: 'sm', lg: 'xl' }}
        m={{ base: '0', md: 'lg' }}
        gap={{ base: 'xs', md: 'lg' }}
      >
        <h2>Section title</h2>
        <p>Supporting copy for the section.</p>
      </DynComponentName>
    );

    expect(container).toMatchSnapshot();
  });
});
