"use client";

import { Upload, Brain, Building2, Mail, CheckCircle, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Sube tu CV",
    description: "Arrastra y suelta tu PDF. La IA extrae automáticamente tu experiencia, skills y formación.",
  },
  {
    icon: Brain,
    title: "IA que te entiende",
    description: "Claude analiza tu perfil y aprende qué buscas para encontrar las mejores oportunidades.",
  },
  {
    icon: Building2,
    title: "Empresas compatibles",
    description: "Buscamos en múltiples fuentes empresas que encajan con tu perfil y preferencias.",
  },
  {
    icon: Mail,
    title: "Emails personalizados",
    description: "Generamos borradores únicos para cada empresa. Tú editas y decides cuándo enviar.",
  },
  {
    icon: CheckCircle,
    title: "Tú controlas todo",
    description: "Ningún email sale sin tu aprobación. Revisa, edita y envía cuando quieras.",
  },
  {
    icon: BarChart3,
    title: "Dashboard inteligente",
    description: "Sigue tus aplicaciones, respuestas y métricas en tiempo real.",
  },
];

export function Features() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Todo lo que necesitas para
          <br />
          <span className="text-blue-600 dark:text-blue-400">
            impulsar tu carrera
          </span>
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
