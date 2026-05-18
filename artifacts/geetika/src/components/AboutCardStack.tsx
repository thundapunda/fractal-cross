import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { TopicData } from "@/data/clusters";
import heroPortrait from "@/assets/hero-portrait.jpg";
import atmosNotebook from "@/assets/atmos-notebook.jpg";
import atmosTelescope from "@/assets/atmos-telescope.jpg";
import atmosMusic from "@/assets/atmos-music.jpg";
import texturePaper from "@/assets/texture-paper.jpg";

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * clamp(t, 0, 1); }
function easeOut(t: number) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }

const EXPAND_END = 0.12;
const ESSAY_END = 0.88;

const LIGHTBOX_CARDS = [
  {
    slug: "scientist",
    label: "The Scientist",
    blurb: "Physics, mathematics, and the obsession with first principles.",
    accent: "#c9a342",
    photo: atmosTelescope,
    detail: `Physics found me before I found it. I remember being seven years old in Jaipur, watching my father sketch orbital diagrams on the back of a receipt and explaining why the moon doesn't fall. Something clicked — not just the fact, but the machinery of explanation itself. That there could be a language precise enough to describe the universe felt, to me, miraculous.\n\nMathematics followed as the natural companion. I moved through arithmetic into algebra, then into calculus and combinatorics, drawn less by grades than by the specific pleasure of a proof that snaps shut. Olympiad mathematics taught me that the goal is never mere computation — it is the identification of the hidden structure beneath a problem, the moment the labyrinth reveals itself to have a logic.\n\nIn Montréal I found myself in an environment where STEM was both celebrated and accessible. My school's AP track let me push ahead in physics and math simultaneously, and I began supplementing formal coursework with independent reading: Feynman's lectures, Penrose's road to reality, papers on quantum information that I understood imperfectly but returned to obsessively.\n\nChess, too, belongs here. The board is a finite combinatorial universe in which intuition and calculation must negotiate in real time. Training in chess sharpened my ability to hold several scenarios in mind, evaluate positions under pressure, and make decisions with incomplete information — skills that transfer directly into every other domain I inhabit.\n\nComputer science completed the triangle. Code is the third language, after mathematics and English, in which I think most fluently. I built this site myself, not because it was the easiest solution but because I wanted to understand the full stack: the data, the components, the types, the deployment. Understanding the whole system is the only way to build at the edges where domains meet — and that intersection is precisely where I intend to spend my life.`,
  },
  {
    slug: "artist",
    label: "The Artist",
    blurb: "Hindustani vocal, fiction, and the discipline of daily practice.",
    accent: "#8ab4c8",
    photo: atmosMusic,
    detail: `I have been singing since before I had words for what I was doing. Hindustani classical vocal is not a hobby — it is a practice in the deepest sense of the word. The Sanskrit root of riyaaz is the same as the root of the word for repetition: you come to the tanpura every morning not because you are not yet good enough, but because perfection in this tradition is a direction, not a destination.\n\nI train in the guru-shishya tradition under a teacher who learned from a teacher who learned from a teacher — a lineage that stretches back centuries. What I am learning is not only a repertoire of raagas and taals but an entire epistemology of listening. The classical form demands that you understand silence as structure, that you hear the space between notes as meaningfully as the notes themselves.\n\nWriting is the other primary creative strand. I have been building a novel series — multiple volumes, a complete fictional world with its own geographies, languages, and histories — since I was twelve. The project has become a laboratory for every intellectual obsession I have: the physics of imaginary cosmologies, the linguistics of constructed languages, the political economy of fictional civilisations.\n\nLong-form fiction demands exactly the qualities that scientific thinking rewards: patience with complexity, willingness to revise fundamental assumptions when the evidence demands it, attention to the gap between intended meaning and received meaning. The creative life and the scientific life are not opposites — they are the same impulse expressed in different registers, both reaching toward the same goal: understanding, made communicable.\n\nI have also run a podcast, exploring the intersections of creativity, science, and culture through conversation and monologue. The discipline of speaking clearly and precisely for an audience has sharpened my writing in ways that surprised me. Every medium teaches you something the others cannot.`,
  },
  {
    slug: "builder",
    label: "The Builder",
    blurb: "FRC Team 7700, engineering systems, and things that ship.",
    accent: "#7bbcb4",
    photo: atmosNotebook,
    detail: `The first time I held a drill during FRC build season, I was terrified. Six weeks to design, fabricate, wire, and programme a competition robot from a kit of parts and a game manual — that is the premise of FIRST Robotics, and it is one of the most demanding creative environments I have ever entered.\n\nTeam 7700 changed how I think about making things. The build season is a compressed version of every engineering project that exists: the initial excitement of the design phase, the brutal middle weeks when nothing works as specified, the integration hell when subsystems that tested fine individually refuse to cooperate, and then — if you have done the work — the game-day clarity when the machine does what you built it to do.\n\nI learned Onshape and SolidWorks for CAD, gained hands-on experience with fabrication (metal, plastic, pneumatics, wiring), and contributed to the programming side using Java and later Python. But the most important thing I learned on the team was not any particular tool — it was how to debug a system whose components you do not fully understand, under time pressure, with imperfect information.\n\nThat skill — systematic debugging of complex, partially-opaque systems — is the most transferable thing I own. I apply it when I am writing code, when I am revising a chapter of my novel, when I am preparing for a physics exam. Every domain I work in is, at some level, a system. The engineering mindset is the practice of engaging those systems honestly: defining inputs and outputs, isolating variables, testing assumptions one at a time.\n\nThis site is also a build. Every component, every data structure, every animation you see was designed and implemented by me. Building the dossier was itself a proof of concept: that I could ship something complete, functional, and genuinely representative of who I am.`,
  },
];

// ---------------------------------------------------------------------------
// Static lightbox card — no entrance animation, plain in-flow card
// ---------------------------------------------------------------------------
function LightboxCard({ card, index }: { card: typeof LIGHTBOX_CARDS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: "1 1 0",
          minWidth: 0,
          cursor: "pointer",
          borderRadius: "16px",
          overflow: "hidden",
          background: "hsl(220 32% 7%)",
          border: `1px solid ${card.accent}${hovered ? "55" : "28"}`,
          boxShadow: hovered
            ? `0 20px 48px -16px hsl(220 90% 3% / 0.55), 0 0 0 1.5px ${card.accent}33`
            : `0 8px 24px -12px hsl(220 90% 3% / 0.28)`,
          aspectRatio: "4/5",
          position: "relative",
          transition: "transform 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms ease, border-color 200ms ease",
          transform: hovered ? "translateY(-4px) scale(1.025)" : "translateY(0) scale(1)",
          willChange: "transform",
        }}
      >
        <img
          src={card.photo}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] grayscale pointer-events-none"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 3px, hsl(220 50% 100%/0.006) 3px 4px)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
          <div className="flex items-center justify-between mb-auto">
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "7.5px", letterSpacing: "0.3em", textTransform: "uppercase", color: `${card.accent}88` }}>§ 0{index + 1}</span>
            {hovered && (
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(220 15% 55%)" }}>open →</span>
            )}
          </div>
          <div style={{ marginTop: "auto" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(16px,1.6vw,22px)", fontWeight: 600, lineHeight: 1.1, color: "hsl(38 30% 90%)", marginBottom: "0.5rem" }}>{card.label}</h3>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(12px,0.9vw,14px)", fontStyle: "italic", color: "hsl(38 15% 60%)", lineHeight: 1.4 }}>{card.blurb}</p>
          </div>
        </div>
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${card.accent}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-[hsl(220_30%_8%)] border border-border text-paper p-0 overflow-hidden">
          <div className="relative">
            <div className="relative h-32 overflow-hidden">
              <img src={card.photo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(220_30%_8%)]" />
            </div>
            <div className="p-6 md:p-8 -mt-8 relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono uppercase tracking-[0.3em] text-gold/55" style={{ fontSize: "8px" }}>§ 0{index + 1}</span>
                <div className="flex-1 h-px bg-border/35" />
              </div>
              <DialogTitle style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 600, color: "hsl(38 40% 92%)", lineHeight: 1.1, marginBottom: "0.35rem" }}>{card.label}</DialogTitle>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", fontStyle: "italic", color: "hsl(38 20% 58%)", marginBottom: "1.25rem" }}>{card.blurb}</p>
              <div className="h-px bg-border/28 mb-5" />
              <DialogDescription asChild>
                <div style={{ maxHeight: "45vh", overflowY: "auto" }}>
                  {card.detail.split("\n").map((para, i) => (
                    <p key={i} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15.5px", lineHeight: 1.75, color: "hsl(220 15% 74%)", marginBottom: i < card.detail.split("\n").length - 1 ? "1rem" : "0" }}>{para}</p>
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

// ---------------------------------------------------------------------------
// Essay helpers (used inside the scroll-driven profile section)
// ---------------------------------------------------------------------------

function EssayPhoto({ src, alt, caption, align = "right" }: { src: string; alt: string; caption: string; align?: "left" | "right" | "full" }) {
  if (align === "full") return (
    <figure className="my-8 w-full clear-both">
      <div className="relative w-full overflow-hidden border border-white/10" style={{ aspectRatio: "21/8" }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
      <figcaption className="mt-2 text-center font-mono uppercase tracking-[0.2em] text-white/30" style={{ fontSize: "8px" }}>{caption}</figcaption>
    </figure>
  );
  return (
    <figure className={`my-0 mb-4 ${align === "right" ? "float-right ml-6" : "float-left mr-6"} w-28 md:w-40`}>
      <div className="relative overflow-hidden border border-white/10" style={{ aspectRatio: "4/5" }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
      <figcaption className="mt-1.5 font-mono uppercase tracking-[0.2em] text-white/28" style={{ fontSize: "7px" }}>{caption}</figcaption>
    </figure>
  );
}

function Essay() {
  return (
    <article style={{ maxWidth: "640px", margin: "0 auto" }}>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(43 70% 58%)", marginBottom: "1rem", opacity: 0.85 }}>I. Origin</h3>
        <EssayPhoto src={heroPortrait} alt="Geetika portrait" caption="Montréal, 2024" align="right" />
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 82%)", marginBottom: "1rem" }}>
          <span style={{ float: "left", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(3.2rem,5vw,4.2rem)", lineHeight: 0.78, fontWeight: 700, color: "hsl(43 78% 62%)", marginRight: "0.18em", marginTop: "0.08em" }}>I</span>
          was born in Rajasthan, in the high-desert heart of India, where the architecture is rose-pink sandstone and the sky at night is so uninterrupted that the Milky Way looks less like a smear than a fact. The land there has a particular quality of light — hard, clarifying, indifferent to sentiment — that I carry with me still, as a standard of precision against which softer environments sometimes feel inadequate.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          My family moved when I was young — first within India, tracking my father's work through cities whose names I associate with specific smells and textures: petrichor on hot concrete, cardamom in the afternoon, the particular silence of a new apartment before the furniture arrives. Each move was a small rehearsal for the larger one that came later, when we crossed an ocean and landed in Montréal.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          Canada was cold in ways I had not prepared for, and not only meteorologically. The social codes were different, the academic culture was different, the relationship between ambition and its expression was subtly but completely different. I spent a year and a half operating primarily in translation — not just between Hindi and French and English, but between entire frameworks for understanding what school was for, what talent meant, what it looked like to want something.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)" }}>
          I am fifteen now. Most people my age have lived in one or two places. I have lived in four or five, depending on how you count. I do not think of this as loss — I think of it as a curriculum. You learn to read rooms quickly when you have had to read many unfamiliar ones. You learn to carry your identity with you rather than deriving it from geography, because geography keeps changing.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(43 70% 58%)", marginBottom: "1rem", opacity: 0.85 }}>II. Between Worlds</h3>
        <EssayPhoto src={atmosNotebook} alt="Notebook and drafts" caption="Notes and drafts, always" align="left" />
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          I speak four languages: English, French, Hindi, and Marwari. The last one is the language of my family, a dialect of Rajasthan that is unwritten, oral, carried in the throat rather than on any page. Each of these languages has its own grammar not only in the syntactic sense but in the epistemic sense — each one organises the world differently, makes different things sayable, privileges different kinds of knowledge.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          In Marwari, the formal and informal registers are so distant from each other that the same sentence changes character completely depending on whether you are speaking to an elder or a peer. In French, the subjunctive is a whole mood devoted to doubt, contingency, and wishful thinking — it has no direct English equivalent, and once you know it, you miss it when you write in English. In Hindi, the concept of <em>jugaad</em> — improvised, frugal, immediate problem-solving — does not translate cleanly into any European language because European languages do not have the same relationship to scarcity and resourcefulness.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)" }}>
          Growing up between languages and cultures made me a better thinker. Not because I am confused about who I am — I am not — but because I learned early that every framework is a choice, not a fact. The way any given culture organises its assumptions is contingent, historical, revisable. That insight is the foundation of all critical thinking, and I received it before I could have articulated it, simply by being a person who had to navigate between worlds.
        </p>
      </section>

      <EssayPhoto src={texturePaper} alt="Deep cosmos" caption="The texture of deep time — and deep space" align="full" />

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(43 70% 58%)", marginBottom: "1rem", opacity: 0.85 }}>III. The Scientist's Mind</h3>
        <EssayPhoto src={atmosTelescope} alt="Telescope" caption="Observing — always observing" align="right" />
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          Physics found me before I found it. I remember being seven years old, watching my father sketch orbital diagrams on the back of a receipt and explaining why the moon doesn't fall toward the Earth the way an apple does. Something clicked — not just the fact, but the machinery behind the explanation. That there could be a language precise enough to describe the universe felt miraculous.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          Mathematics is physics's companion. I moved through arithmetic into algebra, then into calculus and combinatorics, drawn less by academic obligation than by the specific pleasure of a proof that snaps shut. Olympiad mathematics taught me that the goal is never computation — it is the identification of the hidden structure underneath a problem, the moment when the labyrinth reveals its logic. Chess did the same work in real time: finite universe, unlimited complexity, intuition and calculation in constant negotiation.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)" }}>
          Computer science completed the triangle. Code is the third language — after mathematics and English — in which I think most fluently. I built this site not because it was the simplest solution but because I wanted to understand the full stack: the data model, the component architecture, the type system, the deployment pipeline. Understanding the whole system is the only honest way to work at the edges where domains meet, and those edges are where I intend to spend my life.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(43 70% 58%)", marginBottom: "1rem", opacity: 0.85 }}>IV. The Creative Life</h3>
        <EssayPhoto src={atmosMusic} alt="Music and riyaaz" caption="Daily riyaaz — discipline as practice" align="left" />
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          I have been singing since before I had words for what I was doing. Hindustani classical vocal is not a hobby — it is a practice in the deepest sense of the word. The root of <em>riyaaz</em> is the same as the root of the word for repetition: you come to the tanpura every morning not because you are not yet good enough, but because perfection in this tradition is a direction, not a destination.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          I train in the guru-shishya tradition — a lineage that stretches back centuries. What I am learning is not only a repertoire of raagas and taals but an entire epistemology of listening. The classical form demands that you understand silence as structure, that you hear the space between notes as meaningfully as the notes themselves. This is not metaphor. In Hindustani music, the <em>gamak</em> — the ornament — derives its beauty from the clarity of what it departs from.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)" }}>
          Writing is the other primary strand. I have been building a novel series — multiple volumes, a complete fictional world with its own geographies, languages, and histories — since I was twelve. The project has become a laboratory for every intellectual obsession I have: the physics of imaginary cosmologies, the linguistics of invented languages, the political economy of civilisations that never existed. Long-form fiction demands exactly the qualities that science rewards — patience with complexity, willingness to revise fundamental assumptions when the evidence demands it, and attention to the gap between intended meaning and received meaning.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(43 70% 58%)", marginBottom: "1rem", opacity: 0.85 }}>V. Robotics &amp; Engineering</h3>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          The first time I held a drill during FRC build season, I was terrified — not of the drill, but of building something that would have to work in front of people. Six weeks to design, fabricate, wire, and programme a competition robot from a kit of parts and a game manual. That is the premise of FIRST Robotics, and it is one of the most demanding creative environments I have entered.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          Team 7700 changed how I think about making things. The build season is a compressed version of every engineering project that exists: the initial excitement of the design phase, the brutal middle weeks when nothing works as specified, the integration hell when subsystems that tested fine individually refuse to cooperate, and then — if you have done the work — the clarity when the machine does exactly what you built it to do.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)" }}>
          I learned CAD in Onshape and SolidWorks, gained hands-on experience with fabrication and pneumatics, and contributed to the programming side. But the most important thing I learned was not any particular tool — it was how to debug a system whose components you do not fully understand, under time pressure, with imperfect information. That skill transfers everywhere: writing code, revising a manuscript, preparing for a physics exam. Every domain I work in is, at some level, a system. Engineering taught me to engage those systems honestly.
        </p>
      </section>

      <section style={{ marginBottom: "0" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(43 70% 58%)", marginBottom: "1rem", opacity: 0.85 }}>VI. What I Am Building</h3>
        <EssayPhoto src={heroPortrait} alt="Paper and process" caption="Every claim has evidence here" align="right" />
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          This site is an artifact. It is not a portfolio in the conventional sense — a curated highlights reel arranged to impress a particular audience. It is a working dossier: every claim backed by evidence, every skill accompanied by a receipt, every curiosity documented in the process of its exploration.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1rem" }}>
          I am fifteen, which means the future is genuinely open in a way it will not always be. I do not have a single dream career — I have a working model of how disciplines intersect, and a strong conviction that the most interesting work happens at the places where fields meet and borrow from each other. Whether the trajectory leads toward research physics, computational design, literary fiction, or something that does not yet have a name, the thread is the same: build things that matter, and prove that they work.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(15px,1.25vw,17px)", lineHeight: 1.82, color: "hsl(220 15% 78%)", marginBottom: "1.5rem" }}>
          The dossier is the argument. Everything else on this site is the evidence. The AP courses, the robotics build logs, the vocal performances, the manuscript excerpts, the physics problems — all of it adds up to a single claim: that a person can pursue many things rigorously, that breadth and depth are not opposites, that the disciplines reward each other when you let them.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.82, fontStyle: "italic", color: "hsl(43 60% 55%)", borderLeft: "2px solid hsl(43 60% 55% / 0.35)", paddingLeft: "1.25rem", clear: "both" }}>
          I am building a life where curiosity is not a luxury but the method itself — where every question leads somewhere real, every discipline is a tool, and the work is always, in some sense, not yet finished.
        </p>
      </section>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main export — scroll-driven profile section + static cards below
// ---------------------------------------------------------------------------

export function AboutCardStack({ topics: _topics }: { topics: TopicData[] }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 900);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const totalScroll = shellRef.current ? Math.max(1, shellRef.current.offsetHeight - vh) : 1;
  const t = clamp(scrollY / totalScroll, 0, 1);

  const expandT = easeOut(clamp(t / EXPAND_END, 0, 1));

  const START_W = Math.min(440, vw * 0.88);
  const START_H = Math.min(300, vh * 0.45);

  const cardW = lerp(START_W, vw, expandT);
  const cardH = lerp(START_H, vh, expandT);
  const cardLeft = lerp((vw - START_W) / 2, 0, expandT);
  const cardTop = lerp((vh - START_H) / 2, 0, expandT);
  const cardRadius = lerp(20, 0, expandT);
  const cardPad = lerp(20, 32, expandT);

  const contentVisible = expandT > 0.7;
  const contentOpacity = easeOut(clamp((expandT - 0.7) / 0.3, 0, 1));

  const initialLabelOpacity = easeOut(clamp((expandT < 0.5 ? expandT / 0.35 : 1 - (expandT - 0.35) / 0.3), 0, 1));

  const essayPhaseT = clamp((t - EXPAND_END) / Math.max(0.001, ESSAY_END - EXPAND_END), 0, 1);

  const headerOpacity = clamp(1 - (expandT * 3), 0, 1);

  return (
    <>
      {/* Scroll-driven profile card section */}
      <section ref={shellRef} className="relative w-full" style={{ height: "350vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "hsl(220 30% 5%)" }}>

          {expandT < 0.95 && (
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                padding: "5rem 2rem 0",
                zIndex: 0,
                opacity: headerOpacity,
                pointerEvents: "none",
              }}
            >
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(13px,1vw,15px)", fontStyle: "italic", color: "hsl(220 15% 45%)", textAlign: "center" }}>
                Scroll to read the essay ↓
              </p>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: `${cardLeft}px`,
              top: `${cardTop}px`,
              width: `${cardW}px`,
              height: `${cardH}px`,
              borderRadius: `${cardRadius}px`,
              background: "hsl(220 28% 6.5%)",
              border: `1px solid hsl(43 60% 50% / ${lerp(0.18, 0.12, expandT)})`,
              boxShadow: `0 ${Math.round(lerp(8, 40, expandT))}px ${Math.round(lerp(24, 80, expandT))}px -${Math.round(lerp(8, 20, expandT))}px hsl(220 90% 2% / 0.7)`,
              overflow: "hidden",
              transition: "border-color 200ms ease",
              willChange: "left, top, width, height",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 1 - contentOpacity,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "1.5rem",
              }}
            >
              <div style={{ opacity: initialLabelOpacity }}>
                <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase", color: "hsl(43 70% 55% / 0.6)", textAlign: "center", marginBottom: "0.6rem" }}>§ 01 · Personal Profile</div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, color: "hsl(38 35% 90%)", textAlign: "center", lineHeight: 1.1 }}>Geetika Gehlot</h2>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(12px, 1vw, 14px)", fontStyle: "italic", color: "hsl(220 15% 55%)", textAlign: "center", marginTop: "0.4rem" }}>Montréal · India-born · Multidisciplinary</p>
              </div>
            </div>

            {contentVisible && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: contentOpacity,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    padding: `${cardPad}px ${cardPad}px 0`,
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", border: "1px solid hsl(43 60% 50% / 0.2)", flexShrink: 0 }}>
                    <img src={heroPortrait} alt="Geetika Gehlot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "7px", letterSpacing: "0.32em", textTransform: "uppercase", color: "hsl(43 70% 55% / 0.65)", marginBottom: "0.25rem" }}>§ 01 · Personal Profile</div>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 600, color: "hsl(38 35% 92%)", lineHeight: 1 }}>Geetika Gehlot</h2>
                  </div>
                  <div style={{ marginLeft: "auto", fontFamily: "ui-monospace, monospace", fontSize: "7px", letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(220 15% 40%)" }}>Scroll ↓</div>
                </div>

                <div style={{ height: 1, background: "hsl(43 60% 50% / 0.1)", margin: `${Math.round(cardPad * 0.6)}px ${cardPad}px` }} />

                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    padding: `0 ${cardPad}px 0`,
                  }}
                >
                  <div
                    style={{
                      willChange: "transform",
                      transform: `translateY(-${essayPhaseT * 100}%)`,
                    }}
                  >
                    <Essay />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Static facet cards — always visible, no animation, flush below the essay */}
      <div
        style={{
          background: "hsl(220 30% 5%)",
          padding: "clamp(24px, 4vw, 56px) clamp(16px, 5vw, 72px) clamp(40px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "9px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "hsl(43 70% 55% / 0.5)",
            marginBottom: "1.25rem",
          }}
        >
          § 01 · Three Facets
        </div>
        <div
          style={{
            display: "flex",
            gap: "clamp(10px, 1.5vw, 20px)",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {LIGHTBOX_CARDS.map((card, i) => (
            <div key={card.slug} style={{ flex: "1 1 200px", minWidth: "180px", maxWidth: "360px" }}>
              <LightboxCard card={card} index={i} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
