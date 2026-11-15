import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";

import { useThemeMode } from "../providers/theme-provider";
import type { ThemeMode } from "../services/theme";

const THEME_OPTIONS: ReadonlyArray<{ value: ThemeMode; label: string }> = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/**
 * Switches the app preference between following the OS and forcing a mode.
 * The resolved value drives both Astryx tokens and the Android system bars.
 */
export function ThemeSwitcher() {
  const { mode, setMode } = useThemeMode();

  return (
    <SegmentedControl
      label="Color theme"
      size="sm"
      layout="hug"
      value={mode}
      onChange={(value) => setMode(value as ThemeMode)}
    >
      {THEME_OPTIONS.map((option) => (
        <SegmentedControlItem
          key={option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </SegmentedControl>
  );
}
