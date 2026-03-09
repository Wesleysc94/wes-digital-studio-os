import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow-label">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-[2rem]">{title}</h2>
        <p className="section-copy mt-3 text-sm leading-7">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
