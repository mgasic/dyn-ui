import { focusElement, getFocusableElements } from './focus';

export interface FocusTrapOptions {
  /** Custom element to receive focus when the trap activates. */
  initialFocus?: HTMLElement | null | (() => HTMLElement | null);
  /** Element to focus when the trap is released. */
  returnFocus?: HTMLElement | null | (() => HTMLElement | null);
  /** When true the Tab key is intercepted to keep focus inside the container. */
  loop?: boolean;
  /** If provided, the trap is skipped when the predicate returns false. */
  isEnabled?: () => boolean;
}

const resolveTarget = (target?: HTMLElement | null | (() => HTMLElement | null)) =>
  typeof target === 'function' ? target() : target ?? null;

export type FocusTrapDeactivation = () => void;

export const activateFocusTrap = (
  container: HTMLElement,
  options: FocusTrapOptions = {}
): FocusTrapDeactivation => {
  const ownerDocument = container.ownerDocument ?? document;
  const previousActiveElement = ownerDocument.activeElement as HTMLElement | null;
  const loop = options.loop ?? true;

  const shouldHandle = () => (options.isEnabled ? options.isEnabled() : true);

  const focusables = () => getFocusableElements(container);

  const focusInitial = () => {
    const explicit = resolveTarget(options.initialFocus);
    if (explicit) {
      focusElement(explicit);
      return;
    }

    const [firstFocusable] = focusables();
    if (firstFocusable) {
      focusElement(firstFocusable);
      return;
    }

    focusElement(container);
  };

  if (shouldHandle() && !container.contains(previousActiveElement)) {
    focusInitial();
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!loop || event.key !== 'Tab' || !shouldHandle()) return;

    const elements = focusables();
    if (elements.length === 0) {
      event.preventDefault();
      focusElement(container);
      return;
    }

    const active = ownerDocument.activeElement as HTMLElement | null;
    const first = elements[0];
    const last = elements[elements.length - 1];

    if (event.shiftKey) {
      if (active === first || !container.contains(active)) {
        event.preventDefault();
        focusElement(last);
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      focusElement(first);
    }
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!shouldHandle()) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (container.contains(target)) return;
    focusInitial();
  };

  ownerDocument.addEventListener('keydown', handleKeyDown);
  ownerDocument.addEventListener('focusin', handleFocusIn);

  return () => {
    ownerDocument.removeEventListener('keydown', handleKeyDown);
    ownerDocument.removeEventListener('focusin', handleFocusIn);

    const target = resolveTarget(options.returnFocus) ?? previousActiveElement;
    if (target && typeof target.focus === 'function' && target.isConnected) {
      focusElement(target);
    }
  };
};

