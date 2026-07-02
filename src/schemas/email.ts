import { z } from "zod/v4";

export const emailDraftSchema = z.object({
  company_id: z.string().uuid(),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres").max(200),
  body: z.string().min(50, "El cuerpo debe tener al menos 50 caracteres").max(2000),
});

export const emailSendSchema = z.object({
  application_id: z.string().uuid(),
  to: z.email("Email del destinatario inválido"),
  subject: z.string(),
  body: z.string(),
});

export const batchSendSchema = z.object({
  application_ids: z.array(z.string().uuid()).min(1).max(50),
});

export type EmailDraft = z.infer<typeof emailDraftSchema>;
export type EmailSend = z.infer<typeof emailSendSchema>;
