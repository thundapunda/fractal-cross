import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Entry is fast and punchy. Exit is slower and graceful.
const DRIP_TIME = 520;
const HOLD_TIME = 360;
const LIFT_TIME = 950;

// First-render intro: slower, more dramatic
const INTRO_DRIP = 900;
const INTRO_HOLD = 550;
const INTRO_LIFT = 1300;

// Decelerating ease: fast start, slow settle
const EASE_OUT_DECEL = "cubic-bezier(0.22, 1, 0.36, 1)";

// Panel sits at ±220% when hidden — far enough that the fractal SVG overflow
// never peeks into the viewport, even on phones.
const OFFSCREEN = 220;

type Phase = "idle" | "dripping" | "covered" | "lifting";

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/academics": "Academics",
  "/works": "Works",
  "/vault": "CV & Resume",
  "/contact": "Contact",
  "/dashboard": "Pages",
};

// ---------------------------------------------------------------------------
// 3-level Sierpinski triangle edge tiles (128×72 px, fixed physical size)
// Tile for BOTTOM edge: triangle pointing DOWN, apex at y=72
// All holes via fill-rule=evenodd — transparent gaps show page bg through.
// ---------------------------------------------------------------------------
const _SIERPINSKI_BOTTOM = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="72" viewBox="0 0 128 72"><path fill-rule="evenodd" fill="hsl(43,82%,50%)" d="M0,0 L128,0 L64,72 Z M64,0 L32,36 L96,36 Z M32,0 L16,18 L48,18 Z M96,0 L80,18 L112,18 Z M64,36 L48,54 L80,54 Z M16,0 L8,9 L24,9 Z M48,0 L40,9 L56,9 Z M32,18 L24,27 L40,27 Z M80,0 L72,9 L88,9 Z M112,0 L104,9 L120,9 Z M96,18 L88,27 L104,27 Z M48,36 L40,45 L56,45 Z M80,36 L72,45 L88,45 Z M64,54 L56,63 L72,63 Z"/></svg>`;

// Tile for TOP edge: triangle pointing UP, apex at y=0
const _SIERPINSKI_TOP = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="72" viewBox="0 0 128 72"><path fill-rule="evenodd" fill="hsl(43,82%,50%)" d="M0,72 L128,72 L64,0 Z M64,72 L32,36 L96,36 Z M32,72 L16,54 L48,54 Z M96,72 L80,54 L112,54 Z M64,36 L48,18 L80,18 Z M16,72 L8,63 L24,63 Z M48,72 L40,63 L56,63 Z M32,54 L24,45 L40,45 Z M80,72 L72,63 L88,63 Z M112,72 L104,63 L120,63 Z M96,54 L88,45 L104,45 Z M48,36 L40,27 L56,27 Z M80,36 L72,27 L88,27 Z M64,18 L56,9 L72,9 Z"/></svg>`;

const FRACTAL_URI_BOTTOM = `url("data:image/svg+xml,${encodeURIComponent(_SIERPINSKI_BOTTOM)}")`;
const FRACTAL_URI_TOP    = `url("data:image/svg+xml,${encodeURIComponent(_SIERPINSKI_TOP)}")`;

// Fixed tile dimensions — these never scale with viewport
const TILE_W = 128;
const TILE_H = 72;

export function PageTransition() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lastPath = useRef<string | null>(null);
  const transitionTarget = useRef<string | null>(null);
  const transitionBusy = useRef(false);
  // Start covered so page is never visible before the intro animation lifts
  const [phase, setPhase] = useState<Phase>("covered");
  const [firstRender, setFirstRender] = useState(true);
  const [destLabel, setDestLabel] = useState("");
  const [shrinkLabel, setShrinkLabel] = useState(false);
  const timers = useRef<number[]>([]);
  const pendingDest = useRef<string | null>(null);

  const isIntro = firstRender;
  const drip = isIntro ? INTRO_DRIP : DRIP_TIME;
  const hold = isIntro ? INTRO_HOLD : HOLD_TIME;
  const lift = isIntro ? INTRO_LIFT : LIFT_TIME;

  const runTransition = useCallback((destPathname: string, doReload = false) => {
    if (transitionBusy.current && transitionTarget.current === destPathname && !doReload) {
      return;
    }
    transitionBusy.current = true;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setFirstRender(false);
    transitionTarget.current = destPathname;

    const label =
      PAGE_LABELS[destPathname] ??
      (destPathname.replace("/", "").replace(/^\w/, (c) => c.toUpperCase()) || "Home");

    setDestLabel(label);
    setShrinkLabel(false);
    setPhase("dripping");

    const d = DRIP_TIME;
    const h = HOLD_TIME;
    const l = LIFT_TIME;

    timers.current.push(
      window.setTimeout(() => {
        setPhase("covered");
        if (doReload) {
          window.setTimeout(() => window.location.reload(), 60);
        } else if (pendingDest.current && pendingDest.current !== lastPath.current) {
          navigate(pendingDest.current);
        }
      }, d),
      window.setTimeout(() => {
        lastPath.current = destPathname;
        setShrinkLabel(true);
        setPhase("lifting");
      }, d + h),
      window.setTimeout(() => {
        setPhase("idle");
        setShrinkLabel(false);
        pendingDest.current = null;
        transitionTarget.current = null;
        transitionBusy.current = false;
      }, d + h + l),
    );
  }, [navigate]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("http") || href.startsWith("//") || href.startsWith("mailto:") ||
        href.startsWith("tel:") || anchor.hasAttribute("download") || anchor.target === "_blank"
      ) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      if (href.startsWith("#")) return;
      if (!href.startsWith("/")) return;
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent("gg-force-nav", { detail: { to: href, reload: false } })
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { to, reload } = (e as CustomEvent<{ to: string; reload?: boolean }>).detail;
      if (transitionBusy.current && transitionTarget.current !== to && !reload) return;
      if (transitionTarget.current === to && !reload) return;
      // Same-page click: skip transition entirely to avoid double animation / hang
      if (to === pathname && !reload) return;
      if (to === pathname) {
        runTransition(to, true);
        return;
      }
      pendingDest.current = to;
      runTransition(to, false);
    };
    window.addEventListener("gg-force-nav", handler);
    return () => window.removeEventListener("gg-force-nav", handler);
  }, [pathname, runTransition]);

  useEffect(() => {
    if (firstRender) {
      const label =
        PAGE_LABELS[pathname] ??
        (pathname.replace("/", "").replace(/^\w/, (c) => c.toUpperCase()) || "Home");
      setDestLabel(label);
      setShrinkLabel(false);
      // Already "covered" from initial state — skip drip, just hold then lift
      timers.current = [
        window.setTimeout(() => {
          lastPath.current = pathname;
          setShrinkLabel(true);
          setPhase("lifting");
        }, INTRO_HOLD),
        window.setTimeout(() => {
          setPhase("idle");
          setShrinkLabel(false);
          setFirstRender(false);
        }, INTRO_HOLD + INTRO_LIFT),
      ];
      return () => timers.current.forEach(window.clearTimeout);
    }
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    return;
  }, [pathname, firstRender]);

  const panelTranslateY =
    phase === "idle" ? -OFFSCREEN
    : phase === "dripping" ? 0
    : phase === "covered" ? 0
    : OFFSCREEN;

  const transformTransition =
    phase === "dripping"
      ? `transform ${drip}ms ${EASE_OUT_DECEL}`
      : phase === "lifting"
      ? `transform ${lift}ms ${EASE_OUT_DECEL}`
      : "none";

  const labelOpacity = phase === "idle" ? 0 : 1;

  const labelTransform =
    shrinkLabel
      ? "translate(calc(-50% - 28vw), calc(-50% - 22vh)) scale(0.18)"
      : "translate(-50%, -50%) scale(1)";

  const labelTransition =
    phase === "lifting"
      ? `opacity ${Math.round(lift * 0.3)}ms ease, transform ${Math.round(lift * 0.85)}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : phase === "dripping"
      ? `opacity ${Math.round(drip * 0.4)}ms ease`
      : "none";

  const showIntroLine = isIntro;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${panelTranslateY}%)`,
          transition: transformTransition,
          willChange: "transform",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(175deg, hsl(220 52% 5%) 0%, hsl(220 48% 4%) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 45% at 50% 50%, hsl(43 60% 14% / 0.5) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Text label */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            opacity: labelOpacity,
            transform: labelTransform,
            transition: labelTransition,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.55rem",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
              fontWeight: 600,
              color: "hsl(43 78% 68%)",
              letterSpacing: "0.03em",
              lineHeight: 1.05,
              textShadow:
                "0 0 50px hsl(43 78% 55% / 0.4), 0 0 100px hsl(43 65% 42% / 0.22)",
              whiteSpace: "nowrap",
            }}
          >
            Geetika Gehlot
          </span>
          {showIntroLine && (
            <span
              style={{
                width: "clamp(48px, 10vw, 100px)",
                height: 1,
                background: "hsl(43 60% 55% / 0.4)",
                marginTop: "clamp(0.6rem, 1.5vh, 1.2rem)",
                transition: "width 800ms ease 400ms",
              }}
            />
          )}
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
              fontWeight: 500,
              fontStyle: "italic",
              color: "hsl(43 60% 55% / 0.75)",
              letterSpacing: "0.1em",
              marginTop: "clamp(2rem, 6vh, 3.5rem)",
            }}
          >
            {destLabel}
          </span>
        </div>

        {/* Top fractal edge — fixed-size Sierpinski triangles, pointing UP */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: `${TILE_H}px`,
            transform: "translateY(-100%)",
            backgroundImage: FRACTAL_URI_TOP,
            backgroundRepeat: "repeat-x",
            backgroundSize: `${TILE_W}px ${TILE_H}px`,
            backgroundPosition: "0 0",
          }}
        />

        {/* Bottom fractal edge — fixed-size Sierpinski triangles, pointing DOWN */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${TILE_H}px`,
            transform: "translateY(100%)",
            backgroundImage: FRACTAL_URI_BOTTOM,
            backgroundRepeat: "repeat-x",
            backgroundSize: `${TILE_W}px ${TILE_H}px`,
            backgroundPosition: "0 0",
          }}
        />
      </div>
    </div>
  );
}
