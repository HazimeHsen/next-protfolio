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
    thirdParties: ["Uploadthing"],
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
    thirdParties: ["Sox"],
    duration: "Oct 2023 – Mar 2024",
    images: ["/projects/mashabeat/mashabeat.jpeg"],
    type: "laptop",
    link: "https://mashabeat.com",
  },
  {
    id: "3d-bag",
    title: "3d Bag",
    description:
      "Developed a visually stunning and responsive 3d website using Next.js, Tailwind CSS and Three.js.",
    subtitle: "May 2023",
    technologies: ["Next.js", "Tailwind CSS", "Three.js"],
    thirdParties: [""],
    duration: "Jul 2024",
    images: ["/projects/3d-bag/3d-bag.png"],
    type: "laptop",
    link: "https://3d-bag-project.vercel.app",
  },

  {
    id: "mibio.bio",
    title: "Mibio.bio",
    description:
      "Developed a visually stunning and responsive NFC card website using Next.js, Tailwind CSS, and Firebase, working collaboratively with a team. The site features dynamic content management and seamless integration with Firebase for real-time data handling.",
    subtitle: "May 2023",
    technologies: ["Next.js", "Tailwind CSS", "Firebase"],
    thirdParties: [""],
    duration: "Apr 2024",
    images: ["/projects/mibio.bio/mibio.bio.jpeg"],
    type: "laptop",
    link: "https://mibio.bio",
  },
  {
    id: "restarunat",
    title: "Restarunat",
    description:
      "Developed a visually stunning and responsive website using Next.js, Tailwind CSS and Sanity.io.",
    subtitle: "Dec 2023",
    technologies: ["Next.js", "Tailwind CSS", "Sanity"],
    thirdParties: ["Sanity"],
    duration: "May 2023",
    images: ["/projects/resturant/returant.png"],
    type: "laptop",
    link: "https://restarunat.vercel.app",
  },
  {
    id: "asquaredCrypto",
    title: "Asquared Crypto",
    description:
      "Developed a visually stunning and responsive website using Next.js and Tailwind CSS.",
    subtitle: "Jul 2023",
    technologies: ["Next.js", "Tailwind CSS"],
    thirdParties: ["Resend"],
    duration: "May 2023",
    images: ["/projects/AsquaredCrypto/AsquaredCrypto.png"],
    type: "laptop",
    link: "https://asquaredCrypto.com",
  },
];
