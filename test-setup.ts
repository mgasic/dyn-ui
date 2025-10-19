import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Make vi globally available
(globalThis as any).vi = vi;

// For backward compatibility, also provide jest as vi
(globalThis as any).jest = vi;

// CSS Modules mock for testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver with a stable constructor implementation
class MockResizeObserver {
  cb?: ResizeObserverCallback;
  constructor(cb?: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// @ts-ignore
global.ResizeObserver = MockResizeObserver as any;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
