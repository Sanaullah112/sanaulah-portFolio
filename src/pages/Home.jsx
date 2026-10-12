import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmoothScrollProvider from "../components/Scroll/SmoothScrollProvider";
import LoadingScreen from "../components/Feedback/LoadingScreen";
import CustomCursor from "../components/Interaction/CustomCursor";

// Components Calling
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Service from "../components/Service";
import Project from "../components/Project";
import Contact from "../components/Contact";
import HireMe from "../components/HireMe";
import PeopleTalk from "../components/PeopleTalk";
import MarqueeTicker from "../components/MarqueeTicker";
import MyLatestWork from "../components/MyLatestWork";
import Footer from "../components/Footer";
import ThemeSwitcher from "../components/ThemeSwitcher";

const WELCOME_MESSAGE =
  "Hi, I'm Sanaullah. Welcome to my portfolio where you can explore my projects, experience, and development journey. Feel free to discover my latest work and see how I turn ideas into modern web applications.";

const Home = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [startTyping, setStartTyping] = useState(false);

  // 1. Mount Check: Setup global fallback interaction listeners to bypass browser auto-speech restrictions
  useEffect(() => {
    const alreadyWelcomed = sessionStorage.getItem("portfolio_welcomed");
    if (alreadyWelcomed) return;

    const initiateSpeechAutomation = () => {
      // Remove triggers immediately to run only once
      ["click", "mousedown", "touchstart", "keydown"].forEach((event) =>
        window.removeEventListener(event, initiateSpeechAutomation)
      );

      setStartTyping(true);
      sessionStorage.setItem("portfolio_welcomed", "true");

      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(WELCOME_MESSAGE);
          utterance.rate = 0.90; // Balanced rhythm match
          utterance.pitch = 1.05;
          utterance.volume = 1;

          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.toLowerCase().includes("google") ||
                v.name.toLowerCase().includes("samantha") ||
                v.name.toLowerCase().includes("natural"))
          );
          if (preferredVoice) utterance.voice = preferredVoice;

          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn("Speech synthesis initialization interrupted:", err);
      }
    };

    // Attach passive fallback triggers across viewport canvas
    ["click", "mousedown", "touchstart", "keydown"].forEach((event) =>
      window.addEventListener(event, initiateSpeechAutomation, { once: true, passive: true })
    );

    return () => {
      ["click", "mousedown", "touchstart", "keydown"].forEach((event) =>
        window.removeEventListener(event, initiateSpeechAutomation)
      );
    };
  }, []);

  // 2. Control overlay viewport display states based on loading screens
  useEffect(() => {
    if (loadingComplete) {
      const alreadyWelcomed = sessionStorage.getItem("portfolio_welcomed");
      if (!alreadyWelcomed) {
        setShowWelcomeModal(true);
      }
    }
  }, [loadingComplete]);

  // 3. Step-by-Step Character Typewriter Logic Array Tracker
  useEffect(() => {
    if (!startTyping) return;

    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + WELCOME_MESSAGE.charAt(index));
      index++;

      if (index >= WELCOME_MESSAGE.length) {
        clearInterval(typingInterval);
        // Fade out overlay window gently following narrative conclusion
        setTimeout(() => {
          setShowWelcomeModal(false);
        }, 4000);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [startTyping]);

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {/* 🎙️ INTERACTIVE CINEMATIC SPEECH WELCOME MODAL */}
      {/* <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 select-none font-['Raleway']"
          >
            <div className="max-w-3xl w-full text-center flex flex-col items-center gap-8">
              
              {!startTyping ? (
                 State A: Ambient Hint (Disappears on first click anywhere)
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="text-white/60 text-lg sm:text-xl font-medium tracking-wider uppercase animate-pulse"
                >
                  Click anywhere to explore portfolio...
                </motion.div>
              ) : (
                State B: Automated Writing / Speaking Canvas Action
                <div className="flex flex-col items-center gap-6">
                  <p 
                    className="text-[#9AF23A] text-xl sm:text-3xl font-bold leading-relaxed tracking-wide text-center"
                    style={{ 
                      textShadow: "0px 4px 12px rgba(154, 242, 58, 0.4), 0px 0px 30px rgba(154, 242, 58, 0.2)" 
                    }}
                  >
                    {displayedText}
                    <span className="inline-block w-1.5 h-6 sm:h-8 bg-[#9AF23A] ml-1 animate-ping" />
                  </p>
                  
                  Quick-Skip Configuration Layer
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    onClick={() => {
                      if(window.speechSynthesis) window.speechSynthesis.cancel();
                      setShowWelcomeModal(false);
                    }}
                    className="text-white/80 text-sm font-semibold tracking-wider uppercase mt-8 border-b border-white/40 pb-0.5 pointer-events-auto"
                  >
                    Skip Welcome
                  </motion.button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* ─── Main Structural Sections ─── */}
      {loadingComplete && (
        <SmoothScrollProvider>
          <CustomCursor />
          <div className="relative min-h-screen selection:bg-white selection:text-black antialiased">
            <Navbar />
            <main
              className="w-full  transition-colors duration-500"
              style={{ background: "var(--pt-bg, #F3F8EF)" }}
            >
              <Hero />
              <Service />
              <About />
              <HireMe />
              <Project />
              <PeopleTalk />
              <MarqueeTicker />
              <MyLatestWork />
              <Contact />
            </main>
            <Footer />
          </div>
        </SmoothScrollProvider>
      )}

      <ThemeSwitcher />
    </>
  );
};

export default Home;