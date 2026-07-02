import { MATCHER_SYSTEM_PROMPT } from "@/prompts/matcher";
import { callAnthropicJSON } from "./client";
import type { ParsedCV, UserPreferences, CompanyMatch } from "@/types";
import { logger } from "@/lib/logger";

export interface CompanyToMatch {
  id: string;
  name: string;
  industry?: string;
  description?: string;
  location?: string;
  domain?: string;
}

export async function matchCompaniesWithAI(
  cv: ParsedCV,
  preferences: UserPreferences,
  companies: CompanyToMatch[]
): Promise<CompanyMatch[]> {
  if (companies.length === 0) return [];

  logger.info("Iniciando matching de empresas con IA", {
    companiesCount: companies.length,
  });

  const result = await callAnthropicJSON<CompanyMatch[]>(
    MATCHER_SYSTEM_PROMPT,
    `Perfil del candidato:
${JSON.stringify({ cv, preferences }, null, 2)}

Empresas disponibles para evaluar:
${JSON.stringify(companies, null, 2)}

Devuelve un array JSON con el ranking de compatibilidad.
Si ninguna empresa es compatible, devuelve un array vacío.`
  );

  logger.info("Matching completado", { matchesCount: result.length });

  return result.map((match: CompanyMatch) => ({
    ...match,
    match_score: Math.min(100, Math.max(0, match.match_score)),
  }));
}
