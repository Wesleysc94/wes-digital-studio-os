import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  helper: string;
  insight: string;
  icon: LucideIcon;
}

export function MetricCard({ title, value, helper, insight, icon: Icon }: MetricCardProps) {
  return (
    <Card className="glass-card overflow-hidden rounded-[28px] border-white/10">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_20px_50px_-30px_hsl(var(--accent))]">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">{helper}</p>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.24em] text-white/32">Insight</p>
          <p className="mt-2 text-sm leading-6 text-white/72">{insight}</p>
        </div>
      </CardContent>
    </Card>
  );
}
