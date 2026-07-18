// Single source of truth for all site copy. Grounded and specific by design:
// no invented statistics, no placement promises, no filler verbs. Mentor names
// and testimonials are realistic placeholders for the client to replace with
// real people (marked PLACEHOLDER).

export const brand = {
  name: "Nextudy",
  wordmark: "nextudy",
  tagline: "Skill up now",
  email: "hello@nextudyeducation.com",
  phone: "+91 90000 00000", // PLACEHOLDER
  socials: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

export const nav = [
  { label: "The shift", href: "#shift" },
  { label: "Programs", href: "#programs" },
  { label: "Mentors", href: "#mentors" },
  { label: "Journey", href: "#journey" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Mentor-led BIM upskilling",
  headline: ["Train for the BIM career", "modern construction is built on."],
  sub: "Nextudy turns civil engineers, mechanical engineers, architects, and graduates into industry-ready BIM professionals through mentor-led, project-based training.",
  primaryCta: { label: "Get the course syllabus", href: "#lead" },
  secondaryCta: { label: "Explore programs", href: "#programs" },
};

// Discipline / tool marquee (no fake company logos, per the brief)
export const disciplines = [
  "Revit",
  "Navisworks",
  "Clash detection",
  "MEP coordination",
  "Structural modeling",
  "4D sequencing",
  "Quantity takeoff",
  "Construction documentation",
  "IFC coordination",
  "Shop drawings",
  "Digital twins",
  "Model federation",
];

export const shift = {
  eyebrow: "Why now",
  headline: ["The industry changed.", "Most education didn't."],
  body: "Construction moved from disconnected 2D drawings to intelligent, coordinated models that catch conflicts before anyone breaks ground. Hiring followed. The people who can work inside that model are the ones getting the offers.",
  stages: [
    {
      tag: "Then",
      title: "Disconnected 2D drawings",
      copy: "Plans, sections, and details lived in separate files. Coordination happened on site, late, and expensively.",
    },
    {
      tag: "Now",
      title: "One intelligent model",
      copy: "Architecture, structure, and MEP share a single coordinated model. Clashes surface in the office, not the field.",
    },
    {
      tag: "Next",
      title: "Coordinated, clash-free delivery",
      copy: "Teams sequence, quantify, and document straight from the model. This is the workflow employers are hiring for.",
    },
  ],
};

export const gap = {
  eyebrow: "The gap",
  headline: ["Your degree got you to the door.", "The door wants Revit."],
  problems: [
    {
      problem: "College taught theory, not Revit.",
      solution:
        "You learn the software inside real workflows, the way a project team actually uses it.",
    },
    {
      problem: "You have never coordinated a live model.",
      solution:
        "You run clash detection and federate disciplines on project-style files from week one.",
    },
    {
      problem: "Your portfolio is empty.",
      solution:
        "You leave with coordinated models, drawings, and documentation you can show in an interview.",
    },
    {
      problem: "BIM job posts read like a foreign language.",
      solution:
        "A mentor translates the role, the tools, and the expectations until they stop being mysterious.",
    },
  ],
};

export const why = {
  eyebrow: "Why Nextudy",
  headline: ["Built around how", "BIM teams actually work."],
  pillars: [
    {
      title: "Mentors who ship real projects",
      copy: "You learn workflows from professionals working on live BIM projects, not lecturers reading slides.",
    },
    {
      title: "You build, you don't just watch",
      copy: "Every program is project-based. You finish with models and drawings, not a folder of notes.",
    },
    {
      title: "A portfolio that earns interviews",
      copy: "Coordinated models, construction documentation, and clash reports an employer can actually open.",
    },
    {
      title: "The real multidisciplinary workflow",
      copy: "Architecture, structure, and MEP coordination, the way a project team hands work between them.",
    },
  ],
};

export type Program = {
  id: string;
  name: string;
  index: string;
  for: string;
  summary: string;
  tools: string[];
  outcome: string;
};

export const programs: Program[] = [
  {
    id: "foundation",
    name: "BIM Foundation",
    index: "01",
    for: "Graduates new to BIM",
    summary:
      "Understand what BIM is as a workflow, not just a button. Build your first coordinated model and learn how project information actually flows.",
    tools: ["Revit basics", "BIM concepts", "Model navigation"],
    outcome: "A working grasp of BIM workflows and your first model.",
  },
  {
    id: "revit-arch",
    name: "Revit Architecture",
    index: "02",
    for: "Architects and architecture graduates",
    summary:
      "Model and document a building to industry standards. Walls, families, views, sheets, and the documentation set a practice would actually issue.",
    tools: ["Revit Architecture", "Families", "Documentation"],
    outcome: "Model and document a building to industry standards.",
  },
  {
    id: "revit-struct",
    name: "Revit Structure",
    index: "03",
    for: "Civil and structural engineers",
    summary:
      "Take structural intent into a coordinated model. Framing, rebar, and the structural drawings used on real projects.",
    tools: ["Revit Structure", "Rebar", "Framing"],
    outcome: "Produce structural models and drawings used on site.",
  },
  {
    id: "navisworks",
    name: "Navisworks Coordination",
    index: "04",
    for: "Anyone moving into BIM coordination",
    summary:
      "Federate disciplines, run clash detection, and resolve conflicts before construction. The coordination role employers are short on.",
    tools: ["Navisworks", "Clash detection", "4D sequencing"],
    outcome: "Run clash detection across multi-discipline models.",
  },
  {
    id: "career-bridge",
    name: "BIM Career Bridge",
    index: "05",
    for: "Professionals targeting a BIM role now",
    summary:
      "The end-to-end workflow plus the parts that get you hired: a portfolio, mock interviews, and the language to talk about projects with confidence.",
    tools: ["Full workflow", "Portfolio", "Interview prep"],
    outcome: "A portfolio and the confidence to interview for BIM roles.",
  },
];

export type JourneyStep = {
  index: string;
  title: string;
  copy: string;
};

export const journey: JourneyStep[] = [
  { index: "01", title: "Learn the fundamentals", copy: "BIM concepts and the software, taught as one workflow." },
  { index: "02", title: "Build real project models", copy: "Model the way a project team models, not the way a tutorial does." },
  { index: "03", title: "Coordinate across disciplines", copy: "Federate, detect clashes, and resolve them before the field does." },
  { index: "04", title: "Prepare your portfolio", copy: "Turn your work into models, drawings, and reports an employer can open." },
  { index: "05", title: "Practice mock interviews", copy: "Rehearse the questions and the project talk until they feel routine." },
  { index: "06", title: "Become job-ready", copy: "Walk in able to do the work, not just describe it." },
];

export type Mentor = {
  name: string;
  role: string;
  experience: string;
  focus: string[];
  seed: string;
};

// PLACEHOLDER mentors. Replace name/role/experience/photo with real people.
export const mentors: Mentor[] = [
  {
    name: "Arvind Menon",
    role: "BIM Coordinator",
    experience: "9 years on live projects",
    focus: ["Navisworks", "MEP coordination", "Clash resolution"],
    seed: "arvind-menon",
  },
  {
    name: "Sneha Kulkarni",
    role: "Architectural BIM Lead",
    experience: "7 years in practice",
    focus: ["Revit Architecture", "Documentation", "Families"],
    seed: "sneha-kulkarni",
  },
  {
    name: "Rohan Pillai",
    role: "Structural BIM Modeler",
    experience: "8 years across infrastructure",
    focus: ["Revit Structure", "Rebar", "Detailing"],
    seed: "rohan-pillai",
  },
  {
    name: "Farah Qureshi",
    role: "BIM Manager",
    experience: "11 years, standards and delivery",
    focus: ["BIM standards", "Model federation", "Workflow"],
    seed: "farah-qureshi",
  },
];

export const outcomes = {
  eyebrow: "What you walk away with",
  headline: ["Realistic outcomes,", "stated plainly."],
  note: "No salary promises. No placement guarantees. Just the capability employers are actually screening for.",
  items: [
    "A genuine grasp of BIM workflows",
    "Portfolio-ready project models",
    "Confidence across Revit and Navisworks",
    "An understanding of real coordination",
    "Interview preparation that holds up",
    "The judgement to work inside a team",
  ],
};

export type Testimonial = {
  quote: string;
  name: string;
  transition: string;
  seed: string;
};

// PLACEHOLDER testimonials. Replace with real, consented learner stories.
export const testimonials: Testimonial[] = [
  {
    quote:
      "I could open Revit, but I had no idea how a real project came together. The coordination module is where it finally clicked.",
    name: "Aishwarya R.",
    transition: "Civil engineering graduate",
    seed: "aishwarya",
  },
  {
    quote:
      "The mock interviews were brutal in the best way. By the time I sat for the real one, the project questions felt routine.",
    name: "Kiran Joseph",
    transition: "Site engineer moving into BIM",
    seed: "kiran",
  },
  {
    quote:
      "I finally have models I am proud to show. That changed how I talk about myself in interviews.",
    name: "Nikhil Varma",
    transition: "Architecture graduate",
    seed: "nikhil",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Is Nextudy suitable for complete beginners?",
    a: "Yes. The Foundation program assumes no BIM background. It starts with what BIM is as a workflow and builds from there.",
  },
  {
    q: "I'm already working. Can I learn alongside my job?",
    a: "The programs are built for working professionals. Sessions are project-based and structured so you can apply them around a full-time role.",
  },
  {
    q: "Do I need prior Revit or BIM knowledge?",
    a: "Not for Foundation. The discipline-specific programs assume you are comfortable navigating a model, which Foundation covers.",
  },
  {
    q: "Will I work on real projects?",
    a: "You work on project-style files that mirror how a team models, coordinates, and documents. You finish with work you can show.",
  },
  {
    q: "Is portfolio support included?",
    a: "Yes. The Career Bridge program is built around turning your work into a portfolio and rehearsing how you present it.",
  },
  {
    q: "How is this different from a regular software institute?",
    a: "Institutes teach the buttons. Nextudy teaches the workflow, with mentors who work on live projects and a focus on being job-ready, not just software-aware.",
  },
];

export const recognition = {
  eyebrow: "Trusted by the industry",
  headline: ["Recognized across the", "AEC ecosystem."],
  cards: [
    {
      index: "01",
      metric: "Recognized by 150+",
      highlight: "AEC companies",
      copy: "Our alumni work at leading architecture, engineering, and construction firms across India and GCC countries.",
    },
    {
      index: "02",
      metric: "Top 5 BIM institute",
      highlight: "Industry-experienced faculties",
      copy: "Rated among the top BIM institutes in India for mentor-led training by working professionals.",
    },
    {
      index: "03",
      metric: "Exclusive community of",
      highlight: "100+ BIM professionals",
      copy: "Premium access to a growing network of BIM practitioners — ask questions, share work, and find opportunities.",
    },
    {
      index: "04",
      metric: "India's #1 BIM institute",
      highlight: "Industry recognition",
      copy: "Awarded the best performing BIM institute in India for training quality and graduate readiness.",
    },
  ],
};

export type FlagshipCategoryTab = {
  id: "bim" | "computational";
  label: string;
  href: string | null;
};

export type FlagshipDetail = {
  label: string;
  value: string;
};

export const flagship: {
  eyebrow: string;
  headline: [string, string];
  sub: string;
  categoryTabs: readonly FlagshipCategoryTab[];
  activeCategory: FlagshipCategoryTab["id"];
  course: {
    badge: string;
    name: string;
    image: string;
    imageAlt: string;
    details: FlagshipDetail[];
    cta: { label: string; href: string };
  };
} = {
  eyebrow: "Our Courses",
  headline: ["The future of AEC", "begins with you."],
  sub: "Get closer to your professional goals through global, expert-led certification programs in Architecture, Engineering, and Design.",
  categoryTabs: [
    { id: "bim", label: "Flagship Program", href: null },
    { id: "computational", label: "Other Programs", href: "#programs" },
  ],
  activeCategory: "bim",
  course: {
    badge: "Flagship Program",
    name: "BIM Foundational Bridge Course",
    image: "/images/flagship-bim.jpg",
    imageAlt: "Coordinated BIM model of an architectural project",
    details: [
      { label: "Program Duration", value: "7 Months, Online" },
      { label: "Application Deadline", value: "Jun 13th" },
      { label: "Course Ratings", value: "4.6 ★ ★ ★ ★ ☆" },
      { label: "Learners Enrolled", value: "7254" },
    ],
    cta: { label: "Learn More", href: "#lead" },
  },
};

export const professions = [
  "Student or fresh graduate",
  "Civil engineer",
  "Architect",
  "CAD draftsman",
  "Site engineer",
  "Working professional",
  "Other",
];

export const lead = {
  eyebrow: "Start the conversation",
  headline: ["Get the course", "syllabus."],
  copy: "Tell us where you are now. A mentor will walk you through which program fits, what it covers, and what it does not. No pressure, no script.",
  formNote:
    "Share a few details and download the BIM Foundation syllabus. A mentor reviews every request personally.",
};

export const inquiryTypes = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
] as const;

export const interestOptions: string[] = [
  ...programs.map((p) => p.name),
  "Not sure yet",
];

// Lead magnet delivered on successful form submission.
export const leadMagnet = {
  href: "/bim-foundation-syllabus.pdf",
  fileName: "Nextudy-BIM-Foundation-Bridge-Syllabus.pdf",
  title: "BIM Foundation Bridge Course syllabus",
};
