import { JSDOM } from 'jsdom';

interface SetupDomOptions {
  url?: string;
}

export function setupDomEnvironment(options: SetupDomOptions = {}): void {
  if (typeof window !== 'undefined' && (window as unknown as { __PERF_ENV_READY?: boolean }).__PERF_ENV_READY) {
    return;
  }

  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
    url: options.url ?? 'http://localhost',
  });

  const { window: domWindow } = dom;

  (domWindow as unknown as { __PERF_ENV_READY?: boolean }).__PERF_ENV_READY = true;

  const globalObj = globalThis as unknown as Record<string, unknown>;

  globalObj.window = domWindow;
  globalObj.self = domWindow;
  globalObj.document = domWindow.document;
  globalObj.navigator = domWindow.navigator;
  globalObj.HTMLElement = domWindow.HTMLElement;
  globalObj.HTMLInputElement = domWindow.HTMLInputElement;
  globalObj.Node = domWindow.Node;
  globalObj.MutationObserver = domWindow.MutationObserver;
  globalObj.Event = domWindow.Event;
  globalObj.KeyboardEvent = domWindow.KeyboardEvent;
  globalObj.MouseEvent = domWindow.MouseEvent;
  globalObj.CustomEvent = domWindow.CustomEvent;
  globalObj.ResizeObserver = class ResizeObserverMock {
    observe = () => {};
    unobserve = () => {};
    disconnect = () => {};
  };

  const raf =
    domWindow.requestAnimationFrame?.bind(domWindow) ??
    ((cb: (...args: any[]) => void) => setTimeout(() => cb(Date.now()), 16));
  const caf = domWindow.cancelAnimationFrame?.bind(domWindow) ?? ((id: number) => clearTimeout(id));

  globalObj.requestAnimationFrame = raf;
  globalObj.cancelAnimationFrame = caf;

  // React act() requires this flag in some environments
  globalObj.IS_REACT_ACT_ENVIRONMENT = true;

  // Basic Intl mocks to align with test setup expectations
  if (!('matchMedia' in domWindow)) {
    // @ts-expect-error - we intentionally polyfill matchMedia
    domWindow.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  globalObj.window.matchMedia = domWindow.matchMedia;

  // Ensure getComputedStyle is available and mutable for testing-library
  const originalGetComputedStyle = domWindow.getComputedStyle.bind(domWindow);
  domWindow.getComputedStyle = ((elt: Element, pseudoElt?: string | null) => {
    const style = originalGetComputedStyle(elt, pseudoElt ?? undefined);
    try {
      Object.defineProperty(style, 'pointerEvents', {
        get: () => 'auto',
        configurable: true,
      });
    } catch (error) {
      // no-op - readonly in some environments
    }
    return style;
  }) as typeof domWindow.getComputedStyle;

  globalObj.getComputedStyle = domWindow.getComputedStyle;
}
