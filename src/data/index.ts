export interface Project {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  technologies: string[];
  thirdParties: string[];
  duration: string;
  images: string[];
  link: string;
}

export const projects: Project[] = [
  {
    id: "hebboSites",
    title: "HebboSites",
    description: "Full-stack web application with Next.js and MongoDB.",
    subtitle: "May 2023 – Jun 2023",
    technologies: [
      "Next.js",
      "Node.js",
      "TypeScript",
      "MongoDB",
      "Tailwind CSS",
    ],
    thirdParties: ["Uploadthing", "GitHub"],
    duration: "May 2023 – Jun 2023",
    images: [
      "https://via.placeholder.com/800x400?text=HebboSites+1",
      "https://via.placeholder.com/800x400?text=HebboSites+2",
    ],
    link: "https://example.com/hebboSites",
  },
  {
    id: "mashabeat",
    title: "Mashabeat",
    description:
      "Collaborated on an e-commerce platform using Shopify, Liquid, jQuery, and Tailwind CSS.",
    subtitle: "Oct 2023 – Mar 2024",
    technologies: ["Shopify", "Liquid", "Tailwind CSS", "jQuery", "Node.js"],
    thirdParties: ["Sox", "Mashabeat Audio"],
    duration: "Oct 2023 – Mar 2024",
    images: [
      "https://via.placeholder.com/800x400?text=Mashabeat+1",
      "https://via.placeholder.com/800x400?text=Mashabeat+2",
    ],
    link: "https://example.com/mashabeat",
  },
  {
    id: "asquaredCrypto",
    title: "Asquared Crypto",
    description:
      "Developed a visually stunning and responsive website using Next.js and Tailwind CSS.",
    subtitle: "May 2023",
    technologies: ["Next.js", "Tailwind CSS"],
    thirdParties: ["Resend"],
    duration: "May 2023",
    images: [
      "https://via.placeholder.com/800x400?text=Asquared+Crypto+1",
      "https://via.placeholder.com/800x400?text=Asquared+Crypto+2",
    ],
    link: "https://example.com/asquaredCrypto",
  },
  {
    id: "asquaredCrypto",
    title: "Asquared Crypto",
    description:
      "Developed a visually stunning and responsive website using Next.js and Tailwind CSS.",
    subtitle: "May 2023",
    technologies: ["Next.js", "Tailwind CSS"],
    thirdParties: ["Resend"],
    duration: "May 2023",
    images: [
      "https://via.placeholder.com/800x400?text=Asquared+Crypto+1",
      "https://via.placeholder.com/800x400?text=Asquared+Crypto+2",
    ],
    link: "https://example.com/asquaredCrypto",
  },
  {
    id: "asquaredCrypto",
    title: "Asquared Crypto",
    description:
      "Developed a visually stunning and responsive website using Next.js and Tailwind CSS.",
    subtitle: "May 2023",
    technologies: ["Next.js", "Tailwind CSS"],
    thirdParties: ["Resend"],
    duration: "May 2023",
    images: [
      "https://via.placeholder.com/800x400?text=Asquared+Crypto+1",
      "https://via.placeholder.com/800x400?text=Asquared+Crypto+2",
    ],
    link: "https://example.com/asquaredCrypto",
  },
];
