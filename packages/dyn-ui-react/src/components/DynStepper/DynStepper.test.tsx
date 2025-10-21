/**
 * DynStepper Unit Tests
 * Comprehensive test coverage for step navigation component functionality
 */

import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Mock child components with proper vitest imports
var mockDynIcon: any;

vi.mock('../DynIcon', () => {
  mockDynIcon = vi.fn(({ icon, className }: { icon: string; className?: string }) => (
    <i data-testid={`icon-${icon}`} className={className} />
  ));

  return {
    DynIcon: mockDynIcon
  };
});

import DynStepper from './DynStepper';
import { StepItem, DynStepperHandle } from './DynStepper.types';

// Sample test data
const mockSteps: StepItem[] = [
  {
    id: 'step1',
    title: 'Step 1',
    description: 'First step',
    content: <div>Step 1 Content</div>
  },
  {
    id: 'step2',
    title: 'Step 2',
    description: 'Second step',
    content: <div>Step 2 Content</div>
  },
  {
    id: 'step3',
    title: 'Step 3',
    disabled: true,
    content: <div>Step 3 Content</div>
  },
  {
    id: 'step4',
    title: 'Step 4',
    optional: true,
    content: <div>Step 4 Content</div>
  }
];

const stepsWithStates: StepItem[] = [
  {
    id: 'completed',
    title: 'Completed Step',
    completed: true,
    content: <div>Completed Content</div>
  },
  {
    id: 'error',
    title: 'Error Step',
    error: true,
    content: <div>Error Content</div>
  },
  {
    id: 'active',
    title: 'Active Step',
    content: <div>Active Content</div>
  }
];

const defaultProps = {
  steps: mockSteps
};

describe('DynStepper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders steps correctly', () => {
    render(<DynStepper {...defaultProps} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
  });

  it('shows first step as active by default', () => {
    render(<DynStepper {...defaultProps} />);

    const firstStep = screen.getByLabelText('Step 1');
    expect(firstStep).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
  });

  it('sets the aria-label to the step title without duplication', () => {
    render(<DynStepper {...defaultProps} />);

    const firstStep = screen.getByLabelText('Step 1');
    expect(firstStep).toHaveAccessibleName('Step 1');
  });

  it('falls back to generated labels when title information is missing', () => {
    const stepsWithoutTitles: StepItem[] = [
      {
        id: 'shipping',
        label: 'Shipping',
        content: <div>Shipping Content</div>
      },
      {
        id: 'billing',
        content: <div>Billing Content</div>
      }
    ];

    render(<DynStepper steps={stepsWithoutTitles} />);

    expect(screen.getByLabelText('Shipping')).toHaveAccessibleName('Shipping');
    expect(screen.getByLabelText('Step 2')).toHaveAccessibleName('Step 2');
  });

  it('respects defaultActiveStep prop', () => {
    render(<DynStepper steps={mockSteps} defaultActiveStep={1} />);

    const secondStep = screen.getByLabelText('Step 2');
    expect(secondStep).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
  });

  it('calls onStepChange when step is clicked', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(
      <DynStepper
        steps={mockSteps}
        onStepChange={onStepChange}
        linear={false}
      />
    );

    const secondStep = screen.getByLabelText('Step 2');
    await user.click(secondStep);

    expect(onStepChange).toHaveBeenCalledWith(1, mockSteps[1]);
  });

  it('calls onStepClick when step is clicked', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <DynStepper
        steps={mockSteps}
        onStepClick={onStepClick}
        linear={false}
      />
    );

    const secondStep = screen.getByLabelText('Step 2');
    await user.click(secondStep);

    expect(onStepClick).toHaveBeenCalledWith(1, mockSteps[1]);
  });

  it('prevents navigation to disabled steps', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(
      <DynStepper
        steps={mockSteps}
        onStepChange={onStepChange}
        linear={false}
      />
    );

    const disabledStep = screen.getByLabelText('Step 3');
    expect(disabledStep).toBeDisabled();

    await user.click(disabledStep);
    expect(onStepChange).not.toHaveBeenCalledWith(2, mockSteps[2]);
  });

  it('enforces linear progression when linear=true', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(
      <DynStepper
        steps={mockSteps}
        onStepChange={onStepChange}
        linear={true}
      />
    );

    // Should not be able to click step 4 when step 1 is not completed
    const fourthStep = screen.getByLabelText('Step 4');
    await user.click(fourthStep);

    expect(onStepChange).not.toHaveBeenCalledWith(3, mockSteps[3]);
  });

  it('handles different orientations correctly', () => {
    const { container, rerender } = render(
      <DynStepper steps={mockSteps} orientation="horizontal" />
    );

    expect(container.firstChild).toHaveClass('orientation-horizontal');

    rerender(<DynStepper steps={mockSteps} orientation="vertical" />);
    expect(container.firstChild).toHaveClass('orientation-vertical');
  });

  it('handles different variants correctly', () => {
    const { container, rerender } = render(
      <DynStepper steps={mockSteps} variant="numbered" />
    );

    expect(container.firstChild).toHaveClass('variant-numbered');

    rerender(<DynStepper steps={mockSteps} variant="dots" />);
    expect(container.firstChild).toHaveClass('variant-dots');

    rerender(<DynStepper steps={mockSteps} variant="progress" />);
    expect(container.firstChild).toHaveClass('variant-progress');
  });

  it('handles different sizes correctly', () => {
    const { container, rerender } = render(
      <DynStepper steps={mockSteps} size="small" />
    );

    expect(container.firstChild).toHaveClass('size-small');

    rerender(<DynStepper steps={mockSteps} size="large" />);
    expect(container.firstChild).toHaveClass('size-large');
  });

  it('shows progress bar for progress variant', () => {
    render(<DynStepper steps={mockSteps} variant="progress" defaultActiveStep={1} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50'); // 2nd step out of 4
  });

  it('renders step descriptions when showDescription=true', () => {
    render(<DynStepper steps={mockSteps} showDescription={true} />);

    expect(screen.getByText('First step')).toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();
  });

  it('hides labels when showLabels=false', () => {
    render(<DynStepper steps={mockSteps} showLabels={false} />);

    expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Step 2')).not.toBeInTheDocument();
  });

  it('renders step states correctly', () => {
    render(<DynStepper steps={stepsWithStates} defaultActiveStep={2} />);

    // Check if completed step has correct class
    const completedStep = screen.getByLabelText(/completed step/i);
    expect(completedStep.closest('.step')).toHaveClass('status-completed');

    // Check if error step has correct class
    const errorStep = screen.getByLabelText(/error step/i);
    expect(errorStep.closest('.step')).toHaveClass('status-error');

    // Check if active step has correct class
    const activeStep = screen.getByLabelText(/active step/i);
    expect(activeStep.closest('.step')).toHaveClass('status-active');
  });

  it('renders optional badge for optional steps', () => {
    render(<DynStepper steps={mockSteps} />);

    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DynStepper steps={mockSteps} className="custom-stepper" />
    );

    expect(container.firstChild).toHaveClass('custom-stepper');
  });

  it('applies stepClassName to individual steps', () => {
    const customStepClass = 'custom-step-class';
    render(
      <DynStepper steps={mockSteps} stepClassName={customStepClass} />
    );

    const steps = screen.getAllByRole('button');
    steps.forEach(step => {
      expect(step).toHaveClass(customStepClass);
    });
  });

  it('applies contentClassName to content area', () => {
    const customContentClass = 'custom-content-class';
    render(
      <DynStepper steps={mockSteps} contentClassName={customContentClass} />
    );

    const contentArea = document.querySelector('.step-content');
    expect(contentArea).toHaveClass(customContentClass);
  });

  it('handles custom renderStepContent', () => {
    const customRender = vi.fn((step, index) => <div>Custom {step.title} - {index}</div>);

    render(
      <DynStepper
        steps={mockSteps}
        renderStepContent={customRender}
      />
    );

    expect(customRender).toHaveBeenCalledWith(mockSteps[0], 0);
    expect(screen.getByText('Custom Step 1 - 0')).toBeInTheDocument();
  });

  it('handles custom renderStepIcon', () => {
    const customIconRender = vi.fn((step, index, isActive) => <div>Icon {index}</div>);

    render(
      <DynStepper
        steps={mockSteps}
        renderStepIcon={customIconRender}
      />
    );

    expect(customIconRender).toHaveBeenCalledWith(mockSteps[0], 0, true);
    expect(screen.getByText('Icon 0')).toBeInTheDocument();
  });

  it('renders icons from step data', () => {
    const stepsWithIcons = [
      { ...mockSteps[0], icon: 'test-icon' }
    ];

    render(<DynStepper steps={stepsWithIcons} />);

    // Ensure DynIcon rendered for step icon
    expect(screen.getByTestId('icon-test-icon')).toBeInTheDocument();
  });

  it('handles empty steps array', () => {
    render(<DynStepper steps={[]} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows tooltip on steps with tooltip property', () => {
    const stepsWithTooltip: StepItem[] = [
      {
        id: 'tooltip-step',
        title: 'Step with Tooltip',
        tooltip: 'This is a tooltip',
        content: <div>Content</div>
      }
    ];

    render(<DynStepper steps={stepsWithTooltip} />);

    const step = screen.getByLabelText(/step with tooltip/i);
    expect(step).toHaveAttribute('title', 'This is a tooltip');
  });

  describe('Imperative API', () => {
    it('provides nextStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();
      const onStepChange = vi.fn();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
          onStepChange={onStepChange}
          linear={false}
        />
      );

      const result = stepperRef.current?.nextStep();
      expect(result).toBe(true);
      expect(onStepChange).toHaveBeenCalledWith(1, mockSteps[1]);
    });

    it('provides prevStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();
      const onStepChange = vi.fn();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
          defaultActiveStep={1}
          onStepChange={onStepChange}
          linear={false}
        />
      );

      const result = stepperRef.current?.prevStep();
      expect(result).toBe(true);
      expect(onStepChange).toHaveBeenCalledWith(0, mockSteps[0]);
    });

    it('provides goToStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();
      const onStepChange = vi.fn();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
          onStepChange={onStepChange}
          linear={false}
        />
      );

      const result = stepperRef.current?.goToStep(2);
      expect(result).toBe(false); // step 2 is disabled
      expect(onStepChange).not.toHaveBeenCalledWith(2, mockSteps[2]);
    });

    it('provides getCurrentStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
          defaultActiveStep={1}
        />
      );

      expect(stepperRef.current?.getCurrentStep()).toBe(1);
    });

    it('provides getStepData method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
        />
      );

      expect(stepperRef.current?.getStepData(0)).toBe(mockSteps[0]);
      expect(stepperRef.current?.getStepData(99)).toBeUndefined();
    });

    it('provides validateStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
        />
      );

      expect(stepperRef.current?.validateStep(0)).toBe(true); // normal step
      expect(stepperRef.current?.validateStep(2)).toBe(false); // disabled step
    });

    it('provides completeStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
        />
      );

      expect(() => {
        stepperRef.current?.completeStep(0);
      }).not.toThrow();
    });

    it('provides errorStep method', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
        />
      );

      expect(() => {
        stepperRef.current?.errorStep(0, true);
      }).not.toThrow();

      expect(() => {
        stepperRef.current?.errorStep(0, false);
      }).not.toThrow();
    });

    it('returns false when nextStep reaches end', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
          defaultActiveStep={3} // last step
          linear={false}
        />
      );

      const result = stepperRef.current?.nextStep();
      expect(result).toBe(false);
    });

    it('returns false when prevStep reaches beginning', () => {
      const stepperRef = React.createRef<DynStepperHandle>();

      render(
        <DynStepper
          ref={stepperRef}
          steps={mockSteps}
          defaultActiveStep={0} // first step
        />
      );

      const result = stepperRef.current?.prevStep();
      expect(result).toBe(false);
    });
  });

  it('prevents clicking when clickableSteps=false', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(
      <DynStepper
        steps={mockSteps}
        onStepChange={onStepChange}
        clickableSteps={false}
        linear={false}
      />
    );

    const secondStep = screen.getByLabelText('Step 2');
    await user.click(secondStep);

    expect(onStepChange).not.toHaveBeenCalledWith(1, mockSteps[1]);
  });

  it('handles controlled mode correctly', () => {
    const onStepChange = vi.fn();
    const { rerender } = render(
      <DynStepper
        steps={mockSteps}
        activeStep={0}
        onStepChange={onStepChange}
      />
    );

    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();

    // Change active step externally
    rerender(
      <DynStepper
        steps={mockSteps}
        activeStep={1}
        onStepChange={onStepChange}
      />
    );

    expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
  });
});
