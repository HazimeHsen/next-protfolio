import {
  FaBriefcase,
  FaGithub,
  FaGraduationCap,
  FaInstagram,
  FaLaptopCode,
  FaLinkedinIn,
} from "react-icons/fa";

export const heroContent = {
  title: "Hussein Hazime \n Full-Stack Developer",
  description:
    "Hey there! I’m Hussein Hazime, a creative and dedicated full-stack developer. I specialize in building dynamic and responsive web applications using React.js, Node.js, and MongoDB. Let’s create something amazing together!",
};

export const highlightsContent = [
  { nb: 1.5, title: "Years of Experience" },
  { nb: 10, title: "Projects Completed" },
  { nb: 9, title: "Happy Clients" },
];

export const experiencesContent = [
  {
    title: "Fullstack Developer",
    subtitle: "Self-employed",
    date: "May 2023 – Present",
    icon: FaBriefcase,
  },
  {
    title: "Frontend Internship",
    subtitle: "SmartSoft Company",
    date: "Aug 2023 – Oct 2023",
    icon: FaLaptopCode,
  },
  {
    title: "Fullstack Developer",
    subtitle: "HebboSites Company",
    date: "May 2023 – May 2024",
    icon: FaBriefcase,
  },
  {
    title: "Computer Science",
    subtitle: "Islamic University Of Lebanon",
    date: "Oct 2022 – Feb 2025",
    icon: FaGraduationCap,
  },
  {
    title: "CCNE",
    subtitle: "Lebanese University",
    date: "Oct 2021 – May 2022",
    icon: FaGraduationCap,
  },
];

export const projects = [
  {
    id: "hebboSites",
    title: "HebboSites",
    description:
      "Developed a full-stack web application for HebboSites, a company specializing in software creation, using Next.js, MongoDB, and Tailwind CSS.",
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
      "Developed a visually stunning and responsive website using Next.js and Tailwind CSS for a company specializing in crypto.",
    subtitle: "Jul 2023",
    technologies: ["Next.js", "Tailwind CSS"],
    thirdParties: ["Resend"],
    duration: "May 2023",
    images: ["/projects/AsquaredCrypto/AsquaredCrypto.png"],
    type: "laptop",
    link: "https://asquaredCrypto.com",
  },
];

export const aboutContent = {
  title: "Hi there!",
  intro:
    "I'm Hussein Hazime, a passionate junior full-stack web developer based in Lebanon, working as a freelancer. My expertise lies in UX design, UI animations, and rapid prototyping, allowing me to quickly bring ideas to life and validate user experiences.",
  hobbies:
    "When I'm not coding, you'll find me playing video games or cheering for Real Madrid. I'm always open to new and exciting projects, so don't hesitate to reach out!",
  sectionTitle: "About Me",
};

export const contactContent = {
  title: "Get in Touch",
  description:
    "Have a question or want to work together? Fill out the form below and I will get back to you as soon as possible.",
  socialsTitle: "Socials",
  socialLinks: [
    { href: "https://www.instagram.com/husseinhazime_1", icon: FaInstagram },
    { href: "https://github.com/HazimeHsen", icon: FaGithub },
    {
      href: "https://www.linkedin.com/in/hussein--hazime/",
      icon: FaLinkedinIn,
    },
  ],
  placeholders: {
    name: "hsen",
    email: "hsen@gmail.com",
    message: "Helloooooo",
  },
  submitButton: "Send",
  submittingButton: "Sending...",
  successMessage: "Message Sent Successfully",
};
