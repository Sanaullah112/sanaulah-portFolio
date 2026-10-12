import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { BASE_URL } from "../config/endpoints";

// Staggered Container Variants for entry orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

/* ------------------------------------------------------------------ */
/*  Small inline icons (no extra icon package needed)                  */
/* ------------------------------------------------------------------ */
const ExternalLinkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Archive Project Card                                               */
/*  - GSAP drives the "scroll to reveal full screenshot" hover effect  */
/*  - GSAP quickTo drives a subtle cursor-follow tilt/parallax          */
/*  - Same info density as the homepage Projects.jsx cards              */
/* ------------------------------------------------------------------ */
const ArchiveProjectCard = ({ project, onViewDetails }) => {
  const cardRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);
  const scrollTweenRef = useRef(null);
  const quickRotateX = useRef(null);
  const quickRotateY = useRef(null);
  const quickShadowX = useRef(null);
  const quickShadowY = useRef(null);

  const hasGithub = Boolean(project.githubUrl);
  const hasLive = Boolean(project.liveUrl);
  const isFeatured = Boolean(project.featured);
  const techList = Array.isArray(project.technologies) ? project.technologies : [];

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    quickRotateX.current = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
    quickRotateY.current = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });
    quickShadowX.current = gsap.quickTo(card, "--shadow-x", { duration: 0.5, ease: "power3.out" });
    quickShadowY.current = gsap.quickTo(card, "--shadow-y", { duration: 0.5, ease: "power3.out" });

    // No transformStyle: "preserve-3d" here — combined with a transform
    // on the image wrapper it breaks that wrapper's overflow: hidden
    // clipping in some browsers, which is what silently killed the
    // scroll-reveal effect before. Flat plane + perspective only.
    gsap.set(card, { transformPerspective: 900 });
  }, []);

  const handleCardMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;

    quickRotateX.current && quickRotateX.current(rotateX);
    quickRotateY.current && quickRotateY.current(rotateY);
    quickShadowX.current && quickShadowX.current((px - 0.5) * 40);
    quickShadowY.current && quickShadowY.current((py - 0.5) * 40 + 20);
  };

  const handleCardMouseLeave = () => {
    quickRotateX.current && quickRotateX.current(0);
    quickRotateY.current && quickRotateY.current(0);
    quickShadowX.current && quickShadowX.current(0);
    quickShadowY.current && quickShadowY.current(20);
  };

  const handleImageMouseEnter = () => {
    const wrap = imgWrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const overflow = img.scrollHeight - wrap.clientHeight;
    if (overflow <= 0) return;

    if (scrollTweenRef.current) scrollTweenRef.current.kill();

    scrollTweenRef.current = gsap.to(img, {
      y: -overflow,
      duration: Math.min(Math.max(overflow / 55, 1.4), 4.5),
      ease: "power1.inOut",
      delay: 0.15,
    });
  };

  const handleImageMouseLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    if (scrollTweenRef.current) scrollTweenRef.current.kill();

    scrollTweenRef.current = gsap.to(img, {
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const stop = (e) => e.stopPropagation();

  return (
    <motion.div
      layout
      variants={cardVariants}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      className="relative flex flex-col group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300"
      style={{
        boxShadow: "var(--shadow-x, 0px) var(--shadow-y, 20px) 40px -12px rgba(13,13,13,0.18)",
      }}
    >
      {/* IMAGE */}
      <div
        ref={imgWrapRef}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
        onClick={() => hasLive && window.open(project.liveUrl, "_blank", "noopener,noreferrer")}
        className="w-full aspect-[4/4.2] rounded-2xl overflow-hidden bg-[#F3F8EF] relative mb-4 cursor-pointer"
      >
        {isFeatured ? (
          <span className="absolute top-3 left-3 z-10 bg-[#0D0D0D] text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-md">
            Featured
          </span>
        ) : null}

        <img
          ref={imgRef}
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-auto object-cover object-top will-change-transform pointer-events-none"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-[#0D0D0D]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#79FF26] shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300 ease-out">
            <ExternalLinkIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TEXT + META */}
      <div className="text-left px-1 flex flex-col flex-1">
        <span className="text-[#79FF26] text-xs font-bold uppercase tracking-widest block mb-1">
          {project.category}
        </span>

        <h2 className="text-lg sm:text-xl font-black text-[#0D0D0D] leading-snug tracking-tight group-hover:text-[#79FF26] transition-colors duration-150 mb-2">
          {project.name}
        </h2>

        {project.description ? (
          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>
        ) : null}

        {techList.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {techList.map((tech, i) => (
              <span
                key={tech + i}
                className="bg-[#D9FFB8]/50 text-[#0D0D0D]/80 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onViewDetails(project)}
            className="flex-1 bg-[#0D0D0D] text-white font-bold text-sm py-3 rounded-full shadow-md transition-all duration-300"
          >
            View Details
          </motion.button>

          {hasLive ? (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="w-11 h-11 flex-shrink-0 rounded-full border border-[#0D0D0D]/15 flex items-center justify-center text-[#0D0D0D] hover:border-[#79FF26] hover:text-[#79FF26] transition-colors duration-200"
              aria-label="Live URL"
            >
              <ExternalLinkIcon className="w-4 h-4" />
            </motion.a>
          ) : null}

          {hasGithub ? (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="w-11 h-11 flex-shrink-0 rounded-full border border-[#0D0D0D]/15 flex items-center justify-center text-[#0D0D0D] hover:border-[#79FF26] hover:text-[#79FF26] transition-colors duration-200"
              aria-label="GitHub URL"
            >
              <GithubIcon className="w-4 h-4" />
            </motion.a>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Details Modal — image left (auto-scroll on hover via GSAP),        */
/*  full info right                                                    */
/* ------------------------------------------------------------------ */
const ProjectModal = ({ project, onClose }) => {
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!project) return null;

  const hasGithub = Boolean(project.githubUrl);
  const hasLive = Boolean(project.liveUrl);
  const techList = Array.isArray(project.technologies) ? project.technologies : [];

  const handleMouseEnter = () => {
    const wrap = imgWrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const overflow = img.scrollHeight - wrap.clientHeight;
    if (overflow <= 0) return;

    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(img, {
      y: -overflow,
      duration: Math.min(Math.max(overflow / 60, 2), 6),
      ease: "power1.inOut",
      delay: 0.2,
    });
  };

  const handleMouseLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(img, {
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0D0D0D]/60 flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F3F8EF] w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
      >
        {/* IMAGE SIDE */}
        <div
          ref={imgWrapRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-64 md:h-auto md:max-h-[90vh] overflow-hidden bg-white"
        >
          <img
            ref={imgRef}
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-auto object-cover object-top will-change-transform"
          />
        </div>

        {/* DETAILS SIDE */}
        <div className="relative p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#0D0D0D] hover:text-[#79FF26] transition-colors duration-200"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#79FF26] text-xs font-bold uppercase tracking-wider">
              Project Details
            </span>
            {project.featured ? (
              <span className="bg-[#0D0D0D] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                Featured
              </span>
            ) : null}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] leading-tight tracking-tight mb-4 pr-10">
            {project.name}
          </h2>

          <span className="text-[#79FF26] text-xs font-bold uppercase tracking-wide block mb-1">
            {project.category}
          </span>

          {project.description ? (
            <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed mb-6">
              {project.description}
            </p>
          ) : null}

          {techList.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-[#0D0D0D] font-bold text-sm uppercase tracking-wide mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, i) => (
                  <span
                    key={tech + i}
                    className="bg-[#D9FFB8]/50 text-[#0D0D0D]/80 text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {hasLive ? (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0D0D0D] text-white font-bold text-sm px-6 py-3 rounded-full shadow-md"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                Live Demo
              </motion.a>
            ) : null}

            {hasGithub ? (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-[#0D0D0D] font-bold text-sm px-6 py-3 rounded-full shadow-md border border-[#0D0D0D]/10"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </motion.a>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Window scroll management to ensure client views top of subpage context
    window.scrollTo({ top: 0, behavior: "instant" });

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/projects`);
        if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);

        const data = await response.json();
        const cleanArr = Array.isArray(data) ? data : (data.data && Array.isArray(data.data)) ? data.data : [];

        setProjects(cleanArr);

        if (cleanArr.length > 0) {
          const uniqueCats = [...new Set(cleanArr.map(p => p.category).filter(Boolean))];
          setCategories(["All", ...uniqueCats]);
        }
      } catch (err) {
        console.error("Failed to load archive repository grid contents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <main className="w-full min-h-screen bg-[#F3F8EF] py-12 md:py-20 px-4 sm:px-6 md:px-8 xl:px-16 font-['Raleway'] select-none overflow-x-hidden">
      <div className="max-w-[1320px] mx-auto">

        {/* BACK BUTTON & ARCHIVE HEADER */}
        <div className="w-full flex flex-col items-start gap-4 mb-12">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D]/70 hover:text-[#79FF26] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </motion.button>

          <div className="mt-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D0D0D] tracking-tight mb-3">
              Full Project <span className="text-[#79FF26]">Archive</span>
            </h1>
            <p className="text-[#959595] text-base max-w-xl">
              A comprehensive showcase of every responsive system architecture, CMS panel, and user experience built to date.
            </p>
          </div>
        </div>

        {/* FILTER BAR CONTROLS */}
        <div className="w-full flex flex-wrap items-center justify-start gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                activeFilter === cat
                  ? "bg-[#79FF26] text-white shadow-md shadow-[#79FF26]/20"
                  : "bg-[#D9FFB8]/30 text-[#0D0D0D]/80 hover:bg-[#D9FFB8]/60"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* INTERACTIVE STAGGERED GRID CONTAINER */}
        {loading ? (
          <div className="w-full h-80 flex items-center justify-center text-[#79FF26] font-bold text-lg">
            Compiling Project Archive Matrix...
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 items-stretch"
            style={{ perspective: "1200px" }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ArchiveProjectCard
                  key={project._id}
                  project={project}
                  onViewDetails={setSelectedProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject ? (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
};

export default AllProjects;