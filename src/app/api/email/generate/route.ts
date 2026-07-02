import { NextRequest, NextResponse } from "next/server";
import { generateEmailWithAI } from "@/services/ai/email-generator";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { ParsedCV, Company } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`email-generate:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const cv = body.cv as ParsedCV;
    const company = body.company as Company;
    const matchReason = body.matchReason as string;

    if (!cv || !company) {
      return NextResponse.json(
        { error: "CV y empresa son requeridos" },
        { status: 400 }
      );
    }

    const email = await generateEmailWithAI(cv, company, matchReason);

    logger.info("Email generado", { company: company.name });

    return NextResponse.json({ data: email });
  } catch (error) {
    logger.error("Error generando email", {
      error: (error as Error).message,
    });
    return NextResponse.json(
      { error: "Error al generar el email" },
      { status: 500 }
    );
  }
}
