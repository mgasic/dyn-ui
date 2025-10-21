/**
 * DynStepper Storybook Stories
 * Interactive examples and documentation for step navigation component
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useRef } from 'react';
import DynStepper from './DynStepper';
import { DynStepperHandle, StepItem } from './DynStepper.types';
import React from 'react';

const meta: Meta<typeof DynStepper> = {
  title: 'Navigation/DynStepper',
  component: DynStepper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DynStepper component provides a comprehensive step navigation system with:

- **Multiple Orientations** - Horizontal and vertical layouts with responsive design
- **Multiple Variants** - Default, numbered, dots, and progress bar styles
- **Step States** - Active, completed, error, disabled, and optional states
- **Linear/Non-linear** - Control step accessibility and progression
- **Imperative API** - Programmatic control with nextStep, prevStep, goToStep methods
- **Accessibility** - Full ARIA support and keyboard navigation (step buttons now mirror their visible titles exactly for screen readers, with sensible fallbacks when a title is missing)
- **Customization** - Complete CSS custom properties and render functions

## Usage

\`\`\`tsx
import { DynStepper } from '@dyn-ui/react';

const steps = [
  { id: 'step1', title: 'Personal Info', content: <PersonalForm /> },
  { id: 'step2', title: 'Address', content: <AddressForm /> },
  { id: 'step3', title: 'Review', content: <ReviewStep /> }
];

<DynStepper steps={steps} defaultActiveStep={0} />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    orientation: {
      description: 'Layout orientation of the stepper',
      control: { type: 'select' },
      options: ['horizontal', 'vertical']
    },
    variant: {
      description: 'Visual style variant of the stepper',
      control: { type: 'select' },
      options: ['default', 'numbered', 'dots', 'progress']
    },
    size: {
      description: 'Size of the step indicators',
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    linear: {
      description: 'Enforce linear progression (users must complete steps in order)',
      control: { type: 'boolean' }
    },
    showLabels: {
      description: 'Show step titles and labels',
      control: { type: 'boolean' }
    },
    showDescription: {
      description: 'Show step descriptions',
      control: { type: 'boolean' }
    },
    clickableSteps: {
      description: 'Allow clicking on steps to navigate',
      control: { type: 'boolean' }
    },
    onStepChange: {
      description: 'Callback fired when active step changes',
      action: 'stepChanged'
    },
    onStepClick: {
      description: 'Callback fired when step is clicked',
      action: 'stepClicked'
    }
  }
};

export default meta;
type Story = StoryObj<typeof DynStepper>;

// Sample step data
const sampleSteps: StepItem[] = [
  {
    id: 'step1',
    title: 'Personal Information',
    description: 'Enter your basic details',
    icon: '👤',
    content: (
      <div style={{ padding: '24px' }}>
        <h3>👤 Personal Information</h3>
        <p>Please provide your personal details to continue with the process.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>First Name:</label>
            <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Last Name:</label>
            <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email:</label>
            <input type="email" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone:</label>
            <input type="tel" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'step2',
    title: 'Address Details',
    description: 'Provide your address information',
    icon: '🏠',
    content: (
      <div style={{ padding: '24px' }}>
        <h3>🏠 Address Information</h3>
        <p>Enter your current address details for delivery and billing purposes.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Street Address:</label>
            <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>City:</label>
              <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>State:</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Select State</option>
                <option>CA</option>
                <option>NY</option>
                <option>TX</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>ZIP:</label>
              <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'step3',
    title: 'Payment Method',
    description: 'Choose your payment option',
    icon: '💳',
    optional: true,
    content: (
      <div style={{ padding: '24px' }}>
        <h3>💳 Payment Method (Optional)</h3>
        <p>Select your preferred payment method. You can skip this step and add payment later.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <input type="radio" name="payment" id="credit-card" />
            <label htmlFor="credit-card" style={{ flex: 1 }}>💳 Credit/Debit Card</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <input type="radio" name="payment" id="paypal" />
            <label htmlFor="paypal" style={{ flex: 1 }}>💰 PayPal</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <input type="radio" name="payment" id="bank-transfer" />
            <label htmlFor="bank-transfer" style={{ flex: 1 }}>🏛️ Bank Transfer</label>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f0f8ff', borderRadius: '8px' }}>
            <strong>💡 Note:</strong> This step is optional. You can complete your registration and add payment information later from your account settings.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'step4',
    title: 'Review & Submit',
    description: 'Review your information',
    icon: '✅',
    content: (
      <div style={{ padding: '24px' }}>
        <h3>✅ Review Your Information</h3>
        <p>Please review all information before submitting your registration.</p>
        <div style={{ marginTop: '16px', display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Personal Information</h4>
            <p style={{ margin: 0, color: '#666' }}>John Doe • john.doe@example.com • (555) 123-4567</p>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Address</h4>
            <p style={{ margin: 0, color: '#666' }}>123 Main Street, San Francisco, CA 94105</p>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Payment Method</h4>
            <p style={{ margin: 0, color: '#666' }}>💳 Credit Card ending in 1234 (Optional step skipped)</p>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Submit Registration
            </button>
            <button style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#333', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
              Save Draft
            </button>
          </div>
        </div>
      </div>
    )
  }
];

const errorSteps: StepItem[] = [
  { ...sampleSteps[0], completed: true },
  { ...sampleSteps[1], error: true },
  { ...sampleSteps[2] },
  { ...sampleSteps[3] }
];

export const Default: Story = {
  args: {
    steps: sampleSteps,
    defaultActiveStep: 0
  }
};

export const Vertical: Story = {
  args: {
    steps: sampleSteps,
    orientation: 'vertical',
    defaultActiveStep: 0
  }
};

export const Numbered: Story = {
  args: {
    steps: sampleSteps,
    variant: 'numbered',
    defaultActiveStep: 0
  }
};

export const Dots: Story = {
  args: {
    steps: sampleSteps,
    variant: 'dots',
    defaultActiveStep: 0
  }
};

export const Progress: Story = {
  args: {
    steps: sampleSteps,
    variant: 'progress',
    defaultActiveStep: 0
  }
};

export const NonLinear: Story = {
  args: {
    steps: sampleSteps,
    linear: false,
    defaultActiveStep: 0
  }
};

export const WithDescription: Story = {
  args: {
    steps: sampleSteps,
    showDescription: true,
    defaultActiveStep: 0
  }
};

export const Small: Story = {
  args: {
    steps: sampleSteps,
    size: 'small',
    defaultActiveStep: 0
  }
};

export const Large: Story = {
  args: {
    steps: sampleSteps,
    size: 'large',
    defaultActiveStep: 0
  }
};

export const WithErrors: Story = {
  args: {
    steps: errorSteps,
    defaultActiveStep: 1
  }
};

export const Controlled: Story = {
  render: (args) => {
    const [activeStep, setActiveStep] = useState(0);
    const stepperRef = useRef<DynStepperHandle>(null);

    const handleNext = () => {
      stepperRef.current?.nextStep();
    };

    const handlePrev = () => {
      stepperRef.current?.prevStep();
    };

    const handleReset = () => {
      setActiveStep(0);
    };

    return (
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrev}
            disabled={activeStep === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: activeStep === 0 ? '#f3f4f6' : '#2563eb',
              color: activeStep === 0 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: activeStep === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={activeStep === sampleSteps.length - 1}
            style={{
              padding: '8px 16px',
              backgroundColor: activeStep === sampleSteps.length - 1 ? '#f3f4f6' : '#2563eb',
              color: activeStep === sampleSteps.length - 1 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: activeStep === sampleSteps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#333',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          <div style={{ marginLeft: 'auto', padding: '8px 16px', background: '#f0f8ff', borderRadius: '4px' }}>
            Step {activeStep + 1} of {sampleSteps.length}
          </div>
        </div>
        <DynStepper
          {...args}
          ref={stepperRef}
          steps={sampleSteps}
          activeStep={activeStep}
          onStepChange={(step) => setActiveStep(step)}
        />
      </div>
    );
  }
};

export const CustomIcons: Story = {
  args: {
    steps: [
      {
        id: 'user',
        title: 'User Account',
        icon: '👤',
        content: <div style={{ padding: '20px' }}>Create your user account</div>
      },
      {
        id: 'profile',
        title: 'Profile Setup',
        icon: '📋',
        content: <div style={{ padding: '20px' }}>Complete your profile</div>
      },
      {
        id: 'preferences',
        title: 'Preferences',
        icon: '⚙️',
        content: <div style={{ padding: '20px' }}>Set your preferences</div>
      },
      {
        id: 'finish',
        title: 'Finish',
        icon: '🎉',
        content: <div style={{ padding: '20px' }}>All done!</div>
      }
    ],
    defaultActiveStep: 0
  }
};

export const VariantShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ marginBottom: '16px', color: '#333' }}>Default Variant</h4>
        <DynStepper steps={sampleSteps.slice(0, 3)} variant="default" defaultActiveStep={1} />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px', color: '#333' }}>Numbered Variant</h4>
        <DynStepper steps={sampleSteps.slice(0, 3)} variant="numbered" defaultActiveStep={1} />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px', color: '#333' }}>Dots Variant</h4>
        <DynStepper steps={sampleSteps.slice(0, 3)} variant="dots" defaultActiveStep={1} />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px', color: '#333' }}>Progress Variant</h4>
        <DynStepper steps={sampleSteps.slice(0, 3)} variant="progress" defaultActiveStep={1} />
      </div>
    </div>
  )
};

export const AccessibilityDemo: Story = {
  args: {
    steps: [
      {
        id: 'accessible',
        title: 'Accessible Step',
        description: 'This stepper demonstrates accessibility features',
        icon: '♿',
        tooltip: 'This step shows accessibility features',
        content: (
          <div style={{ padding: '20px' }}>
            <h3>♿ Accessibility Features</h3>
            <div style={{ marginTop: '16px' }}>
              <h4>ARIA Support:</h4>
              <ul>
                <li>Proper ARIA roles (tablist, step indicators)</li>
                <li>ARIA labels and descriptions</li>
                <li>Screen reader announcements</li>
                <li>Progress indication</li>
              </ul>

              <h4 style={{ marginTop: '16px' }}>Keyboard Navigation:</h4>
              <ul>
                <li><kbd>Tab</kbd> - Focus step indicators</li>
                <li><kbd>Enter/Space</kbd> - Activate focused step</li>
                <li><kbd>Arrow Keys</kbd> - Navigate between steps (non-linear mode)</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'keyboard',
        title: 'Keyboard Navigation',
        icon: '⌨️',
        content: (
          <div style={{ padding: '20px' }}>
            <h3>⌨️ Try Keyboard Navigation!</h3>
            <p>Use your keyboard to navigate this stepper:</p>
            <div style={{ marginTop: '16px', padding: '16px', background: '#f0f8ff', borderRadius: '8px' }}>
              <strong>💡 Tip:</strong> Use Tab to focus step indicators, then Enter or Space to activate!
            </div>
          </div>
        )
      },
      {
        id: 'screen-reader',
        title: 'Screen Reader Support',
        icon: '🔊',
        content: (
          <div style={{ padding: '20px' }}>
            <h3>🔊 Screen Reader Optimized</h3>
            <p>This stepper is optimized for screen readers with proper ARIA attributes.</p>
            <div style={{ marginTop: '16px', padding: '16px', background: '#f0fff0', borderRadius: '8px' }}>
              Screen readers will announce: "Step 3 of 3, Screen Reader Support, current step."
            </div>
          </div>
        )
      }
    ],
    linear: false,
    defaultActiveStep: 0
  },
  parameters: {
    docs: {
      description: {
        story: 'This example demonstrates the accessibility features of the DynStepper component. Try using keyboard navigation with Tab, Enter, Space, and Arrow keys.'
      }
    }
  }
};
