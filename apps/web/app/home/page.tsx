import { Navbar } from "~/components/landing/navbar";
import { HeroSection } from "~/components/landing/hero-section";
import { StatsSection } from "~/components/landing/stats-section";
import { FeaturesSection } from "~/components/landing/features-section";
import { ProgressionSection } from "~/components/landing/progression-section";
import { WorldsSection } from "~/components/landing/worlds-section";
import { CTASection } from "~/components/landing/cta-section";
import { Footer } from "~/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlockForm — Build forms, block by block",
  description:
    "Create beautiful forms, share them anywhere, and turn every response into something you can build on.",
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0d1117" }}>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ProgressionSection />
        <WorldsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
