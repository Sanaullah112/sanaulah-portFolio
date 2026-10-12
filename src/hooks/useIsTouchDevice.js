import { useEffect, useState } from 'react';

/**
 * Detects touch-primary devices so pointer-only effects (custom cursor,
 * magnetic hover, tilt) can be safely skipped.
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    setIsTouch(checkTouch);
  }, []);

  return isTouch;
};