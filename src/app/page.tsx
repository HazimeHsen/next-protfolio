import { Container } from "@/components/Container";
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
      <div className="absolute -top-[180px] -right-[170px]">
        <Moon />
      </div>
      <>
        <ExperienceSection />
        <About />
        <Contact />
      </>
    </>
  );
}
