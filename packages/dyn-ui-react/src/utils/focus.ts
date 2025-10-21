import type { MutableRefObject } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const isElementFocusable = (element: HTMLElement) => {
  if (element.hasAttribute('disabled')) return false;
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex != null && Number(tabIndex) < 0) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  return true;
};

export const getFocusableElements = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) return [];
  const elements = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  return elements.filter(isElementFocusable);
};

export const focusElement = (element: HTMLElement | null | undefined) => {
  if (!element) return;
  try {
    element.focus({ preventScroll: true });
  } catch {
    // Swallow focus errors (e.g. element not focusable yet)
  }
};

export const setElementRef = <T>(
  ref: MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null
) => {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  (ref as MutableRefObject<T | null>).current = value;
};

