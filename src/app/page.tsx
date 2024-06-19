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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 ">
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
