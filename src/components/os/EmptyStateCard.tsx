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
    <div className="surface-soft rounded-[24px] border border-dashed p-6 text-left">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/18 bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild className="mt-5 h-10 rounded-full px-4">
        <NavLink to={actionHref}>{actionLabel}</NavLink>
      </Button>
    </div>
  );
}
