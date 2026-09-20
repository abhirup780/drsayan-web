"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px the element travels up into place. */
  y?: number;
  as?: "div" | "section" | "aside" | "li" | "span" | "p";
};

/**
 * The site's single entrance animation. Everything that appears on scroll
 * uses it, so the whole page shares one rhythm instead of a zoo of effects.
 *
 * Reduced motion is honoured by zeroing the transition, never by changing the
 * `hidden` variant. `useReducedMotion` is false during SSR and true on a
 * device that asks for reduced motion, so branching the variant made the
 * server send `transform: translateY(18px)` while the client wanted
 * `transform: none`. React reports that as an attribute mismatch it "will not
 * patch up", leaves the server's `opacity: 0` in place, and every revealed
 * section on the site stays invisible for exactly the users who most need it
 * to work. Keep the rendered initial state independent of the hook.
 */
export function Reveal({ children, className, delay = 0, y = 18, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.75, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggers direct children that are `<RevealItem>`s. Use for lists and grids
 * so items cascade rather than all arriving at once.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: reduce ? 0 : stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  y = 16,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </MotionTag>
  );
}
