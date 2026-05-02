import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  Atom, Cpu, Music2, Mic2, Code2, PenTool, Languages, Trophy,
  Camera, Wand2, Brain, Palette,
} from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { PullQuote } from "@/components/Editorial";
import { Bento, type BentoItem } from "@/components/Bento";
import { HeroSlideshow, type Slide } from "@/components/HeroSlideshow";
import { GRAND_GROUPS, findCluster } from "@/data/clusters";
import { useReveal } from "@/hooks/useReveal";
import heroPortrait from "@/assets/hero-portrait.jpg";
import textureCosmos from "@/assets/texture-cosmos.jpg";
import texturePaper from "@/assets/texture-paper.jpg";
import atmosTelescope from "@/assets/atmos-telescope.jpg";
import atmosNotebook from "@/assets/atmos-notebook.jpg";
import atmosMusic from "@/assets/atmos-music.jpg";

/* -------------------- HERO SLIDESHOW -------------------- */
const HERO_SLIDES: Slide[] = [
  {
    src: heroPortrait, alt: "Geetika Gehlot — portrait",
    tone: "light", eyebrow: "Geetika Gehlot · I",
    title: "Building worlds.",
    body: "Scientist · Researcher · Creator · Musician · Storyteller · Innovator. A 15-year-old multidisciplinary mind from Montréal.",
  },
  {
    src: atmosTelescope, alt: "Telescope under stars",
    tone: "light", eyebrow: "Plate II · Observation",
    title: "Through the lens.",
    body: "Robotics, physics, and the slow art of paying attention.",
  },
  {
    src: atmosNotebook, alt: "Open notebook with handwritten pages",
    tone: "dark", eyebrow: "Plate III · Notation",
    title: "On the page.",
    body: "A novel cycle in motion. Words before pixels, always.",
  },
  {
    src: atmosMusic, alt: "Stage lights and microphone",
    tone: "light", eyebrow: "Plate IV · Resonance",
    title: "In full voice.",
    body: "Hindustani vocal, voice acting, and the discipline of stage.",
  },
  {
    src: texturePaper, alt: "Aged paper texture",
    tone: "dark", eyebrow: "Plate V · Dossier",
    title: "Examined in public.",
    body: "Every claim, every clipping, every receipt — open for inspection.",
  },
];


/* -------------------- SKILLS TOOLKIT -------------------- */
const SKILLS: { icon: React.ComponentType<{ className?: string }>; label: string; level: string }[] = [
  { icon: Atom,      label: "Physics",         level: "Self-taught + olympiad" },
  { icon: Brain,     label: "Mathematics",     level: "AP track" },
  { icon: Cpu,       label: "Robotics",        level: "FRC Team 7700" },
  { icon: Code2,     label: "Web + Code",      level: "React · TS · Python" },
  { icon: PenTool,   label: "Writing",         level: "Novel cycle · podcast" },
  { icon: Music2,    label: "Hindustani Vocal", level: "Stage performer" },
  { icon: Mic2,      label: "Voice Acting",    level: "Child-artist credits" },
  { icon: Camera,    label: "Multimedia",      level: "Edit · shoot · score" },
  { icon: Palette,   label: "Visual Art",      level: "Canvas · embroidery" },
  { icon: Trophy,    label: "Strategy Games",  level: "Chess · badminton · TT" },
  { icon: Languages, label: "Languages",       level: "EN · HI · FR" },
  { icon: Wand2,     label: "Storyworlds",     level: "Worldbuilding craft" },
];

/* -------------------- FEATURED HIGHLIGHTS BENTO -------------------- */
const FEATURED: BentoItem[] = [
  {
    id: "f-frc", size: "xl", eyebrow: "Robotics",
    title: "FRC Team 7700",
    blurb: "Build seasons, mechanical instinct, and the controlled chaos of competition robotics.",
    image: atmosTelescope, meta: "Cluster 04 · Robotics",
    detail: "From CAD reviews at midnight to driver-station nerves on game day — Team 7700 is where I learned to design under deadline, debug under pressure, and trust a team. Click through to the cluster for the full build log.",
  },
  {
    id: "f-novel", size: "lg", eyebrow: "Writing",
    title: "The Novel Cycle",
    blurb: "A multi-book story world I've been building for years.",
    image: atmosNotebook, meta: "Cluster 05 · Writing",
  },
  {
    id: "f-vocal", size: "md", eyebrow: "Performance",
    title: "Hindustani Vocal",
    blurb: "Stage repertoire, raagas, and live performance reels.",
    image: atmosMusic, meta: "Cluster 06 · Music",
  },
  {
    id: "f-ap", size: "md", eyebrow: "Academics",
    title: "AP Track + Olympiads",
    blurb: "The transcript backing the curiosity.", meta: "Cluster 02 · Academics",
  },
  {
    id: "f-acting", size: "md", eyebrow: "Screen",
    title: "Child Artist Reel",
    blurb: "Years on screen, in front of a camera and a microphone.", meta: "Cluster 07 · Acting",
  },
  {
    id: "f-zion", size: "md", eyebrow: "Tech",
    title: "Zionaxelle",
    blurb: "A multimedia universe I built from scratch.", meta: "Cluster 08 · Tech",
  },
];

/* -------------------- RANDOM WINS / CURIOSITIES TEASER -------------------- */
const CURIOSITIES: BentoItem[] = [
  { id: "c-karate", size: "md", eyebrow: "Belt", title: "Karate", blurb: "Years on the mat — discipline that bleeds into everything else.", meta: "TODO · belt level + dojo" },
  { id: "c-abacus", size: "md", eyebrow: "Mental Math", title: "Abacus medals", blurb: "Lightning arithmetic from the elementary years.", meta: "TODO · grades + competitions" },
  { id: "c-chess", size: "sm", eyebrow: "Strategy", title: "Chess", blurb: "Tournament play and pattern obsession.", meta: "TODO · rating" },
  { id: "c-bad", size: "sm", eyebrow: "Court", title: "Badminton", blurb: "Smash, drop, repeat.", meta: "TODO" },
  { id: "c-tt", size: "sm", eyebrow: "Court", title: "Table Tennis", blurb: "Reflex over reach.", meta: "TODO" },
  { id: "c-misc", size: "wide", eyebrow: "Side quests", title: "And a few oddities I'm proud of", blurb: "Random certificates, half-wins, things that don't fit a category but absolutely shaped me.", meta: "Cluster 15 · Curiosities — full archive" },
];

const Index = () => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(GRAND_GROUPS.map((g) => [g.slug, true]))
  );
  const allOpen = GRAND_GROUPS.every((g) => openGroups[g.slug]);
  const toggleAll = () => {
    const next = !allOpen;
    setOpenGroups(Object.fromEntries(GRAND_GROUPS.map((g) => [g.slug, next])));
  };
  const toggleOne = (slug: string) =>
    setOpenGroups((p) => ({ ...p, [slug]: !p[slug] }));
  return (
    <PageShell>
      {/* HERO — fullscreen navigable slideshow */}
      <HeroSlideshow slides={HERO_SLIDES} />

      {/* MANIFESTO */}
      <section id="after-hero" className="relative py-24 md:py-32 scroll-mt-16 overflow-hidden">
        <img
          src={texturePaper}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply pointer-events-none"
        />
        <img
          src={atmosNotebook}
          alt=""
          aria-hidden
          className="absolute -right-20 top-10 w-[42%] max-w-2xl h-[80%] object-cover opacity-15 grayscale pointer-events-none hidden md:block"
        />
        <div className="container relative">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-3">
              <p className="label-gold">§ 00 · Foreword</p>
              <p className="eyebrow mt-3">Read aloud</p>
            </div>
            <div className="md:col-span-9 max-w-3xl">
              <p className="font-display text-3xl md:text-5xl text-ink leading-tight text-balance drop-cap">
                This is not a résumé. It is a working dossier — equal parts laboratory
                notebook, gallery catalogue, and founder's manifesto. Every page has
                layers, sublayers, evidence. Every claim is meant to be examined.
              </p>
              <div className="rule-double my-12 max-w-xs" />
              <p className="text-ink-soft text-lg leading-relaxed">
                I was born in India, raised between two continents, and I now write,
                perform, code, and study physics from Montréal. I have spent the
                last ten years collecting questions; this site is where I begin to
                answer them — in public, with proof.
              </p>
            </div>
          </div>
        </div>
      </section>


      <PullQuote attr="The operating principle">
        Curiosity is not my hobby. It is my operating system.
      </PullQuote>

      {/* SKILLS TOOLKIT */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src={atmosTelescope}
          alt=""
          aria-hidden
          className="absolute -left-24 top-20 w-[36%] max-w-xl h-[70%] object-cover opacity-20 grayscale pointer-events-none hidden md:block"
        />
        <div className="container relative">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <div>
              <p className="label-gold mb-3">§ 01 · Toolkit</p>
              <h2 className="display-xl text-4xl md:text-6xl text-ink">Skills I bring to the table.</h2>
            </div>
            <p className="max-w-md text-ink-soft text-sm leading-relaxed">
              A working list, not a brag sheet. Each tool earns its place by what I've shipped, not what I've studied.
            </p>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border border border-border">
            {SKILLS.map(({ icon: I, label, level }) => (
              <li key={label} className="bg-paper p-5 group hover:bg-navy-deep hover:text-paper transition-colors duration-500">
                <I className="w-5 h-5 text-gold mb-4" />
                <p className="font-display text-xl leading-tight">{label}</p>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft group-hover:text-paper/60 mt-2">
                  {level}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>


      {/* FEATURED HIGHLIGHTS BENTO */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src={textureCosmos}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <div className="container relative">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <div>
              <p className="label-gold mb-3">§ 02 · Showcase</p>
              <h2 className="display-xl text-4xl md:text-6xl text-ink">Featured work.</h2>
            </div>
            <p className="max-w-md text-ink-soft text-sm leading-relaxed">
              Hover for the elevator pitch. Click for the full story.
            </p>
          </div>
          <Bento items={FEATURED} />
        </div>
      </section>


      {/* TRIPTYCH */}
      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-2">
          {[
            { src: atmosTelescope, label: "Observation", num: "I" },
            { src: atmosNotebook, label: "Notation", num: "II" },
            { src: atmosMusic, label: "Resonance", num: "III" },
          ].map((x) => (
            <figure key={x.label} className="relative aspect-[3/4] overflow-hidden group">
              <img
                src={x.src} alt={x.label} width={1600} height={1000} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 text-paper">
                <span className="font-mono text-xs text-gold tracking-widest">PLATE {x.num}</span>
                <p className="font-display text-3xl mt-1">{x.label}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* RANDOM WINS / CURIOSITIES TEASER */}
      <section className="container py-20 md:py-28">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <p className="label-gold mb-3">§ 03 · Random Wins</p>
            <h2 className="display-xl text-4xl md:text-6xl text-ink">Belts, medals & side quests.</h2>
          </div>
          <Link to="/curiosities" className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-soft hover:text-gold transition-colors flex items-center gap-2">
            Open the full vault <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <Bento items={CURIOSITIES} />
      </section>

      {/* GRAND GROUPS — ALWAYS EXPANDED INDEX */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <img
          src={atmosMusic}
          alt=""
          aria-hidden
          className="absolute right-0 top-0 w-[40%] max-w-2xl h-[55%] object-cover opacity-15 grayscale pointer-events-none hidden md:block"
        />
        <div className="container relative">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="label-gold mb-3">§ 04 · The Archive</p>
              <h2 className="display-xl text-4xl md:text-6xl text-ink">Every cluster, in four groups.</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAll}
                className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-soft hover:text-gold transition-colors border border-border hover:border-gold px-3 py-2"
              >
                {allOpen ? "Collapse all" : "Expand all"}
              </button>
            </div>
          </div>


        <div className="space-y-16">
          {GRAND_GROUPS.map((g) => {
            const GI = g.icon;
            const isOpen = openGroups[g.slug];
            return (
              <div key={g.slug}>
                <header className="grid md:grid-cols-12 gap-6 items-baseline mb-6 pb-4 border-b border-border">
                  <div className="md:col-span-3 flex items-center gap-3">
                    <GI className="w-5 h-5 text-gold" />
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-gold">Grand Group</span>
                  </div>
                  <div className="md:col-span-7">
                    <h3 className="font-display text-3xl md:text-4xl text-ink">{g.label}</h3>
                    <p className="text-ink-soft text-sm mt-1">{g.tagline}</p>
                  </div>
                  <div className="md:col-span-2 md:text-right flex md:justify-end items-center gap-3">
                    <span className="font-mono text-[0.6rem] tracking-widest text-ink-soft">
                      {g.clusterSlugs.length} clusters
                    </span>
                    <button
                      onClick={() => toggleOne(g.slug)}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? "Collapse group" : "Expand group"}
                      className="w-8 h-8 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
                    </button>
                  </div>
                </header>
                {isOpen && (
                <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                  {g.clusterSlugs.map((cs) => {
                    const c = findCluster(cs);
                    if (!c) return null;
                    return (
                      <li key={cs} className="bg-paper">
                        <Link
                          to={`/${c.slug}`}
                          className="group/tile block p-7 h-full hover:bg-navy-deep hover:text-paper transition-colors duration-500"
                        >
                          <div className="flex items-start justify-between mb-10">
                            <span className="font-mono text-xs tracking-widest text-gold">{c.num}</span>
                            <ArrowUpRight className="w-4 h-4 text-ink-soft group-hover/tile:text-gold group-hover/tile:translate-x-1 group-hover/tile:-translate-y-1 transition-all" />
                          </div>
                          <h4 className="font-display text-2xl md:text-3xl leading-tight mb-2">{c.label}</h4>
                          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft group-hover/tile:text-paper/60">
                            {c.tagline}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </section>


      {/* CORE TRAITS BAND */}
      <section className="force-light bg-navy-deep text-paper py-24 md:py-32 relative overflow-hidden grain">
        <img src={textureCosmos} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="container relative">
          <p className="label-gold mb-6">§ 05 · Core Traits</p>
          <h2 className="display-xl text-5xl md:text-7xl mb-16 max-w-3xl text-balance">
            Five instincts I trust before any plan.
          </h2>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              ["I", "Analytical Precision", "Numbers before opinions."],
              ["II", "Creative Intelligence", "Form follows imagination."],
              ["III", "Leadership", "Quiet, by example."],
              ["IV", "Relentless Work Ethic", "Hours compound."],
              ["V", "Cross-disciplinary Thinking", "Edges are where ideas meet."],
            ].map(([n, t, d]) => (
              <div key={t} className="border-t border-gold/40 pt-4">
                <p className="font-mono text-xs text-gold tracking-widest">{n}</p>
                <h3 className="font-display text-2xl mt-2">{t}</h3>
                <p className="text-paper/60 text-sm mt-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Index;
