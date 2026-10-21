import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ─── Voice Feedback ──────────────────────────────────────────────────────────
const speak = (text) => {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const english = voices.find((v) => v.lang?.startsWith("en"));
    if (english) utterance.voice = english;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis unavailable:", err);
  }
};

// ─── Stats cards data ────────────────────────────────────────────────────────
const cardsData = [
  {
    id: 1,
    count: "5+",
    title: "Satisfied Clients",
    alignmentClass: "lg:self-start lg:ml-12",
    bounceDelay: 0,
  },
  {
    id: 2,
    count: "10+",
    title: "Project Complete",
    alignmentClass: "lg:self-end",
    bounceDelay: 0.4,
  },
  {
    id: 3,
    count: "8+",
    title: "Happy Reviews",
    alignmentClass: "lg:self-start lg:ml-12",
    bounceDelay: 0.2,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const HireMe = () => {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  // Resume state
  const [resume, setResume]           = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast]             = useState(null); // { type: 'success'|'error', msg }

  // ── Fetch resume on mount ────────────────────────────────────────────────
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/resume`
        );
        setResume(res.data?.resume || res.data?.data || null);
      } catch {
        // No resume uploaded yet — buttons stay hidden
        setResume(null);
      } finally {
        setResumeLoading(false);
      }
    };
    fetchResume();
  }, []);

  // ── Auto-dismiss toast ───────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ── View (open in new tab) ───────────────────────────────────────────────
  const handleView = () => {
    if (!resume?.fileUrl) return;
    setShowPreview(true);
  };

  // ── Download ─────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!resume?.fileUrl || downloading) return;
    setDownloading(true);

    try {
      const response = await axios.get(resume.fileUrl, {
        responseType: "blob",
      });

      // Create a temporary <a> and trigger download
      const url    = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link   = document.createElement("a");
      link.href    = url;
      link.download = resume.fileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // ✅ Success feedback
      setToast({ type: "success", msg: "Resume downloaded successfully!" });
      setTimeout(() => speak("Resume downloaded successfully!"), 200);

    } catch {
      setToast({ type: "error", msg: "Download failed. Please try again." });
      speak("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="hire-me"
      className="w-full bg-[#F3F8EF] py-20 md:py-24 px-4 sm:px-6 md:px-8 xl:px-16 select-none overflow-hidden font-['Raleway']"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

        {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#79FF26] text-sm md:text-base font-bold tracking-wide mb-3"
          >
            Hire Me
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0D0D0D] mb-8"
          >
            Why <span className="text-[#79FF26]">Hire me</span>?
          </motion.h2>

         <motion.div 
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, delay: 0.2 }}
  className="flex flex-col gap-5 text-[#959595] text-[18px] font-normal font-['Raleway'] leading-[130%] tracking-[0.03em] text-justify max-w-xl"
>
  <p>  
  I’m a passionate MERN Stack Developer who enjoys turning ideas into modern, responsive, and user-friendly web applications. I work with React.js, Node.js, Express.js, and MongoDB to build complete full-stack solutions from frontend interfaces to backend APIs and databases.

     </p>
  <p>
    I focus on writing clean, maintainable, and scalable code while paying close attention to UI/UX and performance. I enjoy solving real-world problems, learning new technologies, and improving my skills by working on practical projects.
  </p>
  <p>
     I’m a dedicated and reliable developer who takes ownership of my work, communicates clearly, and always looks for ways to improve. If you’re looking for someone who is eager to learn, committed to quality, and passionate about building great web experiences, I’d be happy to work with you.
  </p>
        </motion.div>

          {/* ── CTA Buttons ─────────────────────────────────────────── */}
          <a
            href="#contact"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#79FF26] px-7 py-3.5 font-bold text-[#0D0D0D] transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#79FF26]/30"
          >
            Discuss a project
          </a>

          {!resumeLoading && (
            <div className="mt-10 flex flex-wrap items-center gap-4">

              {/* VIEW RESUME — Fixed hover color inversion */}
              {resume && (
                <motion.button
                  onClick={handleView}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    boxShadow: "0px 10px 25px rgba(121, 255, 38, 0.25)",
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 border-2 border-[#79FF26] font-bold text-[20px] letter-spacing-[3%] hover:bg-[#79FF26] hover:text-white text-[#9AF23A] rounded-full bg-transparent shadow-sm relative overflow-hidden group transition-colors duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#79FF26]/10 to-transparent -translate-x-full group-hover:animate-shine" />
                  <span className="relative z-10 flex items-center gap-2">
                    {/* Eye icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Resume
                  </span>
                </motion.button>
              )}

              {/* DOWNLOAD CV — circle icon button, only when resume exists */}
              {resume && (
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  animate={{ y: [-4, 2, -4] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4 }}
                  whileHover={{
                    scale: 1.08,
                    rotate: [0, -10, 10, 0],
                    boxShadow: "0px 10px 25px rgba(121, 255, 38, 0.25)",
                    transition: { duration: 0.4 },
                  }}
                  whileTap={{ scale: 0.93 }}
                  className="w-14 h-14 border-2 border-[#79FF26] rounded-full flex items-center justify-center text-[#9AF23A] bg-transparent hover:bg-[#79FF26] hover:text-white transition-all duration-300 shadow-sm group disabled:opacity-60 disabled:cursor-not-allowed relative"
                  title="Download CV"
                >
                  {downloading ? (
                    /* Spinner while downloading */
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    /* Download arrow */
                    <svg
                      className="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                </motion.button>
              )}

              {/* No resume uploaded yet */}
              {!resume && (
                <p className="text-[#959595] text-sm italic">Resume not available yet.</p>
              )}
            </div>
          )}

          {/* Skeleton placeholder while loading */}
          {resumeLoading && (
            <div className="mt-10 flex items-center gap-4">
              <div className="h-12 w-36 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse" />
            </div>
          )}

          {/* ── Toast notification ───────────────────────────────────── */}
          <AnimatePresence>
            {toast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm w-fit ${
                  toast.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {toast.type === "success" ? (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {toast.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT COLUMN: STAGGERED OSCILLATING CARDS ────────────────── */}
        <div className="lg:col-span-6 flex flex-col gap-12 w-full max-w-md mx-auto lg:max-w-lg">
          {cardsData.map((card, idx) => {
            const isCurrentHovered = hoveredIndex === idx;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: idx * 0.15 },
                  x: { duration: 0.5, delay: idx * 0.15 },
                  y: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    delay: card.bounceDelay,
                  },
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                className={`relative w-full sm:w-[320px] h-[120px] ${card.alignmentClass} flex items-center justify-center cursor-pointer`}
              >
                {/* Shadow backing layer */}
                <div
                  className={`absolute inset-0 translate-x-2 translate-y-2 rounded-xl transition-colors duration-300 opacity-80 z-0 ${
                    isCurrentHovered ? "bg-[#79FF26]" : "bg-[#E2E0DF]"
                  }`}
                />

                {/* Top semi-circle badge */}
                <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 w-14 h-7 overflow-hidden z-20">
                  <motion.div
                    animate={{ y: isCurrentHovered ? -2 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-14 h-14 text-white rounded-full border-2 transition-colors duration-300 flex items-start justify-center pt-1 shadow-sm ${
                      isCurrentHovered
                        ? "bg-[#9AF23A]"
                        : "bg-white border-gray-300/60"
                    }`}
                  >
                    <span
                      className={`text-xs font-black tracking-tighter transition-colors duration-300 ${
                        isCurrentHovered ? "text-white" : "text-[#79FF26]"
                      }`}
                    >
                      {card.count}
                    </span>
                  </motion.div>
                </div>

                {/* Card body */}
                <div
                  className={`absolute inset-0 rounded-xl border border-gray-300/40 flex items-center justify-center p-4 z-10 shadow-md transition-all duration-300 ${
                    isCurrentHovered ? "bg-[#79FF26] border-white" : "bg-white"
                  }`}
                >
                  <motion.h3
                    animate={{ scale: isCurrentHovered ? 1.02 : 1 }}
                    className={`text-2xl sm:text-3xl font-normal tracking-wide italic font-serif transition-colors duration-300 ${
                      isCurrentHovered ? "text-white" : "text-[#79FF26]"
                    }`}
                  >
                    {card.title}
                  </motion.h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Resume Preview Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && resume?.fileUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  {/* PDF icon */}
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 18.5v-1h7v1h-7zm0-3v-1h7v1h-7zm0-3v-1h3v1h-3z"/>
                  </svg>
                  <span className="font-semibold text-[#0D0D0D] text-sm">
                    {resume.fileName || "resume.pdf"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Download from modal */}
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#79FF26] text-white text-sm font-semibold rounded-lg hover:bg-[#62D91C] transition-colors disabled:opacity-60"
                  >
                    {downloading ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    Download
                  </button>
                  {/* Close */}
                  <button
                    onClick={() => setShowPreview(false)}
                    className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PDF iframe */}
              <iframe
                src={resume.fileUrl}
                title="Resume Preview"
                className="flex-1 w-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HireMe;
