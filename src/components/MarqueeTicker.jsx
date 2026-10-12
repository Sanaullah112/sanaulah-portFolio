import { useEffect, useRef } from "react";
import gsap from "gsap";

const MarqueeTicker = () => {
  const trackRef = useRef(null);
  const tickerItems = [
    { text: "React.js" },
    { text: "JavaScript ES6+" },
    { text: "Tailwind CSS" },
    { text: "Node.js" },
    { text: "Express.js" },
    { text: "REST APIs" },
    { text: "JWT Authentication" },
    { text: "MongoDB" },
    { text: "Mongoose" },
    { text: "GitHub" },
    { text: "Postman" },
    { text: "Vercel" },
    { text: "Render" },
    { text: "Prompt Engineering" },
    { text: "Problem Solving" },
    { text: "Debugging" },
    { text: "Team Leadership" },
  ];

  // Triplicating items to guarantee smooth seamless visual looping on large displays
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  useEffect(() => {
    const tween = gsap.to(trackRef.current, {
      x: "-33.333%",
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  return (
    <section className="w-full bg-[#F3F8EF] py-10 md:py-16 overflow-hidden select-none flex items-center justify-center">
      {/* Main Green Container Band (Slanted Outer Wrap) */}
      <div className="w-[110%] -rotate-2 bg-[#79FF26] py-3.5 sm:py-5 md:py-7 flex items-center overflow-hidden shadow-lg">
        
        {/* White Inner Background Track spanning across the screen width */}
        <div className="w-full bg-white py-1 flex items-center overflow-hidden border-y border-gray-100">
          
          <div ref={trackRef} className="flex w-max relative whitespace-nowrap">
            {/* First Rolling Track */}
            <div
              className="flex items-center gap-8 sm:gap-10 pr-12 sm:pr-16"
            >
              {duplicatedItems.map((item, idx) => (
                <div key={`white-track1-${idx}`} className="flex items-center gap-12 sm:gap-16">
                  {/* Black Text Mapping */}
                  <span className="text-[#0D0D0D] text-1xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
                    {item.text}
                  </span>
                  
                  {/* Green Star Divider Icon matching the outer band */}
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#79FF26] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Second Rolling Track to prevent viewport clipping spaces */}
            <div
              className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 absolute top-0 left-full h-full"
            >
              {duplicatedItems.map((item, idx) => (
                <div key={`white-track2-${idx}`} className="flex items-center gap-12 sm:gap-16">
                  <span className="text-[#0D0D0D] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                    {item.text}
                  </span>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#79FF26] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MarqueeTicker;