import { useEffect, useLayoutEffect, useRef } from 'react'

type Entry = { back: (() => void) | null; forward: (() => void) | null }

const stack: Entry[] = []
let listenerInstalled = false

function ensureListener() {
  if (listenerInstalled) return
  listenerInstalled = true
  window.addEventListener(
    'mousedown',
    (e) => {
      if (e.button !== 3 && e.button !== 4) return
      e.preventDefault()
      const top = stack[stack.length - 1]
      if (!top) return
      if (e.button === 3) top.back?.()
      if (e.button === 4) top.forward?.()
    },
    { capture: true },
  )
}

/**
 * Registers back/forward mouse-button handlers for a component.
 * The topmost registered handler wins — deeper components naturally override
 * shallower ones because they mount later.
 */
export function useMouseNav(back: (() => void) | null, forward: (() => void) | null) {
  ensureListener()
  const backRef = useRef(back)
  const forwardRef = useRef(forward)

  // Keep refs up-to-date after every render without re-registering.
  useLayoutEffect(() => {
    backRef.current = back
    forwardRef.current = forward
  })

  useEffect(() => {
    // Getter-based entry: always delegates to the latest ref values.
    const entry: Entry = {
      get back() {
        return backRef.current
      },
      get forward() {
        return forwardRef.current
      },
    }
    stack.push(entry)
    return () => {
      const i = stack.lastIndexOf(entry)
      if (i !== -1) stack.splice(i, 1)
    }
  }, [])
}
