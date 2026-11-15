import { Outlet, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/VStack";
import { isTauri } from "@tauri-apps/api/core";
import { ArrowLeft } from "lucide-react";
import { DesktopTitleBar } from "./components/desktop-titlebar";
import { ThemeSwitcher } from "./components/theme-switcher";
import { useSystemInsets } from "./hooks/use-system-insets";

const PRIMARY_ROUTES = new Set(["/", "/discover", "/profile"]);
const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/discover": "Discover",
  "/profile": "Profile",
  "/settings": "Settings",
  "/about": "About",
  "/help": "Help",
};

function App() {
  useSystemInsets();
  const routeId = useRouterState({
    select: (state) => state.matches[state.matches.length - 1]?.routeId ?? "/",
  });
  const isPrimaryRoute = PRIMARY_ROUTES.has(routeId);
  const isDesktopRuntime =
    isTauri() &&
    typeof navigator !== "undefined" &&
    !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const router = useRouter();
  const navigate = useNavigate();

  function goBack() {
    if (router.history.canGoBack()) {
      router.history.back();
      return;
    }

    void navigate({ to: "/profile" });
  }

  return (
    <VStack className="app" gap={0}>
      {isDesktopRuntime ? <DesktopTitleBar /> : null}
      {!isDesktopRuntime && isPrimaryRoute ? (
        <HStack
          as="header"
          className="app-header"
          align="center"
          justify="between"
          gap={3}
        >
          <Heading level={3}>Tauri</Heading>
          <ThemeSwitcher />
        </HStack>
      ) : null}
      {!isPrimaryRoute ? (
        <HStack
          as="header"
          className="secondary-app-bar"
          align="center"
          gap={3}
        >
          <IconButton
            className="secondary-back-button"
            label="Back"
            icon={<Icon icon={ArrowLeft} />}
            variant="ghost"
            onClick={goBack}
          />
          <Heading level={4}>{ROUTE_LABELS[routeId] ?? "Page"}</Heading>
        </HStack>
      ) : null}

      <VStack
        as="main"
        className={`app-content${isPrimaryRoute ? " has-tabbar" : ""}`}
        gap={4}
        paddingBlockStart={isPrimaryRoute ? 4 : 0}
      >
        <Outlet />
      </VStack>

      {isPrimaryRoute ? (
        <HStack
          as="nav"
          className="app-tabbar"
          align="center"
          justify="around"
          gap={2}
          aria-label="Main navigation"
        >
          <Link href="/" isStandalone className="app-tab-link">
            Home
          </Link>
          <Link href="/discover" isStandalone className="app-tab-link">
            Discover
          </Link>
          <Link href="/profile" isStandalone className="app-tab-link">
            Profile
          </Link>
        </HStack>
      ) : null}
    </VStack>
  );
}

export default App;
