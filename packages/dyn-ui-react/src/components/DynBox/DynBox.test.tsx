import * as React from 'react';
import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { testAccessibility } from '../../test-utils';
import { DynBox } from './DynBox';
import { DYN_BOX_DEFAULT_PROPS, DynBoxOwnProps } from './DynBox.types';
import styles from './DynBox.module.css';

const getStyleClass = (className: string): string => {
  return (styles as Record<string, string>)[className] || '';
};

describe('DynBox', () => {
  describe('Basic Functionality', () => {
    it('exports a React component', () => {
      expect(DynBox).toBeDefined();
      expect((DynBox as any).displayName).toBe('DynBox');
    });

    it('renders with default props', () => {
      const { getByTestId } = render(<DynBox />);
      const element = getByTestId(DYN_BOX_DEFAULT_PROPS['data-testid']);

      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe('DIV');
    });

    it('applies base class and custom className', () => {
      const { getByTestId } = render(<DynBox className="custom" />);
      const element = getByTestId(DYN_BOX_DEFAULT_PROPS['data-testid']);

      expect(element).toHaveClass(getStyleClass('box'));
      expect(element).toHaveClass('custom');
    });

    it('supports polymorphic rendering and ref forwarding', () => {
      const ref = createRef<any>();
      const { rerender } = render(
        <DynBox ref={ref as any} data-testid="polymorphic">
          Content
        </DynBox>
      );

      expect(screen.getByTestId('polymorphic').tagName).toBe('DIV');

      rerender(
        <DynBox as="section" ref={ref as any} data-testid="polymorphic">
          Content
        </DynBox>
      );

      expect(screen.getByTestId('polymorphic').tagName).toBe('SECTION');
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('supports multiple element types with proper typing', () => {
      const { rerender } = render(
        <DynBox as="article" data-testid="element">Article</DynBox>
      );
      expect(screen.getByTestId('element').tagName).toBe('ARTICLE');

      rerender(
        <DynBox as="main" data-testid="element">Main</DynBox>
      );
      expect(screen.getByTestId('element').tagName).toBe('MAIN');

      rerender(
        <DynBox as="aside" data-testid="element">Aside</DynBox>
      );
      expect(screen.getByTestId('element').tagName).toBe('ASIDE');
    });

    it('renders semantic overrides for section, nav, and list patterns', () => {
      const { rerender } = render(
        <DynBox as="section" data-testid="semantic">
          Section content
        </DynBox>
      );

      expect(screen.getByTestId('semantic').tagName).toBe('SECTION');

      rerender(
        <DynBox as="nav" data-testid="semantic" aria-label="Site navigation">
          Navigation
        </DynBox>
      );

      expect(screen.getByTestId('semantic').tagName).toBe('NAV');

      rerender(
        <DynBox as="ul" data-testid="semantic">
          <li>Item 1</li>
          <li>Item 2</li>
        </DynBox>
      );

      expect(screen.getByTestId('semantic').tagName).toBe('UL');
    });

    it('merges cssVars with inline style', () => {
      render(
        <DynBox
          data-testid="styled-box"
          cssVars={{ '--custom-var': '42px' }}
          style={{ opacity: 0.5 }}
        />
      );

      expect(screen.getByTestId('styled-box')).toHaveStyle({
        '--custom-var': '42px',
        opacity: '0.5',
      });
    });

    it('generates proper ID when not provided', () => {
      render(<DynBox data-testid="auto-id" />);
      const element = screen.getByTestId('auto-id');

      expect(element.id).toMatch(/^dyn-box-\d+$/);
    });

    it('uses custom ID when provided', () => {
      render(<DynBox id="custom-id" data-testid="custom-id-box" />);
      const element = screen.getByTestId('custom-id-box');

      expect(element.id).toBe('custom-id');
    });

    it('forwards additional props correctly', () => {
      render(
        <DynBox
          data-testid="forwarded-props"
          data-custom="value"
          title="Tooltip text"
        />
      );
      const element = screen.getByTestId('forwarded-props');

      expect(element).toHaveAttribute('data-custom', 'value');
      expect(element).toHaveAttribute('title', 'Tooltip text');
    });

    it('applies border side classes without forwarding props to the DOM', () => {
      render(
        <DynBox
          data-testid="border-box"
          border="default"
          borderTop
          borderRight
          borderBottom
          borderLeft
        />
      );

      const element = screen.getByTestId('border-box');

      expect(element).toHaveClass(getStyleClass('box--border'));
      expect(element).toHaveClass(getStyleClass('box--border-top'));
      expect(element).toHaveClass(getStyleClass('box--border-right'));
      expect(element).toHaveClass(getStyleClass('box--border-bottom'));
      expect(element).toHaveClass(getStyleClass('box--border-left'));
      expect(element).not.toHaveAttribute('borderTop');
      expect(element).not.toHaveAttribute('borderRight');
      expect(element).not.toHaveAttribute('borderBottom');
      expect(element).not.toHaveAttribute('borderLeft');
    });
  });

  describe('Accessibility', () => {
    it('passes automated accessibility checks', async () => {
      const { container } = render(
        <DynBox aria-label="Accessible box" p="md" bg="tertiary">
          Accessible Content
        </DynBox>
      );

      await testAccessibility(container);
    });

    it('passes accessibility checks with complex configuration', async () => {
      const { container } = render(
        <DynBox
          interactive
          aria-label="Complex interactive box"
          aria-describedby="description"
          role="button"
          p="lg"
          bg="primary"
          shadow="md"
        >
          Complex Content
          <div id="description">This is a description</div>
        </DynBox>
      );

      await testAccessibility(container);
    });

    it('supports comprehensive aria attributes', () => {
      render(
        <DynBox
          role="region"
          aria-label="Test region"
          aria-labelledby="heading-id"
          aria-describedby="description-id"
          data-testid="aria-box"
        >
          Content
        </DynBox>
      );

      const element = screen.getByTestId('aria-box');
      expect(element).toHaveAttribute('role', 'region');
      expect(element).toHaveAttribute('aria-label', 'Test region');
      expect(element).toHaveAttribute('aria-labelledby', 'heading-id');
      expect(element).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('exposes live region messaging and merges descriptions', () => {
      render(
        <DynBox
          role="region"
          aria-label="Announcements"
          aria-describedby="external-description"
          ariaLiveMessage="Live update inbound"
          ariaLivePoliteness="assertive"
          data-testid="live-region-box"
        >
          Content
        </DynBox>
      );

      const element = screen.getByTestId('live-region-box');
      const liveRegion = element.querySelector('[aria-live]');

      expect(liveRegion).not.toBeNull();
      expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      expect(liveRegion).toHaveClass('dyn-sr-only');
      expect(liveRegion).toHaveTextContent('Live update inbound');

      const liveRegionId = liveRegion?.getAttribute('id');
      const describedBy = element.getAttribute('aria-describedby');

      expect(liveRegionId).toBeTruthy();
      expect(describedBy).toContain('external-description');
      expect(describedBy).toContain(liveRegionId!);
    });

    it('handles live region without external describedBy', () => {
      render(
        <DynBox
          ariaLiveMessage="Simple announcement"
          data-testid="simple-live"
        >
          Content
        </DynBox>
      );

      const element = screen.getByTestId('simple-live');
      const liveRegion = element.querySelector('[aria-live]');
      const liveRegionId = liveRegion?.getAttribute('id');
      const describedBy = element.getAttribute('aria-describedby');

      expect(describedBy).toBe(liveRegionId);
    });

    it('can focus on mount for keyboard users', async () => {
      render(
        <DynBox
          interactive
          aria-label="Focusable box"
          focusOnMount
          data-testid="focus-mount"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('focus-mount')).toHaveFocus();
      });
    });

    it('does not focus on mount when focusOnMount is false', () => {
      render(
        <DynBox
          interactive
          aria-label="Non-focus box"
          focusOnMount={false}
          data-testid="no-focus-mount"
        />
      );

      expect(screen.getByTestId('no-focus-mount')).not.toHaveFocus();
    });

    it('supports screen reader utility class correctly', () => {
      render(
        <DynBox ariaLiveMessage="Screen reader message" data-testid="sr-test">
          Content
        </DynBox>
      );

      const element = screen.getByTestId('sr-test');
      const srElement = element.querySelector('.dyn-sr-only');

      expect(srElement).toBeInTheDocument();
      expect(srElement).toHaveTextContent('Screen reader message');
    });
  });

  describe('Interactive Behavior', () => {
    it('supports pointer and keyboard activation', async () => {
      const onClick = vi.fn();
      const onKeyDown = vi.fn();
      const user = userEvent.setup();

      render(
        <DynBox
          interactive
          onClick={onClick}
          onKeyDown={onKeyDown}
          aria-label="Interactive"
          data-testid="interactive-box"
        >
          Clickable
        </DynBox>
      );

      const element = screen.getByTestId('interactive-box');

      // Test click
      await user.click(element);
      expect(onClick).toHaveBeenCalledTimes(1);

      // Test keyboard interaction
      element.focus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(2);

      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(3);

      // onKeyDown should be called for each keypress
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });

    it('handles interactive state with proper attributes', () => {
      render(
        <DynBox
          interactive
          aria-label="Interactive box"
          data-testid="interactive-attrs"
        />
      );

      const element = screen.getByTestId('interactive-attrs');
      expect(element).toHaveAttribute('role', 'button');
      expect(element).toHaveAttribute('tabIndex', '0');
      expect(element).toHaveClass(getStyleClass('box--interactive'));
    });

    it('respects custom role for interactive elements', () => {
      render(
        <DynBox
          interactive
          role="tab"
          aria-label="Tab element"
          data-testid="custom-role"
        />
      );

      const element = screen.getByTestId('custom-role');
      expect(element).toHaveAttribute('role', 'tab');
    });

    it('respects custom tabIndex', () => {
      render(
        <DynBox
          interactive
          tabIndex={-1}
          aria-label="Custom tabIndex"
          data-testid="custom-tabindex"
        />
      );

      const element = screen.getByTestId('custom-tabindex');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('handles non-interactive state correctly', () => {
      render(
        <DynBox
          aria-label="Non-interactive"
          data-testid="non-interactive"
        >
          Static content
        </DynBox>
      );

      const element = screen.getByTestId('non-interactive');
      expect(element).not.toHaveAttribute('role', 'button');
      expect(element).not.toHaveAttribute('tabIndex');
      expect(element).not.toHaveClass(getStyleClass('box--interactive'));
    });

    it('ignores keyboard events when not interactive', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();

      render(
        <DynBox
          onClick={onClick}
          data-testid="click-only"
        >
          Click only
        </DynBox>
      );

      const element = screen.getByTestId('click-only');

      // Click should work
      await user.click(element);
      expect(onClick).toHaveBeenCalledTimes(1);

      // Keyboard should not trigger click
      element.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1); // Still only 1
    });
  });

  describe('Variants and States', () => {
    it('applies spacing tokens to CSS variables', () => {
      render(
        <DynBox
          data-testid="spacing-box"
          p="md"
          mt="lg"
          px="sm"
          mx="auto"
        />
      );

      expect(screen.getByTestId('spacing-box')).toHaveStyle({
        '--dyn-box-padding': 'var(--dyn-spacing-md, var(--spacing-md, 1rem))',
        '--dyn-box-padding-left': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
        '--dyn-box-padding-right': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
        '--dyn-box-margin-top': 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
        '--dyn-box-margin-left': 'auto',
        '--dyn-box-margin-right': 'auto',
      });
    });

    it('applies all spacing variations correctly', () => {
      render(
        <DynBox
          data-testid="all-spacing"
          pt="xs" pr="sm" pb="md" pl="lg"
          mt="xl" mr="2xl" mb="0" ml="auto"
        />
      );

      const element = screen.getByTestId('all-spacing');
      expect(element).toHaveStyle({
        '--dyn-box-padding-top': 'var(--dyn-spacing-xs, var(--spacing-xs, 0.25rem))',
        '--dyn-box-padding-right': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
        '--dyn-box-padding-bottom': 'var(--dyn-spacing-md, var(--spacing-md, 1rem))',
        '--dyn-box-padding-left': 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
        '--dyn-box-margin-top': 'var(--dyn-spacing-xl, var(--spacing-xl, 2rem))',
        '--dyn-box-margin-right': 'var(--dyn-spacing-2xl, var(--spacing-2xl, 3rem))',
        '--dyn-box-margin-bottom': '0',
        '--dyn-box-margin-left': 'auto',
      });
    });

    it('maps responsive spacing tokens to breakpoint-aware CSS variables', () => {
      render(
        <DynBox
          data-testid="responsive-spacing"
          p={{ base: 'sm', lg: 'xl' }}
          px={{ md: 'lg' }}
          my={{ base: 'xs', xl: '2xl' }}
          gap={{ base: 'sm', md: 'lg', xl: '2xl' }}
        />
      );

      const element = screen.getByTestId('responsive-spacing');
      expect(element).toHaveClass(getStyleClass('box--p-sm'));
      expect(element.style.getPropertyValue('--dyn-box-padding')).toBe(
        'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-padding-lg')).toBe(
        'var(--dyn-spacing-xl, var(--spacing-xl, 2rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-padding-right-md')).toBe(
        'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-padding-left-md')).toBe(
        'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-margin-top')).toBe(
        'var(--dyn-spacing-xs, var(--spacing-xs, 0.25rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-margin-bottom')).toBe(
        'var(--dyn-spacing-xs, var(--spacing-xs, 0.25rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-margin-top-xl')).toBe(
        'var(--dyn-spacing-2xl, var(--spacing-2xl, 3rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-margin-bottom-xl')).toBe(
        'var(--dyn-spacing-2xl, var(--spacing-2xl, 3rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-gap')).toBe(
        'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-gap-md')).toBe(
        'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))'
      );
      expect(element.style.getPropertyValue('--dyn-box-gap-xl')).toBe(
        'var(--dyn-spacing-2xl, var(--spacing-2xl, 3rem))'
      );
    });

    it('applies background variant and border utilities', () => {
      render(
        <DynBox data-testid="variant-box" bg="primary" border="default"  borderRadius="md" shadow="lg" />
      );

      const element = screen.getByTestId('variant-box');
      expect(element).toHaveClass(getStyleClass('box--bg-primary'));
      expect(element).toHaveClass(getStyleClass('box--border'));
      expect(element).toHaveClass(getStyleClass('box--rounded-md'));
      expect(element).toHaveClass(getStyleClass('box--shadow-lg'));
    });

    it('applies all background variants', () => {
      const variants = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'] as const;

      variants.forEach(variant => {
        const { unmount } = render(
          <DynBox bg={variant} data-testid={`bg-${variant}`} />
        );

        expect(screen.getByTestId(`bg-${variant}`)).toHaveClass(getStyleClass(`box--bg-${variant}`));
        unmount();
      });
    });

    it('handles custom background colors', () => {
      render(
        <DynBox
          data-testid="custom-bg"
          bg="rgba(255,255,255,0.1)"
        />
      );

      const element = screen.getByTestId('custom-bg');
      // Custom backgrounds should not get CSS classes but should use CSS variables
      expect(
        Array.from(element.classList).some(className => className.includes('box--bg-'))
      ).toBe(false);
      expect(element).toHaveStyle({
        '--dyn-box-bg': 'rgba(255,255,255,0.1)',
      });
    });

    it('handles custom border radius values', () => {
      render(
        <DynBox
          data-testid="custom-radius"
          borderRadius="20px"
        />
      );

      const element = screen.getByTestId('custom-radius');
      // Custom radius should not get CSS classes but should use CSS variables
      expect(
        Array.from(element.classList).some(className => className.includes('box--rounded-'))
      ).toBe(false);
      expect(element).toHaveStyle({
        '--dyn-box-radius': '20px',
      });
    });

    it('applies layout variables for flex configuration', () => {
      render(
        <DynBox
          data-testid="flex-box"
          display="flex"
          flexDirection="column"
          justify="center"
          align="flex-start"
          gap="sm"
          rowGap="md"
          columnGap="lg"
        />
      );

      const element = screen.getByTestId('flex-box');
      expect(element).toHaveClass(getStyleClass('box--flex'));
      expect(element).toHaveStyle({
        '--dyn-box-flex-direction': 'column',
        '--dyn-box-justify-content': 'center',
        '--dyn-box-align-items': 'flex-start',
        '--dyn-box-gap': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
        '--dyn-box-row-gap': 'var(--dyn-spacing-md, var(--spacing-md, 1rem))',
        '--dyn-box-column-gap': 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
      });
    });

    it('applies grid layout variables', () => {
      render(
        <DynBox
          data-testid="grid-box"
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          gridTemplateRows="auto 1fr auto"
          gridTemplateAreas="'header header header' 'sidebar content content' 'footer footer footer'"
        />
      );

      const element = screen.getByTestId('grid-box');
      expect(element).toHaveClass(getStyleClass('box--grid'));
      expect(element).toHaveStyle({
        '--dyn-box-grid-columns': 'repeat(3, 1fr)',
        '--dyn-box-grid-rows': 'auto 1fr auto',
        '--dyn-box-grid-areas': "'header header header' 'sidebar content content' 'footer footer footer'",
      });
    });

    it('applies position and offset variables', () => {
      render(
        <DynBox
          data-testid="positioned-box"
          position="absolute"
          top={10}
          right="20px"
          bottom={0}
          left="auto"
          zIndex={999}
        />
      );

      const element = screen.getByTestId('positioned-box');
      expect(element).toHaveClass(getStyleClass('box--absolute'));
      expect(element).toHaveStyle({
        '--dyn-box-top': '10px',
        '--dyn-box-right': '20px',
        '--dyn-box-bottom': '0',
        '--dyn-box-left': 'auto',
        '--dyn-box-z-index': '999',
      });
    });

    it('applies display variants correctly', () => {
      const displays = ['flex', 'inline-flex', 'grid', 'inline-grid', 'inline', 'inline-block', 'none'] as const;

      displays.forEach(display => {
        const { unmount } = render(
          <DynBox display={display} data-testid={`display-${display}`} />
        );

        expect(screen.getByTestId(`display-${display}`)).toHaveClass(getStyleClass(`box--${display}`));
        unmount();
      });
    });
  });

  describe('Props and Customization', () => {
    it('applies responsive visibility helpers', () => {
      render(
        <DynBox
          data-testid="responsive-box"
          hideOnMobile
          tabletOnly
        />
      );

      const element = screen.getByTestId('responsive-box');
      expect(element).toHaveClass(getStyleClass('box--mobile-hidden'));
      expect(element).toHaveClass(getStyleClass('box--desktop-hidden'));
      expect(element).not.toHaveClass(getStyleClass('box--tablet-hidden'));
    });

    it('applies all responsive visibility combinations', () => {
      render(
        <DynBox
          data-testid="all-responsive"
          hideOnTablet
          mobileOnly={false}
          desktopOnly
        />
      );

      const element = screen.getByTestId('all-responsive');
      expect(element).toHaveClass(getStyleClass('box--tablet-hidden'));
      expect(element).toHaveClass(getStyleClass('box--mobile-hidden'));
    });

    it('supports custom dimensions via tokens', () => {
      render(
        <DynBox
          data-testid="dimension-box"
          width={320}
          height="50%"
          minWidth={200}
          maxWidth="640px"
          minHeight="100vh"
          maxHeight={800}
        />
      );

      expect(screen.getByTestId('dimension-box')).toHaveStyle({
        '--dyn-box-width': '320px',
        '--dyn-box-height': '50%',
        '--dyn-box-min-width': '200px',
        '--dyn-box-max-width': '640px',
        '--dyn-box-min-height': '100vh',
        '--dyn-box-max-height': '800px',
      });
    });

    it('handles zero dimensions correctly', () => {
      render(
        <DynBox
          data-testid="zero-dimensions"
          width={0}
          height={0}
        />
      );

      expect(screen.getByTestId('zero-dimensions')).toHaveStyle({
        '--dyn-box-width': '0',
        '--dyn-box-height': '0',
      });
    });

    it('applies custom colors correctly', () => {
      render(
        <DynBox
          data-testid="custom-colors"
          backgroundColor="rgb(255, 0, 0)"
          color="#ffffff"
        />
      );

      expect(screen.getByTestId('custom-colors')).toHaveStyle({
        '--dyn-box-bg': 'rgb(255, 0, 0)',
        '--dyn-box-color': '#ffffff',
      });
    });

    it('applies text alignment and overflow styles', () => {
      render(
        <DynBox
          data-testid="text-overflow"
          textAlign="center"
          overflow="hidden"
          overflowX="scroll"
          overflowY="auto"
        />
      );

      const element = screen.getByTestId('text-overflow');
      expect(element).toHaveClass(getStyleClass('box--text-center'));
      expect(element).toHaveClass(getStyleClass('box--overflow-hidden'));
      expect(element).toHaveStyle({
        '--dyn-box-overflow-x': 'scroll',
        '--dyn-box-overflow-y': 'auto',
      });
    });

    it('applies custom border radius', () => {
      render(
        <DynBox
          data-testid="custom-radius"
          customBorderRadius="10px"
        />
      );

      expect(screen.getByTestId('custom-radius')).toHaveStyle({
        '--dyn-box-radius': '10px',
      });
    });

    it('combines multiple CSS custom properties correctly', () => {
      render(
        <DynBox
          data-testid="complex-box"
          p="lg"
          m="sm"
          bg="primary"
          border="default"
          borderRadius="md"
          shadow="lg"
          display="flex"
          flexDirection="row"
          justify="space-between"
          align="center"
          gap="md"
          cssVars={{ '--custom': 'value' }}
        />
      );

      const element = screen.getByTestId('complex-box');

      // Check CSS classes
      expect(element).toHaveClass(getStyleClass('box'));
      expect(element).toHaveClass(getStyleClass('box--bg-primary'));
      expect(element).toHaveClass(getStyleClass('box--border'));
      expect(element).toHaveClass(getStyleClass('box--rounded-md'));
      expect(element).toHaveClass(getStyleClass('box--shadow-lg'));
      expect(element).toHaveClass(getStyleClass('box--flex'));

      // Check CSS variables
      expect(element).toHaveStyle({
        '--dyn-box-padding': 'var(--dyn-spacing-lg, var(--spacing-lg, 1.5rem))',
        '--dyn-box-margin': 'var(--dyn-spacing-sm, var(--spacing-sm, 0.5rem))',
        '--dyn-box-flex-direction': 'row',
        '--dyn-box-justify-content': 'space-between',
        '--dyn-box-align-items': 'center',
        '--dyn-box-gap': 'var(--dyn-spacing-md, var(--spacing-md, 1rem))',
        '--custom': 'value',
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles undefined values gracefully', () => {
      render(
        <DynBox
          data-testid="undefined-props"
          p={undefined}
          width={undefined}
          backgroundColor={undefined}
          gap={undefined}
        />
      );

      const element = screen.getByTestId('undefined-props');
      expect(element).toBeInTheDocument();

      // Check that style attribute exists but doesn't contain these variables
      const styleAttr = element.getAttribute('style');
      if (styleAttr) {
        expect(styleAttr).not.toContain('--dyn-box-padding');
        expect(styleAttr).not.toContain('--dyn-box-width');
      }
    });

    it('handles empty strings and null values', () => {
      render(
        <DynBox
          data-testid="empty-values"
          className=""
          style={{}}
          cssVars={{}}
        />
      );

      const element = screen.getByTestId('empty-values');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass(getStyleClass('box'));
    });

    it('handles missing CSS module classes gracefully', () => {
      // This tests the getStyleClass utility function
      const nonExistentClass = getStyleClass('non-existent-class');
      // CSS modules may return a hashed class name even for non-existent classes
      // So we just test that it returns a string (empty or hashed)
      expect(typeof nonExistentClass).toBe('string');

      render(
        <DynBox
          data-testid="missing-class"
          bg="nonexistent-custom-color"
        />
      );

      const element = screen.getByTestId('missing-class');
      expect(element).toBeInTheDocument();
      // Should still have base class
      expect(element).toHaveClass(getStyleClass('box'));
      // Custom bg should be handled as CSS variable
      expect(element).toHaveStyle({
        '--dyn-box-bg': 'nonexistent-custom-color',
      });
    });

    it('maintains performance with complex prop combinations', () => {
      const startTime = performance.now();

      render(
        <DynBox
          data-testid="performance-test"
          p="lg" pt="xl" pr="md" pb="sm" pl="xs"
          m="md" mt="lg" mr="sm" mb="xs" ml="xl"
          width={500} height={300} minWidth={200} maxWidth={800}
          minHeight={100} maxHeight={600}
          bg="primary" color="#ffffff" backgroundColor="rgba(0,0,0,0.1)"
          border="default"  borderTop borderRight borderBottom borderLeft
          borderRadius="lg" customBorderRadius="20px"
          shadow="md" textAlign="center"
          overflow="hidden" overflowX="scroll" overflowY="auto"
          display="flex" flexDirection="column" wrap="wrap"
          justify="center" align="stretch" alignContent="flex-start"
          gap="lg" rowGap="md" columnGap="sm"
          position="relative" top={10} right={20} bottom={30} left={40} zIndex={999}
          interactive hideOnMobile tabletOnly
          cssVars={{ '--test': 'value', '--another': '42px' }}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Ensure render completes within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(100); // 100ms threshold

      const element = screen.getByTestId('performance-test');
      expect(element).toBeInTheDocument();
    });
  });
});

// Tests import the real `DynBox` from the component module above.
// The test file should not declare or export the component implementation.
// Any stray component/type definitions were removed to avoid conflicts with the real module.
