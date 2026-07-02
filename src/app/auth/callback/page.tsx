"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const supabase = createClient();
    let timeout: ReturnType<typeof setTimeout>;

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        clearTimeout(timeout);
        router.push("/onboarding");
      }
    });

    timeout = setTimeout(() => {
      setError("La autenticación tardó demasiado. Intenta de nuevo.");
    }, 15000);

    return () => {
      listener?.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-bold text-red-600">Error de autenticación</h1>
          <p className="mt-2 text-sm text-zinc-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-zinc-600">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
