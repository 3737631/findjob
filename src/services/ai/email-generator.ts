import { EMAIL_GENERATOR_SYSTEM_PROMPT } from "@/prompts/email-generator";
import { callAnthropicJSON } from "./client";
import type { ParsedCV, Company } from "@/types";
import { logger } from "@/lib/logger";

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export async function generateEmailWithAI(
  cv: ParsedCV,
  company: Company,
  matchReason: string
): Promise<GeneratedEmail> {
  logger.info("Generando email con IA", { company: company.name });

  const result = await callAnthropicJSON<GeneratedEmail>(
    EMAIL_GENERATOR_SYSTEM_PROMPT,
    `Genera un email de presentación personalizado.

DATOS DEL CANDIDATO:
${JSON.stringify(cv, null, 2)}

DATOS DE LA EMPRESA:
${JSON.stringify(company, null, 2)}

RAZÓN DEL MATCH:
${matchReason}

Devuelve un objeto JSON con "subject" y "body".`
  );

  logger.info("Email generado exitosamente", {
    company: company.name,
    subjectLength: result.subject.length,
    bodyLength: result.body.length,
  });

  return result;
}
