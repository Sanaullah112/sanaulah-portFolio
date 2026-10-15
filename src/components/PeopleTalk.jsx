import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../config/endpoints";
import { getAssetUrl } from "../utils/assetUrl";

const AUTOPLAY_MS = 4000;

const PeopleTalk = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const autoPlayRef = useRef(null);

  const backgroundColors = ["bg-[#049372]", "bg-[#F3C63F]", "bg-[#ED6B86]", "bg-[#79FF26]"];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/testimonials`);
        if (!response.ok) throw new Error("Network response was not ok");

        const rawData = await response.json();
        const finalArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

        setTestimonials(finalArray);
        if (finalArray.length > 0) {
          setCurrentIndex(Math.floor(finalArray.length / 2));
        }
      } catch (error) {
        console.error("Failed fetching testimonials pipeline stack:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setProgressKey((k) => k + 1);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setProgressKey((k) => k + 1);
  }, [testimonials.length]);

  const goTo = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgressKey((k) => k + 1);
  };

  useEffect(() => {
    if (testimonials.length === 0 || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, AUTOPLAY_MS);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials, isHovered, handleNext]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev]);

  const handleDragEnd = (_, info) => {
    const threshold = 80;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  if (loading || testimonials.length === 0) {
    return (
      <div className="w-full h-72 flex items-center justify-center text-[#79FF26] font-bold bg-[#F3F8EF]">
        Loading Testimonials Data Pipeline...
      </div>
    );
  }

  const contentStagger = {
    initial: {},
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };

  const contentItem = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
  };

  return (
    <section
      id="testimonials"
      className="w-full bg-[#F3F8EF] py-12 px-4 sm:px-6 md:px-8 xl:px-16 select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1320px] mx-auto flex flex-col items-center">
        <div className="text-center max-w-2xl mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0D0D0D] mb-3">
            What People Say <span className="text-[#79FF26]">About My Work</span>
          </h2>
          <p className="text-[#959595] text-sm sm:text-base font-normal leading-relaxed">
                Hear from clients and collaborators about their experience working with me and the web applications I’ve built.
          </p>
        </div>

        <div className="w-full relative flex items-center justify-center min-h-[320px] mb-4 [perspective:1200px]">
          <div className="relative flex items-center justify-center w-full max-w-[1000px] h-[260px] [transform-style:preserve-3d]">
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              {testimonials.map((item, index) => {
                let position = index - currentIndex;
                if (position < -Math.floor(testimonials.length / 2)) {
                  position += testimonials.length;
                }
                if (position > Math.floor(testimonials.length / 2)) {
                  position -= testimonials.length;
                }

                const isCenter = position === 0;
                const isLeft = position === -1;
                const isRight = position === 1;
                const isVisible = isCenter || isLeft || isRight;

                if (!isVisible) {
                  return null;
                }

                let rotateY = 0;
                let translateX = "0%";
                let scale = 1;
                let zIndex = 10;
                let opacity = 1;

                if (isLeft) {
                  rotateY = 25;
                  translateX = "-55%";
                  scale = 0.85;
                  zIndex = 5;
                  opacity = 0.4;
                } else if (isRight) {
                  rotateY = -25;
                  translateX = "55%";
                  scale = 0.85;
                  zIndex = 5;
                  opacity = 0.4;
                }

                const hasLinkedIn = Boolean(item.linkedin) && isCenter;

                return (
                  <motion.div
                    key={item._id}
                    custom={direction}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={isCenter ? handleDragEnd : undefined}
                    initial={{ opacity: 0, scale: 0.7, rotateY: direction > 0 ? 35 : -35, z: -100 }}
                    animate={{
                      opacity: opacity,
                      scale: scale,
                      rotateY: rotateY,
                      x: translateX,
                      z: isCenter ? 100 : 0,
                      zIndex: zIndex,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                      rotateY: direction > 0 ? -35 : 35,
                      z: -100,
                      transition: { duration: 0.35, ease: "easeIn" },
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                    whileDrag={{ cursor: "grabbing", scale: 0.97 }}
                    onClick={() => {
                      if (isLeft) {
                        handlePrev();
                      }
                      if (isRight) {
                        handleNext();
                      }
                    }}
                    className={
                      "absolute w-[92%] sm:w-[460px] lg:w-[480px] bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100/70 flex flex-col items-center justify-between backface-visible min-h-[250px] transition-shadow duration-300 " +
                      (isCenter
                        ? "shadow-gray-200/50 cursor-grab active:cursor-grabbing"
                        : "hover:opacity-60 shadow-sm cursor-pointer")
                    }
                    data-cursor-text={isCenter ? "Drag" : isLeft ? "Prev" : "Next"}
                  >
                    <div
                      className={
                        "absolute -top-10 w-20 h-20 rounded-full flex items-center justify-center p-1 shadow-sm " +
                        backgroundColors[index % backgroundColors.length]
                      }
                    >
                      <img
                        src={getAssetUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-full pointer-events-none"
                        draggable={false}
                      />
                    </div>

                    {isCenter ? (
                      <span className="absolute top-4 right-6 text-5xl font-serif text-gray-100 select-none leading-none">
                        &quot;
                      </span>
                    ) : null}

                    <motion.div
                      variants={contentStagger}
                      initial="initial"
                      animate={isCenter ? "animate" : "initial"}
                      className="flex flex-col items-center w-full mt-10 mb-4 flex-grow justify-center relative"
                    >
                      <motion.div variants={contentItem} className="flex items-center gap-1 mb-2.5 text-[#F3C63F]">
                        {[...Array(5)].map((_, i) => {
                          const filled = i < (item.rating || 5);
                          return (
                            <svg
                              key={i}
                              className={
                                "w-3.5 h-3.5 " + (filled ? "fill-current" : "text-gray-200 stroke-current")
                              }
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                      </motion.div>

                      <motion.p
                        variants={contentItem}
                        className="text-[#959595] text-xs sm:text-sm text-center font-medium leading-relaxed max-w-md line-clamp-3 px-1 italic"
                      >
                        {item.review}
                      </motion.p>
                    </motion.div>

                    <div className="w-full border-t border-gray-100 pt-3.5 text-center relative">
                      <h3 className="text-lg font-bold text-[#112F47] tracking-tight">{item.name}</h3>
                      <p className="text-[#959595] text-[11px] sm:text-xs font-semibold tracking-wide mt-0.5">
                        {item.jobTitle} <span className="text-[#79FF26]">@ {item.company}</span>
                      </p>

                      {hasLinkedIn ? (
                        <a
                          href={item.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-0 bottom-0.5 p-1.5 text-gray-400 hover:text-[#0A66C2] transition-colors rounded-full hover:bg-gray-50"
                          title="View LinkedIn Profile"
                          onClick={(e) => e.stopPropagation()}
                          data-cursor-text="LinkedIn"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {testimonials.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={item._id}
                onClick={() => goTo(index)}
                aria-label={"Go to testimonial " + (index + 1)}
                className="relative p-1.5"
                data-cursor-text="Jump"
              >
                <motion.span
                  className="block rounded-full bg-[#112F47]"
                  animate={{
                    width: isActive ? 20 : 6,
                    height: 6,
                    opacity: isActive ? 1 : 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: "#ffffff" }}
            whileTap={{ scale: 0.94 }}
            onClick={handlePrev}
            className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center text-[#112F47] shadow-sm transition-all"
            aria-label="Previous testimonial"
            data-cursor-text="Prev"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleNext}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
            aria-label="Next testimonial"
            data-cursor-text="Next"
          >
            <span className="absolute inset-0 rounded-full bg-[#9AF23A]" />
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              {!isHovered ? (
                <motion.circle
                  key={progressKey}
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={113}
                  initial={{ strokeDashoffset: 113 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                />
              ) : null}
            </svg>
            <svg className="relative w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PeopleTalk;