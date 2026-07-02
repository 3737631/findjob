"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Edit3, Loader2 } from "lucide-react";
import type { Company, GeneratedEmail } from "@/types";

interface EmailEditorProps {
  company: Company;
  draft: GeneratedEmail;
  onSend: (subject: string, body: string) => Promise<void>;
  onEdit: (subject: string, body: string) => void;
  sending?: boolean;
}

export function EmailEditor({ company, draft, onSend, onEdit, sending }: EmailEditorProps) {
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Email para {company.name}</h3>
            <p className="text-sm text-zinc-500">
              Revisa y edita antes de enviar
            </p>
          </div>
          <Edit3 className="h-5 w-5 text-zinc-400" />
        </div>

        <div className="space-y-2">
          <Label>Asunto</Label>
          <Input
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              onEdit(e.target.value, body);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Cuerpo del email</Label>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              onEdit(subject, e.target.value);
            }}
            className="min-h-[200px] w-full rounded-md border border-zinc-200 bg-white p-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            {company.contact_email
              ? `Se enviará a: ${company.contact_email}`
              : "No tenemos email de contacto — añádelo manualmente"}
          </p>
          <Button
            onClick={() => onSend(subject, body)}
            disabled={sending || !company.contact_email}
          >
            {sending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
