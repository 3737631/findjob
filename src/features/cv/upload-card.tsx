"use client";

import { useState, useCallback } from "react";
import { useCV } from "@/hooks/use-cv";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CVUploadCard() {
  const [dragOver, setDragOver] = useState(false);
  const { uploadCV, uploading } = useCV();
  const { status, progress, statusMessage } = useAppStore();

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        alert("Solo se aceptan archivos PDF");
        return;
      }
      try {
        await uploadCV(file);
      } catch {}
    },
    [uploadCV]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const isIdle = status === "idle";
  const isComplete = status === "complete";
  const isFailed = status === "failed";

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("cv-upload")?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all",
            dragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-zinc-300 dark:border-zinc-700",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {isComplete ? (
            <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
          ) : isFailed ? (
            <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          ) : (
            <Upload className="mb-4 h-12 w-12 text-zinc-400" />
          )}

          <p className="text-lg font-medium">
            {isComplete
              ? "CV analizado correctamente"
              : isFailed
              ? "Error al analizar el CV"
              : "Sube tu CV en PDF"}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {isComplete
              ? "Puedes continuar con el onboarding"
              : isFailed
              ? statusMessage
              : "Arrastra y suelta o haz clic para seleccionar"}
          </p>

          <input
            id="cv-upload"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleInput}
          />
        </div>

        {uploading && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} />
            <p className="text-center text-sm text-zinc-500">{statusMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
