import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get("anthropic-signature");

    if (!signature) {
      return NextResponse.json({ error: "Sin firma" }, { status: 401 });
    }

    logger.info("Webhook de Anthropic recibido", {
      type: body.type,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Error en webhook de Anthropic", {
      error: (error as Error).message,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
