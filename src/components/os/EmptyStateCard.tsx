import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";

type EmptyStateCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function EmptyStateCard({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateCardProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] p-6 text-left">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-white/58">{description}</p>
      <Button asChild className="mt-5 rounded-full">
        <NavLink to={actionHref}>{actionLabel}</NavLink>
      </Button>
    </div>
  );
}
