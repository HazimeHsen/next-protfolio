import {
  FaBriefcase,
  FaGithub,
  FaInstagram,
  FaLaptopCode,
  FaLinkedinIn,
} from "react-icons/fa";

export const heroContent = {
  title: "Hussein Hazime \n Full-Stack Software Engineer",
  description:
    "Full-Stack Software Engineer with 3.5+ years of professional experience building scalable, production-grade web and mobile applications across e-commerce, AI-powered platforms, licensing systems, and real-time environments.",
};

export const highlightsContent = [
  { nb: 3.5, title: "Years of Experience" },
  { nb: 5, title: "Key Projects" },
  { nb: 4, title: "Professional Roles" },
];

export const experiencesContent = [
  {
    title: "Software Engineer",
    subtitle: "BBCorp",
    date: "Nov 2025 - Present",
    icon: FaBriefcase,
    highlights: [
      "Develop full-stack applications using Next.js, React, NestJS, Firebase, MongoDB, and Flutter.",
      "Design and implement secure backend services and RESTful APIs.",
      "Integrate third-party APIs and real-time data services.",
      "Implement background jobs and scheduled tasks using cron.",
      "Develop multi-language applications (English and Arabic).",
    ],
  },
  {
    title: "Freelancer",
    subtitle: "Mibio.am",
    date: "May 2023 - Present",
    icon: FaBriefcase,
    highlights: [
      "Built a full-featured e-commerce platform with Next.js, Medusa.js, Tailwind CSS, and shadcn/ui.",
      "Integrated secure bank payment APIs for transactions, refunds, and cancellations.",
      "Implemented secure cron jobs for order handling and automated system processes.",
      "Built an internal admin dashboard with authentication, product, order, and analytics modules.",
      "Developed a connected React Native and Expo mobile application.",
    ],
  },
  {
    title: "Frontend Intern",
    subtitle: "SmartSoft Company",
    date: "Aug 2023 - Oct 2023",
    icon: FaLaptopCode,
    highlights: [
      "Developed web applications with React.js.",
      "Built a React + Material UI + AgGrid application.",
      "Used Git for collaboration and version control.",
    ],
  },
  {
    title: "Fullstack Developer",
    subtitle: "HebboSites Company",
    date: "Aug 2023 - Oct 2023",
    icon: FaBriefcase,
    highlights: [
      "Full-stack development with MongoDB, Next.js, React, Tailwind CSS, and Sanity.io.",
      "Built RESTful APIs and implemented authentication.",
      "Designed responsive UI/UX systems and optimized database performance.",
    ],
  },
];

export const projects = [
  {
    id: "mashabeat",
    title: "Mashabeat",
    description:
      "Music-focused e-commerce platform where artists can register, upload, and monetize their content with secure purchase workflows.",
    subtitle: "2023",
    technologies: ["Shopify", "Liquid", "jQuery", "Tailwind CSS", "SoX"],
    thirdParties: ["Shopify", "SoX"],
    duration: "2023",
    images: [
      "/projects/mashabeat/mashabeat.jpeg",
      "/projects/mashabeat/mashabeat-2.jpeg",
      "/projects/mashabeat/mashabeat-3.jpeg",
    ],
    type: "laptop",
    link: "https://mashabeat.com/",
    highlights: [
      "Implemented artist dashboards, digital purchase workflows, and custom commerce features.",
      "Integrated a SoX-based audio watermarking pipeline for content protection.",
      "Built an optimized audio player with interactive reviews and likes.",
    ],
  },
  {
    id: "mibio-bio",
    title: "Mibio.bio",
    description:
      "NFC-powered digital business card platform for creating and managing professional profiles with synchronized web and mobile experiences.",
    subtitle: "2024",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Firebase",
      "React Native",
      "Expo",
    ],
    thirdParties: ["Firebase"],
    duration: "2024",
    images: [
      "/projects/mibio.bio/mibio.bio.jpeg",
      "/projects/mibio.bio/mibio.bio-2.jpeg",
      "/projects/mibio.bio/mibio.bio-3.jpeg",
    ],
    type: "laptop",
    link: "https://mibio.bio",
    highlights: [
      "Built secure dashboards for profile editing and multiple profile creation.",
      "Implemented multi-language support and real-time synchronization.",
      "Delivered shared backend architecture across web and mobile.",
    ],
  },
  {
    id: "mibio-am",
    title: "Mibio.am",
    description:
      "Full-scale multi-language e-commerce platform with secure bank payments, refunds, order cancellations, and connected admin/mobile apps.",
    subtitle: "2025",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "shadcn/ui",
      "Medusa.js",
      "React Native",
      "Expo",
      "Supabase",
    ],
    thirdParties: ["Bank API", "Medusa.js", "Supabase"],
    duration: "2025",
    images: [
      "/projects/mibio.am/mibio.am.jpeg",
      "/projects/mibio.am/mibio.am-2.jpeg",
      "/projects/mibio.am/mibio.am-3.jpeg",
    ],
    type: "laptop",
    link: "https://mibio.am",
    highlights: [
      "Implemented Armenian and English localization end-to-end.",
      "Implemented secure payment, refund, cancellation, and multi-currency order logic.",
      "Developed a custom admin dashboard for products, orders, users, and analytics.",
    ],
  },
  {
    id: "hayvors",
    title: "Hayvors",
    description:
      "Online hunter licensing platform for applying, purchasing, and renewing hunting licenses with QR verification and admin workflows.",
    subtitle: "2025",
    technologies: ["Next.js", "Tailwind CSS", "shadcn/ui", "Google APIs"],
    thirdParties: ["Bank API", "Google APIs"],
    duration: "2025",
    images: [
      "/projects/hayvors/hayvors.png",
      "/projects/hayvors/hayvors-2.png",
      "/projects/hayvors/hayvors-3.png",
    ],
    type: "laptop",
    link: "https://hayvors.am",
    highlights: [
      "Implemented license purchasing for single-year and multi-year subscriptions with renewals.",
      "Generated dynamic license cards with QR-based public verification profiles.",
      "Integrated payment and refund flows with bank APIs.",
      "Integrated Google APIs for document data extraction and built admin tools for approvals, users, licenses, and payments.",
    ],
  },
  {
    id: "legacy",
    title: "Legacy",
    description:
      "Memorial portfolio platform for preserving stories with dynamic profiles, media galleries, and secure interactions.",
    subtitle: "2025",
    technologies: ["Next.js", "Tailwind CSS", "Firebase"],
    thirdParties: ["Firebase"],
    duration: "2025",
    images: [
      "/projects/legacy/legacy.png",
      "/projects/legacy/legacy-2.png",
      "/projects/legacy/legacy-3.png",
    ],
    type: "laptop",
    link: "https://legacy.am",
    highlights: [
      "Implemented dynamic profile pages for biographies and memories.",
      "Built secure comment features and media management dashboard.",
      "Designed a responsive, accessibility-focused interface.",
    ],
  },
];

export const aboutContent = {
  title: "Hi there!",
  intro:
    "I am Hussein Hazime, a full-stack software engineer based in Lebanon with 3.5+ years of experience delivering scalable, production-grade web and mobile applications.",
  hobbies:
    "My stack includes Next.js, React, Node.js (NestJS), Firebase, MongoDB, Supabase, React Native, Expo, and Flutter, with hands-on experience in AI integrations, payment systems, cron automation, and real-time applications.",
  sectionTitle: "About Me",
};

export const contactContent = {
  title: "Get in Touch",
  description:
    "Have a question or want to collaborate on a project? Send a message and I will get back to you as soon as possible.",
  socialsTitle: "Socials",
  socialLinks: [
    { href: "https://github.com/HazimeHsen", icon: FaGithub },
    {
      href: "https://www.linkedin.com/in/hussein--hazime/",
      icon: FaLinkedinIn,
    },
    {
      href: "https://www.instagram.com/hsen.hazime/",
      icon: FaInstagram,
    },
  ],
  placeholders: {
    name: "Hussein Hazime",
    email: "hazimehussein01@gmail.com",
    message: "Let's discuss your project requirements...",
  },
  submitButton: "Send",
  submittingButton: "Sending...",
  successMessage: "Message Sent Successfully",
};
