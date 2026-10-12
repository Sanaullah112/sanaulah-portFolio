import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import logoImg from "../assets/sanaullah-logo.png"; // Ensure the logo image is placed in the correct path

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".footer-reveal", {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: footerRef.current, start: "top 85%" },
    });
  }, { scope: footerRef });

  // Dynamic Array for Clean Mapping (Default routing setups)
  const infoLinks = [
    { name: "Home", path: "#home" },
    { name: "About Us", path: "#about" },
    { name: "Services", path: "#service" },
    { name: "Resume", path: "#hire-me" },
    { name: "Project", path: "#project" },
    { name: "Contact Us", path: "#contact" },
  ];

  const socialLinks = [
    { id: "tiktok", url: "https://www.tiktok.com" },
    { id: "whatsapp", url: "https://wa.me/923099369195" },
    { id: "linkedin", url: "https://www.linkedin.com/in/sana-ullah-16464939a/" },
    { id: "github", url: "https://github.com/Sanaullah112" },
  ];

  return (
    <footer ref={footerRef} className="w-full bg-[#F3F8EF] pt-10 md:pt-16 pb-8 px-4 sm:px-6 md:px-8 xl:px-16 select-none overflow-hidden relative border-t border-lime-200/20 font-['Raleway']">
      
      {/* 🌟 MAIN FOOTER GRID CONTAINER */}
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16 items-start">
        
        {/* LEFT COLUMN: HERO TEXT & BRAND LOGO FRAME */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-6 text-left">
          <h2 className="footer-reveal text-3xl sm:text-[42px] font-extrabold tracking-tight text-[#0D0D0D] max-w-[590px] leading-[1.15]"
          >
            let's make <span className="text-[#79FF26] hover:scale-[1.02] transition-transform duration-300 cursor-pointer">something <span className="pl-1">amazing</span> </span> together.
          </h2>
          <p className="footer-reveal text-[#959595] text-sm sm:text-base font-normal max-w-md leading-relaxed mt-2">
              Have an idea, a project, or a problem to solve? I'm always open to discussing new opportunities and building meaningful web experiences.
          </p>

          {/* BRAND LOGO WRAPPER LAYER */}
          <Link to="/admin" className="flex items-center gap-3 mt-4 cursor-pointer w-max">
            <img
              src={logoImg} 
              alt="Rahman Logo" 
              className="h-14 w-auto object-contain pointer-events-none"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>

        {/* MIDDLE COLUMN: DYNAMIC INFORMATION HUB LINKS WITH SEAMLESS FLOATING TRACKER */}
        <div className="md:col-span-3 lg:col-span-3 text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0D0D0D] mb-6 tracking-tight">
            Information
          </h3>
          <ul className="flex flex-col gap-2 relative">
            {infoLinks.map((link, idx) => {
              const isHovered = hoveredLink === idx;
              
              return (
                <li 
                  key={idx} 
                  className="relative py-1 w-max"
                  onMouseEnter={() => setHoveredLink(idx)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <a
                    href={link.path}
                    className={`text-base sm:text-lg font-semibold transition-colors duration-300 relative z-10 px-3 py-1 block ${
                      isHovered ? "text-white font-bold" : "text-[#555555]"
                    }`}
                  >
                    {link.name}
                  </a>
                  
                  {/* Premium Ambient Floating Background Capsule */}
                  {isHovered && (
                    <span
                      className="absolute inset-0 bg-[#79FF26] rounded-full z-0"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT COLUMN: VERTICAL SOCIAL SIDEBAR ACTION BLOCKS */}
        <div className="md:col-span-3 lg:col-span-2 flex flex-col items-start md:items-end relative h-full pt-1">
          <div className="flex flex-row md:flex-col items-center gap-6">
            
            {/* Rotated Sidebar Sub-Text Track Layer */}
            <span className="text-[#79FF26] text-xs font-bold uppercase tracking-[0.25em] whitespace-nowrap md:rotate-90 md:mb-7 origin-center md:transform translate-y-2">
               FOLLOW ME ON :
            </span>

            {/* Vertical Segment Border Accent Divider Line */}
            <div className="hidden md:block w-[1px] h-14 bg-gray-300/80 my-4" />

            {/* Social Circle SVG Network Mesh Wrapper */}
            <div className="flex flex-row md:flex-col gap-3 items-center">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#9AF23A] shadow-sm border border-gray-200/60 transition-colors duration-200"
                >
                  {social.id === "tiktok" && <FaTiktok className="w-4 h-4" aria-hidden="true" />}
                  {social.id === "whatsapp" && <FaWhatsapp className="w-4 h-4" aria-hidden="true" />}
                  {social.id === "linkedin" && <FaLinkedinIn className="w-4 h-4" aria-hidden="true" />}
                  {social.id === "github" && <FaGithub className="w-4 h-4" aria-hidden="true" />}
                  {social.id === "facebook" && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  )}
                  {social.id === "legacy-whatsapp" && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-3.859c1.64.973 3.444 1.487 5.297 1.488 5.485 0 9.947-4.444 9.951-9.92 2-2.651-1.03-5.143-2.857-6.973C20.067 2.906 16.224 1.61 12.01 1.61c-5.49 0-9.953 4.447-9.957 9.925-.002 1.944.512 3.839 1.49 5.512l-.991 3.618 3.702-.97a9.907 9.907 0 0 0 5.203 1.446zm11.396-7.66c-.312-.157-1.85-.913-2.135-1.017-.286-.104-.495-.157-.703.157-.208.312-.806.104-.988 1.217-.182.208-.364.234-.676.078-.312-.156-1.318-.486-2.51-1.549-.928-.827-1.554-1.849-1.736-2.162-.182-.312-.02-.481.136-.636.141-.139.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.703-1.693-.963-2.319-.253-.611-.51-.528-.703-.538-.182-.01-.39-.011-.598-.011-.208 0-.546.078-.832.39-.286.312-1.092 1.067-1.092 2.602 0 1.534 1.117 3.017 1.273 3.224.156.208 2.198 3.357 5.327 4.704.744.32 1.325.512 1.777.656.748.237 1.43.204 1.97.123.6-.09 1.85-.756 2.11-1.46.26-.703.26-1.302.182-1.429-.078-.127-.286-.208-.598-.365z"/></svg>
                  )}
                  {social.id === "instagram" && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  )}
                  {social.id === "twitter" && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  )}
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* 📋 SUB-FLOOR COMPONENT DIVIDER */}
      <div className="w-full border-t border-lime-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-medium text-[#555555]">
        <p>
          Copyright© <span className="text-[#79FF26] font-bold">2026</span>. All Rights Reserved
        </p>
        <p>
          Designed By <span className="text-[#79FF26] font-bold">Sanaullah Rahman</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;