"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Building2, Mail, Send, Reply, TrendingUp } from "lucide-react";
import type { DashboardMetrics } from "@/types";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  suffix?: string;
}

function MetricCard({ icon: Icon, label, value, suffix }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="text-2xl font-bold">
            {value}
            {suffix && <span className="text-sm font-normal text-zinc-500 ml-1">{suffix}</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsCards({ metrics }: { metrics: DashboardMetrics | null }) {
  if (!metrics) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-12 w-12 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-2 h-6 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard icon={FileText} label="CV Analizados" value={metrics.total_cvs} />
      <MetricCard icon={Building2} label="Empresas encontradas" value={metrics.total_companies} />
      <MetricCard icon={Mail} label="Emails generados" value={metrics.total_emails_generated} />
      <MetricCard icon={Send} label="Emails enviados" value={metrics.total_emails_sent} />
      <MetricCard icon={Reply} label="Respuestas recibidas" value={metrics.total_replies} />
      <MetricCard icon={TrendingUp} label="Ratio de respuesta" value={metrics.response_rate} suffix="%" />
    </div>
  );
}
