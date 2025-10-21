import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DynModalPlacement } from './DynModalPlacement';
import styles from './DynModalPlacement.module.css';

const getClass = (key: string) => (styles as Record<string, string>)[key];

describe('DynModalPlacement', () => {
  it('applies default center placement and alignment', () => {
    const { container } = render(
      <DynModalPlacement data-testid="placement-default">
        <div>Modal content</div>
      </DynModalPlacement>
    );

    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper).toHaveClass(getClass('dynModalPlacement'));
    expect(wrapper).toHaveClass(getClass('placementCenter'));
    expect(wrapper).toHaveClass(getClass('alignCenter'));
    expect(wrapper).toHaveAttribute('data-placement', 'center');
    expect(wrapper).toHaveAttribute('data-alignment', 'center');
  });

  it('supports all horizontal alignment options', () => {
    (['start', 'center', 'end', 'stretch'] as const).forEach(alignment => {
      const { container, unmount } = render(
        <DynModalPlacement alignment={alignment} data-testid={`placement-${alignment}`}>
          <div>Modal content</div>
        </DynModalPlacement>
      );

      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass(getClass(`align${alignment.charAt(0).toUpperCase()}${alignment.slice(1)}`));
      expect(wrapper.getAttribute('data-alignment')).toBe(alignment);
      unmount();
    });
  });

  it('supports all vertical placement options', () => {
    (['top', 'center', 'bottom', 'fullscreen'] as const).forEach(placement => {
      const { container, unmount } = render(
        <DynModalPlacement placement={placement} data-testid={`placement-${placement}`}>
          <div>Modal content</div>
        </DynModalPlacement>
      );

      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass(getClass(`placement${placement.charAt(0).toUpperCase()}${placement.slice(1)}`));
      expect(wrapper.getAttribute('data-placement')).toBe(placement);
      unmount();
    });
  });

  it('respects spacing props', () => {
    const { getByTestId } = render(
      <DynModalPlacement data-testid="spacing" padding={32} gap="3rem">
        <div>Modal content</div>
      </DynModalPlacement>
    );

    const wrapper = getByTestId('spacing');
    expect(wrapper.style.getPropertyValue('--dyn-modal-placement-padding')).toBe('32px');
    expect(wrapper.style.getPropertyValue('--dyn-modal-placement-gap')).toBe('3rem');
  });

  it('applies strategy, overflow and full height modifiers', () => {
    const { container } = render(
      <DynModalPlacement
        strategy="absolute"
        allowOverflow
        fullHeight
        className="custom-class"
      >
        <div>Modal content</div>
      </DynModalPlacement>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass(getClass('strategyAbsolute'));
    expect(wrapper).toHaveClass(getClass('allowOverflow'));
    expect(wrapper).toHaveClass(getClass('fullHeight'));
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper.getAttribute('data-strategy')).toBe('absolute');
  });
});
