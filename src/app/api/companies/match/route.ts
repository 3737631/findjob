import { NextRequest, NextResponse } from "next/server";
import { searchCompaniesGoogleMaps, searchCompaniesGoogleSearch } from "@/services/companies/search";
import { matchCompaniesWithAI } from "@/services/ai/matcher";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { ParsedCV, UserPreferences, Company } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`companies-match:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const cv = body.cv as ParsedCV;
    const preferences = body.preferences as UserPreferences;

    if (!cv || !preferences) {
      return NextResponse.json(
        { error: "CV y preferencias son requeridos" },
        { status: 400 }
      );
    }

    const searchQuery = `${preferences.target_role} ${preferences.location}`;

    const [mapsResults, searchResults] = await Promise.all([
      searchCompaniesGoogleMaps(searchQuery, preferences.location),
      searchCompaniesGoogleSearch(searchQuery),
    ]);

    const allCompanies: Company[] = [
      ...mapsResults,
      ...searchResults,
    ]
      .filter(
        (c, i, arr) =>
          c.name && arr.findIndex((x) => x.name === c.name) === i
      )
      .map((c, i) => ({
        id: `company_${i}`,
        name: c.name || "Unknown",
        domain: c.domain || "",
        industry: c.industry || "",
        location: c.location || "",
        description: c.description || "",
        source: c.source || "manual" as const,
        contact_email: c.contact_email || "",
        contact_form_url: c.contact_form_url || "",
        created_at: new Date().toISOString(),
      }));

    if (allCompanies.length === 0) {
      return NextResponse.json({
        data: [],
        message: "No se encontraron empresas. Intenta con una búsqueda diferente o añádelas manualmente.",
      });
    }

    const matches = await matchCompaniesWithAI(cv, preferences, allCompanies);

    const scoredMatches = matches.sort((a, b) => b.match_score - a.match_score);

    logger.info("Matching completado", {
      companiesFound: allCompanies.length,
      matchesReturned: scoredMatches.length,
    });

    return NextResponse.json({ data: scoredMatches });
  } catch (error) {
    logger.error("Error en companies match API", {
      error: (error as Error).message,
    });
    return NextResponse.json(
      { error: "Error al buscar empresas compatibles" },
      { status: 500 }
    );
  }
}
