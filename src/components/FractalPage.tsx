import { ReactNode, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowUpRight, FileText, Image as ImgIcon, Sparkles, Quote, Link2, BookOpen,
} from "lucide-react";
import { ClusterShell } from "./ClusterShell";
import { PullQuote, Marginalia } from "./Editorial";
import { Bento, type BentoItem } from "./Bento";
import { CLUSTERS, findCluster, type Cluster, type Subpage } from "@/data/clusters";
import heroFallback from "@/assets/atmos-notebook.jpg";

function SubpageHeader({ kicker, num, title, lede }: { kicker: string; num: string; title: string; lede?: string }) {
  return (
    <header className="px-4 md:px-12 pt-10 md:pt-14 pb-8 max-w-5xl">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-xs tracking-[0.3em] text-gold">§ {num}</span>
        <span className="eyebrow">{kicker}</span>
      </div>
      <h1 className="display-xl text-4xl md:text-6xl text-ink text-balance">{title}</h1>
      {lede && <p className="mt-6 text-lg text-ink-soft font-display italic max-w-2xl leading-relaxed">{lede}</p>}
      <div className="rule-gold mt-10" />
    </header>
  );
}

/** Always-expanded rail: no toggle, just an anchored block with header + content. */
type IconCmp = React.ComponentType<{ className?: string }>;

function Rail({
  id, icon: Icon, label, title, children,
}: { id: string; icon: IconCmp; label: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="px-4 md:px-12 border-t border-border scroll-mt-32 py-10 md:py-14">
      <header className="flex items-center gap-3 mb-8">
        <Icon className="w-4 h-4 text-gold shrink-0" />
        <span className="label-gold">{label}</span>
        <span className="flex-1 h-px bg-border" />
        <h2 className="font-display text-xl md:text-2xl text-ink text-right">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  );
}

function RelatedRail({ clusterSlug }: { clusterSlug: string }) {
  const others = CLUSTERS.filter((c) => c.slug !== clusterSlug).slice(0, 6);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {others.map((c) => {
        const I = c.icon;
        return (
          <Link
            key={c.slug}
            to={`/${c.slug}`}
            className="group dossier-card p-5 hover-lift flex items-start gap-3"
          >
            <I className="w-4 h-4 text-gold mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[0.6rem] tracking-widest text-muted-foreground">§ {c.num}</p>
              <h3 className="font-display text-xl text-ink leading-tight">{c.label}</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed line-clamp-2">{c.tagline}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-ink-soft group-hover:text-gold transition-colors" />
          </Link>
        );
      })}
    </div>
  );
}

/* -------------------- Inner renderers (bento everywhere it makes sense) -------------------- */

/** Visual-first Overview: hero image + tagline + featured trio. */
function OverviewInner({ cluster }: { cluster: Cluster }) {
  const trio: BentoItem[] = [
    {
      id: "trio-1", size: "md", eyebrow: "Signature win",
      title: "The headline achievement",
      blurb: "Replace with the single most impressive thing in this cluster.",
      meta: "TODO · most recent or biggest",
    },
    {
      id: "trio-2", size: "md", eyebrow: "Origin",
      title: "Where it started",
      blurb: "The first spark — when, where, and why this began.",
      meta: "TODO",
    },
    {
      id: "trio-3", size: "md", eyebrow: "What's next",
      title: "The next chapter",
      blurb: "What I'm currently building inside this cluster.",
      meta: "TODO",
    },
  ];
  return (
    <div className="space-y-8">
      {/* Visual-first hero */}
      <div className="relative overflow-hidden border border-border aspect-[21/9]">
        <img
          src={heroFallback}
          alt={`${cluster.label} — atmospheric hero`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-navy-deep/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-paper">
          <p className="label-gold mb-3">§ {cluster.num} · {cluster.label}</p>
          <h2 className="font-display text-3xl md:text-6xl leading-tight max-w-3xl text-balance">
            {cluster.tagline}
          </h2>
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-paper/60">
            {cluster.subpages.filter((s) => s.kind === "topic").length} topic threads ·
            {" "}{cluster.subpages.filter((s) => s.kind !== "topic").length} fractal rails
          </p>
        </div>
      </div>
      <Bento items={trio} />
    </div>
  );
}

function HighlightsInner({ cluster }: { cluster: Cluster }) {
  const items: BentoItem[] = [
    { id: "h1", size: "xl", eyebrow: "Featured", title: `${cluster.label} — best of`, blurb: "The anchor item. Big, bold, the one I'd lead with in a conversation.", image: heroFallback, meta: "TODO · replace" },
    { id: "h2", size: "md", eyebrow: "Highlight", title: "Second favourite", blurb: "Strong supporting work — different in tone from the lead." },
    { id: "h3", size: "md", eyebrow: "Highlight", title: "Recent win", blurb: "Something fresh — within the last 6 months." },
    { id: "h4", size: "lg", eyebrow: "Highlight", title: "The under-rated one", blurb: "A quieter piece I'm proud of — context unlocks why.", image: heroFallback },
    { id: "h5", size: "md", eyebrow: "Highlight", title: "Collaboration", blurb: "Made with someone whose taste I trust." },
    { id: "h6", size: "md", eyebrow: "Highlight", title: "The hard one", blurb: "Almost broke me. Worth it." },
  ];
  return <Bento items={items} />;
}

function EvidenceInner() {
  const items: BentoItem[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `e${i}`,
    size: i === 0 ? "lg" : i === 3 ? "wide" : "sm",
    eyebrow: "Document",
    title: `Evidence ${i + 1}`,
    blurb: "Drop a scan, certificate, transcript, or PDF here.",
    meta: "TODO · who issued · when",
  }));
  return (
    <div className="space-y-6">
      <Bento items={items} />
      <Marginalia>Each evidence item should answer: who issued it, when, what it certifies.</Marginalia>
    </div>
  );
}

function MediaInner() {
  const items: BentoItem[] = [
    { id: "m1", size: "xl", eyebrow: "Feature", title: "Headline media", blurb: "Photo, reel, or video that captures the work.", image: heroFallback },
    { id: "m2", size: "md", eyebrow: "Photo", title: "Behind the scenes" },
    { id: "m3", size: "md", eyebrow: "Audio", title: "Listen to it" },
    { id: "m4", size: "wide", eyebrow: "Embed", title: "External player slot", blurb: "YouTube · Vimeo · podcast feed · external player." },
  ];
  return <Bento items={items} />;
}

function ReflectionInner() {
  return (
    <div className="max-w-3xl space-y-6">
      <p className="font-display text-xl text-ink leading-relaxed drop-cap">
        A short reflection paragraph. What was hard, what surprised me, what I want to keep doing,
        and what I would no longer do the same way.
      </p>
      <PullQuote>One honest sentence I learned the hard way.</PullQuote>
    </div>
  );
}

function TopicInner({ topicLabel }: { topicLabel: string }) {
  const items: BentoItem[] = [
    { id: "t1", size: "xl", eyebrow: "Anchor", title: `${topicLabel} — the headline`, blurb: "The single thing someone should know about this thread.", image: heroFallback },
    { id: "t2", size: "md", eyebrow: "Item", title: "Anchor 2", blurb: "Replace with the real entry." },
    { id: "t3", size: "md", eyebrow: "Item", title: "Anchor 3", blurb: "Replace with the real entry." },
    { id: "t4", size: "lg", eyebrow: "Media", title: `${topicLabel} — visual`, blurb: "Photo, video, or scan that grounds this topic.", image: heroFallback },
    { id: "t5", size: "md", eyebrow: "Item", title: "Anchor 4", blurb: "Replace with the real entry." },
  ];
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-ink-soft text-lg leading-relaxed font-display italic">
        A clear statement of scope for <strong className="text-ink not-italic">{topicLabel}</strong>: what's in,
        what's out, and why it deserves its own thread.
      </p>
      <Bento items={items} />
    </div>
  );
}

const KIND_META: Record<string, { icon: IconCmp; label: string; title: (cl: string) => string }> = {
  overview:    { icon: Sparkles, label: "Overview",   title: (cl) => `${cl} — at a glance` },
  highlights:  { icon: Sparkles, label: "Highlights", title: () => "Best-of, hand-picked" },
  evidence:    { icon: FileText, label: "Evidence",   title: () => "Documents, scores, certificates" },
  media:       { icon: ImgIcon,  label: "Media",      title: () => "Photos, video, audio, embeds" },
  reflection:  { icon: Quote,    label: "Reflection", title: () => "What I learned" },
  related:     { icon: Link2,    label: "Related",    title: () => "Where this connects" },
  topic:       { icon: BookOpen, label: "Topic",      title: () => "" },
};

function renderInner(s: Subpage, c: Cluster): ReactNode {
  switch (s.kind) {
    case "overview":   return <OverviewInner cluster={c} />;
    case "highlights": return <HighlightsInner cluster={c} />;
    case "evidence":   return <EvidenceInner />;
    case "media":      return <MediaInner />;
    case "reflection": return <ReflectionInner />;
    case "related":    return <RelatedRail clusterSlug={c.slug} />;
    case "topic":      return <TopicInner topicLabel={s.label} />;
    default:           return null;
  }
}

/** Single-page cluster view: every rail rendered as an always-expanded section. */
export function FractalPage() {
  const { cluster = "", sub } = useParams();
  const c = findCluster(cluster);

  // If a sub is requested, drop a hash so the matching Rail scrolls into view.
  useEffect(() => {
    if (!c) return;
    if (sub && sub !== "overview") {
      window.location.hash = sub;
      setTimeout(() => {
        document.getElementById(sub)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else if (!sub) {
      if (window.location.hash) history.replaceState(null, "", window.location.pathname);
    }
  }, [sub, c]);

  if (!c) return <Navigate to="/dashboard" replace />;

  return (
    <ClusterShell>
      <SubpageHeader
        num={c.num}
        kicker={`Cluster · ${c.label}`}
        title={c.label}
        lede={c.tagline}
      />
      {c.subpages.map((s) => {
        const meta = KIND_META[s.kind ?? "topic"];
        const isTopic = s.kind === "topic";
        const title = isTopic ? s.label : meta.title(c.label);
        return (
          <Rail
            key={s.slug}
            id={s.slug}
            icon={meta.icon}
            label={isTopic ? "Topic" : meta.label}
            title={title}
          >
            {renderInner(s, c)}
          </Rail>
        );
      })}
      <div className="h-24" />
    </ClusterShell>
  );
}
