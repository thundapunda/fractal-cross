import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

export type Slide = {
  src: string;
  alt: string;
  /** "light" => white text on dark photo. "dark" => black text on light photo. */
  tone: "light" | "dark";
  eyebrow?: string;
  title: string;
  body?: string;
};

type Props = {
  slides: Slide[];
  /** auto-advance interval in ms; 0 disables */
  intervalMs?: number;
};

export function HeroSlideshow({ slides, intervalMs = 6000 }: Props) {
  const [i, setI] = useState(0);
  const [showText, setShowText] = useState(true);
  const total = slides.length;

  const go = (n: number) => setI(((n % total) + total) % total);
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  // autoplay
  useEffect(() => {
    if (!intervalMs) return;
    const t = setInterval(() => setI((p) => (p + 1) % total), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, total]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "h") setShowText((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, total]);

  const s = slides[i];
  // Always-dark overlay system → always light text.
  const textMain = "text-paper";
  const textSoft = "text-paper/80";
  const textFaint = "text-paper/60";
  const accent = "text-gold";
  const overlayGrad = "bg-gradient-to-r from-navy-deep/85 via-navy-deep/45 to-navy-deep/15";
  const chromeBorder = "border-paper/30";
  const chromeHover = "hover:border-gold hover:text-gold";


  return (
    <section
      className="force-light relative w-full h-screen -mt-16 overflow-hidden bg-navy-deep"
      aria-roledescription="carousel"
      aria-label="Portfolio hero slideshow"
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={idx !== i}
        />
      ))}

      {/* Tone-aware gradient for legibility */}
      {showText && <div className={`absolute inset-0 ${overlayGrad}`} />}

      {/* Text overlay */}
      {showText && (
        <div className={`relative container h-full pt-32 pb-24 flex flex-col justify-between ${textMain} animate-fade-in`}>
          <div className={`flex items-baseline justify-between font-mono text-[0.65rem] uppercase tracking-[0.3em] ${textFaint}`}>
            <span>E-Portfolio · Edition I</span>
            <span className="hidden md:inline">Geetika Gehlot · Montréal</span>
            <span className="font-mono">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="max-w-4xl">
            {s.eyebrow && (
              <p className={`font-mono text-xs uppercase tracking-[0.3em] ${accent} mb-6`}>
                {s.eyebrow}
              </p>
            )}
            <h1 className={`font-display leading-[0.9] text-[12vw] md:text-[8rem] ${textMain}`}>
              {s.title}
            </h1>
            {s.body && (
              <p className={`mt-8 max-w-xl text-lg leading-relaxed font-display italic ${textSoft}`}>
                {s.body}
              </p>
            )}
          </div>

          {/* Bottom row: dots + scroll cue */}
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-center gap-2" role="tablist" aria-label="Slide navigation">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => go(idx)}
                  className={`h-[2px] transition-all ${
                    idx === i
                      ? "w-10 bg-gold"
                      : "w-5 bg-paper/40 hover:bg-paper/70"
                  }`}

                />
              ))}
            </div>

            <a
              href="#after-hero"
              className={`font-mono text-[0.6rem] tracking-[0.3em] ${textFaint} hover:${accent} animate-shimmer`}
            >
              ↓ SCROLL TO ENTER
            </a>
          </div>
        </div>
      )}

      {/* Chrome controls (always visible) */}
      <div className="absolute top-24 right-6 md:right-10 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowText((v) => !v)}
          aria-label={showText ? "Hide overlay text" : "Show overlay text"}
          title="Toggle overlay (H)"
          className={`w-10 h-10 flex items-center justify-center border ${chromeBorder} ${chromeHover} ${textMain} backdrop-blur-sm bg-black/10 transition-colors`}
        >
          {showText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className={`absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border ${chromeBorder} ${chromeHover} ${textMain} backdrop-blur-sm bg-black/10 transition-colors`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className={`absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border ${chromeBorder} ${chromeHover} ${textMain} backdrop-blur-sm bg-black/10 transition-colors`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}

export default HeroSlideshow;
