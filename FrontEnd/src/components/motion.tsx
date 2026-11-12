"use client";

import { animate, motion, useInView, useMotionValue, useTransform, type HTMLMotionProps } from "motion/react";
import { useEffect, useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ delay = 0, y = 14, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.45, ease, delay }}
      {...props}
    />
  );
}

/** Children animate in one after another when the group scrolls into view. */
export function Stagger({ gap = 0.06, ...props }: HTMLMotionProps<"div"> & { gap?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      {...props}
    />
  );
}

export function StaggerItem(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
      {...props}
    />
  );
}

/** Counts up to `to` the first time it scrolls into view. */
export function CountUp({ to, decimals = 0, suffix = "", prefix = "" }: { to: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => `${prefix}${n.toFixed(decimals)}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 1.1, ease });
    return () => c.stop();
  }, [inView, to, v]);
  return (
    <span ref={ref}>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{`${prefix}${to.toFixed(decimals)}${suffix}`}</span>
    </span>
  );
}
