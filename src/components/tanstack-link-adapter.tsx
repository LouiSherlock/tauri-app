import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link as TanStackLink } from "@tanstack/react-router";

type TanStackLinkAdapterProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  to?: string;
};

/** Adapts Astryx's href-based Link contract to TanStack Router's `to` prop. */
export const TanStackLinkAdapter = forwardRef<
  HTMLAnchorElement,
  TanStackLinkAdapterProps
>(function TanStackLinkAdapter({ href, to, ...props }, ref) {
  return (
    <TanStackLink
      {...props}
      ref={ref}
      to={(to ?? href ?? "/") as never}
    />
  );
});
