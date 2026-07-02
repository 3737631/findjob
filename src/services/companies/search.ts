import { logger } from "@/lib/logger";
import type { Company } from "@/types";

const GOOGLE_MAPS_API_BASE = "https://maps.googleapis.com/maps/api/place";

export async function searchCompaniesGoogleMaps(
  query: string,
  location?: string
): Promise<Partial<Company>[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    logger.warn("GOOGLE_MAPS_API_KEY no configurada");
    return [];
  }

  try {
    const searchQuery = location
      ? `${query} near ${location}`
      : query;

    const params = new URLSearchParams({
      query: searchQuery,
      type: "establishment",
      key: apiKey,
      language: "es",
    });

    const response = await fetch(
      `${GOOGLE_MAPS_API_BASE}/textsearch/json?${params}`
    );

    if (!response.ok) {
      logger.error("Error en Google Maps API", {
        status: response.status,
      });
      return [];
    }

    const data = await response.json();

    return (data.results || []).map((place: any) => ({
      name: place.name,
      domain: place.website || "",
      location: place.formatted_address || place.vicinity,
      industry: place.types?.join(", ") || "",
      description: place.business_status || "",
      source: "google_maps" as const,
      contact_form_url: place.website || "",
    }));
  } catch (error) {
    logger.error("Error searching companies", {
      error: (error as Error).message,
    });
    return [];
  }
}

export async function searchCompaniesGoogleSearch(
  query: string
): Promise<Partial<Company>[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    logger.warn("Google Search API no configurada");
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      key: apiKey,
      cx,
      num: "10",
      lr: "lang_es",
    });

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?${params}`
    );

    if (!response.ok) {
      logger.error("Error en Google Search API", {
        status: response.status,
      });
      return [];
    }

    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      name: item.title,
      domain: item.link ? new URL(item.link).hostname : "",
      description: item.snippet,
      source: "google_search" as const,
      contact_form_url: item.link,
    }));
  } catch (error) {
    logger.error("Error searching companies via web", {
      error: (error as Error).message,
    });
    return [];
  }
}
