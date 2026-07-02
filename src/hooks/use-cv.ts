"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { callAnthropicJSON } from "@/services/ai/client-browser";
import { CV_PARSER_SYSTEM_PROMPT } from "@/prompts/cv-parser";
import type { ParsedCV } from "@/types";

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pages.push(text);
  }
  return pages.join("\n\n");
}

export function useCV() {
  const [uploading, setUploading] = useState(false);
  const { setStatus, setProgress, setStatusMessage, setParsedCV } =
    useAppStore();

  async function uploadCV(file: File) {
    setUploading(true);
    setStatus("uploading");
    setProgress(10);
    setStatusMessage("Leyendo PDF...");

    try {
      const cvText = await extractTextFromPDF(file);

      setProgress(40);
      setStatusMessage("Analizando CV con IA...");

      const parsed = await callAnthropicJSON<ParsedCV>(
        CV_PARSER_SYSTEM_PROMPT,
        `Analiza el siguiente CV y extrae la información estructurada:

Nombre del archivo: ${file.name}

Contenido del CV:
---
${cvText}
---
Devuelve SOLO el JSON con los datos extraídos.`
      );

      setProgress(80);
      setStatusMessage("CV analizado correctamente");
      setParsedCV(parsed);
      setStatus("complete");
      setProgress(100);

      return parsed;
    } catch (error) {
      setStatus("failed");
      setStatusMessage(
        error instanceof Error ? error.message : "Error al procesar el CV"
      );
      throw error;
    } finally {
      setUploading(false);
    }
  }

  return { uploadCV, uploading };
}
