import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hsen | Portfolio",
  description: "Next js developer",
  icons: {
    icon: [
      {
        url: "/me.jpeg",
      },
    ],
  },
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
          inter.className + " min-h-screen overflow-y-auto overflow-x-hidden"
        }>
        {children}
      </body>
    </html>
  );
}
