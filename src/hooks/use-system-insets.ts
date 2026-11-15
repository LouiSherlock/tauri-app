import { useEffect, useState } from "react";

import {
  getSystemInsets,
  ZERO_INSETS,
  type SystemInsets,
} from "../services/system-bars";

/** Values the native shell publishes on `<html>` while insets change. */
const PUBLISHED_NAMES = {
  top: "--native-safe-area-top",
  bottom: "--native-safe-area-bottom",
  left: "--native-safe-area-left",
  right: "--native-safe-area-right",
} as const;

function readCssInset(name: string): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function readPublishedInsets(): SystemInsets {
  return {
    top: readCssInset(PUBLISHED_NAMES.top),
    bottom: readCssInset(PUBLISHED_NAMES.bottom),
    left: readCssInset(PUBLISHED_NAMES.left),
    right: readCssInset(PUBLISHED_NAMES.right),
  };
}

function publishInsets(insets: SystemInsets) {
  const style = document.documentElement.style;

  style.setProperty("--native-safe-area-top", `${insets.top}px`);
  style.setProperty("--native-safe-area-bottom", `${insets.bottom}px`);
  style.setProperty("--native-safe-area-left", `${insets.left}px`);
  style.setProperty("--native-safe-area-right", `${insets.right}px`);

  // Names the status-bar doc and existing pages use.
  style.setProperty("--status-bar-height", `${insets.top}px`);
  style.setProperty("--navigation-bar-height", `${insets.bottom}px`);
}

/**
 * Single source of truth for the top / bottom / left / right safe areas.
 *
 * Native Android publishes the values on `<html>` whenever the window insets
 * change (rotation, cutout, display scaling, keyboard). The fallback command
 * covers the few frames before the bridge's first post.
 */
export function useSystemInsets(): SystemInsets {
  const [insets, setInsets] = useState<SystemInsets>(ZERO_INSETS);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      const published = readPublishedInsets();
      const hasPublished = published.top > 0 ||
        published.bottom > 0 ||
        published.left > 0 ||
        published.right > 0;

      const next = hasPublished ? published : (await getSystemInsets() ?? published);
      if (cancelled) return;

      publishInsets(next);
      setInsets(next);
    }

    void sync();

    // Insets change on rotation, cutouts, display scaling and app resume.
    const media = window.matchMedia("(orientation: portrait)");
    const handleChange = () => void sync();
    media.addEventListener("change", handleChange);
    window.addEventListener("resize", handleChange);
    window.addEventListener("load", handleChange);
    document.addEventListener("visibilitychange", handleChange);
    // The native bridge posts its values a frame or two after first paint.
    const retry = window.setTimeout(handleChange, 400);

    return () => {
      cancelled = true;
      media.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("load", handleChange);
      document.removeEventListener("visibilitychange", handleChange);
      window.clearTimeout(retry);
    };
  }, []);

  return insets;
}
