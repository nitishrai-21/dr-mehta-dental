import { AboutPractice } from "@/components/dental/about-practice";
import { AppointmentSection } from "@/components/dental/appointment-section";
import { ClinicAssistant } from "@/components/dental/clinic-assistant";
import { Footer } from "@/components/dental/footer";
import { Hero } from "@/components/dental/hero";
import { Navbar } from "@/components/dental/navbar";
import { SkillsShowcase } from "@/components/dental/skills-showcase";
import { Testimonials } from "@/components/dental/testimonials";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <AboutPractice />
        <SkillsShowcase />
        <Testimonials />
        <AppointmentSection />
      </main>

      <Footer />
      <ClinicAssistant />
    </>
  );
}
