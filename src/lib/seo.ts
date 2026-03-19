const fallbackSiteUrl = "https://hsen.me";

const ensureAbsoluteSiteUrl = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const normalizedSiteUrl = ensureAbsoluteSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl
);

export const siteConfig = {
  name: "Hussein Hazime Portfolio",
  title: "Hussein Hazime | Full-Stack, Next.js, and Website Developer",
  description:
    "Hussein Hazime is a Software Engineer and website developer building SEO-friendly, high-performance Next.js and React applications for startups and businesses.",
  ownerName: "Hussein Hazime",
  role: "Software Engineer",
  email: "hazimehussein01@gmail.com",
  phone: "+96178905718",
  location: "Lebanon",
  linkedin: "https://linkedin.com/in/hussein--hazime/",
  github: "https://github.com/HazimeHsen",
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Medusa.js",
    "shadcn/ui",
    "Firebase",
    "MongoDB",
    "MySQL",
    "Supabase",
    "WebSockets",
    "React Native",
    "Expo",
    "Flutter",
    "OpenAI GPT",
    "Google Gemini",
    "Vertex AI",
    "SoX",
    "FFmpeg",
  ],
  url: normalizedSiteUrl,
  ogImage: "/personal/me.jpg",
  locale: "en_US",
  primaryKeywords: [
    "Hussein Hazime",
    "software developer",
    "web developer",
    "website developer",
    "full-stack developer",
    "Software Engineer",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "frontend developer",
    "backend developer",
    "portfolio",
  ],
} as const;

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();
