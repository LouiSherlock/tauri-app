import { invoke, isTauri } from "@tauri-apps/api/core";

/**
 * Safe-area insets in CSS pixels (dp), reported by the Android system-bars
 * plugin. Values already include the display cutout.
 */
export interface SystemInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const ZERO_INSETS: SystemInsets = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const ANDROID_PLUGIN = "plugin:system-bars";

/** True only inside a Tauri WebView on Android, where the plugin exists. */
export function hasNativeSystemBars(): boolean {
  if (typeof navigator === "undefined") return false;

  return isTauri() && /Android/i.test(navigator.userAgent);
}

/**
 * Reads the current insets from Android's WindowInsets. Returns null off
 * Android or when the bridge is unavailable, so callers can fall back to
 * `env(safe-area-inset-*)`.
 */
export async function getSystemInsets(): Promise<SystemInsets | null> {
  if (!hasNativeSystemBars()) return null;

  try {
    return await invoke<SystemInsets>(`${ANDROID_PLUGIN}|get_insets`);
  } catch (error) {
    console.error("Failed to read Android system bar insets:", error);
    return null;
  }
}

/**
 * Keeps the status and navigation bar icons readable against the page
 * background (dark icons on light, light icons on dark).
 */
export async function setSystemBarTheme(
  theme: "light" | "dark",
): Promise<void> {
  if (!hasNativeSystemBars()) return;

  try {
    await invoke(`${ANDROID_PLUGIN}|set_theme`, { theme });
  } catch (error) {
    console.error("Failed to update Android system bar theme:", error);
  }
}
