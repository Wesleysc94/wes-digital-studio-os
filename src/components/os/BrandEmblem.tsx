import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type BrandEmblemProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: {
    shell: "h-16 w-16",
    outer: "-inset-4 blur-2xl",
    innerRing: "inset-[6px]",
    label: "text-[2.75rem] pr-1.5",
    particlePrimary: "h-2 w-2",
    particleSecondary: "h-1.5 w-1.5",
  },
  md: {
    shell: "h-24 w-24 sm:h-28 sm:w-28",
    outer: "-inset-8 blur-[54px]",
    innerRing: "inset-[10px]",
    label: "text-[4.9rem] pr-2.5 sm:text-[5.8rem]",
    particlePrimary: "h-2.5 w-2.5",
    particleSecondary: "h-2 w-2",
  },
} as const;

export function BrandEmblem({ size = "md", className }: BrandEmblemProps) {
  const variant = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: [0, -3, 0] }}
      transition={{ opacity: { duration: 0.28 }, scale: { duration: 0.28 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      className={cn("relative isolate flex items-center justify-center rounded-full", variant.shell, className)}
    >
      <div className={cn("pointer-events-none absolute rounded-full", variant.outer)} style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.24) 0%, transparent 68%)" }} />
      <div className="absolute inset-0 rounded-full border border-border/70 bg-[linear-gradient(180deg,hsl(var(--surface-strong)/0.98),hsl(var(--surface-soft)/0.86))] shadow-[inset_0_1px_0_hsl(var(--foreground)/0.06),0_30px_70px_-42px_hsl(var(--accent)/0.55)]" />
      <div className="absolute inset-[2px] rounded-full border border-accent/30" />

      <motion.div
        className="pointer-events-none absolute inset-[3px] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        <div className={cn("absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_hsl(var(--accent)/0.88)]", variant.particlePrimary)} />
        <div className={cn("absolute bottom-[16%] right-[14%] rounded-full bg-accent/75 shadow-[0_0_10px_hsl(var(--accent)/0.6)]", variant.particleSecondary)} />
        <div className={cn("absolute left-[8%] top-[64%] rounded-full bg-accent/55 shadow-[0_0_8px_hsl(var(--accent)/0.45)]", variant.particleSecondary)} />
      </motion.div>

      <motion.div
        className={cn("pointer-events-none absolute rounded-full border border-dashed border-accent/32", variant.innerRing)}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,hsl(var(--foreground)/0.08),transparent_70%)]" />
      <span className={cn("font-brand relative z-10 font-light italic leading-none text-foreground", variant.label)}>W</span>
    </motion.div>
  );
}
