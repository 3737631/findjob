import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 px-8 py-16 text-center text-white sm:px-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ¿Listo para encontrar tu próximo trabajo?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-blue-100">
          Únete gratis. No necesitas tarjeta de crédito. Tu próxima oportunidad
          está a un clic de distancia.
        </p>
        <div className="mt-8">
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Empezar ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
