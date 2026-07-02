import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseCVWithAI } from "@/services/ai/cv-parser";
import { extractTextFromPDF } from "@/services/cv/parser";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`cv-parse:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const filePath = formData.get("filePath") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!filePath || !fileUrl) {
      return NextResponse.json(
        { error: "filePath y fileUrl son requeridos" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("cvs")
      .download(filePath);

    if (downloadError || !fileData) {
      logger.error("Error descargando CV de Storage", { error: downloadError });
      return NextResponse.json(
        { error: "Error al descargar el archivo" },
        { status: 500 }
      );
    }

    const buffer = await fileData.arrayBuffer();
    const cvText = await extractTextFromPDF(buffer);

    const parsedData = await parseCVWithAI(cvText, filePath.split("/").pop() || "CV.pdf");

    const { error: upsertError } = await supabase.from("cvs").upsert({
      user_id: filePath.split("/")[0],
      raw_file_url: fileUrl,
      parsed_json: parsedData,
    });

    if (upsertError) {
      logger.error("Error guardando CV parseado", { error: upsertError });
    }

    logger.info("CV parseado y guardado", { userId: filePath.split("/")[0] });

    return NextResponse.json({ data: parsedData });
  } catch (error) {
    logger.error("Error en CV parse API", {
      error: (error as Error).message,
    });
    return NextResponse.json(
      { error: "Error al procesar el CV" },
      { status: 500 }
    );
  }
}
