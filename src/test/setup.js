import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Force reduced motion in tests so animation frames never leak between assertions.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

// happy-dom's Web Animations implementation rejects on cancel, which surfaces as an
// unhandled AbortError from motion. Drop it so motion falls back to its JS driver.
if (typeof Element !== 'undefined' && Element.prototype.animate) {
  delete Element.prototype.animate
}

afterEach(() => {
  cleanup()
})
