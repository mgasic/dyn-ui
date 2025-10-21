import { render, screen } from '@testing-library/react';
import { DynDivider } from './DynDivider';

describe('DynDivider', () => {
  it('renders a horizontal divider by default', () => {
    render(<DynDivider />);

    const divider = screen.getByTestId('dyn-divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider.className).toContain('variantHorizontal');
    expect(divider.className).toContain('sizeMd');
  });

  it('renders an accessible label when provided', () => {
    render(<DynDivider label="Details" />);

    const divider = screen.getByTestId('dyn-divider');
    const label = screen.getByText('Details');

    expect(label.tagName).toBe('SPAN');
    expect(divider).toHaveAttribute('aria-labelledby', label.id);
    expect(divider.className).toContain('withLabel');
  });

  it('supports custom label content through children', () => {
    render(
      <DynDivider>
        <span data-testid="custom-label">Custom Content</span>
      </DynDivider>
    );

    const divider = screen.getByTestId('dyn-divider');
    const customLabel = screen.getByTestId('custom-label');
    const labelledBy = divider.getAttribute('aria-labelledby');

    expect(labelledBy).toBeTruthy();
    const labelElement = labelledBy ? document.getElementById(labelledBy) : null;
    expect(labelElement).not.toBeNull();
    expect(labelElement).toContainElement(customLabel);
  });

  it('applies vertical variant tokens', () => {
    render(
      <DynDivider label="Summary" labelPosition="right" variant="vertical" size="lg" color="primary" />
    );

    const divider = screen.getByTestId('dyn-divider');
    const className = divider.className;

    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(className).toContain('variantVertical');
    expect(className).toContain('sizeLg');
    expect(className).toContain('colorPrimary');
    expect(className).toContain('labelRight');
  });

  it('renders text variant without decorative lines while keeping separator semantics', () => {
    render(<DynDivider variant="text" aria-label="Section" label="Overview" />);

    const divider = screen.getByRole('separator');
    const lines = divider.querySelectorAll('[aria-hidden="true"]');

    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider.className).toContain('variantText');
    expect(lines.length).toBe(0);
  });
});
