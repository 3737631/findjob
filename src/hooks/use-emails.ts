"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { logger } from "@/lib/logger";

export function useEmails() {
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const { addApplication, updateApplication, parsedCV, matches } =
    useAppStore();

  async function generateEmail(companyId: string) {
    setGenerating(true);

    try {
      const match = matches.find((m) => m.company.id === companyId);
      if (!match) throw new Error("Empresa no encontrada");

      const response = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv: parsedCV,
          company: match.company,
          matchReason: match.match_reason,
        }),
      });

      if (!response.ok) throw new Error("Error al generar email");

      const { data } = await response.json();
      return data;
    } finally {
      setGenerating(false);
    }
  }

  async function sendEmail(applicationId: string, to: string, subject: string, body: string) {
    setSending(true);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, to, subject, body }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al enviar email");
      }

      updateApplication(applicationId, {
        status: "sent",
        sent_at: new Date().toISOString(),
      });

      logger.info("Email enviado exitosamente", { applicationId });
      return true;
    } finally {
      setSending(false);
    }
  }

  return { generateEmail, sendEmail, generating, sending };
}
