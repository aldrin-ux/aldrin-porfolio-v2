export const siteMetadata = {
  name: "Aldrin Camacho",
  title: "Aldrin Camacho - Webflow Developer & Digital Experience Specialist",
  description:
    "Portfolio of Aldrin Camacho, a Webflow Developer and Digital Experience Specialist building responsive Webflow sites, CMS structures, and technical SEO foundations.",
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
    year: "2025",
    role: "Webflow Development",
    tags: ["SaaS", "CMS", "Responsive"],
    summary:
      "Responsive Webflow build, CMS architecture, and ongoing website support for a SaaS product studio.",
    image: "/assets/dazlab.png",
    alt: "Dazlab SaaS product studio website showcase",
  },
  {
    title: "Mortar",
    slug: "mortar",
    href: "/work/mortar/",
    externalUrl: "https://mortar.design/",
    year: "2025",
    role: "Webflow Implementation",
    tags: ["Interior-design SaaS", "CMS", "Technical SEO"],
    summary:
      "Figma-to-Webflow implementation and CMS setup for an interior-design SaaS platform.",
    image: "/assets/mortar.png",
    alt: "Mortar interior-design SaaS website showcase",
  },
  {
    title: "Handl",
    slug: "handl",
    href: "/work/handl/",
    externalUrl: "https://handl.works/",
    year: "2025",
    role: "Webflow Build",
    tags: ["SaaS", "Integrations"],
    summary:
      "Webflow build and integrations for an agency billing and operations SaaS platform.",
    image: "/assets/handl.png",
    alt: "Handl agency operations SaaS website showcase",
  },
  {
    title: "Tangilla",
    slug: "tangilla",
    href: "/work/tangilla/",
    externalUrl: "https://tangilla.com/",
    year: "2024",
    role: "Responsive Build",
    tags: ["SaaS", "CMS", "Landing Page"],
    summary:
      "Responsive Webflow development for a member-management SaaS platform.",
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
    text: "CMS architecture, schema markup, and technical SEO foundations for maintainable sites.",
  },
  {
    title: "Design-to-Dev Execution",
    text: "Careful translation of Figma layouts into polished, production-ready Webflow pages.",
  },
  {
    title: "Integrations & Optimization",
    text: "Forms, third-party integrations, maintenance, QA, and performance cleanup.",
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
    period: "July 2025 - April 2026",
    company: "Dazlab",
    role: "Webflow Developer",
    description:
      "Webflow development, CMS architecture, technical SEO, integrations, and site maintenance.",
  },
  {
    period: "To be confirmed",
    company: "B+ Studio",
    role: "Webflow Developer",
    description:
      "Figma-to-Webflow implementation and design-to-development collaboration.",
  },
  {
    period: "To be confirmed",
    company: "MCFLY Industries",
    role: "Webflow Developer",
    description:
      "Webflow development, CMS configuration, responsive implementation, and maintenance.",
  },
  {
    period: "To be confirmed",
    company: "Earlier UI/UX & Product Roles",
    role: "Design & Product Development",
    description:
      "Experience in interface design, product planning, and digital experience development.",
  },
];

export const caseStudies = {
  dazlab: {
    title: "Dazlab",
    eyebrow: "Case Study / SaaS Product Studio",
    heading: "Dazlab - Product Studio Website & CMS Architecture.",
    url: "https://dazlab.digital/",
    image: "/assets/dazlab-case.png",
    imageAlt: "Dazlab production website preview",
    summary:
      "Dazlab builds and launches niche SaaS products across specialized industry verticals. Their team needed a clean marketing system that could support multiple product launches.",
    details: [
      ["Role", "Webflow development, CMS architecture, responsive implementation"],
      ["Stack", "Webflow CMS, semantic structure, technical SEO foundations"],
      ["Focus", "Maintainable production pages for SaaS launches"],
      ["Outcome", "A scalable website system for ongoing product-studio work"],
    ],
    sections: [
      {
        title: "Context",
        text: "The site needed to explain Dazlab's product-studio model and stay flexible for ongoing marketing updates. The build emphasized clarity, speed, and CMS structures the team could maintain.",
      },
      {
        title: "Implementation",
        text: "I translated the approved direction into responsive Webflow pages, built reusable CMS-driven structures, and refined interaction details so content could scale cleanly.",
      },
      {
        title: "Result",
        text: "The final system gives Dazlab a dependable marketing foundation with clean pages, reusable publishing patterns, and room for ongoing launches.",
      },
    ],
    missingFacts: [],
  },
  mortar: {
    title: "Mortar",
    eyebrow: "Case Study / Interior-design SaaS",
    heading: "Mortar - Webflow Implementation & CMS Setup.",
    url: "https://mortar.design/",
    image: "/assets/mortar.png",
    imageAlt: "Mortar interior-design SaaS website showcase",
    summary:
      "Figma-to-Webflow implementation and CMS setup for an interior-design SaaS platform.",
    details: [
      ["Role", "Webflow Implementation"],
      ["Year", "2025"],
      ["Focus", "Interior-design SaaS, CMS, Technical SEO"],
    ],
    sections: [],
    missingFacts: [
      "Contribution scope, implementation details, measurable outcomes, and client-approved narrative need confirmation before a full case-study writeup.",
    ],
  },
  handl: {
    title: "Handl",
    eyebrow: "Case Study / SaaS Operations",
    heading: "Handl - Webflow Build & Integrations.",
    url: "https://handl.works/",
    image: "/assets/handl.png",
    imageAlt: "Handl agency operations SaaS website showcase",
    summary:
      "Webflow build and integrations for an agency billing and operations SaaS platform.",
    details: [
      ["Role", "Webflow Build"],
      ["Year", "2025"],
      ["Focus", "SaaS, Integrations"],
    ],
    sections: [],
    missingFacts: [
      "Contribution scope, integration details, measurable outcomes, and client-approved narrative need confirmation before a full case-study writeup.",
    ],
  },
  tangilla: {
    title: "Tangilla",
    eyebrow: "Case Study / SaaS Landing Page",
    heading: "Tangilla - Responsive Webflow Development.",
    url: "https://tangilla.com/",
    image: "/assets/tangilla.png",
    imageAlt: "Tangilla SaaS marketing website showcase",
    summary:
      "Responsive Webflow development for a member-management SaaS platform.",
    details: [
      ["Role", "Responsive Build"],
      ["Year", "2024"],
      ["Focus", "SaaS, CMS, Landing Page"],
    ],
    sections: [],
    missingFacts: [
      "Contribution scope, CMS details, measurable outcomes, and client-approved narrative need confirmation before a full case-study writeup.",
    ],
  },
};

export const caseStudy = caseStudies.dazlab;
