import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { ENDPOINTS } from "../config/endpoints";
import img from "../assets/sanaullah.png";
import img1 from "../assets/Group.png";
import micLogo from "../assets/Microphone.png";
import { GoArrowUpRight } from "react-icons/go";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

// ─── Voice intro ──────────────────────────────────────────────────────────────
const INTRO_TEXT =
  "Hi, I'm Sanaullah, a passionate Full Stack MERN Developer based in Peshawar, Pakistan. " +
  "I specialize in building modern, responsive, and scalable web applications using MongoDB, " +
  "Express.js, React.js, Node.js, JavaScript, Tailwind CSS, HTML, CSS, and REST APIs. " +
  "Currently I'm working on developing full-stack web applications while continuously " +
  "improving my skills and exploring new technologies. I'm passionate about creating clean, " +
  "user-friendly, and high-performance digital experiences that solve real-world problems.";

const speakIntro = (onStart, onEnd) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(INTRO_TEXT);
  u.rate = 0.92;
  u.pitch = 1.05;
  u.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Google UK English Female",
    "Google US English",
    "Samantha",
    "Daniel",
    "Karen",
    "Google UK English Male",
  ];
  const bestVoice =
    preferred.reduce((found, name) => {
      if (found) return found;
      return voices.find((v) => v.name === name) || null;
    }, null) ||
    voices.find((v) => v.lang === "en-GB") ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang?.startsWith("en"));

  if (bestVoice) u.voice = bestVoice;

  u.onstart = onStart;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
};

// ─── Hire Me Modal ────────────────────────────────────────────────────────────
const HireModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | sending | ok | err

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await api.post(ENDPOINTS.contact.submit, {
        fullName: form.name,
        yourEmail: form.email,
        message: `[HIRE REQUEST]\n${form.message}`,
        phoneNumber: "",
        budget: "",
      });
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#79FF26] to-[#55D900] px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-extrabold text-xl">Hire Me</h3>
            <p className="text-white/75 text-sm mt-0.5">
              Send me a quick message
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Success state */}
        {status === "ok" ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-bold text-[#0D0D0D] text-lg">Message Sent!</p>
            <p className="text-[#959595] text-sm">
              I'll get back to you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-8 py-2.5 bg-[#79FF26] text-white font-bold rounded-full text-sm hover:bg-[#62D91C] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={onSubmit} className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#0D0D0D] uppercase tracking-wide">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#79FF26] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#0D0D0D] uppercase tracking-wide">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@mail.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#79FF26] transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#0D0D0D] uppercase tracking-wide">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={4}
                placeholder="Tell me about your project..."
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#79FF26] transition-colors resize-none"
              />
            </div>

            {/* Quick contact alternatives */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <a
                href={`https://wa.me/923099369195?text=${encodeURIComponent(
                  "👋 Hi Sanaullah! I found your portfolio and would love to discuss a project with you. 🚀\n\n" +
                  "💼 I’m looking for a skilled MERN stack developer to help bring my idea to life. " +
                  "Could we talk about the project scope, timeline, and next steps? 🤝\n\n" +
                  "📩 Please let me know when you’re available. Thank you!"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#25D366] font-semibold hover:underline"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.123 1.528 5.855L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.374l-.36-.214-3.732.887.944-3.634-.235-.374A9.818 9.818 0 1112 21.818z" />
                </svg>
                WhatsApp
              </a>
              <span className="text-gray-300 text-xs">|</span>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sanaarman033@gmail.com&su=Contact%20Request"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#79FF26] font-semibold hover:underline"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Direct Email
              </a>
            </div>

            {status === "err" && (
              <p className="text-red-500 text-xs">
                Failed to send. Try WhatsApp or email directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-gradient-to-r from-[#79FF26] to-[#55D900] text-white font-bold py-3 rounded-xl text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Hire Request →"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Hero = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [isHireHover, setIsHireHover] = useState(false);

  // Dynamic Typewriter Core Configuration Layers
  const skillsList = [
    "React JS",
    "REST APIs",
    "TailwindCss",
    "Vercel",
    "JavaScript",
    "Node JS",
    "Express JS",
    "MongoDB",
    "GitHub",
    "AI-Assisted Dev",
  ];
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentFullText = skillsList[currentSkillIdx];

    if (!isDeleting) {
      // Typing phase execution
      if (displayedText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayedText(
            currentFullText.substring(0, displayedText.length + 1),
          );
        }, 80);
      } else {
        // Pause at completion before deletion starts
        timer = setTimeout(() => setIsDeleting(true), 1600);
      }
    } else {
      // Deleting phase execution
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(
            currentFullText.substring(0, displayedText.length - 1),
          );
        }, 40);
      } else {
        setIsDeleting(false);
        setCurrentSkillIdx((prev) => (prev + 1) % skillsList.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentSkillIdx]);

  // Clean up speech on unmount
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const handleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const doSpeak = () =>
      speakIntro(
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
      );
    window.speechSynthesis.getVoices().length > 0
      ? doSpeak()
      : window.speechSynthesis.addEventListener("voiceschanged", doSpeak, {
          once: true,
        });
  };

  const containerRef = useRef(null);
  const portraitFloatRef = useRef(null); // continuous idle bob — separate node from Framer's entrance wrapper
  const glowRef = useRef(null); // pulsing glow blob behind the portrait
  const actionBarRef = useRef(null); // GitHub / Hire Me pill — hosts the magnetic hover
  const githubBtnRef = useRef(null);
  const hireBtnRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*  Entrance timeline + idle loops                                     */
  /*  Only targets elements Framer Motion isn't already animating, so    */
  /*  the two libraries never fight over the same transform/opacity.     */
  /* ------------------------------------------------------------------ */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-eyebrow-icon", {
      opacity: 0,
      scale: 0,
      rotate: -90,
      duration: 0.5,
    })
      .from(
        ".hero-star",
        {
          opacity: 0,
          scale: 0,
          rotate: -180,
          stagger: 0.08,
          duration: 0.5,
          ease: "back.out(2.5)",
        },
        "-=0.2",
      )
      .from(
        ".customer-avatar",
        {
          opacity: 0,
          x: -16,
          stagger: 0.08,
          duration: 0.4,
        },
        "-=0.3",
      )
      .from(
        ".action-bar",
        {
          opacity: 0,
          y: 24,
          duration: 0.6,
        },
        "-=0.4",
      );


  //       useGSAP(() => {
  //   gsap.from(".herologo", {
  //     opacity: 0,
  //     delay: 0.2,
  //     duration: 2,
  //     y: -500,
  //   });
  // }, { scope: containerRef });
    
    if (portraitFloatRef.current) {
      gsap.to(portraitFloatRef.current, {
        y: -14,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  

    // Soft breathing glow behind the portrait for extra depth
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.7,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, { scope: containerRef });

  /* ------------------------------------------------------------------ */
  /*  Magnetic hover for the GitHub / Hire Me pill                       */
  /*  Event-driven, so it lives outside useGSAP and uses quickTo for      */
  /*  cheap, interruptible tweens on every mousemove.                    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const bar = actionBarRef.current;
    const github = githubBtnRef.current;
    const hire = hireBtnRef.current;
    if (!bar || !github || !hire) return;

    const setGithubX = gsap.quickTo(github, "x", { duration: 0.4, ease: "power3.out" });
    const setGithubY = gsap.quickTo(github, "y", { duration: 0.4, ease: "power3.out" });
    const setHireX = gsap.quickTo(hire, "x", { duration: 0.4, ease: "power3.out" });
    const setHireY = gsap.quickTo(hire, "y", { duration: 0.4, ease: "power3.out" });
    const setGithubScale = gsap.quickTo(github, "scale", { duration: 0.3, ease: "power3.out" });
    const setHireScale = gsap.quickTo(hire, "scale", { duration: 0.3, ease: "power3.out" });

    const handleMove = (e) => {
      const rect = bar.getBoundingClientRect();
      const px = e.clientX - rect.left - rect.width / 2;
      const py = e.clientY - rect.top - rect.height / 2;

      setGithubX(px * 0.08);
      setGithubY(py * 0.15);
      setHireX(px * 0.08);
      setHireY(py * 0.15);
    };

    const handleEnter = () => {
      setGithubScale(1.05);
      setHireScale(1.05);
    };

    const handleLeave = () => {
      setGithubX(0);
      setGithubY(0);
      setHireX(0);
      setHireY(0);
      setGithubScale(1);
      setHireScale(1);
    };

    bar.addEventListener("mousemove", handleMove);
    bar.addEventListener("mouseenter", handleEnter);
    bar.addEventListener("mouseleave", handleLeave);
    return () => {
      bar.removeEventListener("mousemove", handleMove);
      bar.removeEventListener("mouseenter", handleEnter);
      bar.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <section
      ref={containerRef}
        id="home"
        style={{ backgroundColor: "var(--pt-bg, #F3F8EF)" }}
        className="relative min-h-screen w-full pt-6 md:pt-28 pb-16 px-4 md:px-8 overflow-hidden transition-colors duration-500 flex items-center justify-center select-none bg-white"
      >
        {/* PIXEL-PERFECT COMPACT GRID CONTEXT */}
        <div className="max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between relative gap-8 lg:gap-4">
          {/* LEFT BLOCK */}
          <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-end text-center lg:text-right z-20">
            <div className="w-full flex flex-col items-center lg:items-end text-center lg:text-right z-20 lg:-mr-20 xl:-mr-24 md:mt-6 lg:-translate-y-8 transition-all">
              <div className=" hidden md:flex relative md:pb-28 absolute lg:left-5">
                <span className="hero-eyebrow-icon absolute -top-5 left-5 text-[#79FF26] size-8 animate-pulse">
                  <img src={img1} alt="Icon" />
                </span>
                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ color: "var(--pt-text-primary, #0D0D0D)" }}
                  className="text-4xl sm:text-6xl xl:text-[115px] font-bold tracking-tight leading-none"
                >
                  HELLO
                </motion.h1>
              </div>

              {/* INTERACTIVE SKILLS DISPLAY BADGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className=" hidden md:flex mt-4 bg-[#79FF26] text-white text-sm sm:text-base lg:text-[26px] font-black px-6 py-3 rounded-full shadow-lg uppercase tracking-wider z-30 lg:-mr-6 lg:translate-y-2  items-center gap-1.5 min-w-[240px] justify-center lg:justify-end border border-white/10"
              >
                <span className="opacity-80 font-medium tracking-normal capitalize">
                  EXPERT IN
                </span>
                <span className="inline-flex items-center text-white drop-shadow-sm font-bold  transition-all">
                  {displayedText}
                  <span className="w-[2px] h-[1em] bg-white ml-1 animate-[ping_0.8s_infinite] will-change-opacity" />
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className=" hidden md:flex flex-col mt-16 max-w-[330px] h-[113px] bg-[#B8FF78] rounded-[4px] py-4 px-8 shadow-sm text-center items-center transition-all mx-auto"
            >
              <p className="text-[#000000] text-[20px] mb-2">
                Real Customer
              </p>
              <div className="flex items-center justify-center -space-x-1.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                ].map((src, idx) => (
                  <div
                    key={idx}
                    className="customer-avatar w-10 h-10 rounded-full border border-[#D9FFB8] overflow-hidden"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="customer profile"
                    />
                  </div>
                ))}
                <div className="customer-avatar w-10 h-10 rounded-full bg-[#79FF26] flex items-center justify-center text-[14px] text-white font-bold pl-0.5">
                  2k
                </div>
              </div>
            </motion.div>
          </div>

          {/* CENTER PORTRAIT */}
          <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] flex flex-col items-center justify-center relative z-10 my-6 lg:my-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full aspect-[4/5]"
            >
              {/* Breathing glow — sits behind everything, GSAP-driven pulse */}
              <div
                ref={glowRef}
                className="absolute inset-0 -z-10 rounded-full blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(121,255,38,0.35), transparent 70%)",
                  opacity: 0.4,
                }}
              />

              {/* Idle-float wrapper — separate node from the entrance <motion.div>
                  above, so GSAP's infinite y-bob never competes with Framer's
                  one-time mount transform on the parent. */}
              <div ref={portraitFloatRef} className="relative w-full h-full will-change-transform">
                <img
                  src={img}
                  alt="Sanaullah Portrait"
                  className=" herologo w-full h-full object-contain drop-shadow-2xl z-10 pointer-events-none"
                />

                {/* ROTATING BADGE */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 z-20 flex items-center justify-center"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      />
                    </defs>
                    <text className="text-[10px] font-bold uppercase tracking-[2px] fill-black dark:fill-white cursor-pointer">
                      <textPath href="#circlePath">
                        My Introduction • Listen •
                      </textPath>
                    </text>
                  </svg>

                  {/* MIC BUTTON */}
                  <motion.button
                    onClick={handleVoice}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    animate={
                      isSpeaking
                        ? {
                            scale: [1, 1.2, 1],
                            boxShadow: [
                              "0 0 0px rgba(121,255,38,0.5)",
                              "0 0 18px rgba(121,255,38,0.8)",
                              "0 0 0px rgba(121,255,38,0.5)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      isSpeaking ? { repeat: Infinity, duration: 1.1 } : {}
                    }
                    className="absolute w-8 h-8 bg-[#79FF26] rounded-full flex items-center justify-center shadow-md"
                    title={
                      isSpeaking ? "Stop speaking" : "Listen to my introduction"
                    }
                  >
                    {isSpeaking ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <img
                        src={micLogo}
                        alt="Microphone"
                        className="w-5 h-5 object-contain"
                      />
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* ACTION BUTTON BAR — magnetic hover driven entirely by GSAP */}
            <div
              ref={actionBarRef}
              className="action-bar mt-12 bg-[#D9FFB8] border-2 border-[#55D900] rounded-[50px] flex items-center gap-2 w-[315px] md:w-[367px] h-[76px] md:h-[82px] z-30 overflow-hidden p-[10px]"
            >
              <a
                ref={githubBtnRef}
                href="https://github.com/Sanaullah112"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                          will-change-transform
                          flex-1 h-full flex items-center justify-center gap-1
                          text-2xl rounded-[50px]
                          transition-colors duration-300 ease-in-out
                          ${
                            isHireHover
                              ? "bg-transparent text-white px-8 py-2 -ml-4"
                              : "bg-[#9AF23A] text-white px-8 py-2"
                          }
                        `}
              >
                <span>GitHub</span>
                <span className="transition-opacity duration-300">
                  {isHireHover ? "" : <GoArrowUpRight size={35} />}
                </span>
              </a>

              <button
                ref={hireBtnRef}
                onClick={() => setHireOpen(true)}
                onMouseEnter={() => setIsHireHover(true)}
                onMouseLeave={() => setIsHireHover(false)}
                className={`
                          will-change-transform
                          relative overflow-hidden flex-1 h-full gap-1
                          flex items-center justify-center
                          text-2xl rounded-[50px]
                          transition-colors duration-300 ease-in-out
                          ${
                            isHireHover
                              ? "bg-[#9AF23A] text-[#1B1F26B8] px-8 py-2 font-semibold text-2xl"
                              : "bg-transparent text-[#1B1F26B8] px-8 py-2"
                          }
                        `}
              >
                {/* Shine Effect */}
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  animate={{ x: ["-150%", "250%"] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,.45) 50%, transparent 70%)",
                  }}
                />

                <span className="flex items-center justify-center relative whitespace-nowrap">
                  Hire Me
                  <span className="transition-opacity duration-300">
                    {isHireHover ? (
                      <span className=" text-white">
                        <GoArrowUpRight size={35} />
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT BLOCK */}
          <div className="w-full lg:w-[32%] flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10">
              <div className="flex sm:hidden relative mt-8 mb-4 items-center justify-center">
                <span className="hero-eyebrow-icon absolute -top-5 left-1 md:-top-5 md:-left-2 text-[#79FF26] size-6 sm:size-7 md:size-8 animate-pulse">
                  <img src={img1} alt="Icon" />
                </span>
                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ color: "var(--pt-text-primary, #0D0D0D)" }}
                  className="text-6xl sm:text-8xl xl:text-[115px] font-bold tracking-tight leading-none"
                >
                  HELLO
                </motion.h1>
              </div>

              <div className="sm:mb-2 lg:mb-44 flex flex-col items-center lg:items-start lg:-ml-[106px]">
                <span className="text-[#79FF26] text-[35px] font-bold uppercase tracking-widest block lg:-pl-10 md:pb-24 lg:-ml-20">
                  I'M
                </span>
                <motion.a
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ color: "var(--pt-text-primary, #0D0D0D)" }}
                  className="text-2xl sm:text-3xl md:text-[32px] md:ml-6 font-bold pb-2 underline underline-offset-1 border-[#0D0D0D] dark:border-[#F3F8EF] uppercase whitespace-nowrap tracking-tight"
                >
                  SANA ULLAH
                </motion.a>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex sm:hidden mt-6 bg-[#79FF26] text-white text-sm sm:text-base font-black px-6 py-3 rounded-full shadow-lg uppercase tracking-wider z-30 items-center gap-1.5 min-w-[240px] justify-center border border-white/10"
                >
                  <span className="opacity-80 font-medium tracking-normal capitalize">
                    EXPERT IN
                  </span>
                  <span className="inline-flex items-center text-white drop-shadow-sm font-bold  transition-all">
                    {displayedText}
                    <span className="w-[2px] h-[1em] bg-white ml-1 animate-[ping_0.8s_infinite] will-change-opacity" />
                  </span>
                </motion.div>
              </div>
            </div>

           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className=" flex md:hidden flex-col mt-16 max-w-[330px] h-[113px] bg-[#B8FF78] rounded-[4px] py-4 px-8 shadow-sm text-center items-center transition-all mx-auto"
            >
              <p className="text-[#000000] text-[20px] mb-2">
                Real Customer
              </p>
              <div className="flex items-center justify-center -space-x-1.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                ].map((src, idx) => (
                  <div
                    key={idx}
                    className="customer-avatar w-10 h-10 rounded-full border border-[#D9FFB8] overflow-hidden"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="customer profile"
                    />
                  </div>
                ))}
                <div className="customer-avatar w-10 h-10 rounded-full bg-[#79FF26] flex items-center justify-center text-[14px] text-white font-bold pl-0.5">
                  2k
                </div>
              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-14 sm:mt-12 md:mt-8 md:ml-24 flex flex-col items-center lg:items-start"
            >
              <div className="flex items-center gap-1 text-[#f26b17ec] mb-2 md:ml-4 text-2xl lg:text-4xl xl:text-7xl font-extrabold tracking-tight">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className="hero-star text-[32px] font-black">
                    ★
                  </span>
                ))}
              </div>
              <h3
                style={{ color: "var(--pt-text-primary, #0D0D0D)" }}
                className="text-[40px] font-bold tracking-tight leading-none"
              >
                1+ Years
              </h3>
              <p className="text-black text-sm  tracking-wider mt-1 lg:ml-16">
                Experience
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hire Me Modal */}
      <AnimatePresence>
        {hireOpen && <HireModal onClose={() => setHireOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Hero;