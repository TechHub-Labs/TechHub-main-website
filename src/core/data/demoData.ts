/**
 * DEMO DATA — Temporary placeholder data
 * ----------------------------------------
 * This file contains all static/mock data used across the application.
 * When the backend is ready, replace these exports with API calls.
 *
 * Usage: import { DEMO_PROJECTS, DEMO_MEMBERS, ... } from '@/core/data/demoData'
 */

// ─── Project Types ────────────────────────────────────────────────────────────

export interface DemoProject {
  id: string;
  name: string;
  desc: string;
  about: string;
  about2: string;
  image?: string;
  status: 'LIVE' | 'BETA' | 'PAUSED' | 'IN DEVELOPMENT' | 'UPCOMING';
  category: string;
  teamSize: string;
  tech: string;
  launchDate: string;
  website: string;
  tags: string[];
}

// ─── Featured Projects (Landing page hero section) ────────────────────────────

export const DEMO_FEATURED_PROJECTS: DemoProject[] = [
  {
    id: 'eventnav',
    name: 'EventNav',
    desc: 'A comprehensive event management and discovery platform built for university campuses.',
    about: 'EventNav bridges the gap between event organizers and attendees on campus. It provides a centralized hub for discovering, booking, and managing university events with real-time updates.',
    about2: 'Built with scalability in mind, it handles concurrent ticket bookings, QR code generation for check-ins, and analytics dashboards for organizers to track engagement.',
    image: '/images/eventnav.png',
    status: 'LIVE',
    category: 'Campus Utility',
    teamSize: '4 Members',
    tech: 'React, Node.js, MongoDB',
    launchDate: 'May 2026',
    website: 'eventnav.nhtechhub.com',
    tags: ['Web', 'Ticketing', 'Real-time'],
  },
  {
    id: 'orbit-app',
    name: 'Orbit Summit App',
    desc: 'The official companion application for the ORBIT 1.0 Tech Summit.',
    about: 'Designed to enhance the attendee experience, this app features real-time schedules, speaker bios, and interactive maps for the tech summit.',
    about2: 'It includes a networking feature that allows attendees to connect based on shared interests and professional backgrounds.',
    image: '/images/orbit.png',
    status: 'BETA',
    category: 'Event Tech',
    teamSize: '6 Members',
    tech: 'React Native, Firebase',
    launchDate: 'March 2026',
    website: 'orbit.nhtechhub.com',
    tags: ['Mobile', 'Networking', 'Live Data'],
  },
  {
    id: 'campus-market',
    name: 'Campus Market',
    desc: 'A peer-to-peer marketplace for students to buy, sell, and trade items safely.',
    about: 'Campus Market eliminates the friction of finding buyers or sellers for textbooks, electronics, and dorm essentials within the university ecosystem.',
    about2: 'The platform integrates verified student emails to ensure a secure and trusted trading environment.',
    image: '/images/market.png',
    status: 'IN DEVELOPMENT',
    category: 'E-commerce',
    teamSize: '3 Members',
    tech: 'Next.js, Tailwind, PostgreSQL',
    launchDate: 'August 2026',
    website: 'market.nhtechhub.com',
    tags: ['Marketplace', 'Next.js', 'Auth'],
  },
];

// ─── All Projects (Projects page) ─────────────────────────────────────────────

export const DEMO_ALL_PROJECTS: DemoProject[] = [
  {
    id: 'nexus',
    name: 'Nexus',
    desc: 'Discover events and hangout spots around you',
    tags: ['Mobile', 'Discovery'],
    status: 'LIVE',
    category: 'Discovery',
    teamSize: 'Nil',
    tech: 'JS, Node',
    launchDate: 'May 15, 2026',
    website: 'www.nexus.com',
    about: '',
    about2: '',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    desc: 'Real-time news and trends tailored for you',
    tags: ['Web', 'News'],
    status: 'BETA',
    category: 'News',
    teamSize: '4',
    tech: 'React, Firebase',
    launchDate: 'TBD',
    website: 'www.pulse.app',
    about: '',
    about2: '',
  },
  {
    id: 'fittrack',
    name: 'FitTrack',
    desc: 'Monitor your health and fitness goals effortlessly',
    tags: ['Mobile', 'Health'],
    status: 'LIVE',
    category: 'Health',
    teamSize: '3',
    tech: 'Flutter, Node',
    launchDate: 'March 2026',
    website: 'www.fittrack.io',
    about: '',
    about2: '',
  },
  {
    id: 'studybuddy',
    name: 'StudyBuddy',
    desc: 'Connect with peers and share study resources',
    tags: ['Web', 'Education'],
    status: 'PAUSED',
    category: 'Education',
    teamSize: '2',
    tech: 'Next.js',
    launchDate: 'TBD',
    website: '',
    about: '',
    about2: '',
  },
  {
    id: 'shopease',
    name: 'ShopEase',
    desc: 'Personalized shopping recommendations and deals',
    tags: ['Mobile', 'E-commerce'],
    status: 'IN DEVELOPMENT',
    category: 'E-commerce',
    teamSize: '5',
    tech: 'React Native',
    launchDate: 'TBD',
    website: '',
    about: '',
    about2: '',
  },
  {
    id: 'travelmate',
    name: 'TravelMate',
    desc: 'Plan trips and explore destinations with locals',
    tags: ['Mobile', 'Travel'],
    status: 'UPCOMING',
    category: 'Travel',
    teamSize: '3',
    tech: 'React Native, Node',
    launchDate: 'Q4 2026',
    website: '',
    about: '',
    about2: '',
  },
  {
    id: 'codelab',
    name: 'CodeLab',
    desc: 'Interactive coding challenges and tutorials',
    tags: ['Web', 'Education'],
    status: 'LIVE',
    category: 'Education',
    teamSize: '4',
    tech: 'Vue, Python',
    launchDate: 'Jan 2026',
    website: 'www.codelab.dev',
    about: '',
    about2: '',
  },
  {
    id: 'greenthumb',
    name: 'GreenThumb',
    desc: 'Gardening tips and plant care reminders',
    tags: ['Mobile', 'Lifestyle'],
    status: 'UPCOMING',
    category: 'Lifestyle',
    teamSize: '2',
    tech: 'Flutter',
    launchDate: 'Q3 2026',
    website: '',
    about: '',
    about2: '',
  },
  {
    id: 'soundscape',
    name: 'SoundScape',
    desc: 'Create and share ambient sound mixes',
    tags: ['Web', 'Entertainment'],
    status: 'BETA',
    category: 'Entertainment',
    teamSize: '3',
    tech: 'React, Web Audio',
    launchDate: 'TBD',
    website: 'www.soundscape.io',
    about: '',
    about2: '',
  },
];

// ─── Landing Page — Members Spotlight ─────────────────────────────────────────

export interface DemoBuilder {
  name: string;
  role: string;
  quote: string;
}

export const DEMO_BUILDERS: DemoBuilder[] = [
  { name: 'John Appleseed', role: 'Frontend Developer', quote: '"I build clean interfaces that just make sense."' },
  { name: 'Avery Johnson', role: 'Product Designer', quote: '"I love creating intuitive user-centered designs."' },
  { name: 'Maria Gonzalez', role: 'UX Designer', quote: '"Designing experiences that delight users."' },
  { name: 'Liam Chen', role: 'Backend Engineer', quote: '"Crafting scalable systems behind the scenes."' },
];

// ─── Project Details — Active Builders ────────────────────────────────────────

export const DEMO_PROJECT_BUILDERS: DemoBuilder[] = [
  { name: 'Chinonso Okafor', role: 'Backend Engineer', quote: '"I power seamless experiences."' },
  { name: 'Chinedu Okafor', role: 'UX Researcher', quote: '"Understanding users is the first step"' },
  { name: 'Amina Yusuf', role: 'Visual Designer', quote: '"Color and balance create harmony"' },
  { name: 'Chinonso Okafor', role: 'Backend Engineer', quote: '"I power seamless experiences."' },
  { name: 'Chinedu Okafor', role: 'UX Researcher', quote: '"Understanding users is the first step"' },
  { name: 'Amina Yusuf', role: 'Visual Designer', quote: '"Color and balance create harmony"' },
];

// ─── Executive Council Members ────────────────────────────────────────────────

export interface DemoCouncilMember {
  id: number;
  name: string;
  role: string;
  description: string;
  quote: string;
  portfolio?: string;
  linkedin?: string;
  twitter?: string;
  category: ('Founding Council' | "'27")[];
  skills: string[];
}

export const DEMO_COUNCIL_MEMBERS: DemoCouncilMember[] = [
  {
    id: 1,
    name: 'Habeeb Abayomi M.',
    role: 'Executive President',
    description: 'Leads vision and strategic direction.',
    category: ['Founding Council'],
    quote: "Empowering student innovators to shape Africa's tech future.",
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/habeeb-abayomi',
    twitter: 'https://twitter.com/habeeb_abayomi',
    skills: ['Node.js', 'PostgreSQL'],
  },
  {
    id: 2,
    name: 'Chinwe Eze',
    role: 'Chief Technology Officer',
    description: 'Oversees technological innovation',
    category: ['Founding Council'],
    quote: 'Driving technological excellence to solve real-world problems.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/chinwe-eze',
    twitter: 'https://twitter.com/chinwe_eze',
    skills: ['React', 'TypeScript'],
  },
  {
    id: 3,
    name: 'Olumide Akinola',
    role: 'Head of Marketing',
    description: 'Drives brand awareness and engagement.',
    category: ['Founding Council'],
    quote: 'Building a strong brand that resonates with our community.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/olumide-akinola',
    twitter: 'https://twitter.com/olumide_akinola',
    skills: ['Strategy', 'Growth'],
  },
  {
    id: 4,
    name: 'Amina Yusuf',
    role: 'Finance Manager',
    description: 'Manages budgets and financial reporting.',
    category: ['Founding Council'],
    quote: 'Ensuring financial sustainability for our initiatives.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/amina-yusuf',
    twitter: 'https://twitter.com/amina_yusuf',
    skills: ['Finance', 'Excel'],
  },
  {
    id: 5,
    name: 'Emeka Okafor',
    role: 'Operations Director',
    description: 'Ensures efficient daily business operations.',
    category: ['Founding Council'],
    quote: 'Streamlining operations to maximize impact.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/emeka-okafor',
    twitter: 'https://twitter.com/emeka_okafor',
    skills: ['Operations', 'Logistics'],
  },
  {
    id: 6,
    name: 'Sade Balogun',
    role: 'Human Resources Lead',
    description: 'Handles recruitment, welfare, and compliance.',
    category: ['Founding Council'],
    quote: 'Fostering a culture of inclusion and growth.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/sade-balogun',
    twitter: 'https://twitter.com/sade_balogun',
    skills: ['HR', 'People Ops'],
  },
  {
    id: 7,
    name: 'Tunde Adeyemi',
    role: 'Product Lead',
    description: 'Coordinates product roadmap and delivery.',
    category: ["'27"],
    quote: 'Driving product innovation to create meaningful impact.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/tunde-adeyemi',
    twitter: 'https://twitter.com/tunde_adeyemi',
    skills: ['Product', 'Agile'],
  },
  {
    id: 8,
    name: 'Ngozi Okonkwo',
    role: 'Design Lead',
    description: 'Drives visual identity and design systems.',
    category: ["'27"],
    quote: 'Creating beautiful and functional user experiences.',
    portfolio: 'https://nhtechhub.org',
    linkedin: 'https://linkedin.com/in/ngozi-okonkwo',
    twitter: 'https://twitter.com/ngozi_okonkwo',
    skills: ['Figma', 'Design Systems'],
  },
];

// ─── Members Page ─────────────────────────────────────────────────────────────

export interface DemoMember {
  id: number;
  name: string;
  role: string;
  quote: string;
  category: ('All' | 'Undergrad' | 'Alumni' | "'25" | "'26")[];
  skills: string[];
  projects: string[];
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export const DEMO_MEMBERS: DemoMember[] = [
  { id: 1, name: 'Chinonso Okafor', role: 'Backend Engineer', quote: '"I power seamless experiences."', category: ['All', 'Undergrad', "'25"], skills: ['Node.js', 'PostgreSQL'], projects: ['Nexspot', 'Glass'] },
  { id: 2, name: 'Chinedu Okafor', role: 'UX Researcher', quote: '"Understanding users is the first step."', category: ['All', 'Undergrad', "'25"], skills: ['Figma', 'User Testing'], projects: ['EventNav', 'Pulse'] },
  { id: 3, name: 'Amina Yusuf', role: 'Visual Designer', quote: '"Color and balance create harmony."', category: ['All', 'Alumni', "'26"], skills: ['Figma', 'Illustrator'], projects: ['Vibe', 'Nexspot'] },
  { id: 4, name: 'Tunde Adebayo', role: 'Interaction Designer', quote: '"Seamless come from interactions."', category: ['All', 'Undergrad', "'25"], skills: ['Framer', 'Prototyping'], projects: ['Glass', 'Orbit'] },
  { id: 5, name: 'Ngozi Eze', role: 'User Interface Designer', quote: '"Every pixel tells a story worth telling."', category: ['All', 'Undergrad', "'26"], skills: ['Figma', 'CSS'], projects: ['Pulse', 'Vibe'] },
  { id: 6, name: 'Ifeanyi Nwosu', role: 'Design Strategist', quote: '"Strategy transforms ideas into solutions."', category: ['All', 'Alumni', "'25"], skills: ['Strategy', 'Figma'], projects: ['EventNav', 'Glass'] },
  { id: 7, name: 'Chinelo Okafor', role: 'Product Designer', quote: '"Empathy is the heart of design."', category: ['All', 'Undergrad', "'25"], skills: ['Figma', 'Research'], projects: ['Nexspot', 'Orbit'] },
  { id: 8, name: 'Emeka Obi', role: 'Frontend', quote: '"Understanding users unlocks innovation."', category: ['All', 'Undergrad', "'26"], skills: ['React', 'TypeScript'], projects: ['Pulse', 'Vibe'] },
  { id: 9, name: 'Amina Yusuf', role: 'Visual Designer', quote: '"Color breathes life into wireframes."', category: ['All', 'Alumni', "'26"], skills: ['Figma', 'Motion'], projects: ['Glass', 'Orbit'] },
  { id: 10, name: 'Funmi Adewale', role: 'Marketing', quote: '"Experiences things deeply."', category: ['All', 'Undergrad', "'25"], skills: ['Copywriting', 'SEO'], projects: ['EventNav', 'Nexspot'] },
  { id: 11, name: 'Obinna Chukwu', role: 'Content Designer', quote: '"Words shape how users engage."', category: ['All', 'Undergrad', "'26"], skills: ['Writing', 'UX Writing'], projects: ['Pulse', 'Glass'] },
  { id: 12, name: 'Halima Bello', role: 'Backend Engineer', quote: '"Movement guides attention and emotion."', category: ['All', 'Alumni', "'25"], skills: ['Python', 'Django'], projects: ['Nexspot', 'Vibe'] },
  { id: 13, name: 'Ibrahim Salisu', role: 'Content', quote: '"Insights drive meaningful design choices."', category: ['All', 'Undergrad', "'26"], skills: ['Content Strategy', 'Analytics'], projects: ['EventNav', 'Orbit'] },
  { id: 14, name: 'Kemi Oladipo', role: 'Accessibility Specialist', quote: '"Inclusion is design\'s true north."', category: ['All', 'Alumni', "'25"], skills: ['WCAG', 'ARIA'], projects: ['Glass', 'Pulse'] },
  { id: 15, name: 'Chidimma Eze', role: 'Brand Designer', quote: '"Identity is the soul of a product."', category: ['All', 'Undergrad', "'26"], skills: ['Branding', 'Figma'], projects: ['Vibe', 'Nexspot'] },
];

// ─── About Page — Timeline ────────────────────────────────────────────────────

export interface DemoTimelineItem {
  year: string;
  desc: string;
  side: 'left' | 'right';
}

export const DEMO_TIMELINE: DemoTimelineItem[] = [
  {
    year: '2024 — The Foundation',
    desc: 'A few members began collaborating on projects to bridge the gap between theory and reality.',
    side: 'left',
  },
  {
    year: '2025 — Structure Emerged',
    desc: 'Specialized roles and leadership systems were introduced to handle growing complexity.',
    side: 'right',
  },
  {
    year: '2026 — Projects Shipping',
    desc: 'Internal products and collaborations gained traction, moving from local to global relevance.',
    side: 'left',
  },
  {
    year: 'The Future — Beyond Campus',
    desc: 'TechHub evolves into a larger innovation ecosystem, becoming a launchpad for world-class innovators.',
    side: 'right',
  },
];

// ─── Landing page — Projects Section spotlight ────────────────────────────────

export const DEMO_LANDING_PROJECTS = [
  {
    status: 'LIVE' as const,
    name: 'Nexus',
    desc: 'Discover events and hangout spots around you',
    tags: ['Mobile', 'Discovery'],
  },
  {
    status: 'UPCOMING' as const,
    name: 'Pulse',
    desc: 'Stay ahead with the latest tech conferences and meetups',
    tags: ['Web', 'Events'],
  },
  {
    status: 'LIVE' as const,
    name: 'Vibe',
    desc: 'Your go-to app for nightlife and local entertainment',
    tags: ['Mobile', 'Lifestyle'],
  },
];
