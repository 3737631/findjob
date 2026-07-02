import { NextRequest, NextResponse } from "next/server";
import { createGmailClient } from "@/services/email/gmail";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`email-send:${ip}`, {
      windowMs: 60_000,
      maxRequests: 10,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados envíos. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { applicationId, to, subject, body: emailBody } = body;

    if (!applicationId || !to || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: tokens } = await supabase
      .from("user_tokens")
      .select("access_token")
      .single();

    if (!tokens?.access_token) {
      return NextResponse.json(
        { error: "Conecta tu Gmail primero en Configuración" },
        { status: 400 }
      );
    }

    const gmail = createGmailClient(tokens.access_token);
    await gmail.sendEmail(to, subject, emailBody);

    await supabase.from("applications").update({
      status: "sent",
      sent_at: new Date().toISOString(),
    }).eq("id", applicationId);

    await supabase.from("application_logs").insert({
      application_id: applicationId,
      action: "sent",
      metadata: { to, subject, sent_at: new Date().toISOString() },
    });

    logger.info("Email enviado y registrado", { applicationId, to });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error enviando email", {
      error: (error as Error).message,
    });
    return NextResponse.json(
      { error: "Error al enviar el email. Verifica tu conexión de Gmail." },
      { status: 500 }
    );
  }
}
