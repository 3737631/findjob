import type { JobOffer } from "@/types";

const REMOTIVE_API = "https://remotive.com/api/remote-jobs";

const REGION_EXPANSIONS: Record<string, string[]> = {
  espana: ["spain", "europe", "worldwide", "latam"],
  spain: ["spain", "europe", "worldwide", "latam"],
  espanol: ["spain", "europe", "worldwide", "latam"],
  europa: ["europe", "worldwide"],
  europe: ["europe", "worldwide"],
  remoto: ["remote", "worldwide", "europe", "latam"],
  remote: ["remote", "worldwide", "europe", "latam"],
  madrid: ["madrid", "spain", "europe", "worldwide"],
  barcelona: ["barcelona", "spain", "europe", "worldwide"],
  valencia: ["valencia", "spain", "europe", "worldwide"],
  sevilla: ["sevilla", "spain", "europe", "worldwide"],
  latam: ["latam", "worldwide"],
  hispanoamerica: ["latam", "worldwide"],
  mexico: ["mexico", "latam", "worldwide"],
  argentina: ["argentina", "latam", "worldwide"],
  chile: ["chile", "latam", "worldwide"],
  colombia: ["colombia", "latam", "worldwide"],
  peru: ["peru", "latam", "worldwide"],
  uruguay: ["uruguay", "latam", "worldwide"],
  usa: ["usa", "united states", "worldwide", "latam"],
  "estados unidos": ["usa", "united states", "worldwide", "latam"],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function keywordsForZone(zone: string): string[] {
  const cleaned = normalize(zone).replace(/[^a-z0-9 ]/g, " ").trim();
  const exactTokens = cleaned.split(/\s+/);
  const keywords = new Set<string>(exactTokens);

  for (const token of exactTokens) {
    const expansion = REGION_EXPANSIONS[token];
    if (expansion) {
      expansion.forEach((k) => keywords.add(k));
    }
  }

  const full = cleaned;
  for (const [key, expansion] of Object.entries(REGION_EXPANSIONS)) {
    if (full.includes(key) || key.includes(full)) {
      expansion.forEach((k) => keywords.add(k));
    }
  }

  return [...keywords].filter(Boolean);
}

function locationList(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

interface RemotiveJob {
  id: string | number;
  title?: string;
  job_title?: string;
  company_name?: string;
  job_country?: string;
  candidate_required_location?: string | string[];
  tags?: string[];
  url?: string;
  application_link?: string;
  publication_date?: string;
}

export async function searchJobsByZone(
  zone: string,
  limit = 50
): Promise<JobOffer[]> {
  const keywords = keywordsForZone(zone);

  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`${REMOTIVE_API}?${params}`);

  if (!response.ok) {
    throw new Error("No se pudo conectar con el buscador de trabajos");
  }

  const data = await response.json();
  const jobs: RemotiveJob[] = Array.isArray(data.jobs) ? data.jobs : [];

  const matches = jobs.filter((job) => {
    const haystack = normalize(
      [
        job.job_country,
        ...locationList(job.candidate_required_location),
        job.job_title,
        job.company_name,
      ].join(" ")
    );
    return keywords.some((keyword) => haystack.includes(keyword));
  });

  return matches.map((job) => ({
    id: String(job.id),
    title: job.title || job.job_title || "Oferta sin título",
    company: job.company_name || "",
    location:
      job.job_country ||
      locationList(job.candidate_required_location).join(", ") ||
      "Remoto",
    tags: Array.isArray(job.tags) ? job.tags.slice(0, 3) : [],
    url: job.url || job.application_link || "#",
    published_at: job.publication_date || "",
  }));
}