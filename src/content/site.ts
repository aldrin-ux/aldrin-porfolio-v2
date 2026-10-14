export const siteMetadata = {
  name: "Aldrin Camacho",
  title: "Aldrin Camacho - Webflow Developer & Digital Experience Specialist",
  description:
    "Portfolio of Aldrin Camacho, a Webflow Developer with a background in UX/UI and service design. Featured work covers marketing websites developed under Dazlab.",
  image: "/assets/aldrin-hero.webp",
  language: "en",
  socialLinks: ["https://www.linkedin.com/in/drin-camacho/"],
};

export const navItems = [
  { label: "Work", href: "/work/" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Services", href: "/#expertise" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const projects = [
  {
    title: "Dazlab",
    slug: "dazlab",
    href: "/work/dazlab/",
    externalUrl: "https://dazlab.digital/",
    role: "Webflow development for Dazlab",
    tags: ["Product Studio", "Webflow", "Responsive"],
    summary:
      "Webflow implementation of Dazlab's product-studio marketing website, developed under Dazlab as its sole Webflow developer.",
    image: "/assets/dazlab.png",
    alt: "Dazlab SaaS product studio website showcase",
  },
  {
    title: "Mortar",
    slug: "mortar",
    href: "/work/mortar/",
    externalUrl: "https://mortar.design/",
    role: "Webflow development for Dazlab",
    tags: ["Interior-design SaaS", "Webflow", "Responsive"],
    summary:
      "Webflow implementation of Mortar's interior-design software marketing website, developed under Dazlab as its sole Webflow developer.",
    image: "/assets/mortar.png",
    alt: "Mortar interior-design SaaS website showcase",
  },
  {
    title: "Handl",
    slug: "handl",
    href: "/work/handl/",
    externalUrl: "https://handl.works/",
    role: "Webflow development for Dazlab",
    tags: ["Agency Billing", "Webflow", "Responsive"],
    summary:
      "Webflow implementation of Handl's agency billing marketing website, developed under Dazlab as its sole Webflow developer.",
    image: "/assets/handl.png",
    alt: "Handl agency operations SaaS website showcase",
  },
  {
    title: "Tangilla",
    slug: "tangilla",
    href: "/work/tangilla/",
    externalUrl: "https://tangilla.com/",
    role: "Webflow development for Dazlab",
    tags: ["Member Management", "Webflow", "Responsive"],
    summary:
      "Webflow implementation of Tangilla's member-management software marketing website, developed under Dazlab as its sole Webflow developer.",
    image: "/assets/tangilla.png",
    alt: "Tangilla SaaS marketing website showcase",
  },
];

export const services = [
  {
    title: "Webflow Development",
    text: "Figma-to-Webflow builds with responsive structure and reusable page patterns.",
  },
  {
    title: "CMS & Structured SEO",
    text: "CMS architecture and setup, with technical SEO and AEO implementation where applicable.",
  },
  {
    title: "Design-to-Dev Execution",
    text: "Careful translation of Figma layouts into polished, production-ready Webflow pages.",
  },
  {
    title: "Responsive Implementation",
    text: "Responsive Webflow development across desktop, tablet, and mobile layouts.",
  },
];

export const workflow = [
  {
    title: "Discover & Plan",
    text: "Clarify goals, requirements, and site structure.",
  },
  {
    title: "Design & Structure",
    text: "Plan flows and refine layouts in Figma.",
  },
  {
    title: "Build in Webflow",
    text: "Build responsive pages with reusable Webflow structure.",
  },
  {
    title: "Refine with AI",
    text: "Use AI review to support troubleshooting and refinement.",
  },
  {
    title: "Test & Launch",
    text: "Check responsiveness, forms, SEO, and launch readiness.",
  },
];

export const experience = [
  {
    period: "2025–2026",
    company: "Dazlab",
    role: "Webflow Developer",
    description:
      "Sole Webflow developer. Figma-to-Webflow implementation, responsive development, CMS architecture and setup, and technical SEO/AEO where applicable.",
  },
  {
    period: "2024–2025",
    company: "B+ Studio",
    role: "Webflow Developer",
    description:
      "Webflow and Shopify website development, including responsive landing pages.",
  },
  {
    period: "2023–2024",
    company: "MCFLY Industries",
    role: "Webflow Developer",
    description:
      "Webflow development, CMS setup, and SEO-ready website structure.",
  },
  {
    period: "2021–2023",
    company: "Priority Studios",
    role: "Webflow Developer & Service Designer",
    description:
      "Webflow website development and service design, including wireframes, service blueprints, and customer journey mapping.",
  },
  {
    period: "2018–2021",
    company: "Platform Studios",
    role: "UX/UI Design",
    description: "UX/UI design, wireframes, and interface mockups.",
  },
  {
    period: "2013–2017",
    company: "Philippines Research & Survey Center",
    role: "Data Encoding",
    description: "Data encoding for research and survey work.",
  },
  {
    period: "2010–2012",
    company: "Art Pose Photos",
    role: "Graphic Design",
    description: "Graphic design work.",
  },
];

// Provisional entries: project dates and image reuse rights remain under review.
export const caseStudies = {
  dazlab: {
    title: "Dazlab",
    eyebrow: "Case Study / Product Studio",
    heading: "Dazlab - Webflow Marketing Website.",
    url: "https://dazlab.digital/",
    image: "/assets/dazlab-case.png",
    imageAlt: "Dazlab public marketing website screenshot",
    seoDescription: "Dazlab marketing website: Webflow implementation by Aldrin Camacho as Dazlab's sole Webflow developer. Project developed under Dazlab.",
    summary: "I implemented Dazlab's marketing website in Webflow as Dazlab's sole Webflow developer. This project was developed under Dazlab.",
    details: [
      ["Project credit", "Dazlab"],
      ["My role", "Sole Webflow developer"],
      ["Scope", "Marketing website"],
      ["Status", "Provisional portfolio entry"]
    ],
    sections: [
      {
        title: "Context",
        text: "Dazlab is a product studio that builds and launches niche SaaS products. This entry covers its marketing website."
      },
      {
        title: "My contribution",
        text: "My role was Webflow implementation and responsive development for the marketing website. My responsibilities at Dazlab included Figma-to-Webflow work, CMS architecture and setup, and technical SEO/AEO where applicable."
      },
      {
        title: "Scope and credit",
        text: "Project delivery is credited to Dazlab. This entry describes my Webflow contribution to the marketing website. Product engineering, visual design authorship, and business outcomes are outside its scope. Product claims shown in screenshots are not measured results of my Webflow work."
      }
    ],
    missingFacts: [
      "This is a provisional portfolio entry. Precise project dates and screenshot reuse rights remain under review; public availability does not establish permission or endorsement."
    ]
  },
  mortar: {
    title: "Mortar",
    eyebrow: "Case Study / Interior-design Software",
    heading: "Mortar - Webflow Marketing Website.",
    url: "https://mortar.design/",
    image: "/assets/mortar.png",
    imageAlt: "Mortar public marketing website screenshot",
    seoDescription: "Mortar marketing website: Webflow implementation by Aldrin Camacho as Dazlab's sole Webflow developer. Project developed under Dazlab.",
    summary: "I implemented Mortar's marketing website in Webflow as Dazlab's sole Webflow developer. This project was developed under Dazlab.",
    details: [
      ["Project credit", "Dazlab"],
      ["My role", "Sole Webflow developer"],
      ["Scope", "Marketing website"],
      ["Status", "Provisional portfolio entry"]
    ],
    sections: [
      {
        title: "Context",
        text: "Mortar provides software for interior designers. This entry covers its marketing website."
      },
      {
        title: "My contribution",
        text: "My role was Webflow implementation and responsive development for the marketing website. My responsibilities at Dazlab included Figma-to-Webflow work, CMS architecture and setup, and technical SEO/AEO where applicable."
      },
      {
        title: "Scope and credit",
        text: "Project delivery is credited to Dazlab. This entry describes my Webflow contribution to the marketing website. Product engineering, visual design authorship, and business outcomes are outside its scope. Product claims shown in screenshots are not measured results of my Webflow work."
      }
    ],
    missingFacts: [
      "This is a provisional portfolio entry. Precise project dates and screenshot reuse rights remain under review; public availability does not establish permission or endorsement."
    ]
  },
  handl: {
    title: "Handl",
    eyebrow: "Case Study / Agency Billing",
    heading: "Handl - Webflow Marketing Website.",
    url: "https://handl.works/",
    image: "/assets/handl.png",
    imageAlt: "Handl public marketing website screenshot",
    seoDescription: "Handl marketing website: Webflow implementation by Aldrin Camacho as Dazlab's sole Webflow developer. Project developed under Dazlab.",
    summary: "I implemented Handl's marketing website in Webflow as Dazlab's sole Webflow developer. This project was developed under Dazlab.",
    details: [
      ["Project credit", "Dazlab"],
      ["My role", "Sole Webflow developer"],
      ["Scope", "Marketing website"],
      ["Status", "Provisional portfolio entry"]
    ],
    sections: [
      {
        title: "Context",
        text: "Handl provides agency billing software. This entry covers its marketing website."
      },
      {
        title: "My contribution",
        text: "My role was Webflow implementation and responsive development for the marketing website. My responsibilities at Dazlab included Figma-to-Webflow work, CMS architecture and setup, and technical SEO/AEO where applicable."
      },
      {
        title: "Scope and credit",
        text: "Project delivery is credited to Dazlab. This entry describes my Webflow contribution to the marketing website. Product engineering, visual design authorship, and business outcomes are outside its scope. Product claims shown in screenshots are not measured results of my Webflow work."
      }
    ],
    missingFacts: [
      "This is a provisional portfolio entry. Precise project dates and screenshot reuse rights remain under review; public availability does not establish permission or endorsement."
    ]
  },
  tangilla: {
    title: "Tangilla",
    eyebrow: "Case Study / Member Management",
    heading: "Tangilla - Webflow Marketing Website.",
    url: "https://tangilla.com/",
    image: "/assets/tangilla.png",
    imageAlt: "Tangilla public marketing website screenshot",
    seoDescription: "Tangilla marketing website: Webflow implementation by Aldrin Camacho as Dazlab's sole Webflow developer. Project developed under Dazlab.",
    summary: "I implemented Tangilla's marketing website in Webflow as Dazlab's sole Webflow developer. This project was developed under Dazlab.",
    details: [
      ["Project credit", "Dazlab"],
      ["My role", "Sole Webflow developer"],
      ["Scope", "Marketing website"],
      ["Status", "Provisional portfolio entry"]
    ],
    sections: [
      {
        title: "Context",
        text: "Tangilla provides association and member-management software. This entry covers its marketing website."
      },
      {
        title: "My contribution",
        text: "My role was Webflow implementation and responsive development for the marketing website. My responsibilities at Dazlab included Figma-to-Webflow work, CMS architecture and setup, and technical SEO/AEO where applicable."
      },
      {
        title: "Scope and credit",
        text: "Project delivery is credited to Dazlab. This entry describes my Webflow contribution to the marketing website. Product engineering, visual design authorship, and business outcomes are outside its scope. Product claims shown in screenshots are not measured results of my Webflow work."
      }
    ],
    missingFacts: [
      "This is a provisional portfolio entry. Precise project dates and screenshot reuse rights remain under review; public availability does not establish permission or endorsement."
    ]
  }
};

export const caseStudy = caseStudies.dazlab;
