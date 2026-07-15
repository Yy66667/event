import Hero from "./components/hero";
import StatsStrip from "./components/StatsStrip";
import ServicesGrid from "./components/ServicesGrid";
import PortfolioPreview from "./components/PortfolioPreview";
import ProcessSection from "./components/ProcessSection";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ServicesGrid />
      <PortfolioPreview />
      <ProcessSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
