import LandingNavbar from "@/components/landing/NavItems";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import ChildThreadsSection from "@/components/landing/ChildThreadsSection";
import HackathonFeature from "@/components/landing/HackathonFeature";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="bg-white">
      <LandingNavbar/>
      <main>
        <Hero />
        <Features />
        <ChildThreadsSection />
        <HowItWorks />
        <HackathonFeature />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;