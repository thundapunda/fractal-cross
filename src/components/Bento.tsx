import { forwardRef, ReactNode, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

/**
 * Bento system — magazine-style mixed-size cards.
 * - Always expanded (no toggles).
 * - On HOVER: card grows / lifts in place, hover blurb fades in.
 * - On CLICK: opens a dimmed modal with the full detail (image + long body + meta).
 *
 * Sizes map to a 6-column grid:
 *   sm  -> col-span-2 row-span-1
 *   md  -> col-span-3 row-span-1
 *   lg  -> col-span-3 row-span-2  (tall feature)
 *   xl  -> col-span-4 row-span-2  (hero feature)
 *   wide -> col-span-6 row-span-1 (banner)
 */

export type BentoSize = "sm" | "md" | "lg" | "xl" | "wide";

export type BentoItem = {
  id: string;
  size?: BentoSize;
  eyebrow?: string;
  title: string;
  blurb?: string;        // short line shown on hover
  image?: string;        // src
  imageAlt?: string;
  meta?: string;         // tiny mono caption
  /** Long-form detail rendered inside the modal. Defaults to blurb if absent. */
  detail?: ReactNode;
  accent?: "gold" | "navy" | "paper";
};

const SIZE_CLASS: Record<BentoSize, string> = {
  sm:   "col-span-6 sm:col-span-3 lg:col-span-2 row-span-1",
  md:   "col-span-6 sm:col-span-3 row-span-1",
  lg:   "col-span-6 sm:col-span-3 row-span-2",
  xl:   "col-span-6 lg:col-span-4 row-span-2",
  wide: "col-span-6 row-span-1",
};

const ACCENT_BG: Record<NonNullable<BentoItem["accent"]>, string> = {
  gold: "bg-gold/10",
  navy: "bg-navy-deep text-paper-contrast",
  paper: "bg-paper",
};

export function BentoGrid({ children, dense = true }: { children: ReactNode; dense?: boolean }) {
  return (
    <div
      className={`grid grid-cols-6 auto-rows-[15rem] md:auto-rows-[17rem] gap-3 md:gap-4 ${dense ? "[grid-auto-flow:dense]" : ""}`}
    >
      {children}
    </div>
  );
}

export function BentoCard({ item }: { item: BentoItem }) {
  const [open, setOpen] = useState(false);
  const size = item.size ?? "md";
  const accent = item.accent ?? "paper";
  const hasImage = !!item.image;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          SIZE_CLASS[size],
          "group fancy-tile tile-soft relative overflow-hidden border border-border text-left",
          "transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          "hover:border-gold",
          "hover:-translate-y-1.5 hover:scale-[1.02] hover:rotate-[0.25deg] hover:z-10",
          "focus:outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40",
          accent === "navy" ? ACCENT_BG.navy : ACCENT_BG[accent],
        ].join(" ")}
        aria-label={`${item.title} — open detail`}
      >
        {/* Background image */}
        {hasImage && (
          <>
            <img
              src={item.image}
              alt={item.imageAlt ?? ""}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                accent === "navy"
                  ? "bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/20 group-hover:from-navy-deep group-hover:via-navy-deep/85"
                  : "bg-gradient-to-t from-navy-deep/95 via-navy-deep/55 to-navy-deep/10 group-hover:from-navy-deep group-hover:via-navy-deep/80"
              }`}
            />
            {/* light leak that intensifies on hover */}
            <span aria-hidden className="leak absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
          </>
        )}
        {/* iridescent sheen on hover */}
        <span aria-hidden className="holo absolute inset-0" />
        {/* hover crisscross + dark overlay */}
        <span aria-hidden className="tile-hover-fx" />

        {/* Content */}
        <div
          className={`tile-content h-full w-full p-5 md:p-6 flex flex-col justify-between ${
            hasImage ? "text-paper-contrast" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            {item.eyebrow && (
              <span
                className={`font-mono text-[0.6rem] uppercase tracking-[0.25em] ${
                  hasImage ? "text-gold" : "text-gold"
                }`}
              >
                {item.eyebrow}
              </span>
            )}
            <ArrowUpRight
              className={`w-4 h-4 shrink-0 transition-all duration-500 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 ${
                hasImage ? "text-paper-contrast/70" : "text-ink-soft"
              }`}
            />
          </div>

          <div>
            <h3
              className={`font-display leading-tight transition-colors duration-300 ${
                size === "xl" || size === "lg" ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
              } ${hasImage ? "text-paper-contrast" : "text-ink group-hover:text-gold"}`}
            >
              {item.title}
            </h3>

            {/* Hover-revealed blurb (also visible at all times on touch devices via opacity transition) */}
            {item.blurb && (
              <p
                className={`mt-2 text-sm leading-relaxed max-h-0 opacity-0 overflow-hidden
                  group-hover:max-h-32 group-hover:opacity-100 group-hover:mt-3
                  transition-all duration-500 ease-out ${
                    hasImage ? "text-paper-contrast/85" : "text-ink-soft"
                  }`}
              >
                {item.blurb}
              </p>
            )}

            {item.meta && (
              <p
                className={`mt-3 font-mono text-[0.6rem] uppercase tracking-widest ${
                  hasImage ? "text-paper-contrast/60" : "text-muted-foreground"
                }`}
              >
                {item.meta}
              </p>
            )}
          </div>
        </div>
      </button>

      {/* Click-to-detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="visible-popup-panel force-light !z-[1200] max-w-3xl p-0 overflow-y-auto">
          {hasImage && (
            <div className="relative aspect-[16/9] overflow-hidden crumpled-paper leak">
              <img src={item.image} alt={item.imageAlt ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
            </div>
          )}
          <div className="p-7 md:p-10 relative">
            {item.eyebrow && <p className="label-gold mb-3">{item.eyebrow}</p>}
            <DialogTitle className="font-display text-2xl md:text-4xl text-ink leading-tight pr-8">
              {item.title}
            </DialogTitle>
            {item.meta && (
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mt-3">
                {item.meta}
              </p>
            )}
            <div className="rule-gold my-6" />
            <DialogDescription asChild>
              <div className="text-ink-soft text-base md:text-lg leading-relaxed font-display [&_p]:mb-4">
                {item.detail ?? item.blurb ?? "More detail coming soon."}
              </div>
          </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Convenience: render a list of items into a BentoGrid. */
export const Bento = forwardRef<HTMLDivElement, { items: BentoItem[] }>(({ items }, ref) => {
  return (
    <div ref={ref}>
      <BentoGrid>
      {items.map((it) => (
        <BentoCard key={it.id} item={it} />
      ))}
      </BentoGrid>
    </div>
  );
});

Bento.displayName = "Bento";
