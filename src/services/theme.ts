import { setSystemBarTheme } from "./system-bars";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "app-theme";

/** Stored preference, defaulting to following the OS. */
export function getThemeMode(): ThemeMode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);

    if (value === "system" || value === "light" || value === "dark") {
      return value;
    }
  } catch {
    // Storage can be unavailable (private mode); fall through.
  }

  return "system";
}

export function saveThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore persistence failures; the in-memory mode still applies.
  }
}

export function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return systemPrefersDark() ? "dark" : "light";
  }

  return mode;
}

/** Pushes the resolved theme to the Android status and navigation bars. */
export async function updateNativeTheme(theme: ResolvedTheme): Promise<void> {
  await setSystemBarTheme(theme);
}
