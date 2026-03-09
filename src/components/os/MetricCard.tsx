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
    <Card className="glass-card overflow-hidden rounded-[24px]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <p className="eyebrow-label">{title}</p>
          <p className="text-[2rem] font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-accent/16 bg-accent/10 text-accent">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">{helper}</p>
        <div className="surface-soft rounded-[18px] px-4 py-3">
          <p className="eyebrow-label">Insight</p>
          <p className="mt-2 text-sm leading-6 text-foreground/82">{insight}</p>
        </div>
      </CardContent>
    </Card>
  );
}
