import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hsen | Portfolio",
  description:
    "Welcome to Hsen's portfolio, showcasing my skills and projects as a Next.js developer. Explore my work in web development, including modern technologies like Tailwind CSS, Three.js, and React Three Fiber. Discover my journey, experience, and the innovative solutions I've crafted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          poppins.className + " min-h-screen overflow-y-auto overflow-x-hidden"
        }>
        {children}
      </body>
    </html>
  );
}
