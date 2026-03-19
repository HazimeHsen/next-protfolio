"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

export default function HomePageClient() {
  // Three possible states: "animation" | "transitioning" | "content"
  // Never show content until animation explicitly completes
  const [phase, setPhase] = useState<"animation" | "content">("animation");

  useEffect(() => {
    // Only skip animation if session flag is already set
    const hasShown = sessionStorage.getItem("hasShownAnimation");
    if (hasShown) {
      setPhase("content");
    }

    // Clear flag on real page unload so animation plays on next visit
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("hasShownAnimation");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Called ONLY when the animation has truly finished and faded out
  const handleFadeOutComplete = useCallback(() => {
    sessionStorage.setItem("hasShownAnimation", "true");
    setPhase("content");
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ThreeScene stays mounted until animation completes —
          it manages its own fade, then calls onFadeOutComplete */}
      {phase === "animation" && (
        <ThreeScene onFadeOutComplete={handleFadeOutComplete} />
      )}

      <AnimatePresence>
        {phase === "content" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20"
          >
            <Navbar />
            <Hero />
            <div className="pointer-events-none fixed inset-0 z-0">
              <Moon />
            </div>
            <div>
              <Highlights />
              <Projects />
              <ExperienceSection />
              <About />
              <Contact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-8SNS7WXM1Y"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8SNS7WXM1Y');
        `}
      </Script>
    </div>
  );
}