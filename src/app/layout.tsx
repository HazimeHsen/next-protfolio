import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hussein Hazime | Full-Stack Developer | React & Next.js Portfolio",
  description:
    "Hussein Hazime's portfolio showcasing expertise in full-stack development using React, Next.js, Node.js, and Tailwind CSS. Explore projects, skills, and web development journey.",
  keywords: [
    "Hussein Hazime",
    "full-stack developer",
    "React",
    "Next.js",
    "Tailwind CSS",
    "JavaScript developer",
    "Hsen portfolio",
    "React portfolio",
    "Next.js portfolio",
    "web developer portfolio",
  ],
  openGraph: {
    title: "Hussein Hazime | Full-Stack Developer | React & Next.js Portfolio",
    description:
      "Discover Hussein Hazime's portfolio as a skilled full-stack developer specializing in React, Next.js, Node.js, and Tailwind CSS. View projects and web development journey.",
    url: "https://hsen.me",
    siteName: "Hussein Hazime Portfolio",
    images: [
      {
        url: "https://hsen.me/_next/image?url=%2Fpersonal%2Fme.jpg&w=384&q=100",
        width: 1200,
        height: 630,
        alt: "Hussein Hazime Full-Stack Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hussein Hazime | Full-Stack Developer | React & Next.js Portfolio",
    description:
      "Explore Hussein Hazime's portfolio, showcasing projects and skills as a React, Next.js, and Tailwind CSS developer.",
    images: ["https://hsen.me/_next/image?url=%2Fpersonal%2Fme.jpg&w=384&q=100"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} min-h-screen overflow-y-auto overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
