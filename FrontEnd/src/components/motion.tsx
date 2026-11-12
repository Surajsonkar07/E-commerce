import { cn } from "@/lib/utils";

/*
 * Scroll reveals are pure CSS (scroll-driven animations, see globals.css),
 * so they ship no JavaScript and never hide content when JS is slow or off.
 * Browsers without `animation-timeline` simply show the content.
 */
type DivProps = React.ComponentProps<"div">;

export function Reveal({ className, ...props }: DivProps) {
  return <div className={cn("reveal", className)} {...props} />;
}

/** Each child reveals as it enters the viewport, which staggers rows naturally. */
export function Stagger({ className, ...props }: DivProps) {
  return <div className={cn("stagger", className)} {...props} />;
}

export function StaggerItem(props: DivProps) {
  return <div {...props} />;
}
