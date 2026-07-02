"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, ExternalLink, Mail } from "lucide-react";
import type { CompanyMatch } from "@/types";

interface CompanyListProps {
  matches: CompanyMatch[];
  onGenerateEmail: (companyId: string) => void;
  generating?: boolean;
}

export function CompanyList({ matches, onGenerateEmail, generating }: CompanyListProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Building2 className="mb-4 h-12 w-12 text-zinc-300" />
          <p className="text-lg font-medium">No encontramos empresas aún</p>
          <p className="mt-1 text-sm text-zinc-500">
            Haz clic en "Buscar empresas" para empezar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((match) => (
        <Card key={match.company.id} className="group transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{match.company.name}</h3>
                <p className="text-sm text-zinc-500">{match.company.industry}</p>
              </div>
              <Badge variant="success" className="text-xs">
                {match.match_score}% match
              </Badge>
            </div>

            <Progress value={match.match_score} className="mb-3 h-1.5" />

            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {match.match_reason}
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onGenerateEmail(match.company.id)}
                disabled={generating}
              >
                <Mail className="mr-2 h-4 w-4" />
                Generar email
              </Button>
              {match.company.domain && (
                <a
                  href={`https://${match.company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
