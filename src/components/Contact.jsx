import { useState, useRef } from "react";
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

// ─── Initial form state ──────────────────────────────────────────────────────
const INITIAL_FORM = {
  fullName: "",
  yourEmail: "",
  phoneNumber: "",
  budget: "",
  message: "",
};

// ─── Component ───────────────────────────────────────────────────────────────
const Contact = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });
  const formRef = useRef(null);

  // ── Input handler ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.yourEmail.trim()) {
      newErrors.yourEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.yourEmail)) {
      newErrors.yourEmail = "Enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, success: null, error: null });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      speak("Please fill in the required fields.");
      return;
    }

    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/contact`,
        formData
      );

      if (response.data.success) {
        setStatus({
          loading: false,
          success: "Your message has been sent successfully! I will get back to you soon.",
          error: null,
        });
        setFormData(INITIAL_FORM);
        setErrors({});

        setTimeout(() => {
          speak(
            "Thank you! Your message has been sent successfully. I will get back to you as soon as possible."
          );
        }, 300);
      }
    } catch (err) {
      console.error("Contact form error:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to send message. Please try again.";
      setStatus({ loading: false, success: null, error: msg });
      speak("Something went wrong. Please try again.");
    }
  };

  // Framer Motion Layout Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  // ── Field class helper (Includes custom focus background & glow animations) ──
  const inputClass = (field) =>
    `w-full text-[#0D0D0D] font-medium placeholder-gray-400 rounded-xl px-5 py-4 border outline-none transition-all duration-300 ease-out ${
      errors[field]
        ? "bg-white border-red-400 focus:bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100 shadow-[0_4px_12px_rgba(239,68,68,0.05)]"
        : "bg-white border-transparent hover:border-gray-200 focus:bg-[#9AF23A]/[0.03] focus:border-[#9AF23A] focus:ring-4 focus:ring-[#9AF23A]/15 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.03)] focus:shadow-[0_12px_24px_-6px_rgba(154,242,58,0.15)]"
    }`;

  return (
    <section
      id="contact"
      className="w-full bg-[#F3F8EF] py-24 px-4 sm:px-6 md:px-8 xl:px-16 select-none overflow-hidden"
    >
      <motion.div 
        className="max-w-[1320px] mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div className="max-w-2xl mx-auto mb-20" variants={itemVariants}>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0D0D0D] mb-4">
            Let's Discuss{" "}
            <span className="text-[#9AF23A] drop-shadow-sm">Your Project</span>
          </h2>
          <p className="text-[#959595] text-sm sm:text-base font-normal leading-relaxed">
            Have a project in mind? Fill in the form below and I will get back to
            you within 24 hours.
          </p>
        </motion.div>

        {/* ── Grid Layout ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start text-left">

          {/* LEFT: Contact Informational Cards */}
          <motion.div className="lg:col-span-4 flex flex-col gap-6 w-full" variants={itemVariants}>

            {/* WhatsApp */}
            <motion.a
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0px 20px 30px -10px rgba(154,242,58,0.15)" }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/923099369195"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white rounded-xl p-5 flex items-center gap-5 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04)] border border-gray-100/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#9AF23A] rounded-xl flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(154,242,58,0.3)] group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.123 1.528 5.855L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.374l-.36-.214-3.732.887.944-3.634-.235-.374A9.818 9.818 0 1112 21.818z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[#9AF23A] text-xs font-bold uppercase tracking-wider">
                  Call Me
                </span>
                <span className="text-[#0D0D0D] font-extrabold text-base mt-0.5 group-hover:text-[#9AF23A] transition-colors duration-200">
                  +92 320 9150 3567
                </span>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0px 20px 30px -10px rgba(154,242,58,0.15)" }}
              whileTap={{ scale: 0.98 }}
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sanaarman033@gmail.com&su=Contact%20Request"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white rounded-xl p-5 flex items-center gap-5 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04)] border border-gray-100/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#9AF23A] rounded-xl flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(154,242,58,0.3)] group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[#9AF23A] text-xs font-bold uppercase tracking-wider">
                  Email Me
                </span>
                <span className="text-[#0D0D0D] font-extrabold text-base mt-0.5 break-all group-hover:text-[#9AF23A] transition-colors duration-200">
                  sanaarman033@gmail.com
                </span>
              </div>
            </motion.a>

            {/* Address */}
            <motion.a
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0px 20px 30px -10px rgba(154,242,58,0.15)" }}
              whileTap={{ scale: 0.98 }}
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white rounded-xl p-5 flex items-center gap-5 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04)] border border-gray-100/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#9AF23A] rounded-xl flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(154,242,58,0.3)] group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[#9AF23A] text-xs font-bold uppercase tracking-wider">
                  Address
                </span>
                <span className="text-[#0D0D0D] font-extrabold text-base mt-0.5 group-hover:text-[#9AF23A] transition-colors duration-200">
                  Barkly, Saidu Sharif, Swat
                </span>
              </div>
            </motion.a>

          </motion.div>

          {/* RIGHT: Contact Form Layout (Upgraded with animated container hover wrapper) */}
          <motion.div 
            className="lg:col-span-8 w-full rounded-2xl border border-gray-200/30 transition-all duration-500 ease-out"
            whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(13,13,13,0.04)" }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="w-full flex flex-col gap-5"
            >
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5" variants={itemVariants}>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass("fullName")}
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs pl-1 font-semibold mt-1">{errors.fullName}</motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="email"
                    name="yourEmail"
                    placeholder="Your Email *"
                    value={formData.yourEmail}
                    onChange={handleChange}
                    className={inputClass("yourEmail")}
                  />
                  <AnimatePresence>
                    {errors.yourEmail && (
                      <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs pl-1 font-semibold mt-1">{errors.yourEmail}</motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5" variants={itemVariants}>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputClass("phoneNumber")}
                />
                <input
                  type="text"
                  name="budget"
                  placeholder="Budget (e.g. $500)"
                  value={formData.budget}
                  onChange={handleChange}
                  className={inputClass("budget")}
                />
              </motion.div>

              <motion.div className="flex flex-col gap-1" variants={itemVariants}>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Message... *"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass("message")} resize-none`}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs pl-1 font-semibold mt-1">{errors.message}</motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Action Block */}
              <motion.div className="w-full flex flex-col items-center justify-center mt-2 gap-4" variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={status.loading}
                  whileHover={{ scale: status.loading ? 1 : 1.04, boxShadow: "0px 10px 25px rgba(154, 242, 58, 0.4)" }}
                  whileTap={{ scale: status.loading ? 1 : 0.96 }}
                  className="relative whitespace-nowrap bg-[#9AF23A] text-white font-bold px-14 py-4 rounded-full text-base tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-[0_4px_15px_rgba(154,242,58,0.25)]"
                >
                  {status.loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending Portfolio Form...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>

                {/* Status alerts */}
                <AnimatePresence mode="wait">
                  {status.success && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm px-6 py-3.5 rounded-xl mt-2 shadow-sm"
                    >
                      <svg className="w-5 h-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {status.success}
                    </motion.div>
                  )}
                  {status.error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 font-semibold text-sm px-6 py-3.5 rounded-xl mt-2 shadow-sm"
                    >
                      <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {status.error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default Contact;