import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from 'framer-motion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [cursorState, setCursorState] = useState('default'); // default | hover | magnetic | text | click
  const [cursorLabel, setCursorLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const isDown = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const outerSpring = { damping: 30, stiffness: 300, mass: 0.5 };
  const innerSpring = { damping: 45, stiffness: 600, mass: 0.2 };

  const outerX = useSpring(cursorX, outerSpring);
  const outerY = useSpring(cursorY, outerSpring);
  const innerX = useSpring(cursorX, innerSpring);
  const innerY = useSpring(cursorY, innerSpring);

  // Velocity-driven stretch — gives the ring weight/momentum
  const velocityX = useVelocity(outerX);
  const velocityY = useVelocity(outerY);
  const speed = useTransform([velocityX, velocityY], ([vx, vy]) =>
    Math.min(Math.hypot(vx, vy) / 40, 14)
  );
  const stretchX = useSpring(useTransform(speed, (s) => 1 + s * 0.02), { damping: 20, stiffness: 200 });
  const stretchY = useSpring(useTransform(speed, (s) => 1 - s * 0.01), { damping: 20, stiffness: 200 });
  const rotate = useTransform([velocityX, velocityY], ([vx, vy]) =>
    Math.hypot(vx, vy) > 60 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0
  );

  useEffect(() => {
    if (isTouch || prefersReducedMotion) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);
    const handleDown = () => { isDown.current = true; setCursorState((s) => (s === 'default' ? 'click' : s)); };
    const handleUp = () => { isDown.current = false; setCursorState((s) => (s === 'click' ? 'default' : s)); };

    // Delegated hover detection — scales to any number of elements, static or dynamic
    const handleOver = (e) => {
      const magnetic = e.target.closest('[data-magnetic]');
      const textEl = e.target.closest('[data-cursor-text]');
      const interactive = e.target.closest('a, button, [data-interactive], input, textarea, select');

      if (textEl) {
        setCursorLabel(textEl.dataset.cursorText);
        setCursorState('text');
      } else if (magnetic) {
        setCursorState('magnetic');
      } else if (interactive) {
        setCursorState('hover');
      }
    };

    const handleOut = (e) => {
      const stillInside =
        e.relatedTarget &&
        (e.relatedTarget.closest('[data-magnetic]') ||
          e.relatedTarget.closest('[data-cursor-text]') ||
          e.relatedTarget.closest('a, button, [data-interactive], input, textarea, select'));
      if (!stillInside) {
        setCursorState(isDown.current ? 'click' : 'default');
        setCursorLabel('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [isVisible, isTouch, prefersReducedMotion]);

  if (isTouch || prefersReducedMotion) return null;

  const outerVariants = {
    default: { width: 18, height: 18, backgroundColor: 'rgba(255,255,255,0.9)' },
    hover: { width: 54, height: 54, backgroundColor: 'rgba(255,255,255,0.9)' },
    magnetic: { width: 68, height: 68, backgroundColor: 'rgba(255,255,255,0.85)' },
    click: { width: 14, height: 14, backgroundColor: 'rgba(255,255,255,1)' },
    text: { width: 96, height: 96, backgroundColor: 'rgba(255,255,255,0.95)' },
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] will-change-transform flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: outerX,
          y: outerY,
          scaleX: stretchX,
          scaleY: stretchY,
          rotate,
          opacity: isVisible ? 1 : 0,
          mixBlendMode: 'difference',
        }}
        animate={{
          ...outerVariants[cursorState],
          scale: cursorState === 'default' ? [1, 1.08, 1] : 1, // idle breathing
        }}
        transition={
          cursorState === 'default'
            ? { scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, default: { type: 'spring', stiffness: 420, damping: 26 } }
            : { type: 'spring', stiffness: 420, damping: 26 }
        }
      >
        {cursorState === 'text' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-black text-[15px] font-medium tracking-wide uppercase select-none whitespace-nowrap"
          >
            {cursorLabel}
          </motion.span>
        )}
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[10001] will-change-transform -translate-x-1/2 -translate-y-1/2 bg-[#9AF23A]"
        style={{ x: innerX, y: innerY, opacity: isVisible && cursorState === 'default' ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      />
    </>
  );
}