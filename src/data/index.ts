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
  type: "phone" | "laptop";
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
    images: ["/projects/hebbosites/hebbosites.jpeg"],
    type: "laptop",
    link: "https://hebboSites.com",
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
    images: ["/projects/mashabeat/mashabeat.jpeg"],
    type: "laptop",
    link: "https://mashabeat.com",
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
    images: ["/projects/mibio.bio/mibio.bio.jpeg"],
    type: "laptop",
    link: "https://asquaredCrypto.com",
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
    images: ["/projects/mashabeat/mashabeat.jpeg"],
    type: "laptop",
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
    images: ["/projects/mashabeat/mashabeat.jpeg"],
    type: "laptop",
    link: "https://example.com/asquaredCrypto",
  },
];
