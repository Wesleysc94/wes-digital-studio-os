import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}

export function MetricCard({ title, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <Card className="glass-card overflow-hidden rounded-[28px]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_20px_50px_-30px_hsl(var(--accent))]">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
