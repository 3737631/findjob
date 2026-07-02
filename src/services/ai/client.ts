import { logger } from "@/lib/logger";

export type AIModel = "claude-3-haiku-20240307" | "claude-3-sonnet-20240229";

export interface AIClientConfig {
  model?: AIModel;
  maxTokens?: number;
  temperature?: number;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callAnthropic(
  systemPrompt: string,
  userMessage: string,
  config: AIClientConfig = {}
) {
  const {
    model = "claude-3-haiku-20240307",
    maxTokens = 2048,
    temperature = 0.3,
  } = config;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY no está configurada");
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || "";

      return content;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Intento ${attempt}/${maxRetries} falló`, {
        error: lastError.message,
      });
      if (attempt < maxRetries) {
        await delay(1000 * attempt);
      }
    }
  }

  throw lastError || new Error("Error al llamar a Anthropic");
}

export async function callAnthropicJSON<T>(
  systemPrompt: string,
  userMessage: string,
  config?: AIClientConfig
): Promise<T> {
  const response = await callAnthropic(systemPrompt, userMessage, {
    ...config,
    temperature: 0.1,
  });

  const jsonMatch = response.match(/\{[\s\S]*\}/) || response.match(/\[[\s\S]*\]/);
  const jsonStr = jsonMatch?.[0] || response;

  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    logger.error("Error parseando respuesta JSON de Anthropic", {
      response: response.slice(0, 500),
    });
    throw new Error("La respuesta de IA no tiene formato JSON válido");
  }
}
