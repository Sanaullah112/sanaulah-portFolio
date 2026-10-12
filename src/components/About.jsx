import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img from "../assets/sanaullah.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  // Local active index hover tracker for skills interaction
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useGSAP(() => {
    gsap.from(".about-reveal", {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.from(".about-progress", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });
  }, { scope: sectionRef });

  const skillsData = [
    { id: 1, name: "Prompt Engineering", level: 88 },
    { id: 2, name: "JWT Authentication", level: 91 },
    { id: 3, name: "Database Design", level: 88 },
    { id: 4, name: "Full Stack Development", level: 92 },
  ];
  return (
    <section ref={sectionRef}
      id="about"
      className="w-full bg-white md:py-20 px-4 sm:px-6 md:px-8 xl:px-16 transition-colors duration-300 select-none overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* 📷 PORTRAIT VISUAL - Placed second on mobile screens */}
        <div className="grid grid-cols-1 lg:col-span-5 flex justify-center items-center relative order-2 lg:order-1">
          <div className="about-reveal relative w-full max-w-[380px] sm:max-w-[420px] aspect-square flex items-center justify-center mx-auto"
          >
            {/* Soft decorative background accent behind the image */}
            <div className="aboutimg absolute inset-0 bg-[#79FF26]/5 rounded-full filter blur-2xl -z-10" />
            <img
              src={img}
              alt="About Profile Visual"
              className=" w-full h-auto object-contain drop-shadow-2xl pointer-events-none"
            />
          </div>
        </div>

        {/* 📋 TEXT CONTENT & PROGRESSIVE METRICS ROW */}
        <div className="lg:col-span-7 flex flex-col order-3 lg:order-2 text-center lg:text-left">
          {/* Desktop Only Main Header Heading Title Layout */}
          <div className="mb-6">
            <h2 className="about-reveal text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0D0D0D]"
            >
              <span className="text-[#79FF26]">About </span>Me
            </h2>
          </div>

          {/* Description Paragraph Body Layout */}
          <p className="about-reveal text-[#959595] text-sm sm:text-base leading-relaxed tracking-wide font-normal max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-10"
          >
            I am a passionate Full-Stack MERN Developer specializing in building
            modern, scalable, and user-focused web applications. I develop
            complete solutions from frontend to backend using React.js, Node.js,
            Express.js, MongoDB, JavaScript, Tailwind CSS, HTML5 and CSS3. Over
            the past year I have worked on real-world projects including
            e-commerce platforms, educational platforms, office management
            systems, restaurant management software and custom business
            applications — most of them live and serving real users today.
          </p>

          {/* 📊 INTERACTIVE SKILLS DISPLAY WRAPPER */}
          <div className="w-full flex flex-col gap-5 max-w-2xl mx-auto lg:mx-0">
            {skillsData.map((skill, index) => {
              const isCurrentHovered = hoveredSkill === index;

              return (
                <div
                  key={skill.id}
                  className="about-reveal w-full cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Skill Typography Meta Information Row */}
                  <div className="flex justify-between items-center mb-2">
                    <span
                      style={{ color: isCurrentHovered ? "#9AF23A" : "#0D0D0D" }}
                      className="font-bold text-base sm:text-lg tracking-tight"
                    >
                      {skill.name}
                    </span>

                    {/* Tooltip percentage tracker element displaying on interactions */}
                    <span
                      style={{ opacity: isCurrentHovered ? 1 : 0.8, transform: isCurrentHovered ? "translateY(-2px) scale(1.1)" : "none" }}
                      className="text-xs font-bold text-white bg-[#9AF23A] px-2.5 py-1 rounded-md shadow-sm border border-white/10"
                    >
                      {skill.level}%
                    </span>
                  </div>

                  {/* Slider Line Structural Framework Container */}
                  <div className="relative w-full h-3 bg-gray-200/80 rounded-full flex items-center">
                    {/* Active Progress Level Slider Fill */}
                    <div
                      className="about-progress h-full bg-[#79FF26] rounded-full relative flex items-center justify-end"
                      style={{ width: `${skill.level}%` }}
                    >
                      {/* Slider Node Dial Indicator Overlay */}
                      <div
                        style={{ transform: isCurrentHovered ? "scale(1.35)" : "none", backgroundColor: isCurrentHovered ? "#0D0D0D" : "#EDECEC" }}
                        className="w-4 h-4 border-[3px] border-[#79FF26] rounded-full absolute -right-2 shadow-md z-10"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
