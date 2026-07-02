import { logger } from "@/lib/logger";

export async function extractTextFromPDF(
  fileBuffer: ArrayBuffer
): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (error) {
    logger.error("Error extrayendo texto del PDF", {
      error: (error as Error).message,
    });
    throw new Error("No se pudo extraer el texto del PDF");
  }
}
