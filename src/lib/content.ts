import { createClient } from "@supabase/supabase-js";
import { profile as fallbackProfile, projects as fallbackProjects, tracks as fallbackTracks } from "../data/site";

export type SiteContent = {
  profile: typeof fallbackProfile & { logo?: string; title?: string; tagline?: string; location?: string; availability?: string; aboutExtra?: string };
  theme: { accent: string; background: string; panel: string; fontEnglish: string; fontPersian: string; radius: string };
  seo: { title: string; description: string; ogImage: string; keywords: string };
  homepage: { eyebrow: string; headline: string; subheadline: string; status: string; ctaPrimary: string; ctaSecondary: string; showCodeCard: boolean; contactTitle: string; contactText: string };
  projects: Array<{ id: string; name: string; description: string; status: string; tags: string[]; image?: string; url?: string; repo?: string; featured?: boolean; order?: number }>;
  tracks: Array<{ id: string; title: string; artist: string; src?: string; cover?: string; link?: string }>;
  games: Array<{ id: string; name: string; subtitle: string; mark: string; url?: string }>;
  posts: Array<{ id: string; title: string; slug: string; excerpt: string; body: string; cover?: string; published: boolean; date: string; tags: string[] }>;
  pages: { aboutIntro: string; aboutMindset: string; projectsIntro: string; musicIntro: string; contactIntro: string };
};

export const defaultContent: SiteContent = {
  profile: { ...fallbackProfile, logo: "", title: "Matin D4 — Developer & Builder", tagline: "Developer, builder & curious mind.", location: "", availability: "Open to interesting projects", aboutExtra: "I'm curious about how things work, and I like turning ideas into small experiments and real projects. This website is my corner to share what I'm learning and building." },
  theme: { accent: "#b8f36b", background: "#0b0d10", panel: "#11151a", fontEnglish: "Inter", fontPersian: "Vazirmatn", radius: "20" },
  seo: { title: "Matin D4 — Developer & Builder", description: "Personal website, projects, music, and interests of Matin D4.", ogImage: "", keywords: "Matin D4, developer, web development, projects" },
  homepage: { eyebrow: "Personal corner of the internet", headline: "Hey, I'm Matin.\nI build things\nfor the web.", subheadline: fallbackProfile.bio, status: "Building, learning, repeating.", ctaPrimary: "Explore projects", ctaSecondary: "Get in touch", showCodeCard: true, contactTitle: "Let's make something interesting.", contactText: "Find me on my social platforms or send a message." },
  projects: fallbackProjects.map((p, i) => ({ ...p, id: ["i-ticket", "d4-vpns", "ayar"][i] || `project-${i + 1}`, featured: true, order: i })),
  tracks: fallbackTracks.map((t, i) => ({ ...t, id: `track-${i + 1}` })),
  games: [
    { id: "minecraft", name: "Minecraft", subtitle: "Build · Explore · Create", mark: "M", url: "https://www.minecraft.net/" },
    { id: "cs2", name: "Counter-Strike 2", subtitle: "Tactical FPS", mark: "CS", url: "https://www.counter-strike.net/cs2" },
    { id: "marvel-rivals", name: "Marvel Rivals", subtitle: "Team-based action", mark: "MR", url: "https://www.marvelrivals.com/" }
  ],
  posts: [],
  pages: { aboutIntro: "Learn more about Matin, his skills, interests, and music.", aboutMindset: "Stay curious.\nKeep building.\nLearn by doing.", projectsIntro: "A collection of experiments, ideas, and projects. Some are still in progress; more details and screenshots will be added as they become available.", musicIntro: `Music I enjoy: ${fallbackProfile.musicArtists.join(", ")}.`, contactIntro: "Have a question, an idea, or want to talk about a project? You can find me on these platforms." }
};

export async function getSiteContent(): Promise<SiteContent> {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR-PROJECT")) return defaultContent;
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("site_content").select("content").eq("id", "main").maybeSingle();
    if (error || !data?.content) return defaultContent;
    const saved = data.content as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...saved,
      profile: { ...defaultContent.profile, ...(saved.profile || {}) },
      theme: { ...defaultContent.theme, ...(saved.theme || {}) },
      seo: { ...defaultContent.seo, ...(saved.seo || {}) },
      homepage: { ...defaultContent.homepage, ...(saved.homepage || {}) },
      pages: { ...defaultContent.pages, ...(saved.pages || {}) },
      projects: Array.isArray(saved.projects) ? saved.projects : defaultContent.projects,
      tracks: Array.isArray(saved.tracks) ? saved.tracks : defaultContent.tracks,
      games: Array.isArray(saved.games) ? saved.games : defaultContent.games,
      posts: Array.isArray(saved.posts) ? saved.posts : defaultContent.posts
    };
  } catch {
    return defaultContent;
  }
}
