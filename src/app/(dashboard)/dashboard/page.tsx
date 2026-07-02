"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { useCompanies } from "@/hooks/use-companies";
import { useEmails } from "@/hooks/use-emails";
import { MetricsCards } from "@/features/dashboard/metrics-cards";
import { ApplicationsTable } from "@/features/dashboard/applications-table";
import { CompanyList } from "@/features/dashboard/company-list";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { DashboardMetrics, CompanyMatch } from "@/types";

export default function DashboardPage() {
  const { parsedCV, preferences, matches, applications, metrics } =
    useAppStore();
  const { findMatchingCompanies, loading: searching } = useCompanies();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  async function handleFindCompanies() {
    await findMatchingCompanies();
  }

  async function handleGenerateEmail(companyId: string) {
    setGeneratingId(companyId);
    try {
      const { generateEmail } = useEmails();
      await generateEmail(companyId);
    } finally {
      setGeneratingId(null);
    }
  }

  const needsSetup = !parsedCV || !preferences;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-zinc-500">
            {needsSetup
              ? "Configura tu perfil para empezar"
              : `Buscando oportunidades como ${preferences?.target_role}`}
          </p>
        </div>
        {needsSetup && (
          <Link href="/onboarding">
            <Button>
              Configurar perfil
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <MetricsCards metrics={metrics} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Empresas compatibles</h2>
          {!needsSetup && (
            <Button onClick={handleFindCompanies} disabled={searching}>
              {searching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Buscar empresas
            </Button>
          )}
        </div>
        <CompanyList
          matches={matches}
          onGenerateEmail={handleGenerateEmail}
          generating={generatingId !== null}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Historial de aplicaciones</h2>
        <ApplicationsTable applications={applications} />
      </div>
    </div>
  );
}
