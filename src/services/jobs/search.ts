import type { JobOffer } from "@/types";

const GOOGLE_CSE_BASE = "https://www.googleapis.com/customsearch/v1";

function getConfig() {
  const apiKey =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY
      : undefined;
  const cx =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CX
      : undefined;

  if (!apiKey || !cx) {
    throw new Error(
      "Faltan las claves de búsqueda: crea .env.local con NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY y NEXT_PUBLIC_GOOGLE_SEARCH_CX y vuelve a desplegar"
    );
  }

  return { apiKey, cx };
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*[-|]\s*[A-Za-z0-9.-]+\.(?:com|es|net|org|info|biz|io|jobs|trabajo)[/]?.*$/i, "")
    .replace(/\s*[-|]\s*[A-Za-z0-9 .-]+$/i, "")
    .trim();
}

function hostname(link: string): string {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function searchJobsByZone(zone: string): Promise<JobOffer[]> {
  const { apiKey, cx } = getConfig();
  const query = `ofertas de empleo ${zone} OR ofertas de trabajo ${zone} OR empleo ${zone}`;

  const params = new URLSearchParams({
    q: query,
    key: apiKey,
    cx,
    num: "10",
    hl: "es",
    gl: "es",
    lr: "lang_es",
    dateRestrict: "m1",
  });

  const response = await fetch(`${GOOGLE_CSE_BASE}?${params}`);

  if (!response.ok) {
    throw new Error("No se pudo conectar con Google (revisa las claves)");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Google: ${data.error.message || "error"}`);
  }

  interface GoogleResultItem {
  cacheId?: string;
  title?: string;
  link?: string;
  snippet?: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
  };
}

interface GoogleSearchResponse {
  error?: { message?: string };
  items?: GoogleResultItem[];
}

  const items = (data as GoogleSearchResponse).items || [];

  return items.map((item, index) => ({
    id: String(item.cacheId || `${zone}-${index}`),
    title: cleanTitle(item.title || "Oferta de empleo"),
    company: hostname(item.link || ""),
    location: zone,
    tags: ["Empleo real"],
    url: item.link || "#",
    published_at: item.pagemap?.metatags?.[0]?.["article:published_time"] || "",
    description: item.snippet || "",
  }));
}