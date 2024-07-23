"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import ExperienceSection from "@/sections/Experience";
import Hero from "@/sections/Hero";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Moon from "@/components/3d/Moon";
import ThreeScene from "@/components/3d/StartAnimation";
import Highlights from "@/sections/Highlights";
import Projects from "@/sections/Projects";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showThreeScene, setShowThreeScene] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasShownAnimation = sessionStorage.getItem("hasShownAnimation");
    if (hasShownAnimation) {
      setShowThreeScene(false);
      setShowContent(true);
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("hasShownAnimation");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleFadeOutComplete = () => {
    sessionStorage.setItem("hasShownAnimation", "true");
    setShowThreeScene(false);
    setShowContent(true);
  };

  return (
    <div className="relative overflow-hidden">
      {showThreeScene && (
        <ThreeScene
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onFadeOutComplete={handleFadeOutComplete}
        />
      )}
      <AnimatePresence>
        {showContent && (
          <>
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative z-20">
              <Navbar />
              <Hero />
              <div className="fixed inset-0">
                <Moon />
              </div>
              <Highlights />
              <Projects />
              <ExperienceSection />
              <About />
              <Contact />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
