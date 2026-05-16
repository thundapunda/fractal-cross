import { NavLink, Link } from "react-router-dom";
import { forwardRef, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CLUSTERS } from "@/data/clusters";

const topLinks = [
  { to: "/", label: "Home", num: "00" },
  { to: "/dashboard", label: "Pages", num: "✦✦" },
];

export const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, []);

  return (
    <>
      <header
        className={`force-light fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
            <span className="hidden sm:inline font-display [text-shadow:0_2px_8px_hsl(220_60%_4%/0.65),0_1px_2px_hsl(220_60%_4%/0.8)] text-[#ffc83d] text-xl">
              Geetika Gehlot
            </span>
          </Link>

          <div className="flex items-center gap-3 text-paper">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 group px-2 py-1 text-paper hover:text-gold shadow-[0_6px_18px_-4px_hsl(220_60%_4%/0.55)]"
              aria-label="Open menu"
            >
              <span className="hidden md:inline eyebrow !text-paper group-hover:!text-gold transition-colors [text-shadow:0_2px_8px_hsl(220_60%_4%/0.65),0_1px_2px_hsl(220_60%_4%/0.8)]">
                Index
              </span>
              <Menu className="w-5 h-5 !text-paper group-hover:!text-gold transition-colors drop-shadow-[0_2px_6px_hsl(220_60%_4%/0.65)]" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-navy-deep/85 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-paper text-ink shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <span className="eyebrow">Site Index</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5 text-ink hover:text-gold transition-colors" />
            </button>
          </div>
          <nav className="p-6">
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
                    <span className="font-mono text-[0.7rem] tracking-widest text-muted-foreground w-8">{s.num}</span>
                    <span className="font-display text-2xl">{s.label}</span>
                  </NavLink>
                </li>
              ))}
            </ol>

            <div className="mt-6 mb-2"><span className="eyebrow">Pages</span></div>
            <ul className="border-t border-border/60">
              {CLUSTERS.map((c) => {
                const CI = c.icon;
                return (
                  <li key={c.slug} className="border-b border-border/60">
                    <NavLink
                      to={`/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-baseline gap-4 py-3 transition-colors ${
                          isActive ? "text-gold" : "text-ink hover:text-gold"
                        }`
                      }
                    >
                      <CI className="w-3.5 h-3.5 text-gold shrink-0 self-center" />
                      <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground w-8">{c.num}</span>
                      <span className="font-display text-lg">{c.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};

export const SiteFooter = forwardRef<HTMLElement>((_, ref) => (
  <footer ref={ref} className="force-light bg-navy-deep text-paper relative overflow-hidden grain">
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
          <li><Link to="/dashboard" className="link-underline hover:text-gold">✦✦ · Pages</Link></li>
          {CLUSTERS.map((c) => (
            <li key={c.slug}>
              <Link to={`/${c.slug}`} className="link-underline hover:text-gold">
                {c.num} · {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow text-paper/60 mb-4">Contact</p>
        <ul className="space-y-2 font-mono text-xs">
          <li><Link to="/contact" className="link-underline hover:text-gold">Email</Link></li>
          <li><Link to="/vault" className="link-underline hover:text-gold">Curriculum Vitae</Link></li>
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
));

SiteFooter.displayName = "SiteFooter";

export const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-paper text-foreground">
    <SiteNav />
    <main className="pt-16">{children}</main>
    <SiteFooter />
  </div>
);
