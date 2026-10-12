import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BASE_URL } from "../config/endpoints";
import bgImg from "../assets/bg.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MyLatestWork = () => {
  const [works, setWorks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchLatestWorks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/last-work`);

        if (!response.ok) {
          throw new Error(`API response error status: ${response.status}`);
        }

        const rawData = await response.json();
        const finalArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

        setWorks(finalArray);
      } catch (error) {
        console.error("Database connection fault or API failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestWorks();
  }, []);

  cardsRef.current = [];
  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  useGSAP(
    () => {
      if (!works.length) return;

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 70, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      const cleanups = [];

      cardsRef.current.forEach((card) => {
        // Card lift on hover (no preserve-3d here — the image panel below
        // relies on overflow-hidden for its scroll-reveal effect, and
        // preserve-3d on an ancestor breaks that clipping in some browsers)
        const quickScale = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power3.out" });
        const quickY = gsap.quickTo(card, "y", { duration: 0.4, ease: "power3.out" });

        // Subtle cursor-follow tilt, flat plane only (no preserve-3d)
        gsap.set(card, { transformPerspective: 800 });
        const quickRotateX = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
        const quickRotateY = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });

        const descPanel = card.querySelector(".js-desc-panel");
        const descText = card.querySelector(".js-desc-text");
        const stackShadow = card.querySelector(".js-stack-shadow");
        const arrowBtn = card.querySelector(".js-arrow-btn");

        let descScrollTween = null;

        const onEnter = () => {
          quickScale(1.03);
          quickY(-12);
          gsap.to(card, { boxShadow: "0px 30px 60px -15px rgba(0,0,0,0.45)", duration: 0.4 });

          // The stacked-card shadow behind the screenshots deepens and
          // shifts slightly, selling the "lifted off the backdrop" feel
          if (stackShadow) {
            gsap.to(stackShadow, {
              y: -6,
              scale: 1.04,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          // Arrow button pops in with a little overshoot instead of a flat fade
          if (arrowBtn) {
            gsap.to(arrowBtn, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.45,
              ease: "back.out(2.5)",
            });
          }

          if (descPanel && descText) {
            gsap.to(descPanel, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });

            // Only auto-scroll the text if it actually overflows its box
            const overflow = descText.scrollHeight - descText.parentElement.clientHeight;
            if (overflow > 0) {
              descScrollTween = gsap.to(descText, {
                y: -overflow,
                duration: Math.max(2.5, overflow / 20), // slower scroll for longer text
                ease: "none",
                delay: 0.5,
              });
            }
          }
        };

        const onLeave = () => {
          quickScale(1);
          quickY(0);
          quickRotateX(0);
          quickRotateY(0);
          gsap.to(card, { boxShadow: "0px 20px 40px -15px rgba(0,0,0,0.3)", duration: 0.4 });

          if (stackShadow) {
            gsap.to(stackShadow, {
              y: 0,
              scale: 1,
              opacity: 0.85,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          if (arrowBtn) {
            gsap.to(arrowBtn, {
              opacity: 0,
              scale: 0.6,
              y: 8,
              duration: 0.3,
              ease: "power2.in",
            });
          }

          if (descPanel && descText) {
            gsap.to(descPanel, { opacity: 0, y: 16, duration: 0.25, ease: "power2.in" });
            if (descScrollTween) descScrollTween.kill();
            gsap.to(descText, { y: 0, duration: 0.3, ease: "power2.out" });
          }
        };

        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          quickRotateY((px - 0.5) * 6);
          quickRotateX((0.5 - py) * 6);
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card.addEventListener("mousemove", onMove);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
          card.removeEventListener("mousemove", onMove);
          if (descScrollTween) descScrollTween.kill();
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: sectionRef, dependencies: [works] }
  );

  if (loading || works.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="latest-work"
      className="w-full bg-[#573c27] py-18 md:py-20 px-4 sm:px-6 md:px-8 xl:px-16 select-none overflow-hidden relative font-['Raleway']"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img src={bgImg} alt="" className="w-full h-full object-cover opacity-90 object-center" />
      </div>

      <div className="max-w-[1320px] mx-auto relative z-10">
        <div className="text-left mb-16">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black">
            My Latest <span className="text-[#79FF26]">Work</span>
          </h2>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 items-stretch mb-12">
          {works.map((work, idx) => (
            <div
              key={work._id}
              ref={addCardRef}
              onClick={() =>
                work.githubLink &&
                window.open(work.githubLink, "_blank", "noopener,noreferrer")
              }
              onMouseEnter={() => setActiveIndex(idx)}
              className="w-full rounded-[32px] bg-[#B8FF78] hover:bg-[#9AF23A]/75 transition-colors duration-300 pt-8 px-5 pb-5 relative flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] cursor-pointer group overflow-visible border border-lime-300/10 will-change-transform"
            >
              {/* Hover Overlay */}
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Heading */}
              <div className="text-left px-3 mb-6 relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0D0D0D] tracking-tight transition-colors duration-300 group-hover:text-white">
                  {work.title}
                </h3>

                {work.category && (
                  <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide text-[#0D0D0D]/60 group-hover:text-white/80 transition-colors duration-300">
                    {work.category}
                  </span>
                )}
              </div>

              {/* Image Section */}
              <div className="w-full bg-[#E8F0E3] rounded-[28px] aspect-[4/3.5] overflow-hidden relative shadow-inner flex items-start justify-center pt-0 px-6">

                {/* Stack Shadow */}
                <div
                  className="absolute top-4 left-1/2 -translate-x-1/2 w-[86%] h-12 bg-gradient-to-b from-[#8BC34A] to-[#5E8F2A] rounded-t-[22px] pointer-events-none"
                  style={{
                    opacity: 0.85,
                    filter: "blur(0.5px)",
                  }}
                />

                {/* Image */}
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="relative z-[1] w-full h-auto object-cover rounded-t-[22px] shadow-2xl object-top pt-6 pointer-events-none transform transition-transform duration-[3.5s] ease-in-out group-hover:translate-y-[calc(-100%+240px)]"
                  style={{
                    transformOrigin: "top",
                  }}
                />

                {/* Description */}
                {work.description && (
                  <div
                    className="js-desc-panel absolute inset-0 z-20 bg-[#1B2A38]/85 flex items-center px-6 py-6 pointer-events-none"
                    style={{
                      opacity: 0,
                      transform: "translateY(16px)",
                    }}
                  >
                    <div className="w-full max-h-full overflow-hidden">
                      <p className="js-desc-text text-white text-sm sm:text-base leading-relaxed">
                        {work.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Arrow */}
              {work.githubLink && (
                <div
                  className="js-arrow-btn absolute -right-8 bottom-7 w-24 h-24 rounded-full bg-[#1B2A38] flex items-center justify-center text-white shadow-[0_20px_45px_rgba(0,0,0,.28)] z-40 transition-all duration-300 group-hover:bg-[#79FF26] hover:scale-110 active:scale-95"
                  style={{
                    opacity: 0,
                    transform: "translateY(8px) scale(0.6)",
                  }}
                >
                  <svg
                    className="w-8 h-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2.5 mt-8">
          {works.map((_, dotIdx) => {
            const isDotActive = activeIndex === dotIdx;
            return (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${isDotActive ? "w-8 bg-[#79FF26]" : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                aria-label={`Go to project card panel ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MyLatestWork;