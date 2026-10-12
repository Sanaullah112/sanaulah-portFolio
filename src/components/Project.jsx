import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { BASE_URL } from "../config/endpoints";

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
/*  Project Card — owns its own image ref so GSAP can drive the       */
/*  "scroll to reveal full screenshot" hover effect per-card           */
/* ------------------------------------------------------------------ */
const ProjectCard = ({ project, onViewDetails }) => {
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);
  const tweenRef = useRef(null);

  const hasGithub = Boolean(project.githubUrl);
  const hasLive = Boolean(project.liveUrl);
  const isFeatured = Boolean(project.featured);

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
      duration: Math.min(Math.max(overflow / 60, 1.4), 4),
      ease: "power1.inOut",
      delay: 0.15,
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

  const stop = (e) => e.stopPropagation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      whileHover={{ y: -8 }}
      className="flex flex-col group min-h-[450px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[520px] xl:min-h-[540px]"
    >
      {/* IMAGE */}
      <div
        ref={imgWrapRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => hasLive && window.open(project.liveUrl, "_blank", "noopener,noreferrer")}
        className="w-full aspect-[4/4.3] rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 relative mb-4 cursor-pointer"
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
          className="w-full h-auto object-cover object-top pointer-events-none will-change-transform"
        />

        <div className="absolute inset-0 bg-[#0D0D0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl text-[#79FF26] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <ExternalLinkIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TEXT + META */}
      <div className="text-left px-1 flex flex-col flex-1">
        <span className="text-[#79FF26] text-xs font-bold uppercase tracking-wider block mb-1">
          {project.category}
        </span>

        <h3 className="text-lg sm:text-xl font-extrabold text-[#0D0D0D] leading-snug tracking-tight group-hover:text-[#79FF26] transition-colors duration-200 mb-2">
          {project.name && project.name.includes("Page Design") ? (
            <>
              {project.name.replace("Page Design", "")}
              <span className="text-[#79FF26]">Page Design</span>
            </>
          ) : (
            project.name
          )}
        </h3>

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
        className="bg-[#F3F8EF] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-y-auto md:overflow-hidden overscroll-contain"
      >
        {/* IMAGE SIDE */}
        <div
          ref={imgWrapRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-56 sm:h-64 md:h-auto md:max-h-[90vh] overflow-hidden bg-white shrink-0"
        >
          <img
            ref={imgRef}
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-auto object-cover object-top will-change-transform"
          />
        </div>

        {/* DETAILS SIDE */}
        <div className="relative p-5 sm:p-6 md:p-8 md:overflow-y-auto md:max-h-[90vh]">
          <div className="sticky top-0 z-10 flex justify-end -mt-1 -mr-1 mb-1 pointer-events-none">
            <button
              onClick={onClose}
              className="pointer-events-auto w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#0D0D0D] hover:text-[#79FF26] transition-colors duration-200"
              aria-label="Close"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

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

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] leading-tight tracking-tight mb-4">
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

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const MyProject = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(""); // Set once real categories load — no "All" option here
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/projects`);

        if (!response.ok) {
          throw new Error(`API response error status: ${response.status}`);
        }

        const resData = await response.json();

        const projectArray = Array.isArray(resData)
          ? resData
          : (resData.data && Array.isArray(resData.data))
            ? resData.data
            : [];

        setProjects(projectArray);

        if (projectArray.length > 0) {
          const uniqueCategories = [...new Set(projectArray.map(item => item.category).filter(Boolean))];
          // No "All" option here — full listing lives on the /all-projects page
          setCategories(uniqueCategories);
          setActiveFilter((prev) => prev || uniqueCategories[0] || "");
        }
      } catch (error) {
        console.error("Database connection fault or API failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter evaluation logic: always filters down to the active category
  const filteredProjects = projects.filter(item => item.category === activeFilter);

  const handleSeeAllRedirect = () => {
    window.location.href = "/all-projects";
  };

  return (
    <section id="project" className="w-full bg-[#F3F8EF] md:py-16 px-4 sm:px-6 md:px-8 xl:px-16 select-none overflow-hidden font-['Raleway']">
      <div className="max-w-[1320px] mx-auto">

        {/* HEADER SECTION WITH SEE ALL CROSSOVER */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <span className="text-[#79FF26] text-sm md:text-[22px] font-semibold tracking-wide block mb-2">
              My <span className="text-black">Work</span>
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl whitespace-nowrap font-bold tracking-tight text-[#0D0D0D] mb-4">
              Explore My Latest <span className="text-[#79FF26]">Projects</span>
            </h2>
            <p className="text-[#959595] text-sm sm:text-base font-normal leading-relaxed">
                A collection of real-world web applications and full-stack projects built with modern technologies, clean UI/UX, and scalable solutions.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(121, 255, 38, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSeeAllRedirect}
            className="whitespace-nowrap bg-[#79FF26] text-white font-bold px-8 py-3.5 rounded-full text-base shadow-md shadow-[#79FF26]/20 transition-all duration-300 self-start md:self-end"
          >
            See All
          </motion.button>
        </div>

        {/* DYNAMIC CATEGORY PILL FILTER BAR */}
        <div className="w-full flex flex-wrap items-center justify-start gap-3 sm:gap-4 mb-16">
          {categories.map((category) => {
            const isSelected = activeFilter === category;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isSelected
                    ? "bg-[#79FF26] text-white shadow-md shadow-[#79FF26]/20"
                    : "bg-[#D9FFB8]/50 text-[#0D0D0D]/80 hover:bg-[#D9FFB8] hover:text-[#0D0D0D]"
                }`}
              >
                {category}
              </motion.button>
            );
          })}
        </div>

        {/* INTERACTIVE PORTFOLIO PROJECT MESH GRID */}
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center text-[#79FF26] font-bold">
            Database Loading Stack Operational...
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
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
    </section>
  );
};

export default MyProject;