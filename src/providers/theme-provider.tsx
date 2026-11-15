import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getThemeMode,
  saveThemeMode,
  systemPrefersDark,
  updateNativeTheme,
  type ResolvedTheme,
  type ThemeMode,
} from "../services/theme";

interface ThemeModeContextValue {
  /** What the user picked: follow the OS, force light, or force dark. */
  mode: ThemeMode;
  /** What is actually painted right now. */
  theme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

/**
 * Owns the app's theme preference. Astryx's <Theme mode> consumes `mode`;
 * Android's system bars consume the resolved `theme`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getThemeMode);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  const theme: ResolvedTheme = mode === "system"
    ? (systemDark ? "dark" : "light")
    : mode;

  const setMode = useCallback((nextMode: ThemeMode) => {
    saveThemeMode(nextMode);
    setModeState(nextMode);
  }, []);

  // Follow the OS while in "system" mode.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Keep Tailwind's `dark:` variant and native form controls in step.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  // Keep the Android status and navigation bar icons readable. The activity
  // owns the bars, so re-apply when the app returns to the foreground instead
  // of trusting the state left behind.
  useEffect(() => {
    void updateNativeTheme(theme);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void updateNativeTheme(theme);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [theme]);

  const value = useMemo(
    () => ({ mode, theme, setMode }),
    [mode, theme, setMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider");
  }

  return context;
}
