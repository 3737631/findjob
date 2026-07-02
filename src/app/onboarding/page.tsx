"use client";

import { CVUploadCard } from "@/features/cv/upload-card";
import { OnboardingForm } from "@/features/onboarding/onboarding-form";
import { useAppStore } from "@/stores/app-store";

export default function OnboardingPage() {
  const { parsedCV } = useAppStore();

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Configuremos tu perfil
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Primero sube tu CV, luego cuéntanos qué buscas
          </p>
        </div>

        <div className="space-y-8">
          <CVUploadCard />
          {parsedCV && <OnboardingForm />}
        </div>
      </div>
    </div>
  );
}
