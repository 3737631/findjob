"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { callAnthropicJSON } from "@/services/ai/client-browser";
import { EMAIL_GENERATOR_SYSTEM_PROMPT } from "@/prompts/email-generator";
import type { Company } from "@/types";

interface GeneratedEmail {
  subject: string;
  body: string;
}

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
      if (!parsedCV) throw new Error("CV no disponible");

      const email = await callAnthropicJSON<GeneratedEmail>(
        EMAIL_GENERATOR_SYSTEM_PROMPT,
        `Genera un email de presentación personalizado.

DATOS DEL CANDIDATO:
${JSON.stringify(parsedCV, null, 2)}

DATOS DE LA EMPRESA:
${JSON.stringify(match.company, null, 2)}

RAZÓN DEL MATCH:
${match.match_reason}

Devuelve un objeto JSON con "subject" y "body".`
      );

      return email;
    } finally {
      setGenerating(false);
    }
  }

  async function sendEmail(applicationId: string, to: string, subject: string, body: string) {
    setSending(true);

    try {
      window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      updateApplication(applicationId, {
        status: "sent",
        sent_at: new Date().toISOString(),
      });
      return true;
    } finally {
      setSending(false);
    }
  }

  return { generateEmail, sendEmail, generating, sending };
}
