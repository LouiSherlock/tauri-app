import "./globals.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@astryxdesign/core/theme";
import { LinkProvider } from "@astryxdesign/core/Link";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { themes, defaultThemeSlug } from "./astryx-themes";
import { ThemeProvider, useThemeMode } from "./providers/theme-provider";
import { router } from "./router";
import { TanStackLinkAdapter } from "./components/tanstack-link-adapter";
import { queryClient } from "./lib/query-client";

/**
 * Astryx needs the selected mode, so it sits inside our preference provider.
 * `Theme` is `display: contents`, so it does not disturb the mobile frame.
 */
function AppRoot() {
  const { mode } = useThemeMode();

  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <LinkProvider component={TanStackLinkAdapter}>
        <RouterProvider router={router} />
      </LinkProvider>
    </Theme>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRoot />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
