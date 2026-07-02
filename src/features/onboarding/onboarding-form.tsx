"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, Building2, MapPin, Globe } from "lucide-react";
import type { UserPreferences, JobType } from "@/types";
import { cn } from "@/lib/utils";

const jobTypes: { value: JobType; label: string; icon: typeof Globe }[] = [
  { value: "remote", label: "Remoto", icon: Globe },
  { value: "hybrid", label: "Híbrido", icon: Building2 },
  { value: "onsite", label: "Presencial", icon: MapPin },
];

export function OnboardingForm() {
  const router = useRouter();
  const { setPreferences } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    target_role: "",
    location: "",
    job_type: "remote" as JobType,
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);

    const preferences: UserPreferences = {
      target_role: form.target_role,
      location: form.location,
      job_type: form.job_type,
      remote_preferred: form.job_type === "remote",
    };

    setPreferences(preferences);
    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 w-16 rounded-full transition-colors",
                  s <= step ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"
                )}
              />
            ))}
          </div>
          <h2 className="text-center text-2xl font-bold">
            {step === 1
              ? "¿Qué puesto buscas?"
              : step === 2
              ? "¿Dónde estás ubicado?"
              : "¿Qué modalidad prefieres?"}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            {step === 1
              ? "Cuéntanos el rol al que aspiras"
              : step === 2
              ? "Indica tu ciudad o región"
              : "Elige cómo quieres trabajar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="role">Rol deseado</Label>
              <Input
                id="role"
                value={form.target_role}
                onChange={(e) => updateField("target_role", e.target.value)}
                placeholder="Ej: Full Stack Developer, Product Manager..."
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Ej: Madrid, España (o 'Remoto')"
                required
              />
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3">
              {jobTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField("job_type", value)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                    form.job_type === value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  )}
                >
                  <Icon className="h-6 w-6 text-zinc-500" />
                  <div>
                    <p className="font-medium">{label}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : step < 3 ? (
              <>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Ir al Dashboard"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
