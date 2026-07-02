"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import type { Application } from "@/types";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  draft: { label: "Borrador", variant: "secondary" },
  approved: { label: "Aprobado", variant: "warning" },
  sent: { label: "Enviado", variant: "success" },
  replied: { label: "Respondido", variant: "default" },
  rejected: { label: "Rechazado", variant: "destructive" },
  failed: { label: "Fallido", variant: "destructive" },
};

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-lg font-medium">No hay aplicaciones aún</p>
          <p className="mt-1 text-sm text-zinc-500">
            Sube tu CV y completa el onboarding para empezar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aplicaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="pb-3 text-left font-medium text-zinc-500">Empresa</th>
                <th className="pb-3 text-left font-medium text-zinc-500">Estado</th>
                <th className="pb-3 text-left font-medium text-zinc-500">Enviado</th>
                <th className="pb-3 text-right font-medium text-zinc-500">Acción</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="py-3">
                    <p className="font-medium">{app.company?.name || "—"}</p>
                    <p className="text-xs text-zinc-500">{app.company?.industry}</p>
                  </td>
                  <td className="py-3">
                    <Badge variant={statusLabels[app.status]?.variant || "secondary"}>
                      {statusLabels[app.status]?.label || app.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-zinc-500">
                    {app.sent_at ? formatDate(app.sent_at) : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
