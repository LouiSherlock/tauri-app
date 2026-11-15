import { useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { StackItem } from "@astryxdesign/core/Stack";
import type { SVGProps } from "react";

function MinimizeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 5.5h8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function MaximizeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 10" fill="none" {...props}>
      <rect
        x="1.5"
        y="1.5"
        width="7"
        height="7"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function RestoreGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 10" fill="none" {...props}>
      <path
        d="M3.5 3.5V1.5h5v5H6.5M1.5 3.5h5v5h-5z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function CloseGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 10" fill="none" {...props}>
      <path
        d="m2 2 6 6M8 2 2 8"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function DesktopTitleBar() {
  const appWindow = useMemo(() => getCurrentWindow(), []);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let disposed = false;
    let unlisten: (() => void) | undefined;

    const syncFullscreen = async () => {
      try {
        const fullscreen = await appWindow.isFullscreen();
        if (!disposed) setIsFullscreen(fullscreen);
      } catch (error) {
        console.error("Could not read window fullscreen state:", error);
      }
    };

    void syncFullscreen();

    void appWindow
      .onResized(() => {
        void syncFullscreen();
      })
      .then((stopListening) => {
        if (disposed) {
          stopListening();
        } else {
          unlisten = stopListening;
        }
      })
      .catch((error: unknown) => {
        console.error("Could not observe window resizing:", error);
      });

    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [appWindow]);

  async function minimizeWindow() {
    try {
      await appWindow.minimize();
    } catch (error) {
      console.error("Could not minimize window:", error);
    }
  }

  async function toggleFullscreen() {
    try {
      const fullscreen = !(await appWindow.isFullscreen());
      await appWindow.setFullscreen(fullscreen);
      setIsFullscreen(fullscreen);
    } catch (error) {
      console.error("Could not toggle fullscreen:", error);
    }
  }

  async function closeWindow() {
    try {
      await appWindow.close();
    } catch (error) {
      console.error("Could not close window:", error);
    }
  }

  return (
    <HStack
      as="header"
      className="desktop-titlebar"
      align="center"
      gap={2}
      aria-label="Window title bar"
      data-tauri-drag-region
    >
      <Heading level={5} data-tauri-drag-region>
        Tauri App
      </Heading>
      <StackItem
        as="span"
        size="fill"
        className="desktop-titlebar-drag-region"
        data-tauri-drag-region
        aria-hidden="true"
      />
      <HStack className="desktop-window-controls" align="center" gap={0}>
        <button
          type="button"
          className="desktop-window-control"
          aria-label="Minimize window"
          title="Minimize"
          onClick={() => void minimizeWindow()}
        >
          <Icon icon={MinimizeGlyph} size="xsm" />
        </button>
        <button
          type="button"
          className="desktop-window-control"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Restore" : "Maximize"}
          onClick={() => void toggleFullscreen()}
        >
          <Icon
            icon={isFullscreen ? RestoreGlyph : MaximizeGlyph}
            size="xsm"
          />
        </button>
        <button
          type="button"
          className="desktop-window-control desktop-close-button"
          aria-label="Close window"
          title="Close"
          onClick={() => void closeWindow()}
        >
          <Icon
            icon={CloseGlyph}
            size="xsm"
            style={{ color: "var(--desktop-close-icon-color)" }}
          />
        </button>
      </HStack>
    </HStack>
  );
}
