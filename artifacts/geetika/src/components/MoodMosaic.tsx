import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { TopicData } from "@/data/clusters";

const CELL_LAYOUTS = {
  mobile: [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
  ],
  md: [
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-2 row-span-1",
  ],
  lg: [
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-2",
    "col-span-2 row-span-1",
    "col-span-2 row-span-1",
  ],
} as const;

const CELL_TINTS = [
  "from-gold/20 via-paper to-paper",
  "from-paper via-paper-deep to-navy-deep/10",
  "from-navy-deep/10 via-paper to-gold/10",
  "from-paper-deep via-paper to-paper",
  "from-gold/15 via-paper-deep to-paper",
  "from-paper via-gold/10 to-paper-deep",
  "from-navy-deep/8 via-gold/8 to-paper",
  "from-paper-deep via-navy-deep/5 to-paper",
  "from-gold/12 via-paper to-navy-deep/8",
  "from-paper via-paper-deep to-gold/8",
  "from-gold/18 via-paper to-paper",
  "from-paper-deep via-gold/5 to-paper",
] as const;

function MediaFrame({ topic }: { topic: TopicData }) {
  if (topic.embed?.type === "youtube") {
    return (
      <iframe
        src={topic.embed.src}
        title={topic.embed.caption ?? topic.label}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  if (topic.embed?.type === "image") {
    return <img src={topic.embed.src} alt={topic.embed.caption ?? topic.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />;
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-paper via-paper-deep to-gold/10">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(201,161,66,0.15),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(17,24,39,0.1),transparent_40%)]" />
    </div>
  );
}

function MosaicTile({ topic, span, tint, index }: { topic: TopicData; span: string; tint: string; index: number }) {
  const [open, setOpen] = useState(false);
  const hasMedia = !!topic.embed;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative ${span} overflow-hidden border border-border bg-paper text-left fancy-tile`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${tint}`} />
        <div className="absolute inset-0">
          <MediaFrame topic={topic} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/20 to-transparent" />
        <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-paper/80">{String(index + 1).padStart(2, "0")}</span>
            {hasMedia && (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-paper/15 text-paper border border-paper/20">
                {topic.embed?.type === "youtube" ? <Play className="h-3.5 w-3.5 fill-paper" /> : <X className="h-3.5 w-3.5 opacity-0" />}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display leading-[0.95] text-paper text-lg md:text-xl lg:text-[1.35rem] line-clamp-2">{topic.label}</h3>
            <p className="max-w-md font-sans italic text-[0.72rem] md:text-[0.8rem] leading-snug text-paper/82 line-clamp-2">{topic.blurb}</p>
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-paper">
          <div className="grid md:grid-cols-[1.1fr,0.9fr]">
            <div className="relative min-h-[280px] md:min-h-[520px] overflow-hidden bg-navy-deep">
              <MediaFrame topic={topic} />
            </div>
            <div className="p-7 md:p-10">
              <DialogTitle className="font-display text-3xl md:text-5xl leading-tight text-ink">{topic.label}</DialogTitle>
              <DialogDescription asChild>
                <div className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft font-display">
                  {topic.detail.split("\n").map((p, i) => (
                    <p key={i} className={i > 0 ? "mt-4" : ""}>{p}</p>
                  ))}
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SplitTile({ left, right, tintLeft, tintRight, index }: { left: TopicData; right: TopicData; tintLeft: string; tintRight: string; index: number }) {
  return (
    <div className="col-span-2 row-span-1 grid grid-cols-2 gap-2 overflow-hidden border border-border bg-paper fancy-tile">
      <div className="relative overflow-hidden min-h-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${tintLeft}`} />
        <div className="absolute inset-0">
          <MediaFrame topic={left} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/20 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-paper/80">{String(index + 1).padStart(2, "0")}</span>
          <div className="space-y-1.5">
            <h3 className="font-display leading-[0.95] text-paper text-lg md:text-xl line-clamp-2">{left.label}</h3>
            <p className="font-sans italic text-[0.72rem] md:text-[0.8rem] leading-snug text-paper/82 line-clamp-2">{left.blurb}</p>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden min-h-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${tintRight}`} />
        <div className="absolute inset-0">
          <MediaFrame topic={right} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/20 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-paper/80">{String(index + 2).padStart(2, "0")}</span>
          <div className="space-y-1.5">
            <h3 className="font-display leading-[0.95] text-paper text-lg md:text-xl line-clamp-2">{right.label}</h3>
            <p className="font-sans italic text-[0.72rem] md:text-[0.8rem] leading-snug text-paper/82 line-clamp-2">{right.blurb}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MoodMosaic({ topics }: { topics: TopicData[] }) {
  const splitIndex = topics.findIndex((topic) => topic.slug === "childhood-trophies");
  return (
    <section className="px-4 md:px-12 pb-4 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[118px] md:auto-rows-[138px] lg:auto-rows-[156px] gap-2.5 md:gap-3.5 lg:gap-4 [grid-auto-flow:dense]">
        {topics.map((topic, index) => {
          if (topic.slug === "childhood-trophies" && splitIndex >= 0 && splitIndex + 1 < topics.length) {
            return (
              <SplitTile
                key={topic.slug}
                left={topics[splitIndex]}
                right={topics[splitIndex + 1]}
                index={splitIndex}
                tintLeft={CELL_TINTS[splitIndex % CELL_TINTS.length]}
                tintRight={CELL_TINTS[(splitIndex + 1) % CELL_TINTS.length]}
              />
            );
          }
          if (splitIndex >= 0 && index === splitIndex + 1) {
            return null;
          }
          return (
            <MosaicTile
              key={topic.slug}
              topic={topic}
              index={index}
              span={CELL_LAYOUTS.lg[index % CELL_LAYOUTS.lg.length]}
              tint={CELL_TINTS[index % CELL_TINTS.length]}
            />
          );
        })}
      </div>
    </section>
  );
}