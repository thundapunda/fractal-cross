import { ReactNode, useState, useEffect } from "react";
import { NavLink, Link, useParams, useLocation } from "react-router-dom";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { SiteNav, SiteFooter } from "./SiteChrome";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { CLUSTERS, findCluster, findSubpage } from "@/data/clusters";

// scroll-spy: tracks which subsection anchor is in view, updates location.hash without jumping
function useScrollSpy(ids: string[]) {
  const location = useLocation();
  const [active, setActive] = useState<string>(() => location.hash.replace("#", "") || ids[0]);

  useEffect(() => {
    if (!ids.length) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibility.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        // pick the most-visible one
        let best = "";
        let bestRatio = 0;
        visibility.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });
        if (best && best !== active) {
          setActive(best);
          // soft-update hash without scrolling
          if (history.replaceState) {
            const newHash = best === ids[0] ? " " : `#${best}`;
            history.replaceState(null, "", `${location.pathname}${newHash === " " ? "" : newHash}`);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), location.pathname]);

  return active;
}

// short glyph for collapsed sidebar (Roman-numeral-ish, sleek)
function railGlyph(index: number): string {
  // small two-digit numerals — clean, consistent width
  return String(index + 1).padStart(2, "0");
}

function ClusterSidebar({ clusterSlug }: { clusterSlug: string }) {
  const cluster = findCluster(clusterSlug);
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Collect subpage slugs in order; "overview" maps to top of page (no hash) but for spy we treat first section as overview
  const subSlugs = cluster?.subpages.map((s) => s.slug) ?? [];
  const activeSlug = useScrollSpy(subSlugs);

  if (!cluster) return null;
  const Icon = cluster.icon;

  const linkFor = (slug: string) => slug === "overview" ? `/${cluster.slug}` : `/${cluster.slug}#${slug}`;
  const isActiveSub = (slug: string) => slug === activeSlug;

  const rails = cluster.subpages.filter((s) => s.kind !== "topic");
  const topics = cluster.subpages.filter((s) => s.kind === "topic");

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-paper">
        <div className={`px-3 py-5 border-b border-border ${collapsed ? "px-2" : "px-4"}`}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 text-ink-soft hover:text-gold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em]">Dashboard</span>
            </Link>
          )}
          <div className={`mt-3 flex items-center gap-2.5 ${collapsed ? "justify-center mt-0" : ""}`}>
            <Icon className="w-4 h-4 text-gold shrink-0" />
            {!collapsed && <span className="font-display text-lg leading-tight text-ink truncate">{cluster.label}</span>}
          </div>
          {!collapsed && <p className="font-mono text-[0.6rem] text-gold tracking-widest mt-1">§ {cluster.num}</p>}
        </div>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground">
              Fractal Rails
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {rails.map((s, i) => {
                const active = isActiveSub(s.slug);
                return (
                  <SidebarMenuItem key={s.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={collapsed ? s.label : undefined}
                    >
                      <a
                        href={linkFor(s.slug)}
                        title={collapsed ? s.label : undefined}
                        className={`font-mono text-xs tracking-wide flex items-center ${
                          active ? "text-gold bg-paper-deep" : "text-ink hover:text-gold"
                        }`}
                      >
                        {collapsed ? (
                          <span className={`font-mono text-[0.65rem] tracking-[0.15em] w-full text-center ${active ? "text-gold" : "text-ink-soft"}`}>
                            {railGlyph(i)}
                          </span>
                        ) : (
                          <>
                            <span className={`mr-1 ${active ? "text-gold" : "text-gold"}`}>·</span>
                            <span className="truncate">{s.label}</span>
                          </>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {topics.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground">
                Topics
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {topics.map((s, i) => {
                  const active = isActiveSub(s.slug);
                  return (
                    <SidebarMenuItem key={s.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={collapsed ? s.label : undefined}
                      >
                        <a
                          href={linkFor(s.slug)}
                          title={collapsed ? s.label : undefined}
                          className={`font-display text-sm flex items-center ${
                            active ? "text-gold" : "text-ink hover:text-gold"
                          }`}
                        >
                          {collapsed ? (
                            <span className="font-mono text-[0.7rem] tracking-widest w-full text-center">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          ) : (
                            <span className="truncate">{s.label}</span>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Flat all-pages nav */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground">
              All Pages
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {CLUSTERS.map((cc) => {
                const CI = cc.icon;
                const isCurrent = cc.slug === cluster.slug;
                return (
                  <SidebarMenuItem key={cc.slug}>
                    <SidebarMenuButton asChild tooltip={collapsed ? cc.label : undefined} isActive={isCurrent}>
                      <NavLink
                        to={`/${cc.slug}`}
                        title={collapsed ? cc.label : undefined}
                        className={`flex items-center gap-2 ${
                          collapsed ? "justify-center" : ""
                        } ${isCurrent ? "text-gold" : "text-ink-soft hover:text-gold"}`}
                      >
                        <CI className="w-3.5 h-3.5 shrink-0" />
                        {!collapsed && (
                          <span className="font-mono text-[0.7rem] tracking-wide truncate">{cc.label}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function Breadcrumbs({ cluster, sub }: { cluster: string; sub?: string }) {
  const c = findCluster(cluster);
  const s = c && sub ? findSubpage(c, sub) : undefined;
  return (
    <nav className="flex items-center gap-2 text-[0.7rem] font-mono uppercase tracking-[0.2em] text-muted-foreground">
      <Link to="/" className="hover:text-gold flex items-center gap-1.5"><Home className="w-3 h-3" />Home</Link>
      <ChevronRight className="w-3 h-3" />
      <Link to="/dashboard" className="hover:text-gold">Dashboard</Link>
      {c && (
        <>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/${c.slug}/overview`} className="hover:text-gold">{c.label}</Link>
        </>
      )}
      {s && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gold">{s.label}</span>
        </>
      )}
    </nav>
  );
}

export function ClusterShell({ children }: { children: ReactNode }) {
  const { cluster = "", sub } = useParams();
  return (
    <div className="min-h-screen bg-paper text-foreground flex flex-col">
      <SiteNav />
      <SidebarProvider>
        <div className="flex w-full pt-16 min-h-[calc(100vh-4rem)]">
          <ClusterSidebar clusterSlug={cluster} />
          <div className="flex-1 flex flex-col min-w-0">
            <div className="sticky top-16 z-30 bg-paper/90 backdrop-blur-md border-b border-border">
              <div className="flex items-center gap-3 px-4 md:px-8 h-12">
                <SidebarTrigger className="text-ink-soft hover:text-gold" />
                <Breadcrumbs cluster={cluster} sub={sub} />
              </div>
            </div>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </SidebarProvider>
      <SiteFooter />
    </div>
  );
}