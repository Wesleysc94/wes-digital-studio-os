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
    <Card className="glass-card rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
