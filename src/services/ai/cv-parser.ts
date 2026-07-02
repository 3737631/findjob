import { CV_PARSER_SYSTEM_PROMPT } from "@/prompts/cv-parser";
import { callAnthropicJSON } from "./client";
import type { ParsedCV } from "@/types";
import { logger } from "@/lib/logger";

export async function parseCVWithAI(
  cvText: string,
  fileName: string
): Promise<ParsedCV> {
  logger.info("Iniciando parsing de CV con IA", { fileName });

  const result = await callAnthropicJSON<ParsedCV>(
    CV_PARSER_SYSTEM_PROMPT,
    `Analiza el siguiente CV y extrae la información estructurada:

Nombre del archivo: ${fileName}

Contenido del CV:
---
${cvText}
---
Devuelve SOLO el JSON con los datos extraídos.`
  );

  logger.info("CV parseado exitosamente", {
    name: result.full_name,
    skillsCount: result.skills.length,
    experienceCount: result.experience.length,
  });

  return result;
}
