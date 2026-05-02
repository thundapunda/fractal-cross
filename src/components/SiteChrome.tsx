import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { CLUSTERS, GRAND_GROUPS, PROOF_CLUSTER, findGrandGroup } from "@/data/clusters";
import { ThemeToggle } from "./ThemeToggle";

const topLinks = [
  { to: "/", label: "Home (Editorial)", num: "00" },
  { to: "/dashboard", label: "Dashboard", num: "✦✦" },
];
const footerLinks = [
  { to: `/${PROOF_CLUSTER.slug}`, label: PROOF_CLUSTER.label, num: PROOF_CLUSTER.num },
];

export const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // grand-group expansion state in the drawer
  const currentClusterSlug = location.pathname.split("/")[1] ?? "";
  const currentGroup = findGrandGroup(currentClusterSlug);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(currentGroup ? [currentGroup.slug] : []),
  );
  const toggleGroup = (slug: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  const allOpen = openGroups.size === GRAND_GROUPS.length;
  const setAllGroups = (o: boolean) =>
    setOpenGroups(o ? new Set(GRAND_GROUPS.map((g) => g.slug)) : new Set());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, []);
  // Auto-open the group containing the active route when navigating
  useEffect(() => {
    if (currentGroup) {
      setOpenGroups((prev) => (prev.has(currentGroup.slug) ? prev : new Set([...prev, currentGroup.slug])));
    }
  }, [currentGroup]);

  // When the hero slideshow is in view, override header colors to light
  // (the slideshow has a dark overlay regardless of theme).
  const heroLight = "[html.hero-in-view_&]:text-paper";
  const heroLightSoft = "[html.hero-in-view_&]:text-paper/80";
  const heroLightBorder = "[html.hero-in-view_&]:border-paper/30";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-navy-deep/85 backdrop-blur-md border-b border-paper/10 shadow-[0_8px_24px_-12px_hsl(220_60%_4%/0.5)]"
            : "bg-navy-deep/55 backdrop-blur-md border-b border-paper/10 shadow-[0_8px_24px_-12px_hsl(220_60%_4%/0.5)]"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-gold [text-shadow:0_2px_8px_hsl(220_60%_4%/0.65),0_1px_2px_hsl(220_60%_4%/0.8)]">
              GG
            </span>
            <span className="hidden sm:inline font-display text-lg text-paper [text-shadow:0_2px_8px_hsl(220_60%_4%/0.65),0_1px_2px_hsl(220_60%_4%/0.8)]">
              Geetika Gehlot
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle className="!text-paper !border-paper/30 hover:!text-gold hover:!border-gold shadow-[0_6px_18px_-4px_hsl(220_60%_4%/0.55)]" />
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 group px-2 py-1 shadow-[0_6px_18px_-4px_hsl(220_60%_4%/0.55)]"
              aria-label="Open menu"
            >
              <span className="hidden md:inline eyebrow text-paper/85 group-hover:text-gold transition-colors [text-shadow:0_2px_8px_hsl(220_60%_4%/0.65),0_1px_2px_hsl(220_60%_4%/0.8)]">
                Index
              </span>
              <Menu className="w-5 h-5 text-paper group-hover:text-gold transition-colors drop-shadow-[0_2px_6px_hsl(220_60%_4%/0.65)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Index drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-deep/85 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-paper shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <span className="eyebrow">Site Index</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5 text-ink hover:text-gold transition-colors" />
            </button>
          </div>
          <nav className="p-6">
            {/* Top fixed links */}
            <ol className="space-y-0">
              {topLinks.map((s) => (
                <li key={s.to}>
                  <NavLink
                    to={s.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-baseline gap-6 py-4 border-b border-border/60 group transition-colors ${
                        isActive ? "text-gold" : "text-ink hover:text-gold"
                      }`
                    }
                  >
                    <span className="font-mono text-[0.7rem] tracking-widest text-muted-foreground w-8">
                      {s.num}
                    </span>
                    <span className="font-display text-2xl">{s.label}</span>
                  </NavLink>
                </li>
              ))}
            </ol>

            {/* Expand/collapse all */}
            <div className="flex items-center justify-between mt-6 mb-2">
              <span className="eyebrow">Clusters</span>
              <button
                onClick={() => setAllGroups(!allOpen)}
                className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-ink-soft hover:text-gold transition-colors flex items-center gap-1.5"
              >
                {allOpen ? "Collapse all" : "Expand all"}
                <ChevronDown className={`w-3 h-3 transition-transform ${allOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Grand groups: contract/expandable */}
            <ul className="border-t border-border/60">
              {GRAND_GROUPS.map((g) => {
                const GI = g.icon;
                const isOpen = openGroups.has(g.slug);
                return (
                  <li key={g.slug} className="border-b border-border/60">
                    <button
                      onClick={() => toggleGroup(g.slug)}
                      className="w-full flex items-center gap-3 py-3 text-left group"
                      aria-expanded={isOpen}
                    >
                      <GI className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="font-display text-lg text-ink group-hover:text-gold transition-colors flex-1">
                        {g.label}
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-widest text-muted-foreground">
                        {g.clusterSlugs.length}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 pb-3" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="pl-6 space-y-0">
                          {g.clusterSlugs.map((cs) => {
                            const c = CLUSTERS.find((x) => x.slug === cs);
                            if (!c) return null;
                            return (
                              <li key={cs}>
                                <NavLink
                                  to={`/${c.slug}`}
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    `flex items-baseline gap-4 py-2 transition-colors ${
                                      isActive ? "text-gold" : "text-ink-soft hover:text-gold"
                                    }`
                                  }
                                >
                                  <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground w-8">
                                    {c.num}
                                  </span>
                                  <span className="font-display text-base">{c.label}</span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer fixed links (Proof) */}
            <ol className="mt-2">
              {footerLinks.map((s) => (
                <li key={s.to}>
                  <NavLink
                    to={s.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-baseline gap-6 py-4 border-b border-border/60 transition-colors ${
                        isActive ? "text-gold" : "text-ink hover:text-gold"
                      }`
                    }
                  >
                    <span className="font-mono text-[0.7rem] tracking-widest text-muted-foreground w-8">
                      {s.num}
                    </span>
                    <span className="font-display text-2xl">{s.label}</span>
                  </NavLink>
                </li>
              ))}
            </ol>

            <p className="mt-8 eyebrow text-muted-foreground">
              Curiosity is not my hobby. It is my operating system.
            </p>
          </nav>
        </aside>
      </div>
    </>
  );
};

export const SiteFooter = () => (
  <footer className="force-light bg-navy-deep text-paper mt-32 relative overflow-hidden grain">
    <div className="container py-20 grid md:grid-cols-4 gap-12">
      <div className="md:col-span-2">
        <p className="label-gold mb-4">Colophon</p>
        <p className="font-display text-3xl text-balance leading-tight">
          A living dossier of one curious mind, updated as the work continues.
        </p>
      </div>
      <div>
        <p className="eyebrow text-paper/60 mb-4">Navigate</p>
        <ul className="space-y-2 font-mono text-xs">
          <li><Link to="/" className="link-underline hover:text-gold">00 · Home</Link></li>
          <li><Link to="/dashboard" className="link-underline hover:text-gold">✦✦ · Dashboard</Link></li>
          {GRAND_GROUPS.map((g) => (
            <li key={g.slug} className="text-gold/80">{g.label}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow text-paper/60 mb-4">Contact</p>
        <ul className="space-y-2 font-mono text-xs">
          <li><Link to="/contact" className="link-underline hover:text-gold">Email</Link></li>
          <li><Link to="/vault" className="link-underline hover:text-gold">Curriculum Vitae</Link></li>
          <li><Link to="/proof" className="link-underline hover:text-gold">Proof of Curiosity</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-paper/10">
      <div className="container py-6 flex flex-col md:flex-row justify-between gap-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-paper/50">
        <span>© {new Date().getFullYear()} Geetika Gehlot · Montréal</span>
        <span>Edition I · Volume One · Ongoing</span>
      </div>
    </div>
  </footer>
);

export const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-paper text-ink">
    <SiteNav />
    <main className="pt-16">{children}</main>
    <SiteFooter />
  </div>
);
