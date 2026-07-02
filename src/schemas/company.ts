import { z } from "zod/v4";

export const companySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  domain: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  contact_email: z.email("Email de contacto inválido").optional(),
  contact_form_url: z.string().url("URL inválida").optional(),
  source: z.enum(["google_maps", "google_search", "manual", "open_directory"]),
});

export const companyMatchSchema = z.object({
  company: companySchema,
  match_score: z.number().min(0).max(100),
  match_reason: z.string(),
  relevance_factors: z.array(z.string()),
});

export type CompanyInput = z.infer<typeof companySchema>;
export type CompanyMatch = z.infer<typeof companyMatchSchema>;
