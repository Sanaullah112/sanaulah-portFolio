import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: 1,
    title: "Full-Stack MERN Development",
    description: "Complete web applications built from database to UI — MongoDB schemas, secure Express APIs and fast React interfaces, delivered as one coherent product.",
  },
  {
    id: 2,
    title: "AI-Powered Applications",
    description: "AI-assisted development and AI-powered product features — from intelligent automation to Python tooling that removes repetitive manual work.",
  },
  {
    id: 3,
    title: "Node.js & REST API Development",
    description: "Scalable REST APIs with Node.js, Express.js and MongoDB — validated, secured with JWT, documented in Postman and ready for any client to consume.",
  },
];

// Precision vector paths to replicate the image wireframe shapes perfectly
const renderIcon = (id, isCurrentActive) => {
  const fillClass = isCurrentActive ? "text-[#79FF26]" : "text-white";
  if (id === 1) {
    return (
      <svg className={`w-8 h-8 transition-colors duration-300 ${fillClass}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
      </svg>
    );
  }
  if (id === 2) {
    return (
      <svg className={`w-8 h-8 transition-colors duration-300 ${fillClass}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className={`w-8 h-8 transition-colors duration-300 ${fillClass}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Service Card                                                       */
/*  - Colors stay Tailwind (cheap, not fought over by GSAP)             */
/*  - Lift / icon bounce / arrow shift are GSAP-owned transforms,       */
/*    driven by hover events, independent of the entrance timeline     */
/* ------------------------------------------------------------------ */
const ServiceCard = ({ service, index, isHovered, onHover }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const arrowRef = useRef(null);

  const handleEnter = () => {
    onHover(index);
    gsap.to(cardRef.current, { y: -14, duration: 0.4, ease: "power3.out" });
    gsap.to(iconRef.current, { rotate: 10, scale: 1.08, duration: 0.4, ease: "back.out(2.5)" });
    gsap.to(arrowRef.current, { x: 6, rotate: 12, duration: 0.3, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: "power3.out" });
    gsap.to(iconRef.current, { rotate: 0, scale: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(arrowRef.current, { x: 0, rotate: 0, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`
        service-card rounded-2xl px-4 md:px-8 py-2 text-left cursor-pointer
        transition-colors duration-300 ease-out will-change-transform
        ${
          isHovered
            ? "bg-[#79FF26] text-white shadow-2xl shadow-[#79FF26]/30"
            : "bg-white text-[#0D0D0D] shadow-xl border border-gray-100"
        }
      `}
    >
      {/* Icon Container Shape — color swaps via Tailwind, motion via GSAP */}
      <div
        ref={iconRef}
        className={`w-16 h-16 flex items-center justify-center mb-4 rounded-2xl rounded-tr-[32px] rounded-bl-[32px] transition-colors duration-300 will-change-transform ${
          isHovered ? "bg-white" : "bg-[#79FF26]"
        }`}
      >
        {renderIcon(service.id, isHovered)}
      </div>

      {/* Card Header Title */}
      <h3
        className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 transition-colors duration-300 ${
          isHovered ? "text-white" : "text-[#0D0D0D]"
        }`}
      >
        {service.title}
      </h3>

      {/* Card Description Paragraph */}
      <p
        className={`text-sm sm:text-base leading-relaxed tracking-wide font-normal transition-colors duration-300 ${
          isHovered ? "text-white/95" : "text-[#959595]"
        }`}
      >
        {service.description}
      </p>

      {/* Micro-interaction layout bottom chevron cue */}
      <div className="mt-6 flex justify-end">
        <span
          ref={arrowRef}
          className={`inline-block text-xl font-bold will-change-transform ${
            isHovered ? "text-white" : "text-[#79FF26]"
          }`}
        >
          ↗
        </span>
      </div>
    </div>
  );
};

const Service = () => {
  // Track which card index is currently hovered. Default to card 1 (index 0) to match the initial Figma look.
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const sectionRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*  Scroll-triggered entrance — header, underline segments, and cards  */
  /*  all cascade in as the section enters the viewport.                 */
  /* ------------------------------------------------------------------ */
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });

    tl.from(".service-eyebrow", { opacity: 0, y: -12, duration: 0.5 })
      .from(".service-heading", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
      .from(
        ".service-line-segment",
        {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.1,
          duration: 0.5,
        },
        "-=0.3",
      )
      .from(
        ".service-card",
        {
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 0.6,
        },
        "-=0.2",
      );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="service"
      className="w-full bg-[#F3F8EF] py-24 px-4 sm:px-6 md:px-8 xl:px-16 transition-colors duration-300 select-none"
    >
      <div className="max-w-[1536px] mx-auto">

        {/* HEADERS SECTION */}
        <div className="w-full flex flex-col items-center text-center mb-20">
          <span className="service-eyebrow text-[#79FF26] text-sm md:text-base font-bold tracking-wide mb-2">
            Services
          </span>
          <h2 className="service-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0D0D0D]">
            <span className="text-[#79FF26]">Services </span>provide
          </h2>

          {/* Custom segmented vector line layout from image_bbb7e1.png */}
          <div className="flex items-center gap-1.5 mt-4">
            <div className="service-line-segment w-20 h-1 bg-[#79FF26] rounded-full"></div>
            <div className="service-line-segment w-2 h-1 bg-[#79FF26] rounded-full"></div>
            <div className="service-line-segment w-3 h-1 bg-[#79FF26] rounded-full"></div>
          </div>
        </div>

        {/* DYNAMIC CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center px-2">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Service;