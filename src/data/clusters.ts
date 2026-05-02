import type { LucideIcon } from "lucide-react";
import {
  User, GraduationCap, Atom, Cpu, BookOpen, Music2, Film,
  Code2, Palette, Users, Trophy, FileText, Compass, Mail, Sparkles,
  Brain, Wand2, Heart, Archive, Shapes,
} from "lucide-react";

export type Subpage = { slug: string; label: string; kind?: "overview" | "highlights" | "evidence" | "media" | "reflection" | "related" | "topic" };
export type Cluster = {
  num: string;
  slug: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  /** if a route in the OLD flat site already covers the Overview, point at it */
  legacyOverviewPath?: string;
  subpages: Subpage[];
};

/* The fractal pattern: visual-first ordering — Overview → Highlights → Media → Topics → Evidence → Reflection → Related. */
const HEAD: Subpage[] = [
  { slug: "overview", label: "Overview", kind: "overview" },
  { slug: "highlights", label: "Highlights", kind: "highlights" },
  { slug: "media", label: "Media", kind: "media" },
];
const TAIL: Subpage[] = [
  { slug: "evidence", label: "Evidence", kind: "evidence" },
  { slug: "reflection", label: "Reflection", kind: "reflection" },
  { slug: "related", label: "Related", kind: "related" },
];

const withTopics = (...topics: string[]): Subpage[] => [
  ...HEAD,
  ...topics.map((t) => ({
    slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    label: t,
    kind: "topic" as const,
  })),
  ...TAIL,
];

export const CLUSTERS: Cluster[] = [
  {
    num: "01", slug: "about", label: "About / Identity", icon: User,
    tagline: "Who I am, what drives me, where I am headed.",
    legacyOverviewPath: "/about",
    subpages: withTopics("Personal Profile", "Identity Timeline", "Languages & Culture"),
  },
  {
    num: "02", slug: "academics", label: "Academics", icon: GraduationCap,
    tagline: "Education timeline, exams, awards, subject strengths.",
    legacyOverviewPath: "/academic",
    subpages: withTopics("Education Timeline", "Subject Strengths", "Awards Vault", "Growth Notes"),
  },
  {
    num: "03", slug: "stem", label: "STEM + Research", icon: Atom,
    tagline: "Self-taught physics, research interests, mentorship, future goals.",
    legacyOverviewPath: "/research",
    subpages: withTopics("Physics Journey", "Research Interests", "Independent Archive", "Mentorship", "Future STEM Goals"),
  },
  {
    num: "04", slug: "robotics", label: "Robotics + Engineering", icon: Cpu,
    tagline: "FRC Team 7700, build seasons, engineering instincts.",
    subpages: withTopics("FRC Team 7700", "Engineering Skills", "Build Log"),
  },
  {
    num: "05", slug: "writing", label: "Writing + Story Worlds", icon: BookOpen,
    tagline: "The novel cycle, samples, podcast, creative method.",
    legacyOverviewPath: "/writing",
    subpages: withTopics("Novel Series Archive", "Writing Samples", "Podcast", "Creative Method"),
  },
  {
    num: "06", slug: "music", label: "Music + Performance", icon: Music2,
    tagline: "Vocal, instrumental, stage portfolio, repertoire.",
    legacyOverviewPath: "/music",
    subpages: withTopics("Vocal Performance", "Instrumental", "Performance Portfolio", "Repertoire"),
  },
  {
    num: "07", slug: "acting", label: "Acting + Media", icon: Film,
    tagline: "Child-artist archive, reels, voice, screen credits.",
    legacyOverviewPath: "/film",
    subpages: withTopics("Child Artist Archive", "Acting Reel", "Voice & Screen", "Media Credits"),
  },
  {
    num: "08", slug: "tech", label: "Design + Web + Tech", icon: Code2,
    tagline: "Zionaxelle, multimedia, tools, build log.",
    legacyOverviewPath: "/technology",
    subpages: withTopics("Zionaxelle", "Multimedia Production", "Tech Skills", "Build Log"),
  },
  {
    num: "09", slug: "art", label: "Art + Handmade", icon: Palette,
    tagline: "Canvas, embroidery, mixed media.",
    legacyOverviewPath: "/art",
    subpages: withTopics("Canvas Art", "Embroidery", "Mixed Media"),
  },
  {
    num: "10", slug: "leadership", label: "Leadership + Impact", icon: Users,
    tagline: "Initiative, mentoring, responsibility, integration.",
    legacyOverviewPath: "/leadership",
    subpages: withTopics("Mentoring", "Community & Family", "Cultural Integration"),
  },
  {
    num: "11", slug: "athletics", label: "Sports + Strategy", icon: Trophy,
    tagline: "Badminton, table tennis, chess, strategic thinking.",
    legacyOverviewPath: "/athletics",
    subpages: withTopics("Badminton", "Table Tennis", "Chess", "Strategic Thinking"),
  },
  {
    num: "12", slug: "vault", label: "CV + Document Vault", icon: FileText,
    tagline: "CV, certificates, transcripts, recognition.",
    legacyOverviewPath: "/cv",
    subpages: withTopics("Certificates", "Transcripts", "Recognition"),
  },
  {
    num: "13", slug: "vision", label: "Future Vision", icon: Compass,
    tagline: "Education goals, career, what I am building.",
    legacyOverviewPath: "/future",
    subpages: withTopics("Education Goals", "Career Vision", "What I Am Building"),
  },
  {
    num: "14", slug: "contact", label: "Contact + Links", icon: Mail,
    tagline: "Open correspondence and links.",
    legacyOverviewPath: "/contact",
    subpages: withTopics("Channels", "Links"),
  },
  {
    num: "15", slug: "curiosities", label: "Curiosities + Odds & Ends", icon: Shapes,
    tagline: "Karate belts, abacus medals, side quests, half-wins, oddities.",
    subpages: withTopics("Karate", "Abacus", "Side Quests", "Random Wins", "Childhood Trophies"),
  },
];

export const PROOF_CLUSTER = {
  num: "✦", slug: "proof", label: "Proof of Curiosity", icon: Sparkles,
  tagline: "Notebook scans, sketches, half-formed ideas.",
  legacyOverviewPath: "/proof",
};

export const findCluster = (slug: string) => CLUSTERS.find((c) => c.slug === slug);
export const findSubpage = (cluster: Cluster, slug: string) =>
  cluster.subpages.find((s) => s.slug === slug);

/* Grand groups: meta-categories that bundle the 14 clusters. */
export type GrandGroup = {
  slug: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  clusterSlugs: string[];
};

export const GRAND_GROUPS: GrandGroup[] = [
  {
    slug: "mind",
    label: "Mind & Method",
    tagline: "How I think, learn, and prove it.",
    icon: Brain,
    clusterSlugs: ["about", "academics", "stem", "robotics"],
  },
  {
    slug: "craft",
    label: "Craft & Expression",
    tagline: "What I make — in words, sound, image, and code.",
    icon: Wand2,
    clusterSlugs: ["writing", "music", "acting", "tech", "art"],
  },
  {
    slug: "world",
    label: "World & Self",
    tagline: "How I show up — for people, in play, in motion.",
    icon: Heart,
    clusterSlugs: ["leadership", "athletics"],
  },
  {
    slug: "dossier",
    label: "Dossier & Direction",
    tagline: "Receipts, oddities, and the road ahead.",
    icon: Archive,
    clusterSlugs: ["vault", "curiosities", "vision", "contact"],
  },
];

export const findGrandGroup = (clusterSlug: string) =>
  GRAND_GROUPS.find((g) => g.clusterSlugs.includes(clusterSlug));

/* Map of OLD flat URL -> NEW canonical URL (for redirects). */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/academic": "/academics",
  "/research": "/stem",
  "/film": "/acting",
  "/technology": "/tech",
  "/cv": "/vault",
  "/future": "/vision",
};