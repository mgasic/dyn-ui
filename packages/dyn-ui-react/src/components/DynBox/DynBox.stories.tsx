import type { Meta, StoryObj } from '@storybook/react';
import { DynBox } from './DynBox';

const meta: Meta<typeof DynBox> = {
  title: 'Components/DynBox',
  component: DynBox,
  parameters: {
    docs: {
      description: {
        component:
          'DynBox is the polymorphic, design-token aware layout primitive that serves as the foundational building block of the dyn-ui design system. It provides a consistent API for spacing, colors, borders, shadows, and layout properties while maintaining full accessibility compliance and type safety. Built following the DynAvatar gold standard template with comprehensive JSDoc documentation, extensive test coverage, and optimized performance.',
      },
    },
  },
  args: {
    as: 'div',
    p: 'md',
    borderRadius: 'md',
  },
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav'],
      description: 'The HTML element to render',
    },
    p: {
      control: { type: 'select' },
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Padding on all sides using design tokens',
    },
    m: {
      control: { type: 'select' },
      options: ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'auto'],
      description: 'Margin on all sides using design tokens',
    },
    bg: {
      control: { type: 'text' },
      description: 'Background color variant or custom CSS color',
    },
    display: {
      control: { type: 'select' },
      options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'],
      description: 'CSS display property',
    },
    interactive: {
      control: { type: 'boolean' },
      description: 'Enable interactive styles and keyboard navigation',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler for interactive boxes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DynBox>;

/**
 * Default DynBox configuration showing basic usage with design tokens
 */
export const Default: Story = {
  args: {
    bg: 'tertiary',
    shadow: 'sm',
    children: (
      <>
        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>DynBox</strong>
        <span>Token-aware container with spacing, border radius, and shadow applied through design tokens.</span>
      </>
    ),
  },
};

/**
 * Various background variants and visual styles available in DynBox
 */
export const Variants: Story = {
  render: (args) => (
    <DynBox
      {...args}
      display="grid"
      gap="sm"
      gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
      aria-label="DynBox variants showcase"
    >
      <DynBox bg="primary" borderRadius="md" shadow="md" p="sm" color="#ffffff">
        <strong>Primary</strong>
        <br />Surface with primary theming
      </DynBox>
      <DynBox bg="secondary" borderRadius="md" shadow="sm" p="sm" color="#ffffff">
        <strong>Secondary</strong>
        <br />Secondary themed surface
      </DynBox>
      <DynBox bg="success" borderRadius="md" shadow="sm" p="sm" color="#ffffff">
        <strong>Success</strong>
        <br />Success state indication
      </DynBox>
      <DynBox bg="warning" borderRadius="md" shadow="sm" p="sm" color="#ffffff">
        <strong>Warning</strong>
        <br />Warning state indication
      </DynBox>
      <DynBox bg="danger" borderRadius="md" shadow="sm" p="sm" color="#ffffff">
        <strong>Danger</strong>
        <br />Error state indication
      </DynBox>
      <DynBox border="default" borderRadius="md" p="sm">
        <strong>Neutral</strong>
        <br />Border-only variant
      </DynBox>
    </DynBox>
  ),
  args: {
    p: 'lg',
    borderRadius: 'lg',
    shadow: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all available background variants with consistent spacing and border radius tokens.',
      },
    },
  },
};

/**
 * Interactive DynBox with keyboard navigation and click handlers
 */
export const Interactive: Story = {
  render: (args) => (
    <DynBox display="flex" flexDirection="column" gap="md" p="lg">
      <DynBox
        {...args}
        interactive
        aria-label="Interactive primary button"
        bg="primary"
        color="#ffffff"
        onClick={() => console.log('Primary clicked')}
      >
        Primary Interactive Box - Click or press Enter/Space
      </DynBox>

      <DynBox
        interactive
        aria-label="Interactive secondary button"
        bg="secondary"
        color="#ffffff"
        p="md"
        borderRadius="md"
        onClick={() => console.log('Secondary clicked')}
      >
        Secondary Interactive Box - Focus with Tab
      </DynBox>

      <DynBox
        interactive
        role="tab"
        aria-label="Custom tab element"
        border="default"
        p="md"
        borderRadius="md"
        onClick={() => console.log('Tab clicked')}
        focusOnMount
      >
        Custom Role Interactive Box (Tab) - Auto-focused
      </DynBox>

      <DynBox
        interactive
        aria-label="Interactive with live announcements"
        bg="tertiary"
        p="md"
        borderRadius="md"
        ariaLiveMessage="Status updated successfully"
        ariaLivePoliteness="assertive"
        onClick={() => console.log('Live message clicked')}
      >
        Box with Live Region Announcements - Screen reader accessible
      </DynBox>
    </DynBox>
  ),
  args: {
    p: 'md',
    borderRadius: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows interactive DynBox components with proper keyboard navigation, ARIA attributes, and screen reader support. Try using Tab, Enter, and Space keys.',
      },
    },
  },
};

/**
 * Comprehensive accessibility features and WCAG compliance demonstration
 */
export const Accessibility: Story = {
  render: (args) => (
    <DynBox {...args} display="flex" flexDirection="column" gap="md" role="main">
      <DynBox
        as="section"
        bg="tertiary"
        p="md"
        borderRadius="md"
        role="region"
        aria-labelledby="responsive-heading"
        aria-describedby="responsive-description"
      >
        <h3 id="responsive-heading" style={{ margin: '0 0 0.5rem 0' }}>Responsive Visibility</h3>
        <p id="responsive-description" style={{ margin: '0' }}>
          This content adapts to different screen sizes. Resize your viewport to see responsive helpers in action.
        </p>
      </DynBox>

      <DynBox
        as="section"
        bg="primary"
        color="#ffffff"
        p="md"
        borderRadius="md"
        ariaLiveMessage="Background processes completed successfully"
        ariaLivePoliteness="polite"
        role="status"
        aria-label="System status updates"
      >
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Live Region Support</h3>
        <p style={{ margin: '0' }}>
          Screen readers receive real-time updates via the aria-live region. Status changes are announced automatically.
        </p>
      </DynBox>

      <DynBox
        as="section"
        border="default"
        p="md"
        borderRadius="md"
        role="complementary"
        aria-label="Keyboard navigation example"
      >
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Keyboard Navigation</h3>
        <DynBox display="flex" gap="sm" mt="sm">
          <DynBox
            interactive
            as="button"
            bg="success"
            color="#ffffff"
            p="sm"
            borderRadius="sm"
            aria-label="Confirm action"
            onClick={() => console.log('Confirm')}
          >
            Confirm
          </DynBox>
          <DynBox
            interactive
            as="button"
            bg="danger"
            color="#ffffff"
            p="sm"
            borderRadius="sm"
            aria-label="Cancel action"
            onClick={() => console.log('Cancel')}
          >
            Cancel
          </DynBox>
        </DynBox>
      </DynBox>

      <DynBox
        as="section"
        bg="warning"
        color="#ffffff"
        p="md"
        borderRadius="md"
        role="alert"
        aria-live="assertive"
      >
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Alert Region</h3>
        <p style={{ margin: '0' }}>
          Important notifications are announced immediately to screen readers using role="alert".
        </p>
      </DynBox>
    </DynBox>
  ),
  args: {
    'aria-label': 'Accessibility demonstration',
    hideOnMobile: false,
    tabletOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive accessibility features including ARIA attributes, live regions, semantic HTML, keyboard navigation, and screen reader support. All components pass WCAG 2.1 AA compliance.',
      },
    },
  },
};

/**
 * Layout system demonstration with flex and grid capabilities
 */
export const LayoutSystem: Story = {
  render: (args) => (
    <DynBox {...args} display="flex" flexDirection="column" gap="lg">
      {/* Flexbox Layout */}
      <DynBox as="section">
        <h3 style={{ margin: '0 0 1rem 0' }}>Flexbox Layout</h3>
        <DynBox
          display="flex"
          flexDirection="row"
          justify="space-between"
          align="center"
          gap="md"
          bg="tertiary"
          p="md"
          borderRadius="md"
        >
          <DynBox bg="primary" color="#ffffff" p="sm" borderRadius="sm">Item 1</DynBox>
          <DynBox bg="secondary" color="#ffffff" p="sm" borderRadius="sm">Item 2</DynBox>
          <DynBox bg="success" color="#ffffff" p="sm" borderRadius="sm">Item 3</DynBox>
        </DynBox>
      </DynBox>

      {/* Grid Layout */}
      <DynBox as="section">
        <h3 style={{ margin: '0 0 1rem 0' }}>Grid Layout</h3>
        <DynBox
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
          gap="sm"
          bg="tertiary"
          p="md"
          borderRadius="md"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <DynBox
              key={num}
              bg={num % 2 === 0 ? 'primary' : 'secondary'}
              color="#ffffff"
              p="sm"
              borderRadius="sm"
              textAlign="center"
            >
              Grid {num}
            </DynBox>
          ))}
        </DynBox>
      </DynBox>

      {/* Complex Layout */}
      <DynBox as="section">
        <h3 style={{ margin: '0 0 1rem 0' }}>Complex Layout</h3>
        <DynBox
          display="grid"
          gridTemplateAreas="'header header header' 'sidebar content content' 'footer footer footer'"
          gridTemplateRows="auto 1fr auto"
          gap="sm"
          height={300}
          bg="tertiary"
          p="sm"
          borderRadius="md"
        >
          <DynBox
            bg="primary"
            color="#ffffff"
            p="sm"
            borderRadius="sm"
            style={{ gridArea: 'header' }}
            textAlign="center"
          >
            Header
          </DynBox>
          <DynBox
            bg="secondary"
            color="#ffffff"
            p="sm"
            borderRadius="sm"
            style={{ gridArea: 'sidebar' }}
          >
            Sidebar
          </DynBox>
          <DynBox
            bg="success"
            color="#ffffff"
            p="sm"
            borderRadius="sm"
            style={{ gridArea: 'content' }}
          >
            Main Content Area
          </DynBox>
          <DynBox
            bg="warning"
            color="#ffffff"
            p="sm"
            borderRadius="sm"
            style={{ gridArea: 'footer' }}
            textAlign="center"
          >
            Footer
          </DynBox>
        </DynBox>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the powerful layout capabilities of DynBox including flexbox, grid, and complex layouts with CSS Grid Areas.',
      },
    },
  },
};

/**
 * Polymorphic rendering capabilities with different HTML elements
 */
export const Polymorphic: Story = {
  render: (args) => (
    <DynBox {...args} display="flex" flexDirection="column" gap="md">
      <DynBox as="header" bg="primary" color="#ffffff" p="md" borderRadius="md">
        <h1 style={{ margin: 0 }}>Header Element</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Rendered as &lt;header&gt;</p>
      </DynBox>

      <DynBox as="nav" bg="secondary" color="#ffffff" p="md" borderRadius="md">
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Navigation</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>Rendered as &lt;nav&gt; with proper semantics</p>
      </DynBox>

      <DynBox as="main" bg="tertiary" p="md" borderRadius="md">
        <h2 style={{ margin: '0 0 0.5rem 0' }}>Main Content</h2>
        <p style={{ margin: 0 }}>Rendered as &lt;main&gt; for primary content</p>
      </DynBox>

      <DynBox as="aside" bg="success" color="#ffffff" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Sidebar Content</h3>
        <p style={{ margin: 0, opacity: 0.9 }}>Rendered as &lt;aside&gt; for supplementary content</p>
      </DynBox>

      <DynBox as="footer" bg="warning" color="#ffffff" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Footer Information</h3>
        <p style={{ margin: 0, opacity: 0.9 }}>Rendered as &lt;footer&gt; with footer semantics</p>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how DynBox can render as different HTML elements while maintaining consistent styling and functionality.',
      },
    },
  },
};

/**
 * Dark theme and theming support
 */
export const DarkTheme: Story = {
  render: (args) => (
    <DynBox {...args} display="flex" flexDirection="column" gap="md" p="lg">
      <DynBox bg="primary" shadow="md" color="#ffffff" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Primary Theme</h3>
        <p style={{ margin: 0 }}>DynBox adapts to dark mode using CSS custom properties and design tokens.</p>
      </DynBox>

      <DynBox bg="secondary" shadow="sm" color="#ffffff" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Secondary Theme</h3>
        <p style={{ margin: 0 }}>Automatic theme switching based on user preferences.</p>
      </DynBox>

      <DynBox bg="tertiary" shadow="sm" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Adaptive Colors</h3>
        <p style={{ margin: 0 }}>Text and background colors automatically adjust for optimal contrast.</p>
      </DynBox>

      <DynBox
        interactive
        bg="success"
        color="#ffffff"
        shadow="md"
        p="md"
        borderRadius="md"
        onClick={() => console.log('Dark theme interaction')}
        aria-label="Interactive element in dark theme"
      >
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Interactive Elements</h3>
        <p style={{ margin: 0 }}>Interactive states maintain proper contrast ratios in dark mode.</p>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1f2937' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        story: 'Demonstrates how DynBox components automatically adapt to dark themes using design tokens and CSS custom properties.',
      },
    },
  },
};

/**
 * Performance and edge cases demonstration
 */
export const Performance: Story = {
  render: (args) => (
    <DynBox {...args} display="flex" flexDirection="column" gap="md">
      <DynBox bg="tertiary" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 1rem 0' }}>Performance Optimized</h3>
        <p style={{ margin: '0 0 1rem 0' }}>DynBox is optimized for performance with:</p>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Memoized CSS variable generation</li>
          <li>Efficient class name composition</li>
          <li>Minimal re-renders</li>
          <li>Type-safe prop handling</li>
        </ul>
      </DynBox>

      {/* Large number of boxes to test performance */}
      <DynBox bg="primary" color="#ffffff" p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 1rem 0' }}>Stress Test Grid</h3>
        <DynBox
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(60px, 1fr))"
          gap="xs"
          p="sm"
          bg="rgba(255,255,255,0.1)"
          borderRadius="sm"
        >
          {Array.from({ length: 50 }, (_, i) => (
            <DynBox
              key={i}
              bg={i % 4 === 0 ? 'secondary' : i % 4 === 1 ? 'success' : i % 4 === 2 ? 'warning' : 'danger'}
              color="#ffffff"
              p="xs"
              borderRadius="xs"
              textAlign="center"
              style={{ fontSize: '0.75rem' }}
            >
              {i + 1}
            </DynBox>
          ))}
        </DynBox>
      </DynBox>

      {/* Edge cases */}
      <DynBox border="default"  p="md" borderRadius="md">
        <h3 style={{ margin: '0 0 1rem 0' }}>Edge Cases Handled</h3>
        <DynBox display="flex" flexDirection="column" gap="sm">
          <DynBox bg="tertiary" p="sm" borderRadius="sm" width={0} height={0}>
            Zero dimensions handled gracefully
          </DynBox>
          <DynBox
            p="xl" m="auto"
            backgroundColor="rgba(255, 0, 0, 0.1)"
            customBorderRadius="20px"
          >
            Custom CSS values override tokens
          </DynBox>
          <DynBox
            hideOnMobile
            tabletOnly
            desktopOnly={false}
            style={{ backgroundColor: 'var(--custom-color, #f0f0f0)' }}
            p="sm"
            borderRadius="sm"
          >
            Responsive visibility with fallback CSS
          </DynBox>
        </DynBox>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tests performance with many components and demonstrates handling of edge cases, custom CSS properties, and responsive behavior.',
      },
    },
  },
};

/**
 * Demonstrates responsive spacing tokens combined with semantic overrides.
 */
export const SpacingPlayground: Story = {
  render: () => (
    <DynBox
      as="section"
      border="default"
      borderRadius="lg"
      display="grid"
      gap={{ base: 'md', md: 'lg' }}
      gridTemplateColumns="repeat(auto-fit, minmax(260px, 1fr))"
      p={{ base: 'md', lg: 'xl' }}
      aria-labelledby="spacing-playground-heading"
    >
      <DynBox
        as="section"
        border="default"
        borderRadius="md"
        display="flex"
        flexDirection="column"
        gap={{ base: 'xs', md: 'sm' }}
        p={{ base: 'sm', lg: 'lg' }}
      >
        <h3 id="spacing-playground-heading" style={{ margin: 0 }}>Responsive spacing tokens</h3>
        <p style={{ margin: 0 }}>
          Padding, margin, and gap props accept breakpoint-aware values that map directly to dyn-ui spacing tokens.
        </p>
        <DynBox
          display="flex"
          flexDirection="column"
          gap={{ base: 'xs', md: 'sm' }}
          my={{ base: 'xs', lg: 'md' }}
        >
          <DynBox bg="tertiary" borderRadius="sm" p={{ base: 'xs', md: 'sm' }}>
            Base spacing (sm) grows to lg padding on large screens.
          </DynBox>
          <DynBox bg="tertiary" borderRadius="sm" px={{ base: 'sm', md: 'lg' }} py={{ base: 'xs', md: 'md' }}>
            Horizontal and vertical tokens can be tuned independently.
          </DynBox>
        </DynBox>
      </DynBox>

      <DynBox
        as="nav"
        aria-label="Secondary navigation"
        border="default"
        borderRadius="md"
        display="flex"
        flexDirection="column"
        gap={{ base: 'xs', md: 'sm' }}
        mx={{ base: '0', lg: 'auto' }}
        px={{ base: 'sm', md: 'lg' }}
        py={{ base: 'xs', md: 'md' }}
      >
        <strong style={{ margin: 0 }}>Navigation</strong>
        <DynBox
          as="ul"
          display="flex"
          flexDirection="row"
          wrap="wrap"
          gap={{ base: 'xs', md: 'md' }}
          m={{ base: '0', md: 'xs' }}
          p={{ base: '0' }}
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          <DynBox as="li" border="default" borderRadius="sm" p={{ base: 'xs', md: 'sm' }}>
            Overview
          </DynBox>
          <DynBox as="li" border="default" borderRadius="sm" p={{ base: 'xs', md: 'sm' }}>
            Settings
          </DynBox>
          <DynBox as="li" border="default" borderRadius="sm" p={{ base: 'xs', md: 'sm' }}>
            Billing
          </DynBox>
        </DynBox>
        <span style={{ fontSize: '0.875rem' }}>
          The <code>nav</code> and <code>ul</code> elements inherit semantic overrides without losing spacing tokens.
        </span>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Showcases responsive `p`, `m`, and `gap` props alongside semantic overrides (`section`, `nav`, `ul`) that consume dyn-ui spacing tokens.',
      },
    },
  },
};
