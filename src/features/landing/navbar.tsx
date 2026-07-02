"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-lg dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-5 w-5 text-blue-600" />
          AI Job Agent
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/login">
            <Button size="sm">Vincular con Google</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
