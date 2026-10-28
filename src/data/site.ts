export type Project = {
  name: string;
  description: string;
  status: string;
  tags: string[];
  image?: string;
  url?: string;
  repo?: string;
};

export type Track = {
  title: string;
  artist: string;
  src?: string;
  cover?: string;
};

export const profile = {
  name: "Matin",
  brand: "Matin D4",
  role: "Half-stack developer",
  bio: "Hey, I'm Matin. I'm a half-stack developer who enjoys building projects and learning how technology works.",
  shortBio: "Developer, builder & curious mind.",
  skills: ["React", "Python", "JavaScript", "HTML", "CSS"],
  interests: ["Minecraft", "Programming", "Technology"],
  musicArtists: ["Måneskin", "Imagine Dragons", "Kendrick Lamar", "Marz Aslani"],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/itsmatind4?vrfl=MTBsdTdyNjIzMGFkaw==" },
    { label: "Telegram", href: "https://t.me/itsmatind4" },
    { label: "Discord", href: "https://discord.gg/ht5quzMbbh" }
  ]
};

export const projects: Project[] = [
  {
    name: "I Ticket",
    description: "An AI-assisted support and ticketing platform concept for websites and online stores.",
    status: "In progress",
    tags: ["AI", "Support", "Web"]
  },
  {
    name: "D4 Vpns",
    description: "A personal project. More details and screenshots will be added as the project page is prepared.",
    status: "In progress",
    tags: ["Networking", "Web"]
  },
  {
    name: "Ayar",
    description: "A price-tracking interface concept for precious metals, currencies, and crypto assets.",
    status: "Concept",
    tags: ["Finance UI", "Dashboard"]
  }
];

// No audio is bundled. Add licensed audio files in public/music and fill in src values.
export const tracks: Track[] = [
  { title: "Add your first track", artist: "Your music collection" }
];