import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const textRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const letters = textRef.current?.querySelectorAll('.loading-letter');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to('.loading-screen-container', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 1.0,
            ease: 'power4.inOut',
            onComplete: () => {
              setIsVisible(false);
              if (onComplete) onComplete();
            }
          });
        }
      });

      // Character-by-character fluid sequence reveal
      if (letters && letters.length > 0) {
        tl.fromTo(letters, 
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'back.out(1.7)' }
        );
      }

      // Elegant numeric countdown sequence tracking hydration status
      const counterObj = { value: 0 };
      tl.to(counterObj, {
        value: 100,
        duration: 2.0,
        ease: 'power3.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(counterObj.value).toString().padStart(3, '0');
          }
        }
      }, "-=0.5");

      // Brief pause to anchor user immersion
      tl.to({}, { duration: 0.4 });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return isVisible ? (
        <div 
          className="loading-screen-container fixed inset-0 z-[9999] flex flex-col justify-between bg-[#9AF23A] p-10 text-white select-none pointer-events-auto"
        >
          {/* Top Metadata */}
          <div className="flex justify-between items-center text-xs tracking-[0.3em] uppercase opacity-60">
            <span>Portfolio Initialization</span>
            <span>v2.0.26</span>
          </div>

          {/* Main Visual Typography Grid */}
          <div className="overflow-hidden py-4">
            <h1 
              ref={textRef} 
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase flex flex-wrap"
              aria-label="SANAULLAH"
            >
              {"SANAULLAH".split("").map((char, index) => (
                <span 
                  key={index} 
                  className="loading-letter inline-block transform will-change-transform"
                  aria-hidden="true"
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* Bottom Numeric Stat Layer */}
          <div className="flex justify-between items-end">
            <div className="text-xs tracking-widest opacity-40 max-w-xs hidden md:block">
              ENGINEERING PREMIUM DIGITAL EXPERIENCES THROUGH PIXEL-PERFECT INTERACTION PATTERNS.
            </div>
            <div className="text-[12vw] font-light leading-none tracking-tighter tabular-nums">
              <span ref={counterRef}>000</span>
            </div>
          </div>
        </div>
      ) : null;
}