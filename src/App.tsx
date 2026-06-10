import { useState, useEffect, useRef, useCallback } from "react";
import { X, MapPin, Phone, Mail, Building2, Users, Award } from "lucide-react";

/* ── Constants ── */
const BRAND_DARK = "#1a2634";
const FULL_TEXT = "Sixth River";
const HOUSE_IMG =
  "https://images.squarespace-cdn.com/content/v1/53d7e840e4b01774461cdd4e/1681392882617-JVSDSCRL3SKO9CDTJ9X5/2022.02.17_1300e+Exterior+View+1.jpg?format=2500w";
const BG_IMG =
  "https://images.squarespace-cdn.com/content/v1/53d7e840e4b01774461cdd4e/1733263037482-CV9PJ8BGFU6OMXZMEE0J/1300E5thSt_Aerial-074.jpg?format=2500w";

const SQ = "https://images.squarespace-cdn.com/content/v1/53d7e840e4b01774461cdd4e";

const GALLERY_IMAGES = [
  { src: `${SQ}/1695392537733-4255CEWBPPFOR0CDCPPS/1300E5thSt_Aerial-074.jpg?format=1500w`, label: "1300 East 5th — Aerial" },
  { src: `${SQ}/1695392541109-GH6DZTD6XZ4HXVSHR1YL/1300E5thSt-012.jpg?format=1500w`, label: "1300 East 5th — Interior" },
  { src: `${SQ}/1585249221156-84IEUSF5IICF80W53BZ2/MZE_N64.jpg?format=1500w`, label: "The Muze — Exterior" },
  { src: `${SQ}/1627572222404-AYN7N5NTR0OT1ZOH6ILG/PennFieldOffice-162.jpg?format=1500w`, label: "Penn Field — Office" },
  { src: `${SQ}/1627581549234-NGELGPY0YOKA10X9QI64/KendraScott+SM-2.jpg?format=1500w`, label: "Kendra Scott HQ" },
  { src: `${SQ}/1601561703567-F3A979NIPOCR3YBTOV5S/Foundry-061.jpg?format=1500w`, label: "The Foundry — Austin" },
  { src: `${SQ}/200e83ca-e25b-481b-b799-cab27e56e72f/1300E5thSt-012.jpg?format=1500w`, label: "1300 East 5th — Lobby" },
];

const PROJECTS = [
  {
    name: "1300 East 5th Street",
    location: "Austin, TX",
    status: "Completed 2023",
    size: "125,000 SF",
    tags: ["Office", "Mixed-Use", "Sustainable"],
    description: "A three-story office building and parking garage adjacent to Saltillo Plaza. Specialty metal panels, glass curtain wall, ground-floor retail, rainwater capture, and native landscaping.",
    img: `${SQ}/1695392537733-4255CEWBPPFOR0CDCPPS/1300E5thSt_Aerial-074.jpg?format=1500w`,
  },
  {
    name: "The Muze (Lark Austin)",
    location: "Austin, TX",
    status: "Completed",
    size: "Mixed-Use",
    tags: ["Residential", "Multi-Family", "Urban"],
    description: "A landmark mixed-use development in East Austin blending residential living with ground-floor retail. Modern material palette, community-oriented public spaces, and walkable urban design.",
    img: `${SQ}/1585249221156-84IEUSF5IICF80W53BZ2/MZE_N64.jpg?format=1500w`,
  },
  {
    name: "Penn Field",
    location: "Austin, TX",
    status: "Completed",
    size: "Office Campus",
    tags: ["Commercial", "Adaptive Reuse", "Campus"],
    description: "An adaptive-reuse office campus on a historic South Austin airfield. Thoughtful interiors and campus planning create a collaborative environment rooted in Austin's aviation heritage.",
    img: `${SQ}/1627572222404-AYN7N5NTR0OT1ZOH6ILG/PennFieldOffice-162.jpg?format=1500w`,
  },
];

/* ── Helpers ── */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/* ── CountUp ── */
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const dur = 2000;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = clamp((now - t0) / dur, 0, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * end) + suffix);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, suffix]);

  return <span ref={ref}>{display}</span>;
}

/* ── Brand Logo ── */
function BrandLogo({ color, className = "" }: { color: string; className?: string }) {
  return (
    <span className={`font-primary select-none ${className}`} style={{ color, transition: "color 0.35s ease" }}>
      <span style={{ fontWeight: 700 }}>Sixth</span>{" "}
      <span style={{ fontWeight: 700 }}>Rive</span>
      <span style={{ fontWeight: 900 }}>r</span>
    </span>
  );
}

/* ── App ── */
export default function App() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [lifting, setLifting] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [liftDone, setLiftDone] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [navOnDark, setNavOnDark] = useState(false);
  const [hamburgerHover, setHamburgerHover] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const houseWrapRef = useRef<HTMLDivElement>(null);
  const houseInnerRef = useRef<HTMLDivElement>(null);
  const houseImgRef = useRef<HTMLImageElement>(null);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const CHAR_INTERVAL = 140;
  const TYPE_START = 600;
  const totalChars = FULL_TEXT.length;
  const LIFT_AT = TYPE_START + totalChars * CHAR_INTERVAL + 700;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < totalChars; i++) {
      timers.push(setTimeout(() => setTyped(FULL_TEXT.slice(0, i + 1)), TYPE_START + i * CHAR_INTERVAL));
    }
    timers.push(setTimeout(() => setShowCursor(false), LIFT_AT - 150));
    timers.push(setTimeout(() => setLifting(true), LIFT_AT));
    timers.push(setTimeout(() => setHeroVisible(true), LIFT_AT + 1300));
    timers.push(setTimeout(() => setLiftDone(true), LIFT_AT + 2100));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const check = () => {
      const refs = [darkRef.current, galleryRef.current, projectsRef.current];
      let onDark = false;
      for (const el of refs) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 0 && r.bottom > 0) { onDark = true; break; }
      }
      setNavOnDark(onDark);
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  const updateHousePosition = useCallback(() => {
    const wrap = houseWrapRef.current;
    const inner = houseInnerRef.current;
    const img = houseImgRef.current;
    const hero = heroRef.current;
    const dark = darkRef.current;
    if (!wrap || !inner || !img || !hero || !dark || !liftDone) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const heroRect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight;
    const darkRect = dark.getBoundingClientRect();
    const baseW = Math.max(vw, 1400);
    const imgH = img.offsetHeight || (baseW * img.naturalHeight) / (img.naturalWidth || 1);

    const triggerPoint = -(heroH * 0.3);
    const endPoint = heroRect.top - (darkRect.bottom - vh);
    const rawProgress = endPoint === triggerPoint ? 0 : (heroRect.top - triggerPoint) / (endPoint - triggerPoint);
    const progress = clamp(rawProgress, 0, 1);
    const t = smoothstep(smoothstep(progress));

    const startX = (vw - baseW) / 2;
    const startY = vh - imgH;
    const finalScale = 1.45;
    const finalX = (vw - baseW * finalScale) / 2;
    const mobileOffset = vw < 1024 ? -250 : 4;
    const finalY = darkRect.bottom - imgH * finalScale + 500 + mobileOffset;

    if (progress <= 0) {
      inner.style.position = "";
      inner.style.top = "";
      inner.style.left = "";
      inner.style.transform = "";
      inner.style.transformOrigin = "";
      wrap.style.bottom = "0";
      wrap.style.left = "50%";
      wrap.style.transform = "translateX(-50%)";
      wrap.style.width = "100%";
      wrap.style.minWidth = "1400px";
      return;
    }

    wrap.style.bottom = "auto";
    wrap.style.left = "0";
    wrap.style.transform = "none";
    wrap.style.width = baseW + "px";
    wrap.style.minWidth = "0";

    const currentX = startX + (finalX - startX) * t;
    const currentY = startY + (finalY - startY) * t;
    const currentScale = 1 + (finalScale - 1) * t;

    inner.style.position = "fixed";
    inner.style.top = "0";
    inner.style.left = "0";
    inner.style.transformOrigin = "top left";
    inner.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  }, [liftDone]);

  useEffect(() => {
    if (!liftDone) return;
    const onScroll = () => requestAnimationFrame(updateHousePosition);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateHousePosition();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [liftDone, updateHousePosition]);

  const navColor = navOnDark ? "#ffffff" : BRAND_DARK;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        .font-primary { font-family: 'Syne', sans-serif; }
        .font-secondary { font-family: 'Inter', sans-serif; }
        body { background: #f5f0ea; overflow-x: clip; margin: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Hero responsive */
        @media (max-width: 639px) {
          .hero-subtitle-desktop { display: none !important; }
          .hero-subtitle-mobile  { display: block !important; }
          .hero-text-block { padding-top: 90px !important; }
          .hero-heading-top { justify-content: flex-start !important; }
          .hero-own-the { font-size: 7.5vw !important; }
          .hero-extraordinary { font-size: 14.5vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-subtitle-desktop { display: none !important; }
          .hero-subtitle-mobile  { display: block !important; }
          .hero-text-block { padding-top: 110px !important; }
          .hero-heading-top { justify-content: flex-start !important; }
          .hero-own-the { font-size: 5.5vw !important; }
          .hero-extraordinary { font-size: 11vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
        }
        @media (min-width: 1024px) {
          .hero-subtitle-desktop { display: block !important; }
          .hero-subtitle-mobile  { display: none !important; }
          .hero-text-block { padding-top: calc(28vh - 50px) !important; }
          .hero-own-the { font-size: 3vw !important; }
          .hero-extraordinary { font-size: clamp(52px, 6.5vw, 9vw) !important; white-space: nowrap !important; line-height: 0.88 !important; }
        }

        /* Dark statement section */
        .s2-statement { font-family: 'Inter', sans-serif; font-weight: 300; color: #e8e4df; letter-spacing: -0.02em; line-height: 1.35; white-space: nowrap; font-size: clamp(22px, 2.6vw, 42px); }
        .s2-content { display: flex; flex-direction: column; justify-content: center; flex: 1; padding: clamp(30px, 4vw, 60px) 1.5rem clamp(60px, 8vw, 120px); }
        @media (min-width: 768px) { .s2-content { padding-left: 2.5rem; padding-right: 2.5rem; } }
        @media (min-width: 1024px) { .s2-content { padding-left: 4rem; padding-right: 4rem; } }
        .s2-stats-row { max-width: 1200px; margin: clamp(48px, 6vw, 80px) auto 0; padding-left: 25%; display: flex; width: 100%; }
        .s2-stat-item { flex: 1; }
        .s2-stat-item + .s2-stat-item { border-left: 1px solid rgba(255,255,255,0.2); padding-left: clamp(20px, 2.5vw, 40px); }
        .s2-stat-num { font-family: 'Inter', sans-serif; font-weight: 300; color: #fff; font-size: clamp(36px, 4.5vw, 72px); line-height: 1.1; }
        .s2-stat-label { font-family: 'Inter', sans-serif; font-weight: 400; color: rgba(255,255,255,0.6); font-size: clamp(12px, 1.1vw, 16px); margin-top: clamp(4px, 0.5vw, 8px); letter-spacing: 0.01em; }
        .s2-statement-wrap { max-width: 1200px; margin: 0 auto; padding-left: 25%; }
        @media (max-width: 767px) {
          .s2-statement-wrap, .s2-stats-row { padding-left: 0 !important; }
          .s2-statement { white-space: normal !important; font-size: clamp(20px, 5.5vw, 32px) !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .s2-statement-wrap, .s2-stats-row { padding-left: 15% !important; }
          .s2-statement { white-space: normal !important; }
        }

        /* Gallery */
        .s3-gallery-section { position: relative; z-index: 25; margin-top: -100vh; background: #1a1a1a; height: 100vh; overflow: hidden; }
        .s3-ticker-wrap { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; z-index: 0; pointer-events: none; }
        .ticker-track { display: flex; white-space: nowrap; }
        .ticker-word { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(100px, 14vw, 220px); color: rgba(255,255,255,0.04); white-space: nowrap; letter-spacing: -0.02em; user-select: none; padding-right: 0.3em; }
        .s3-gallery-content { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; height: 100%; padding: clamp(24px, 4vw, 60px); }
        .gallery-expand-row { display: flex; gap: 6px; height: 70%; max-width: 1200px; width: 100%; }
        .gallery-expand-item { flex: 1 1 0%; height: 100%; border-radius: 12px; overflow: hidden; cursor: pointer; transition: flex 0.5s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .gallery-expand-item.expanded { flex: 4; }
        .gallery-expand-item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 400; letter-spacing: 0.02em; opacity: 0; transition: opacity 0.4s ease; }
        .gallery-expand-item.expanded .gallery-label { opacity: 1; }

        @media (max-width: 1023px) {
          .s3-gallery-section { height: auto; min-height: 100vh; overflow: visible; }
          .s3-ticker-wrap { position: sticky; top: 0; height: 100vh; width: 100%; margin-bottom: -100vh; }
          .s3-gallery-content { height: auto; align-items: flex-start; padding: 80px 16px 60px; }
          .gallery-expand-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; height: auto; width: 100%; max-width: 700px; }
          .gallery-expand-item { flex: none !important; height: auto; aspect-ratio: 4/5; border-radius: 10px; transition: transform 0.3s ease; }
          .gallery-expand-item:hover { transform: scale(1.02); }
          .gallery-expand-item:last-child:nth-child(odd) { grid-column: 1 / -1; max-width: calc(50% - 4px); justify-self: center; }
          .gallery-label { opacity: 1; font-size: 11px; padding: 10px; }
        }
        @media (max-width: 479px) { .s3-gallery-content { padding: 60px 12px 48px; } .gallery-expand-row { gap: 6px; } }

        /* Projects section */
        .project-card { background: #f5f0ea; border-radius: 16px; overflow: hidden; transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .project-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .project-card img { width: 100%; height: 260px; object-fit: cover; }
      `}</style>

      {/* ── Preloader ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 100, background: BRAND_DARK,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: lifting ? "translateY(-100%)" : "translateY(0)",
        transition: lifting && !liftDone ? "transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)" : "none",
        pointerEvents: liftDone ? "none" : "auto",
      }}>
        <span className="font-primary" style={{ fontSize: "2.6rem", color: "#fff", letterSpacing: "-0.02em", display: "inline-flex", alignItems: "center" }}>
          {typed.split("").map((ch, i) => (
            <span key={i} style={{ fontWeight: ch === "r" && i === FULL_TEXT.length - 1 ? 900 : 700 }}>
              {ch === " " ? " " : ch}
            </span>
          ))}
          {showCursor && (
            <span style={{ display: "inline-block", width: 3, height: "1.1em", background: "#fff", borderRadius: 2, marginLeft: 2, animation: "blink 0.7s step-end infinite" }} />
          )}
        </span>
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 py-5 md:py-6">
        <BrandLogo color={navColor} className="text-xl" />
        <button
          className="relative z-50 flex flex-col items-end justify-center gap-[7px] w-10 h-10"
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={() => setHamburgerHover(true)}
          onMouseLeave={() => setHamburgerHover(false)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={24} style={{ color: BRAND_DARK, transition: "color 0.35s ease" }} />
          ) : (
            <>
              <span style={{ display: "block", height: 1, background: navColor, transition: "width 0.3s ease, background 0.35s ease", width: hamburgerHover ? 20 : 28 }} />
              <span style={{ display: "block", width: 28, height: 1, background: navColor, transition: "background 0.35s ease" }} />
            </>
          )}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8" style={{ background: "#f5f0ea" }}>
          {["Portfolio", "Services", "Gallery", "Contact"].map((link) => (
            <button key={link} className="font-primary text-4xl font-light tracking-widest uppercase hover:text-gray-500 transition-colors" style={{ color: "#000" }} onClick={() => setMenuOpen(false)}>
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── House Image ── */}
      <div ref={houseWrapRef} style={{ position: "fixed", zIndex: 22, pointerEvents: "none", willChange: "transform", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", minWidth: 1400 }}>
        <div ref={houseInnerRef} style={{
          transform: lifting ? "translateY(0)" : "translateY(102vh)",
          transition: !liftDone ? "transform 1.5s cubic-bezier(0.45, 0, 0.15, 1) 0.4s" : "none",
        }}>
          <img ref={houseImgRef} src={HOUSE_IMG} alt="" aria-hidden style={{ width: "100%", display: "block" }} />
        </div>
      </div>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{
        position: "relative", minHeight: "100vh", overflow: "visible",
        backgroundImage: `url(${BG_IMG})`, backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat",
      }}>
        <div className="hero-text-block" style={{
          position: "relative", zIndex: 10,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(-28px)",
          transition: "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s",
        }}>
          <div className="hero-heading-top flex items-end justify-between px-6 md:px-10 lg:px-16" style={{ marginBottom: "-0.04em" }}>
            <span className="font-primary hero-own-the uppercase" style={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
              UNLOCKING THE
            </span>
            <p className="hero-subtitle-desktop font-primary text-right" style={{ fontWeight: 700, fontSize: "clamp(10px, 0.95vw, 14px)", maxWidth: 300, opacity: 0.8, lineHeight: 1.6, marginBottom: "0.2em", letterSpacing: "0.02em", display: "none", color: "#fff" }}>
              Innovative architects and designers<br />creating transformative spaces.
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <h1 className="font-primary hero-extraordinary uppercase px-6 md:px-10 lg:px-16" style={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
              POWER OF TOGETHER
            </h1>
          </div>
          <p className="hero-subtitle-mobile font-primary px-6" style={{ fontWeight: 600, fontSize: "clamp(12px, 3vw, 15px)", opacity: 0.75, marginTop: "0.9em", display: "none", color: "#fff" }}>
            Innovative architects and designers<br />creating transformative spaces.
          </p>
        </div>
      </section>

      {/* ── Dark Statement + Stats ── */}
      <div ref={darkRef} style={{ position: "relative", height: "200vh", zIndex: 20 }}>
        <div style={{ height: "4vh", background: "#1a1a1a" }} />
        <div className="s2-section" style={{ position: "sticky", top: 0, height: "100vh", background: "#1a1a1a", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="s2-content">
            <div className="s2-statement-wrap">
              <p className="s2-statement">
                Sixthriver brings innovative architects<br />
                and designers together to create<br />
                transformative spaces that inspire<br />
                connection and community.
              </p>
            </div>
            <div className="s2-stats-row">
              <div className="s2-stat-item">
                <div className="s2-stat-num"><CountUp end={20} suffix="+" /></div>
                <div className="s2-stat-label">Years in Austin</div>
              </div>
              <div className="s2-stat-item">
                <div className="s2-stat-num"><CountUp end={3} /></div>
                <div className="s2-stat-label">Disciplines — Arch + Interiors + Furniture</div>
              </div>
              <div className="s2-stat-item">
                <div className="s2-stat-num"><CountUp end={50} suffix="+" /></div>
                <div className="s2-stat-label">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div ref={galleryRef} className="s3-gallery-section">
        <div className="s3-ticker-wrap">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div key={copy} style={{ display: "flex" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="ticker-word">Sixth River</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="s3-gallery-content">
          <div className="gallery-expand-row">
            {GALLERY_IMAGES.map((item, i) => (
              <div
                key={i}
                className={`gallery-expand-item${hoveredIdx === i ? " expanded" : ""}`}
                style={hoveredIdx !== null && hoveredIdx !== i ? { flex: "0.5 1 0%" } : undefined}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <img src={item.src} alt={item.label} loading="lazy" />
                <div className="gallery-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects Section ── */}
      <section ref={projectsRef} style={{ background: "#111", position: "relative", zIndex: 26 }} className="py-20 md:py-28 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p className="font-secondary text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured Work</p>
              <h2 className="font-primary text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: "#e8e4df", letterSpacing: "-0.02em", lineHeight: 1 }}>
                Our<br />Portfolio
              </h2>
            </div>
            <p className="font-secondary text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              Architecture, interiors, and furniture — designing with purpose, crafting with care across Austin's most transformative developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <div key={project.name} className="project-card">
                <img src={project.img} alt={project.name} loading="lazy" />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-secondary text-[11px] px-2.5 py-1 rounded-full" style={{ background: "rgba(26,38,52,0.08)", color: BRAND_DARK }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-primary text-xl font-bold mb-1" style={{ color: BRAND_DARK, letterSpacing: "-0.01em" }}>{project.name}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-secondary text-xs flex items-center gap-1" style={{ color: "rgba(26,38,52,0.6)" }}>
                      <MapPin size={12} /> {project.location}
                    </span>
                    <span className="font-secondary text-xs" style={{ color: "rgba(26,38,52,0.6)" }}>{project.size}</span>
                    <span className="font-secondary text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#e3f2fd", color: "#1565c0" }}>{project.status}</span>
                  </div>
                  <p className="font-secondary text-sm leading-relaxed" style={{ color: "rgba(26,38,52,0.7)" }}>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials Bar ── */}
      <section style={{ background: "#f5f0ea", position: "relative", zIndex: 26 }} className="py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,38,52,0.08)" }}>
                <Building2 size={20} style={{ color: BRAND_DARK }} />
              </div>
              <div>
                <h4 className="font-primary text-lg font-bold" style={{ color: BRAND_DARK }}>Architecture</h4>
                <p className="font-secondary text-sm mt-1" style={{ color: "rgba(26,38,52,0.6)", lineHeight: 1.6 }}>Innovative and tailored architectural solutions that blend creativity with functionality, shaping environments that inspire and endure.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,38,52,0.08)" }}>
                <Users size={20} style={{ color: BRAND_DARK }} />
              </div>
              <div>
                <h4 className="font-primary text-lg font-bold" style={{ color: BRAND_DARK }}>Interior Design</h4>
                <p className="font-secondary text-sm mt-1" style={{ color: "rgba(26,38,52,0.6)", lineHeight: 1.6 }}>Thoughtfully curated interiors that reflect each client's vision, balancing aesthetics with purpose to create inviting, functional spaces.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,38,52,0.08)" }}>
                <Award size={20} style={{ color: BRAND_DARK }} />
              </div>
              <div>
                <h4 className="font-primary text-lg font-bold" style={{ color: BRAND_DARK }}>Furniture by Rise</h4>
                <p className="font-secondary text-sm mt-1" style={{ color: "rgba(26,38,52,0.6)", lineHeight: 1.6 }}>Purposeful, design-driven furniture solutions that complete the story of a space — curated, procured, and delivered with precision.</p>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(26,38,52,0.15) 20%, rgba(26,38,52,0.15) 80%, transparent 100%)" }} className="mb-12" />

          <div className="flex flex-wrap items-start justify-between gap-12">
            <div>
              <h4 className="font-primary text-lg font-bold mb-1" style={{ color: BRAND_DARK }}>Sixth River Architects</h4>
              <p className="font-secondary text-sm" style={{ color: "rgba(26,38,52,0.6)" }}>Boutique Architecture + Design</p>
              <p className="font-secondary text-sm" style={{ color: "rgba(26,38,52,0.6)" }}>Austin, Texas</p>
              <p className="font-secondary text-xs mt-2" style={{ color: "rgba(26,38,52,0.45)" }}>S Mopac Expressway, Austin 78746</p>
            </div>
            <div>
              <h4 className="font-primary text-lg font-bold mb-1" style={{ color: BRAND_DARK }}>Services</h4>
              <p className="font-secondary text-sm" style={{ color: "rgba(26,38,52,0.6)" }}>Feasibility & Due Diligence</p>
              <p className="font-secondary text-sm" style={{ color: "rgba(26,38,52,0.6)" }}>Concept Design & Renderings</p>
              <p className="font-secondary text-sm" style={{ color: "rgba(26,38,52,0.6)" }}>Architecture & Interior Design</p>
            </div>
            <div>
              <h4 className="font-primary text-lg font-bold mb-3" style={{ color: BRAND_DARK }}>Get in Touch</h4>
              <div className="space-y-2">
                <a href="tel:+15123069928" className="font-secondary text-sm flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "rgba(26,38,52,0.7)" }}>
                  <Phone size={14} /> (512) 306-9928
                </a>
                <a href="https://sixthriver.com" target="_blank" rel="noopener noreferrer" className="font-secondary text-sm flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "rgba(26,38,52,0.7)" }}>
                  <Mail size={14} /> sixthriver.com
                </a>
                <p className="font-secondary text-sm flex items-center gap-2" style={{ color: "rgba(26,38,52,0.5)" }}>
                  <MapPin size={14} /> Austin, TX 78746
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#1a1a1a", position: "relative", zIndex: 26 }} className="py-12 px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <BrandLogo color="#e8e4df" className="text-xl" />
            <span className="font-secondary text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Architecture + Interior Design + Furniture</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://sixthriver.com/portfolio" target="_blank" rel="noopener noreferrer" className="font-secondary text-sm hover:opacity-100 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>Portfolio</a>
            <a href="https://sixthriver.com" target="_blank" rel="noopener noreferrer" className="font-secondary text-sm hover:opacity-100 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>Website</a>
            <a href="tel:+15123069928" className="font-secondary text-sm hover:opacity-100 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
