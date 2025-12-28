# DynCarousel - Enterprise Implementation Guide

**TIER**: 3 | **Complexity**: HIGH | **Timeline**: 6-7 days

## QUICK FACTS
- **Type**: Image/content carousel
- **State**: Complex (current slide, autoplay, swipe gestures)
- **Keyboard**: Arrow keys, Home, End
- **ARIA**: role="region", aria-live, aria-roledescription="carousel"
- **Testing**: TIER 3

## WANTED STATE
✅ Slide navigation (prev/next, dots, keyboard)  
✅ Autoplay with pause on hover  
✅ Swipe gestures (touch support)  
✅ ARIA complete (carousel pattern)  
✅ Animation tokens  
✅ Dark mode  
✅ 85%+ coverage  

## STATE MANAGEMENT (useReducer)
```typescript
type CarouselState = {
  currentIndex: number;
  isPlaying: boolean;
  direction: 'forward' | 'backward';
};

type CarouselAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO'; index: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' };

const carouselReducer = (state: CarouselState, action: CarouselAction): CarouselState => {
  switch (action.type) {
    case 'NEXT':
      return { ...state, currentIndex: (state.currentIndex + 1) % totalSlides, direction: 'forward' };
    case 'PREV':
      return { ...state, currentIndex: (state.currentIndex - 1 + totalSlides) % totalSlides, direction: 'backward' };
    // ...
  }
};
```

## KEYBOARD NAVIGATION
- Arrow Left - Previous slide
- Arrow Right - Next slide
- Home - First slide
- End - Last slide

## ARIA PATTERN
```tsx
<section
  role="region"
  aria-roledescription="carousel"
  aria-label="Image Carousel"
  aria-live="polite"
>
  <div role="group" aria-roledescription="slide" aria-label={`Slide ${currentIndex + 1} of ${totalSlides}`}>
    {slides[currentIndex]}
  </div>
  <button onClick={() => dispatch({ type: 'PREV' })} aria-label="Previous slide">Prev</button>
  <button onClick={() => dispatch({ type: 'NEXT' })} aria-label="Next slide">Next</button>
</section>
```

## TESTING (TIER 3)
- Navigation (prev/next/goto)
- Autoplay + pause on hover
- Keyboard navigation
- Swipe gestures (touch events)
- ARIA (carousel pattern)
- jest-axe

## REFERENCES
- PATTERNS/01-Keyboard-Navigation-Pattern.md → TIER 3
- PATTERNS/02-ARIA-Attributes-Pattern.md → TIER 3 (carousel)
- PATTERNS/03-State-Management-Pattern.md → TIER 3
- PATTERNS/04-Testing-Pattern.md → TIER 3
