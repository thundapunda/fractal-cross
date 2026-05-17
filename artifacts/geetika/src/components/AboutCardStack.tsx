import { useEffect, useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { TopicData } from "@/data/clusters";
import heroPortrait from "@/assets/hero-portrait.jpg";
import atmosNotebook from "@/assets/atmos-notebook.jpg";
import atmosTelescope from "@/assets/atmos-telescope.jpg";
import atmosMusic from "@/assets/atmos-music.jpg";
import textureCosmos from "@/assets/texture-cosmos.jpg";

/* ─── Helpers ──────────────────────────────────────────────────── */
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * clamp(t, 0, 1); }
function easeOut(t: number) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }
function easeInOut(t: number) { const c = clamp(t, 0, 1); return c < 0.5 ? 2*c*c : 1 - Math.pow(-2*c+2, 2)/2; }

/* ─── Scroll phases ─────────────────────────────────────────────── */
const ENTER        = 0.03;   // profile card starts entering
const EXPAND_END   = 0.20;   // fully expanded
const READ_END     = 0.58;   // essay fully read

/* ─── Card placement aesthetics ────────────────────────────────── */
const ENTRY = [
  { angle:  8, x:  55, y: -75 },
  { angle: -7, x: -50, y: -80 },
  { angle:  9, x:  60, y: -70 },
  { angle: -6, x: -45, y: -72 },
  { angle:  7, x:  52, y: -78 },
  { angle: -8, x: -55, y: -68 },
];
const PEEK = [
  { angle: -2.8, x: -7, y:  5 },
  { angle:  2.2, x:  5, y:  6 },
  { angle: -3.2, x: -8, y:  4 },
  { angle:  1.8, x:  6, y:  7 },
  { angle: -2.5, x: -6, y:  5 },
  { angle:  2.6, x:  7, y:  6 },
];

const CARD_BG = [
  "hsl(220 32% 7%)",
  "hsl(226 28% 7.5%)",
  "hsl(215 36% 6.5%)",
  "hsl(228 30% 8%)",
  "hsl(218 38% 6%)",
  "hsl(223 26% 7%)",
];
const CARD_ACCENT = [
  "#c9a342",  // gold
  "#8ab4c8",  // blue-silver
  "#c49a3a",  // warm gold
  "#7bbcb4",  // teal
  "#d4aa44",  // bright gold
  "#9aaed4",  // cool silver
];
const PHOTOS = [heroPortrait, atmosNotebook, atmosTelescope, atmosMusic, textureCosmos, atmosNotebook];

/* ─── Profile card inner essay ─────────────────────────────────── */
function EssayPhoto({ src, alt, caption, align = "right" }: { src: string; alt: string; caption: string; align?: "left" | "right" | "full" }) {
  if (align === "full") return (
    <figure className="my-8 w-full clear-both">
      <div className="relative w-full overflow-hidden border border-border/25" style={{ aspectRatio: "21/8" }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
      <figcaption className="mt-1.5 text-center font-mono uppercase tracking-[0.2em] text-ink-soft/40" style={{ fontSize: "8px" }}>{caption}</figcaption>
    </figure>
  );
  return (
    <figure className={`my-1 mb-4 ${align === "right" ? "float-right ml-6" : "float-left mr-6"} w-36 md:w-52`} style={{ shapeOutside: "border-box" } as React.CSSProperties}>
      <div className="relative overflow-hidden border border-border/25 bg-paper-deep" style={{ aspectRatio: "4/5" }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute inset-1 border border-paper/8 pointer-events-none" />
      </div>
      <figcaption className="mt-1 font-mono uppercase tracking-[0.2em] text-ink-soft/38" style={{ fontSize: "7.5px" }}>{caption}</figcaption>
    </figure>
  );
}

function Essay({ innerRef }: { innerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={innerRef} className="flex-1 min-h-0 essay-scroll" style={{ overflowY: "hidden" }}>
      <article className="essay-body pr-4 pb-20" style={{ maxWidth: "740px", margin: "0 auto" }}>
        <section className="essay-section mb-8">
          <h3 className="essay-heading">I. Origin</h3>
          <EssayPhoto src={heroPortrait} alt="Geetika portrait" caption="Montréal, 2024" align="right" />
          <p className="drop-cap">I was born in a city that does not sleep lightly. Rajasthan, India — sandstone and spice and a sky so wide it made ambition feel obligatory. My earliest memories are not of a classroom but of the space between things: between words in a conversation I was too young to join, between the notes of a raag my grandmother hummed while she cooked, between the lines of a physics problem my father was explaining to someone else that I absorbed from across the room.</p>
          <p>That space between things is where I have always lived. Not quite inside any single discipline, any single culture, any single language. The gap is not emptiness. It is where everything interesting happens.</p>
          <p>My family moved when I was young — first within India, then to Canada, to Montréal, a city whose own identity is built on productive tension between languages and traditions. I did not know it then, but I was training for that city my whole life.</p>
        </section>
        <section className="essay-section mb-8">
          <h3 className="essay-heading">II. Between Worlds</h3>
          <EssayPhoto src={atmosNotebook} alt="Notebook" caption="Notes, drafts, half-formed questions" align="left" />
          <p>Moving between countries at a formative age rewires something. You stop assuming the way things are done where you grew up is the only way. You develop a permeability to context, an ability to read rooms that are not yours.</p>
          <p>I speak four languages: English, French, Hindi, and Marwari. Each one carries a different register of myself. English is where I think most precisely. French navigates the city. Hindi is where old memories arrive in intact sentences. Marwari is where I belong without explanation.</p>
          <p>Fluency in a culture is not just the language — it is the assumptions embedded in the grammar, the things people do not say because they do not have to. I grew up learning to find those load-bearing silences in more than one culture. It made me a better thinker, writer, and scientist.</p>
        </section>
        <section className="essay-section mb-8">
          <h3 className="essay-heading">III. The Mind and Its Obsessions</h3>
          <EssayPhoto src={atmosTelescope} alt="Telescope" caption="Observing — always observing" align="right" />
          <p>If you asked me to identify the central obsession of my intellectual life, I would not give you a subject. I would give you a posture. I am obsessed with the moment when something that appeared complicated becomes, in the right frame, simple.</p>
          <p>Physics found me through my father, who treated it not as a subject but as a lens. Mathematics followed closely — I competed in olympiads not because I was the fastest calculator but because I loved the architecture of proofs. Chess gave me something similar: the pleasure of thinking several moves ahead. The disciplines are different in almost every surface feature. The underlying skill is the same.</p>
          <p>Computer science arrived as a natural extension. I came to programming not to build apps but to build things that think. I taught myself React, TypeScript, Python. I built this site. Not to be a software engineer, but to be someone who can build whatever needs to be built.</p>
        </section>
        <EssayPhoto src={textureCosmos} alt="Cosmos" caption="The texture of deep time" align="full" />
        <section className="essay-section mb-8">
          <h3 className="essay-heading">IV. The Creative Life</h3>
          <EssayPhoto src={atmosMusic} alt="Music" caption="Riyaaz — daily practice in Hindustani vocal" align="left" />
          <p>The assumption that STEM and the arts are in competition has never matched my experience. The creativity required to design an experiment and to write a novel are not different in kind — different in material, identical in demand.</p>
          <p>I have been training in Hindustani classical vocal for years. Riyaaz is non-negotiable. A raag is a grammar — it specifies which notes are permitted, forbidden, emphasised. Within those constraints, improvisation is required. You must find something new to say inside a structure explored for centuries. This is also what good science asks.</p>
          <p>Writing is the other major strand. I am several volumes into a novel series — a world built over years with its own history, geography, and rules. Worldbuilding at that scale is a systems design problem. Every chapter revised makes me a better thinker.</p>
        </section>
        <section className="essay-section mb-8">
          <h3 className="essay-heading">V. What I Am Building</h3>
          <p>This site is an artifact. I built it from scratch — React, TypeScript, Vite, Tailwind — not because I needed a portfolio but because I needed a structure that could hold the full picture. Every claim has evidence, every skill has a receipt, every curiosity has a paper trail.</p>
          <p>The FRC robotics team taught me what it means to build under pressure with a team counting on you. Twelve weeks of design, iteration, fabrication, testing, ending in competition — and learning to communicate across roles, between strategic vision and engineering constraints.</p>
        </section>
        <section className="essay-section mb-4">
          <h3 className="essay-heading">VI. Where I Am Headed</h3>
          <p>I do not have a five-year plan. I have a model of what I want my work to look like: rigorous, interdisciplinary, evidence-based, built at the intersection of STEM and creative practice. I am fifteen years old. I have been working on these things for most of my conscious life. I am going to keep working on them.</p>
          <p className="font-accent italic text-ink-soft/65 mt-5 text-[14px] border-l-2 border-gold/30 pl-4 clear-both">The dossier is the argument. Everything else on this site is the evidence. Welcome to the paper trail.</p>
          <div className="flex items-center gap-4 mt-8 clear-both">
            <span className="flex-1 h-px bg-border/25" />
            <span className="font-mono text-gold/35 uppercase tracking-[0.3em]" style={{ fontSize: "7.5px" }}>End § 01</span>
            <span className="flex-1 h-px bg-border/25" />
          </div>
        </section>
      </article>
    </div>
  );
}

/* ─── Single topic card ─────────────────────────────────────────── */
function TopicCard({
  topic, index, transform, opacity, zIndex, isInteractive,
}: {
  topic: TopicData; index: number;
  transform: string; opacity: number; zIndex: number; isInteractive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(50);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const accent = CARD_ACCENT[index % CARD_ACCENT.length];
  const bg = CARD_BG[index % CARD_BG.length];
  const photo = PHOTOS[index % PHOTOS.length];
  const num = String(index + 1).padStart(2, "0");

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setMx(((e.clientX - r.left) / r.width) * 100);
    setMy(((e.clientY - r.top) / r.height) * 100);
  }, []);

  return (
    <>
      <div
        ref={ref}
        onClick={() => isInteractive && setOpen(true)}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "absolute",
          inset: 0,
          transform,
          opacity,
          zIndex,
          cursor: isInteractive ? "pointer" : "default",
          pointerEvents: isInteractive ? "auto" : "none",
          willChange: "transform, opacity",
          background: bg,
          border: `1px solid ${hovered && isInteractive ? accent + "bb" : accent + "30"}`,
          borderRadius: "4px",
          overflow: "hidden",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          boxShadow: isInteractive && hovered
            ? `0 0 0 1px ${accent}40, 0 40px 100px -20px hsl(220 90% 3%/0.97), 0 0 80px -20px ${accent}30`
            : `0 20px 80px -24px hsl(220 90% 3%/0.8)`,
        }}
      >
        {/* Faint background photo */}
        <img src={photo} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.06] grayscale pointer-events-none" />
        {/* Spotlight */}
        {hovered && isInteractive && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(600px circle at ${mx}% ${my}%, ${accent}16, transparent 55%)` }}
          />
        )}
        {/* Scan lines */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 3px, hsl(220 50% 100%/0.01) 3px 4px)" }} />
        {/* Top glow edge */}
        <div className="pointer-events-none absolute top-0 left-0 right-0" style={{ height: "1px", background: `linear-gradient(to right, transparent, ${accent}${hovered ? "80" : "28"}, transparent)`, transition: "background 0.4s ease" }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono uppercase tracking-[0.35em]" style={{ fontSize: "9px", color: `${accent}99` }}>§ 01</span>
              <span className="w-6 h-px" style={{ background: `${accent}35` }} />
              <span className="font-mono uppercase tracking-[0.25em]" style={{ fontSize: "9px", color: `${accent}55` }}>{num}</span>
            </div>
            {isInteractive && (
              <span className="font-mono uppercase tracking-[0.22em] text-paper/20" style={{ fontSize: "8.5px" }}>tap to expand →</span>
            )}
          </div>

          {/* Ghost number */}
          <div className="pointer-events-none absolute bottom-6 right-6" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(120px, 18vw, 240px)",
            fontWeight: 700, lineHeight: 1, color: `${accent}07`, userSelect: "none", letterSpacing: "-0.05em",
          }}>{num}</div>

          {/* Main text */}
          <div className="relative z-10">
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4.5vw, 60px)",
              fontWeight: 600, lineHeight: 1.06,
              color: `hsl(38 30% ${hovered && isInteractive ? 97 : 88}%)`,
              transition: "color 0.35s ease",
              marginBottom: "1rem",
            }}>{topic.label}</h3>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(15px, 1.8vw, 22px)",
              fontStyle: "italic",
              color: `hsl(38 15% ${hovered && isInteractive ? 75 : 62}%)`,
              maxWidth: "520px", lineHeight: 1.55,
              transition: "color 0.35s ease",
            }}>{topic.blurb}</p>
            <div className="inline-flex items-center gap-2 mt-7" style={{
              border: `1px solid ${accent}${hovered && isInteractive ? "55" : "22"}`,
              padding: "7px 16px", borderRadius: "2px", transition: "border-color 0.4s ease",
            }}>
              <span className="font-mono uppercase tracking-[0.28em]" style={{ fontSize: "8.5px", color: `${accent}${hovered && isInteractive ? "cc" : "60"}`, transition: "color 0.4s ease" }}>Read more</span>
              <span style={{ color: `${accent}${hovered && isInteractive ? "cc" : "45"}`, fontSize: "11px", transition: "color 0.4s ease" }}>→</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-[hsl(220_30%_8%)] border border-border text-paper p-0 overflow-hidden">
          <div className="p-7 md:p-9">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono uppercase tracking-[0.3em] text-gold/55" style={{ fontSize: "8.5px" }}>§ 01 · {num}</span>
              <div className="flex-1 h-px bg-border/35" />
            </div>
            <DialogTitle style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 600, color: "hsl(38 40% 92%)", lineHeight: 1.1 }}>{topic.label}</DialogTitle>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px", fontStyle: "italic", color: "hsl(38 20% 62%)", marginTop: "0.4rem", marginBottom: "1.2rem" }}>{topic.blurb}</p>
            <div className="h-px bg-border/28 mb-5" />
            <DialogDescription asChild>
              <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: "14.5px", lineHeight: 1.8, color: "hsl(220 15% 74%)" }}>
                {topic.detail.split("\n").map((para, i) => <p key={i} className={i > 0 ? "mt-3" : ""}>{para}</p>)}
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─── Profile card (base of stack) ─────────────────────────────── */
function ProfileCard({
  ep, essayRef, transform,
}: {
  ep: number; essayRef: React.RefObject<HTMLDivElement | null>; transform: string;
}) {
  const bOp = lerp(0.18, 0.7, ep);
  const spr  = lerp(0, 90, ep);
  const gOp  = lerp(0, 0.18, ep);
  const imgW = lerp(48, 88, ep);
  const PY   = lerp(20, 48, ep);
  const PX   = lerp(22, 56, ep);
  const W    = lerp(50, 94, ep);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        transform,
        willChange: "transform",
      }}
    >
      <div
        className="relative flex flex-col bg-[hsl(220_30%_7%)] border overflow-hidden"
        style={{
          width: `${W}%`, maxWidth: "1160px",
          height: `calc(100vh - ${lerp(88, 36, ep)}px)`,
          borderColor: `hsl(41 80% 60% / ${bOp})`,
          borderRadius: `${lerp(8, 4, ep)}px`,
          padding: `${PY}px ${PX}px`,
          boxShadow: `0 0 0 1px hsl(41 80% 55% / ${gOp * 0.8}), 0 ${Math.round(spr * 0.3)}px ${spr}px -12px hsl(220 90% 3%/0.96), 0 0 ${Math.round(spr * 0.5)}px -18px hsl(41 80% 55% / ${gOp * 2})`,
          transition: "width 0.8s cubic-bezier(0.22,1,0.36,1), height 0.8s cubic-bezier(0.22,1,0.36,1), padding 0.8s cubic-bezier(0.22,1,0.36,1), border-color 0.8s cubic-bezier(0.22,1,0.36,1), box-shadow 0.8s cubic-bezier(0.22,1,0.36,1), border-radius 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Corner brackets */}
        {(["top-3.5 left-3.5 border-t border-l", "top-3.5 right-3.5 border-t border-r", "bottom-3.5 left-3.5 border-b border-l", "bottom-3.5 right-3.5 border-b border-r"] as const).map((cls, k) => (
          <span key={k} className={`absolute w-4 h-4 ${cls} border-gold/60`} style={{ opacity: ep * 0.65 }} />
        ))}

        {/* Header */}
        <header className="flex items-start gap-5 shrink-0" style={{ marginBottom: `${lerp(0, 28, ep)}px`, transition: "margin 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
          <figure className="relative shrink-0 overflow-hidden border bg-[hsl(220_30%_10%)]"
            style={{ width: `${imgW}px`, aspectRatio: "3/4", borderColor: `hsl(41 80% 60%/${lerp(0.15, 0.45, ep)})`, transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
            <img src={heroPortrait} alt="Geetika" className="absolute inset-0 w-full h-full object-cover object-[60%_25%]" />
            <span className="absolute inset-1 border border-paper/10 pointer-events-none" />
          </figure>
          <div className="flex flex-col gap-1.5 pt-0.5 flex-1">
            <span className="font-mono text-gold/65 uppercase tracking-[0.3em]" style={{ fontSize: `${lerp(8.5, 11, ep)}px` }}>§ 01 · Personal Profile</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: `${lerp(17, 32, ep)}px`, fontWeight: 600, lineHeight: 1.1, color: `hsl(38 40% ${lerp(80, 96, ep)}%)`, transition: "font-size 0.8s cubic-bezier(0.22,1,0.36,1)" }}>Geetika Gehlot</h2>
            <p className="font-mono text-ink-soft/65 tracking-[0.08em]" style={{ fontSize: `${lerp(9, 12.5, ep)}px` }}>Montréal · India-born · Multidisciplinary</p>
            {ep < 0.2 && <p className="font-accent italic text-ink-soft/45 mt-1" style={{ fontSize: "12px", opacity: Math.max(0, 1 - ep * 6) }}>Scroll to read ↓</p>}
          </div>
        </header>

        {/* Divider */}
        <div className="shrink-0" style={{
          height: "1px",
          background: `linear-gradient(to right, hsl(41 80% 55%/${lerp(0, 0.45, ep)}), transparent)`,
          marginBottom: `${lerp(0, 20, ep)}px`,
          opacity: ep,
          transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
        }} />

        {/* Essay */}
        <Essay innerRef={essayRef} />

        {/* Bottom vignette */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{
          height: "80px",
          background: "linear-gradient(to top, hsl(220 30% 7%/0.97) 35%, transparent)",
          opacity: ep, transition: "opacity 0.6s ease",
        }} />
      </div>
    </div>
  );
}

/* ─── Main exported component ───────────────────────────────────── */
export function AboutCardStack({ topics }: { topics: TopicData[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const essayRef   = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const CARD_ZONE = (1 - READ_END) / topics.length;

  const handleScroll = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const wh = window.innerHeight;
    const travel = rect.height - wh;
    if (travel <= 0) return;
    const p = clamp(-rect.top / travel, 0, 1);
    setProgress(p);

    // Drive essay scrollTop
    const essay = essayRef.current;
    if (essay) {
      const readStart = EXPAND_END;
      const readEnd   = READ_END;
      if (p >= readStart && p <= readEnd) {
        const rp = easeInOut((p - readStart) / (readEnd - readStart));
        const maxSc = essay.scrollHeight - essay.clientHeight;
        if (maxSc > 0) essay.scrollTop = rp * maxSc;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Profile expansion progress
  const ep = easeOut(clamp((progress - ENTER) / (EXPAND_END - ENTER), 0, 1));

  // How many cards placed
  const placedCount = topics.reduce((acc, _, i) => {
    const slotStart = READ_END + i * CARD_ZONE;
    return acc + (progress >= slotStart ? 1 : 0);
  }, 0);

  // Profile card pushes down as cards stack
  const profileTY = placedCount * 4;
  const profileScale = 1 - placedCount * 0.01;

  // Ambient glow opacity
  const glowOp = Math.max(lerp(0, 0.1, ep), lerp(0, 0.06, progress));

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${92 + topics.length * 118}vh` }}>
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        {/* Ambient radial backdrop */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: `radial-gradient(60% 55% at 50% 45%, hsl(41 80% 55%/${glowOp}), transparent 68%)`,
          transition: "background 0.8s ease",
        }} />

        {/* Profile card */}
        <ProfileCard
          ep={ep}
          essayRef={essayRef}
          transform={`scale(${profileScale}) translateY(${profileTY}px)`}
        />

        {/* Topic cards — stacked on top */}
        {topics.map((topic, i) => {
          const slotStart  = CARD_STACK_START + i * (CARD_ZONE * CARD_STACK_SPAN);
          const placingEnd = slotStart + CARD_ZONE * 0.28;

          // Placement progress [0,1]
          let pp = 0;
          if (progress >= slotStart && progress < placingEnd) {
            pp = (progress - slotStart) / (placingEnd - slotStart);
          } else if (progress >= placingEnd) {
            pp = 1;
          }
          const ppE = easeOut(pp);

          const isPlaced = progress >= placingEnd;
          const depth = isPlaced ? (placedCount - 1 - i) : -1;
          const isTop  = depth === 0;

          // Compute transform
          let tx: number, ty: number, rot: number, scale: number, opacity: number;

          if (!isPlaced && pp === 0) {
            // Waiting — invisible, positioned at entry
            opacity = 0; tx = 0; ty = -96; rot = ENTRY[i % ENTRY.length].angle; scale = 0.88;
          } else if (pp < 1) {
            // Flying in
            const e = ENTRY[i % ENTRY.length];
            opacity = ppE;
            tx = lerp(e.x, 0, ppE);
            ty = lerp(e.y, 0, ppE);
            rot = lerp(e.angle, 0, ppE);
            scale = lerp(0.88, 1, ppE);
          } else if (isTop) {
            // Current top — flat
            opacity = 1; tx = 0; ty = 0; rot = 0; scale = 1;
          } else {
            // Buried — peek
            const d = Math.min(depth, 4);
            const pk = PEEK[i % PEEK.length];
            opacity = 1;
            tx = pk.x * d;
            ty = pk.y * d;
            rot = pk.angle * d;
            scale = 1 - d * 0.018;
          }

          return (
            <TopicCard
              key={topic.slug}
              topic={topic}
              index={i}
              transform={`translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`}
              opacity={opacity}
              zIndex={i + 2}
              isInteractive={isTop && pp === 1}
            />
          );
        })}
      </div>
    </div>
  );
}
