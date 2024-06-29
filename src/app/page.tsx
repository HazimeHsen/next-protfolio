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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowContent(true);
      setShowThreeScene(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {showThreeScene && (
        <div className="three-scene fixed inset-0">
          <ThreeScene />
        </div>
      )}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}>
            <Navbar />
            <Hero />
            <div className="fixed inset-0">
              <Moon />
            </div>
            <ExperienceSection />
            <About />
            <Contact />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
