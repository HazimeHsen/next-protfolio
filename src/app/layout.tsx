import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hussein Hazime | Full-Stack Developer Portfolio",
  description:
    "Explore the portfolio of Hussein Hazime, a passionate full-stack developer specializing in React.js, Node.js, and MongoDB. Discover projects, skills, and the journey in web development.",
  openGraph: {
    title: "Hussein Hazime | Full-Stack Developer Portfolio",
    description:
      "Explore the portfolio of Hussein Hazime, a passionate full-stack developer specializing in React.js, Node.js, and MongoDB. Discover projects, skills, and the journey in web development.",
    url: "https://hsen.me",
    siteName: "Hussein Hazime Portfolio",
    images: [
      {
        url: "https://hsen.me/_next/image?url=%2Fpersonal%2Fme.jpg&w=384&q=100",
        width: 1200,
        height: 630,
        alt: "Hussein Hazime Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hussein Hazime | Full-Stack Developer Portfolio",
    description:
      "Explore the portfolio of Hussein Hazime, a passionate full-stack developer specializing in React.js, Node.js, and MongoDB. Discover projects, skills, and the journey in web development.",
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
