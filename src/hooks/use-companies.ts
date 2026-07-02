"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { callAnthropicJSON } from "@/services/ai/client-browser";
import { MATCHER_SYSTEM_PROMPT } from "@/prompts/matcher";
import type { ParsedCV, UserPreferences, CompanyMatch, Company } from "@/types";

const MOCK_COMPANIES: Company[] = [
  { id: "1", name: "Google", industry: "Tecnología", description: "Empresa líder en tecnología, inteligencia artificial y servicios digitales", location: "Madrid", domain: "google.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "2", name: "Microsoft", industry: "Tecnología", description: "Corporación multinacional de tecnología informática", location: "Barcelona", domain: "microsoft.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "3", name: "Amazon", industry: "Comercio electrónico", description: "Empresa de comercio electrónico y cloud computing", location: "Madrid", domain: "amazon.es", source: "open_directory", created_at: new Date().toISOString() },
  { id: "4", name: "Meta", industry: "Redes sociales", description: "Empresa de tecnología enfocada en redes sociales y realidad virtual", location: "Remoto", domain: "meta.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "5", name: "Spotify", industry: "Música", description: "Plataforma de streaming de música y podcasts", location: "Barcelona", domain: "spotify.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "6", name: "Glovo", industry: "Delivery", description: "Plataforma de delivery y servicios on-demand", location: "Barcelona", domain: "glovoapp.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "7", name: "Cabify", industry: "Movilidad", description: "Plataforma de movilidad urbana", location: "Madrid", domain: "cabify.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "8", name: "Deutsche Telekom", industry: "Telecomunicaciones", description: "Empresa de telecomunicaciones alemana", location: "Bonn/Berlín", domain: "telekom.de", source: "open_directory", created_at: new Date().toISOString() },
  { id: "9", name: "SAP", industry: "Software", description: "Empresa alemana de software empresarial", location: "Walldorf/Berlín", domain: "sap.com", source: "open_directory", created_at: new Date().toISOString() },
  { id: "10", name: "Siemens", industry: "Industrial", description: "Conglomerado industrial alemán", location: "Múnich/Berlín", domain: "siemens.com", source: "open_directory", created_at: new Date().toISOString() },
];

export function useCompanies() {
  const [loading, setLoading] = useState(false);
  const { parsedCV, preferences, setMatches, setStatus, setProgress, setStatusMessage } =
    useAppStore();

  async function findMatchingCompanies() {
    if (!parsedCV || !preferences) {
      throw new Error("Completa el onboarding primero");
    }

    setLoading(true);
    setStatus("matching");
    setProgress(10);
    setStatusMessage("Analizando empresas...");

    try {
      const matches = await callAnthropicJSON<CompanyMatch[]>(
        MATCHER_SYSTEM_PROMPT,
        `Perfil del candidato:
${JSON.stringify({ cv: parsedCV, preferences }, null, 2)}

Empresas disponibles para evaluar:
${JSON.stringify(MOCK_COMPANIES, null, 2)}

Devuelve un array JSON con el ranking de compatibilidad.
Si ninguna empresa es compatible, devuelve un array vacío.`
      );

      const scored = matches.map((match: CompanyMatch) => ({
        ...match,
        match_score: Math.min(100, Math.max(0, match.match_score)),
      }));

      setMatches(scored);
      setProgress(100);
      setStatusMessage(`${scored.length} empresas encontradas`);

      return scored;
    } catch (error) {
      setStatus("failed");
      setStatusMessage(
        error instanceof Error ? error.message : "Error al buscar empresas"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { findMatchingCompanies, loading };
}
