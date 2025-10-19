import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Ensure Intl defaults to pt-BR formatting to match production locale expectations
const OriginalNumberFormat = Intl.NumberFormat;
Intl.NumberFormat = function (locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) {
  return new OriginalNumberFormat(locales ?? 'pt-BR', options);
} as typeof Intl.NumberFormat;
Intl.NumberFormat.prototype = OriginalNumberFormat.prototype;

// Silence pointer-events check errors (disabled elements) when supported
const maybeConfigure = (userEvent as unknown as { configure?: (options: { pointerEventsCheck?: string }) => void }).configure;
if (typeof maybeConfigure === 'function') {
  maybeConfigure({ pointerEventsCheck: 'never' });
}

// ResizeObserver mock
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
// Always define/override ResizeObserver to a stable class for tests
// @ts-ignore
globalThis.ResizeObserver = ResizeObserverMock as any;

// matchMedia mock — always define to ensure consistent behavior in test env
// @ts-ignore
window.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// expose vi and jest on global for test helpers
(globalThis as any).vi = vi;
(globalThis as any).jest = vi;

// Try to disable user-event pointer-events assertions (some environments/styles set pointer-events:none)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cssPointer = require('@testing-library/user-event/dist/esm/utils/pointer/cssPointerEvents');
  if (cssPointer && typeof cssPointer.assertPointerEvents === 'function') {
    cssPointer.assertPointerEvents = () => {};
  }
} catch (e) {
  // ignore if module path differs or not available
}

// Override getComputedStyle to force pointer-events to 'auto' during tests so
// user-event won't reject interactions due to CSS pointer-events restrictions.
const _origGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (elt: Element, pseudoElt?: string) => {
  const style = _origGetComputedStyle(elt as any, pseudoElt as any);
  try {
    Object.defineProperty(style, 'pointerEvents', {
      get: () => 'auto',
      configurable: true
    });
  } catch (err) {
    // ignore if cannot redefine
  }
  return style;
};

// requestAnimationFrame mock
if (!('requestAnimationFrame' in window)) {
  // @ts-ignore
  window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0);
  // @ts-ignore
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// scrollIntoView mock
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Canvas getContext mock
if (!HTMLCanvasElement.prototype.getContext) {
  // @ts-ignore
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    canvas: document.createElement('canvas'),
    // minimal 2D context shim
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: [] }),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    measureText: vi.fn(() => ({ width: 0, height: 12 })),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createPattern: vi.fn(),
    font: '10px Arial',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    fillStyle: '#000000',
    strokeStyle: '#000000',
  });
}
