import { Container } from "@/components/Container";
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
      <>
        <ExperienceSection />
        <About />
        <Contact />
      </>
    </>
  );
}
