import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioTheme, THEMES } from "../context/PortfolioThemeContext";

const ThemeSwitcher = () => {
  const { themeId, switchTheme } = usePortfolioTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Panel ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel card */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed right-16 bottom-6 z-50 rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: "var(--pt-surface)",
                border: "1px solid var(--pt-border)",
                minWidth: 220,
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center gap-2 border-b"
                style={{ borderColor: "var(--pt-border)" }}
              >
                <svg className="w-4 h-4" style={{ color: "var(--pt-accent)" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--pt-text-primary)" }}
                >
                  Choose Theme
                </span>
              </div>

              {/* Theme list */}
              <div className="p-3 flex flex-col gap-1.5">
                {Object.values(THEMES).map((t) => {
                  const isActive = themeId === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      onClick={() => {
                        switchTheme(t.id);
                        setOpen(false);
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-left transition-colors"
                      style={{
                        background: isActive ? "var(--pt-accent-soft)" : "transparent",
                        border: isActive
                          ? `1.5px solid var(--pt-accent)`
                          : "1.5px solid transparent",
                      }}
                    >
                      {/* Swatch dot */}
                      <span
                        className="w-5 h-5 rounded-full shrink-0 ring-2 ring-offset-1"
                        style={{
                          background: t.vars["--pt-accent"],
                          ringColor: isActive ? t.vars["--pt-accent"] : "transparent",
                          boxShadow: isActive
                            ? `0 0 0 2px ${t.vars["--pt-accent"]}`
                            : "none",
                        }}
                      />
                      <span className="text-2xl leading-none">{t.emoji}</span>
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: isActive
                            ? "var(--pt-accent)"
                            : "var(--pt-text-primary)",
                        }}
                      >
                        {t.name}
                      </span>
                      {isActive && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          style={{ color: "var(--pt-accent)" }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger Button ──────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        style={{
          background: "var(--pt-accent)",
          boxShadow: `0 8px 24px var(--pt-shadow)`,
        }}
        title="Switch theme"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </motion.button>
    </>
  );
};

export default ThemeSwitcher;
    