"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";

type Tab = {
  name: string;
  path: string;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setActive(newTabs[0]);
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      let current = "home";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 120) {
          current = section.getAttribute("id") || "home";
        }
      });

      const activeTab = propTabs.find(
        (tab) => tab.name.toLowerCase() === current
      );
      if (activeTab) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setActive(activeTab);
        }, 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [propTabs]);

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}>
        {propTabs.map((tab, idx) => (
          <a href={tab.path} key={tab.name}>
            <button
              onClick={() => moveSelectedTabToTop(idx)}
              className={cn(
                "relative px-1.5 md:px-3 py-2 rounded-full",
                tabClassName
              )}
              style={{
                transformStyle: "preserve-3d",
              }}>
              {active.name === tab.name && (
                <motion.div
                  layoutId="clickedbutton"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    "absolute inset-0 bg-white rounded-full ",
                    activeTabClassName
                  )}
                />
              )}

              <span
                className={`relative block text-xs md:text-sm cursor-pointer transition-colors duration-200 ${
                  active.name === tab.name ? "text-black" : "text-white"
                }`}>
                {tab.name}
              </span>
            </button>
          </a>
        ))}
      </div>
    </>
  );
};

export default function Navbar() {
  const tabs = [
    { name: "Home", path: "/#" },
    { name: "Highlights", path: "/#highlights" },
    { name: "Experience", path: "/#experience" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <div className="flex flex-col z-[5000] items-start justify-start border-2 border-zinc-800 rounded-full fixed top-4 left-1/2 radial-gradient -translate-x-1/2 p-1">
      <Tabs tabs={tabs} />
    </div>
  );
}
