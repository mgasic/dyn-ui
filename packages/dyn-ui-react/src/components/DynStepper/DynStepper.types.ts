/**
 * DynStepper TypeScript type definitions
 * Step navigation component types with advanced progression features
 */

export interface StepItem {
  id: string;
  title: string;
  description?: string;
  icon?: string | React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
  completed?: boolean;
  error?: boolean;
  optional?: boolean;
  tooltip?: string;
}

export interface DynStepperProps {
  steps: StepItem[];
  activeStep?: number;
  defaultActiveStep?: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'numbered' | 'dots' | 'progress';
  size?: 'small' | 'medium' | 'large';
  linear?: boolean;
  showLabels?: boolean;
  showDescription?: boolean;
  clickableSteps?: boolean;
  className?: string;
  stepClassName?: string;
  contentClassName?: string;
  onStepChange?: (step: number, stepData: StepItem) => void;
  onStepClick?: (step: number, stepData: StepItem) => boolean | void;
  renderStepContent?: (step: StepItem, index: number) => React.ReactNode;
  renderStepIcon?: (step: StepItem, index: number, isActive: boolean) => React.ReactNode;
}

export interface DynStepperHandle {
  nextStep: () => boolean;
  prevStep: () => boolean;
  goToStep: (step: number) => boolean;
  getCurrentStep: () => number;
  getStepData: (step: number) => StepItem | undefined;
  validateStep: (step: number) => boolean;
  completeStep: (step: number) => void;
  errorStep: (step: number, hasError: boolean) => void;
}

// Default configuration
export const STEPPER_DEFAULTS = {
  orientation: 'horizontal' as const,
  variant: 'default' as const,
  size: 'medium' as const,
  linear: true,
  showLabels: true,
  showDescription: false,
  clickableSteps: true,
  defaultActiveStep: 0
};

// Step variants
export const STEPPER_VARIANTS = {
  DEFAULT: 'default',
  NUMBERED: 'numbered',
  DOTS: 'dots',
  PROGRESS: 'progress'
} as const;

// Step orientations
export const STEPPER_ORIENTATIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
} as const;

// Step states
export const STEP_STATES = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ERROR: 'error',
  DISABLED: 'disabled'
} as const;

export type StepState = typeof STEP_STATES[keyof typeof STEP_STATES];
