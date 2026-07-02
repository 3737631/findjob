import { Navbar } from "@/features/landing/navbar";
import { Hero } from "@/features/landing/hero";
import { Features } from "@/features/landing/features";
import { CTA } from "@/features/landing/cta";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <CTA />
      </main>
    </>
  );
}
