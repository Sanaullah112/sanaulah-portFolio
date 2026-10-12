import { createContext, useContext, useEffect, useState } from "react";

// ─── Theme Definitions ───────────────────────────────────────────────────────
export const THEMES = {
  warm: {
    id: "warm",
    name: "Warm",
    emoji: "🍊",
    vars: {
      "--pt-bg":          "#F3F8EF",
      "--pt-surface":     "#FFFFFF",
      "--pt-accent":      "#79FF26",
      "--pt-accent-hover":"#62D91C",
      "--pt-accent-soft": "#F2FFE8",
      "--pt-text-primary":"#0D0D0D",
      "--pt-text-muted":  "#959595",
      "--pt-border":      "rgba(0,0,0,0.07)",
      "--pt-shadow":      "rgba(121,255,38,0.15)",
      "--pt-card-bg":     "#FFFFFF",
      "--pt-navbar-bg":   "rgba(245,241,238,0.85)",
      "--pt-badge-bg":    "#F2FFE8",
      "--pt-badge-text":  "#79FF26",
    },
  },
  dark: {
    id: "dark",
    name: "Dark",
    emoji: "🌑",
    vars: {
      "--pt-bg":          "#0D0D0D",
      "--pt-surface":     "#1A1A1A",
      "--pt-accent":      "#79FF26",
      "--pt-accent-hover":"#B8FF80",
      "--pt-accent-soft": "#122B05",
      "--pt-text-primary":"#F3F8EF",
      "--pt-text-muted":  "#777777",
      "--pt-border":      "rgba(255,255,255,0.08)",
      "--pt-shadow":      "rgba(121,255,38,0.2)",
      "--pt-card-bg":     "#1A1A1A",
      "--pt-navbar-bg":   "rgba(13,13,13,0.90)",
      "--pt-badge-bg":    "#122B05",
      "--pt-badge-text":  "#79FF26",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    vars: {
      "--pt-bg":          "#EEF4F8",
      "--pt-surface":     "#FFFFFF",
      "--pt-accent":      "#2563EB",
      "--pt-accent-hover":"#1d4ed8",
      "--pt-accent-soft": "#EFF6FF",
      "--pt-text-primary":"#0A1628",
      "--pt-text-muted":  "#6B7FA3",
      "--pt-border":      "rgba(37,99,235,0.12)",
      "--pt-shadow":      "rgba(37,99,235,0.15)",
      "--pt-card-bg":     "#FFFFFF",
      "--pt-navbar-bg":   "rgba(238,244,248,0.85)",
      "--pt-badge-bg":    "#EFF6FF",
      "--pt-badge-text":  "#2563EB",
    },
  },
  forest: {
    id: "forest",
    name: "Forest",
    emoji: "🌿",
    vars: {
      "--pt-bg":          "#EEF5EE",
      "--pt-surface":     "#FFFFFF",
      "--pt-accent":      "#16A34A",
      "--pt-accent-hover":"#15803d",
      "--pt-accent-soft": "#F0FDF4",
      "--pt-text-primary":"#0A1A0D",
      "--pt-text-muted":  "#6B8F6B",
      "--pt-border":      "rgba(22,163,74,0.12)",
      "--pt-shadow":      "rgba(22,163,74,0.15)",
      "--pt-card-bg":     "#FFFFFF",
      "--pt-navbar-bg":   "rgba(238,245,238,0.85)",
      "--pt-badge-bg":    "#F0FDF4",
      "--pt-badge-text":  "#16A34A",
    },
  },
  violet: {
    id: "violet",
    name: "Violet",
    emoji: "💜",
    vars: {
      "--pt-bg":          "#F3EEF8",
      "--pt-surface":     "#FFFFFF",
      "--pt-accent":      "#7C3AED",
      "--pt-accent-hover":"#6d28d9",
      "--pt-accent-soft": "#F5F3FF",
      "--pt-text-primary":"#1A0A2E",
      "--pt-text-muted":  "#7B6B9A",
      "--pt-border":      "rgba(124,58,237,0.12)",
      "--pt-shadow":      "rgba(124,58,237,0.15)",
      "--pt-card-bg":     "#FFFFFF",
      "--pt-navbar-bg":   "rgba(243,238,248,0.85)",
      "--pt-badge-bg":    "#F5F3FF",
      "--pt-badge-text":  "#7C3AED",
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    emoji: "🌌",
    vars: {
      "--pt-bg":          "#0F1117",
      "--pt-surface":     "#1C1F2E",
      "--pt-accent":      "#6366F1",
      "--pt-accent-hover":"#818CF8",
      "--pt-accent-soft": "#1E1B4B",
      "--pt-text-primary":"#E2E8F0",
      "--pt-text-muted":  "#64748B",
      "--pt-border":      "rgba(99,102,241,0.2)",
      "--pt-shadow":      "rgba(99,102,241,0.25)",
      "--pt-card-bg":     "#1C1F2E",
      "--pt-navbar-bg":   "rgba(15,17,23,0.92)",
      "--pt-badge-bg":    "#1E1B4B",
      "--pt-badge-text":  "#818CF8",
    },
  },
};

// ─── Context ─────────────────────────────────────────────────────────────────
const PortfolioThemeContext = createContext(null);

export const PortfolioThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem("portfolio_theme") || "warm"
  );

  const theme = THEMES[themeId] || THEMES.warm;

  // Apply CSS variables to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-portfolio-theme", themeId);
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    localStorage.setItem("portfolio_theme", themeId);
  }, [themeId, theme]);

  const switchTheme = (id) => {
    if (THEMES[id]) setThemeId(id);
  };

  return (
    <PortfolioThemeContext.Provider value={{ themeId, theme, switchTheme, themes: THEMES }}>
      {children}
    </PortfolioThemeContext.Provider>
  );
};

export const usePortfolioTheme = () => {
  const ctx = useContext(PortfolioThemeContext);
  if (!ctx) throw new Error("usePortfolioTheme must be used inside PortfolioThemeProvider");
  return ctx;
};
