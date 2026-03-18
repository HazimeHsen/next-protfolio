import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Software Developer & Next.js Website Developer",
  description:
    "Hire Hussein Hazime, a full-stack software developer and Next.js website developer building fast, modern, SEO-friendly web applications.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    ...siteConfig.primaryKeywords,
    "hire web developer",
    "hire next.js developer",
    "freelance web developer",
  ],
  openGraph: {
    title: "Hussein Hazime | Software Developer & Next.js Website Developer",
    description:
      "Portfolio and case studies by Hussein Hazime, a full-stack software developer focused on high-performance Next.js and React applications.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hussein Hazime | Software Developer & Next.js Website Developer",
    description:
      "Portfolio and case studies by Hussein Hazime, a full-stack software developer focused on high-performance Next.js and React applications.",
  },
};

export default function Home() {
  return <HomePageClient />;
}
