import { logger } from "@/lib/logger";

interface GmailToken {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

export function createGmailClient(accessToken: string) {
  async function sendEmail(to: string, subject: string, body: string) {
    logger.info("Enviando email vía Gmail API", { to, subject });

    const utf8Subject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `To: ${to}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      `Subject: ${utf8Subject}`,
      "",
      body,
    ];

    const message = messageParts.join("\n");
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      logger.error("Error al enviar email vía Gmail", { error });
      throw new Error(`Gmail API error: ${error}`);
    }

    const data = await response.json();
    logger.info("Email enviado exitosamente", { messageId: data.id });

    return data;
  }

  return { sendEmail };
}

export function getGmailAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGmailCode(code: string): Promise<GmailToken> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error exchanging Gmail code: ${error}`);
  }

  return response.json();
}
