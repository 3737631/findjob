"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";

export function useCV() {
  const [uploading, setUploading] = useState(false);
  const { setStatus, setProgress, setStatusMessage, setParsedCV } =
    useAppStore();

  async function uploadCV(file: File) {
    setUploading(true);
    setStatus("uploading");
    setProgress(10);
    setStatusMessage("Subiendo CV...");

    try {
      const supabase = createClient();
      const user = await supabase.auth.getUser();

      if (!user.data.user) {
        throw new Error("Usuario no autenticado");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.data.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setProgress(30);
      setStatusMessage("Analizando CV...");

      const { data: urlData } = supabase.storage
        .from("cvs")
        .getPublicUrl(filePath);

      setStatus("parsing");
      setProgress(50);

      const formData = new FormData();
      formData.append("filePath", filePath);
      formData.append("fileUrl", urlData.publicUrl);

      const response = await fetch("/api/cv/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al parsear CV");
      }

      const { data: parsedData } = await response.json();

      setProgress(80);
      setStatusMessage("CV analizado correctamente");
      setParsedCV(parsedData);
      setStatus("complete");
      setProgress(100);

      return parsedData;
    } catch (error) {
      setStatus("failed");
      setStatusMessage(
        error instanceof Error ? error.message : "Error al procesar el CV"
      );
      throw error;
    } finally {
      setUploading(false);
    }
  }

  return { uploadCV, uploading };
}
