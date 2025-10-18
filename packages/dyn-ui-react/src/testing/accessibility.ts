import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import './axe-patch';
import axe from 'axe-core';
import type { RunOptions, AxeResults } from 'axe-core';

export interface AccessibilityTestOptions {
  /** Additional configuration forwarded to axe-core */
  axeOptions?: RunOptions;
  /** Optional test id that selects a specific node for the audit */
  containerTestId?: string;
}

export interface AccessibilityTestResult {
  /** Raw axe-core result allowing deeper assertions if desired */
  rawResults: AxeResults;
}

/**
 * Convenience helper that runs an axe accessibility audit against the
 * rendered output of a component. The helper automatically asserts that
 * no accessibility violations are present and provides formatted output
 * on failure to make debugging easier.
 */
export async function testA11y(
  ui: ReactElement,
  options: AccessibilityTestOptions = {}
): Promise<AccessibilityTestResult> {
  const { container, unmount } = render(ui);

  const target = options.containerTestId
    ? container.querySelector(`[data-testid="${options.containerTestId}"]`) ?? container
    : container;

  // Ensure canvas.getContext exists in the test environment to avoid axe errors
  if (typeof HTMLCanvasElement !== 'undefined') {
    const canvasProto = HTMLCanvasElement.prototype as HTMLCanvasElement & {
      getContext?: (contextId: string, options?: unknown) => unknown;
    };

    if (!canvasProto.getContext) {
      canvasProto.getContext = () => null;
    }
  }

  // axe.run typing is overloaded; cast to avoid narrow overload resolution issues
  const results = (await (axe.run as any)(target, options.axeOptions)) as AxeResults;

  if (results.violations && results.violations.length > 0) {
    const formattedViolations = results.violations
      .map((violation) => {
        const nodes = violation.nodes.map((node) => node.html).join('\n');
        return `${violation.id}: ${violation.help}\n${violation.description}\nImpact: ${violation.impact}\n
Nodes:\n${nodes}`;
      })
      .join('\n\n');

    // Fail the test with the formatted message so CI output is actionable
    throw new Error(`Accessibility violations:\n${formattedViolations}`);
  } else {
    expect(results.violations).toHaveLength(0);
  }

  unmount();
  return { rawResults: results };
}

export { axe };
