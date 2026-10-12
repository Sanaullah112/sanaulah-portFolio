import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import img from "../assets/sanaullah-logo.png"; // Ensure the logo image is placed in the correct path
import { usePortfolioTheme, THEMES } from "../context/PortfolioThemeContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
// ─── Section id map ───────────────────────────────────────────────────────────
// Each nav label maps to the `id` attribute on the matching section element.
// Make sure your sections have these ids:
//   <section id="home">   <section id="about">  <section id="service">
//   <section id="resume"> <section id="project"> <section id="contact">
const SECTION_IDS = {
  Home: "home",
  Service: "service",
  About: "about",
  Resume: "hire-me",   // HireMe section has id="hire-me"
  Project: "project",
  Contact: "contact",
};

const leftLinks = ["Home","Service", "About"];
const rightLinks = ["Resume", "Project", "Contact"];
const allLinks = [...leftLinks, ...rightLinks];

// ─── Smooth scroll helper ─────────────────────────────────────────────────────
const scrollToSection = (label) => {
  const id = SECTION_IDS[label];
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = 88; // fixed navbar height offset
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: "smooth" });
};

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const containerRef = useRef(null);

  const { themeId, switchTheme } = usePortfolioTheme();


  useGSAP(() => {
    gsap.from(".navbar1", {
      opacity: 0,
      delay: 0.2,
      duration: 3,
      x: -1200,
      stagger: 0.3,
    });
  }, { scope: containerRef });

   useGSAP(() => {
    gsap.from(".navbar2", {
      opacity: 0,
      delay: 0.2,
      duration: 3,
      x: 1200,
      stagger: 0.3,
    });
  }, { scope: containerRef });

  useGSAP(() => {
    gsap.from(".navbar", {
      opacity: 0,
      delay: 0.2,
      duration: 3,
      y: -400,
    });
  }, { scope: containerRef });

  // ── Shrink navbar on scroll ─────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Track active section via IntersectionObserver ───────────────────────
  useEffect(() => {
    const observers = [];
    allLinks.forEach((label) => {
      const id = SECTION_IDS[label];
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveTab(label);
        },
        { threshold: 0.35, rootMargin: "-80px 0px -20% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Handle nav link click ───────────────────────────────────────────────
  const handleNav = useCallback((label) => {
    setActiveTab(label);
    setIsMobileOpen(false);
    scrollToSection(label);
  }, []);

  // ─── Nav link button ──────────────────────────────────────────────────────
  const NavLink = ({ label }) => {
    const isActive = activeTab === label;
    return (
      <button
        key={label}
        onClick={() => handleNav(label)}
        className={`relative px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? "text-white font-bold" : "text-white/85 hover:text-white"
          }`}
      >
        {isActive && (
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--pt-accent, #79FF26)" }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </button>
    );
  };

  // ─── Theme colour swatch preview ─────────────────────────────────────────
  const ThemeSwatches = () => (
    <div className="flex gap-1 items-center">
      {Object.values(THEMES).map((t) => (
        <button
          key={t.id}
          onClick={() => switchTheme(t.id)}
          title={t.name}
          className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 ${themeId === t.id ? "border-white scale-125" : "border-white/30"
            }`}
          style={{ background: t.vars["--pt-accent"] }}
        />
      ))}
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <header
    ref={containerRef}
    
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "top-2" : "top-6"
        } px-4 sm:px-6 md:px-8`}
    >
      <div className="max-w-6xl mx-auto flex justify-center">
        <nav
          className={`w-full md:w-auto md:min-w-[700px] lg:min-w-[1040px] bg-[#0D0D0D] rounded-full flex items-center justify-between md:justify-center relative shadow-xl border border-white/5 transition-all duration-300 ${scrolled ? "p-1.5" : "p-2"
            }`}
          style={{
            boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          {/* ── MOBILE: active label ────────────────────────────────── */}
          <div className="navbar flex md:hidden items-center pl-4" >
            <span
              className="text-sm font-semibold tracking-wide uppercase"
              style={{ color: "var(--pt-accent, #79FF26)" }}
            >
              {activeTab}
            </span>
          </div>

          {/* ── DESKTOP: left links ─────────────────────────────────── */}
          <div className=" navbar1 hidden md:flex items-center gap-4 lg:gap-16 flex-1 justify-start">
            {leftLinks.map((link) => (
              <NavLink key={link} label={link} />
            ))}
          </div>

          {/* ── CENTER LOGO ─────────────────────────────────────────── */}
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 md:px-8 z-10 hover:opacity-80 transition-opacity shrink-0"
          >
            <img
              src={img}
              alt="Logo"
              className={`object-contain transition-all duration-300 ${scrolled ? "h-10" : "h-12"
                }`}
            />
          </Link>

          {/* ── DESKTOP: right links ─────────────────────────────────── */}
          <div className=" navbar2 hidden md:flex items-center gap-4 lg:gap-16 flex-1 justify-end">
            {rightLinks.map((link) => (
              <NavLink key={link} label={link} />
            ))}
          </div>

          {/* ── MOBILE: hamburger + theme swatch ────────────────────── */}
          <div className=" navbar flex md:hidden items-center gap-3 pr-3">
            {/* <ThemeSwatches /> */}

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-white hover:text-[#79FF26] transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>

          {/* ── MOBILE drawer ────────────────────────────────────────── */}
            {isMobileOpen && (
              <div
                className="absolute top-full left-0 w-full mt-3 bg-[#0D0D0D] rounded-2xl p-3 flex flex-col gap-1 shadow-2xl border border-white/5 md:hidden"
              >
                {allLinks.map((link) => {
                  const isActive = activeTab === link;
                  return (
                    <button
                      key={link}
                      onClick={() => handleNav(link)}
                      className="w-full text-left px-5 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: isActive ? "var(--pt-accent, #79FF26)" : "transparent hover:bg-gray-300 hover:rounded-2xl",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {link}
                    </button>
                  );
                })}
              </div>
            )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;