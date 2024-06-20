import Moon from "@/components/Moon";
import Navbar from "@/components/Navbar";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import ExperienceSection from "@/sections/Experience";
import Hero from "@/sections/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="fixed inset-0">
        <Moon />
      </div>
      <div className="relative z-10">
        <ExperienceSection />
        <About />
        <Contact />
      </div>
    </>
  );
}
