"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import ExperienceSection from "@/sections/Experience";
import Hero from "@/sections/Hero";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Moon from "@/components/Moon";
import ThreeScene from "@/components/StartAnimation";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showThreeScene, setShowThreeScene] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleFadeOutComplete = () => {
    setShowThreeScene(false);
    setShowContent(true);
  };

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        handleFadeOutComplete();
      }, 4700);

      return () => clearTimeout(timeout);
    }
  }, []);

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
              <About />
              <ExperienceSection />
              <Contact />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
