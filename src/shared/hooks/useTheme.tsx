// Theme context — light/dark mode + raw token map (tm) for inline styles.
// Components import tm instead of hardcoding colours.

import { createContext, useContext, useState } from "react";

export const DARK_THEME = {
  appBg: "#0F172A",
  sidebar: "#1E293B",
  navBg: "#0F172A",
  border: "rgba(255,255,255,0.08)",
  surface1: "rgba(255,255,255,0.03)",
  surface2: "rgba(255,255,255,0.06)",
  surface3: "rgba(255,255,255,0.09)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.1)",
  inputFocus: "rgba(34,197,94,0.5)",
  text1: "rgba(255,255,255,0.92)",
  text2: "rgba(255,255,255,0.68)",
  text3: "rgba(255,255,255,0.42)",
  text4: "rgba(255,255,255,0.28)",
  text5: "rgba(255,255,255,0.16)",
  glass: "rgba(15,23,42,0.88)",
  glassCard: "rgba(15,23,42,0.95)",
  dropdown: "#1E293B",
  dropdownBorder: "rgba(255,255,255,0.1)",
  filterChip: "rgba(255,255,255,0.07)",
  filterChipText: "rgba(255,255,255,0.5)",
  primary: "#22c55e",
  primaryText: "#0f2d1a",
};

export const LIGHT_THEME = {
  appBg: "#F8F9FF",
  sidebar: "#F0FDF4",
  navBg: "#006E2F",
  border: "#D1D5DB",
  surface1: "#F0FDF4",
  surface2: "#FFFFFF",
  surface3: "#D1D5DB",
  inputBg: "#FFFFFF",
  inputBorder: "#D1D5DB",
  inputFocus: "#22C55E",
  text1: "#0F172A",
  text2: "#3F465C",
  text3: "#5C647A",
  text4: "#5C647A",
  text5: "#BEC6E0",
  glass: "rgba(248,249,255,0.92)",
  glassCard: "rgba(255,255,255,0.98)",
  dropdown: "#FFFFFF",
  dropdownBorder: "#D1D5DB",
  filterChip: "#F0FDF4",
  filterChipText: "#3F465C",
  primary: "#22C55E",
  primaryText: "#ffffff",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const tm = darkMode ? DARK_THEME : LIGHT_THEME;
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, tm }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
