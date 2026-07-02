"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import type { CompanyMatch } from "@/types";

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
    setStatusMessage("Buscando empresas...");

    try {
      const response = await fetch("/api/companies/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv: parsedCV,
          preferences,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al buscar empresas");
      }

      const { data: matches } = await response.json();
      setMatches(matches);
      setProgress(100);
      setStatusMessage(`${matches.length} empresas encontradas`);

      return matches as CompanyMatch[];
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
