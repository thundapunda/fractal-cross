import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Star, Compass } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { GRAND_GROUPS, PROOF_CLUSTER, findCluster } from "@/data/clusters";
import heroPortrait from "@/assets/hero-portrait.jpg";

const stats = [
  ["15", "Age"],
  ["Sec. IV", "Grade"],
  ["IN → CA", "Trajectory"],
  ["100+", "Recognitions"],
  ["3", "Languages"],
  ["12", "Disciplines"],
];

const featured = [
  { tag: "Achievement", title: "FRC Team 7700", to: "/robotics#highlights" },
  { tag: "Academic", title: "AP Track + Olympiads", to: "/academics#highlights" },
  { tag: "Artistic", title: "Child Artist reel", to: "/acting#child-artist-archive" },
  { tag: "Technical", title: "Zionaxelle.com", to: "/tech#zionaxelle" },
  { tag: "Performance", title: "Hindustani vocal", to: "/music#vocal-performance" },
  { tag: "Leadership", title: "Cultural integration", to: "/leadership#cultural-integration" },
  { tag: "Curiosity", title: "Karate + Abacus", to: "/curiosities" },
];

const startHere = [
  { label: "AP Exams + Grades", to: "/academics#highlights" },
  { label: "Robotics 7700", to: "/robotics" },
  { label: "Zionaxelle", to: "/tech#zionaxelle" },
  { label: "Child artist playlist", to: "/acting#child-artist-archive" },
  { label: "Endless Portals podcast", to: "/writing#podcast" },
  { label: "Random wins vault", to: "/curiosities" },
];

function GrandGroupBlock({ group }: { group: typeof GRAND_GROUPS[number] }) {
  const GI = group.icon;
  return (
    <div className="border-t border-border py-8">
      <header className="flex items-baseline gap-4 mb-5">
        <GI className="w-4 h-4 text-gold shrink-0" />
        <div className="flex-1">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-gold">Grand Group</p>
          <h3 className="font-display text-2xl md:text-3xl text-ink">{group.label}</h3>
          <p className="text-xs text-ink-soft mt-1">{group.tagline}</p>
        </div>
        <span className="font-mono text-[0.6rem] tracking-widest text-ink-soft">
          {group.clusterSlugs.length} clusters
        </span>
      </header>
      <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
        {group.clusterSlugs.map((cs) => {
          const c = findCluster(cs);
          if (!c) return null;
          const I = c.icon;
          return (
            <li key={cs} className="bg-paper">
              <Link
                to={`/${c.slug}`}
                className="group/tile block p-5 h-full hover:bg-navy-deep hover:text-paper transition-colors duration-500"
              >
                <div className="flex items-start justify-between mb-8">
                  <I className="w-5 h-5 text-gold" />
                  <span className="font-mono text-[0.6rem] tracking-widest text-ink-soft group-hover/tile:text-paper/60">
                    {c.num}
                  </span>
                </div>
                <h4 className="font-display text-xl leading-tight">{c.label}</h4>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft group-hover/tile:text-paper/60 mt-2 line-clamp-2">
                  {c.tagline}
                </p>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const Dashboard = () => (
  <PageShell>
    {/* Banner */}
    <section className="container pt-10 pb-12">
      <div className="grid md:grid-cols-[160px,1fr] gap-8 items-center">
        <img
          src={heroPortrait}
          alt="Geetika Gehlot"
          className="w-32 h-32 md:w-40 md:h-40 object-cover object-[60%_30%] rounded-sm border border-border"
        />
        <div>
          <p className="label-gold mb-2">Dashboard · Edition I</p>
          <h1 className="display-xl text-4xl md:text-6xl text-ink leading-[0.95]">Geetika Gehlot</h1>
          <p className="mt-3 font-display italic text-lg md:text-xl text-ink-soft max-w-2xl">
            Multidisciplinary student, creator, performer, and emerging scientist.
          </p>
          <p className="mt-2 text-ink-soft text-sm max-w-2xl">
            Building toward physics, engineering, and ambitious creative work — one fractal cluster at a time.
          </p>
        </div>
      </div>
    </section>

    {/* Stat strip */}
    <section className="container">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border">
        {stats.map(([v, l]) => (
          <div key={l} className="bg-paper px-4 py-4">
            <div className="font-display text-2xl text-ink leading-none">{v}</div>
            <div className="eyebrow mt-1.5">{l}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Featured */}
    <section className="container py-14">
      <div className="flex items-baseline gap-3 mb-6">
        <Star className="w-4 h-4 text-gold" />
        <span className="label-gold">Featured Highlights</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {featured.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="snap-start shrink-0 w-64 dossier-card p-5 hover-lift"
          >
            <p className="font-mono text-[0.6rem] text-gold tracking-widest">{f.tag.toUpperCase()}</p>
            <p className="font-display text-xl text-ink mt-2 leading-tight">{f.title}</p>
            <ArrowUpRight className="w-4 h-4 text-ink-soft mt-3" />
          </Link>
        ))}
      </div>
    </section>

    {/* App grid — always expanded */}
    <section className="container pb-14">
      <div className="flex items-baseline gap-3 mb-6">
        <Sparkles className="w-4 h-4 text-gold" />
        <span className="label-gold">Grand Groups · All Clusters</span>
        <span className="flex-1 h-px bg-border" />
      </div>
      <div>
        {GRAND_GROUPS.map((g) => (
          <GrandGroupBlock key={g.slug} group={g} />
        ))}
        {/* Proof of Curiosity standalone */}
        <div className="border-t border-border py-6">
          <Link to={`/${PROOF_CLUSTER.slug}`} className="flex items-center gap-4 group">
            <PROOF_CLUSTER.icon className="w-4 h-4 text-gold" />
            <div className="flex-1">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-gold">Bonus</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">{PROOF_CLUSTER.label}</h3>
              <p className="text-xs text-ink-soft mt-1">{PROOF_CLUSTER.tagline}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-ink-soft group-hover:text-gold" />
          </Link>
        </div>
      </div>
    </section>

    {/* Start Here */}
    <section className="container pb-24">
      <div className="bg-navy-deep text-paper p-8 md:p-12 grain relative overflow-hidden">
        <div className="flex items-baseline gap-3 mb-4">
          <Compass className="w-4 h-4 text-gold" />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-gold">Start Here</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl mb-6 max-w-2xl">Explore my strongest work first.</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {startHere.map((x) => (
            <li key={x.to}>
              <Link to={x.to} className="flex items-center justify-between gap-3 border border-paper/20 px-4 py-3 hover:border-gold hover:text-gold transition-colors">
                <span className="font-display text-lg">{x.label}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </PageShell>
);

export default Dashboard;
