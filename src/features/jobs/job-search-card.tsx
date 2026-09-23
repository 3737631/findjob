"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { searchJobsByZone } from "@/services/jobs/search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import type { JobOffer } from "@/types";

export function JobSearchCard() {
  const { parsedCV } = useAppStore();
  const [zone, setZone] = useState(parsedCV?.location || "");
  const [jobs, setJobs] = useState<JobOffer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!zone.trim()) {
      setError("Escribe tu zona o ciudad");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const results = await searchJobsByZone(zone);
      setJobs(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al buscar trabajos");
      setJobs(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Trabajos en tu zona
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Buscamos ofertas compatibles con tu ubicación
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-zone">Zona / Ciudad</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                id="job-zone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Ej: España, Madrid, Europe, Remoto..."
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Buscar
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Buscando trabajos...
          </p>
        )}

        {jobs !== null && !loading && jobs.length === 0 && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            No encontramos ofertas para esa zona
          </p>
        )}

        {jobs !== null && jobs.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-zinc-500">
              {jobs.length}{" "}
              {jobs.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {jobs.map((job) => (
                <li key={job.id}>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-zinc-200 p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-zinc-800"
                  >
                    <p className="font-medium leading-snug group-hover:text-blue-600">
                      {job.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {job.company}
                    </p>
                    {job.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                        {job.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </Badge>
                      {job.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      <span className="ml-auto inline-flex items-center text-zinc-400 transition-colors group-hover:text-blue-600">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}