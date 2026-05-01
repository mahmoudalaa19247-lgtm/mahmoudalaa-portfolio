import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook for scroll animations ──
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Animated counter ──
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Fade-in wrapper ──
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>{children}</div>
  );
}

// ── Typewriter ──
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    const speed = deleting ? 60 : 110;
    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIdx(i => i + 1);
      } else {
        setText(t => deleting ? t.slice(0, -1) : word.slice(0, t.length + 1));
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, words]);
  return (
    <span className="text-cyan-400 font-mono">
      {text}<span className="animate-pulse">|</span>
    </span>
  );
}

// ── Skill badge ──
function SkillBadge({ label }) {
  return (
    <span className="px-3 py-1 text-xs font-mono border border-cyan-500/40 text-cyan-300 rounded-sm bg-cyan-950/30 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200 cursor-default">
      {label}
    </span>
  );
}

// ── Section header ──
function SectionHeader({ number, title }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="font-mono text-cyan-500 text-sm">[ {number} ]</span>
      <h2 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
    </div>
  );
}

// ── Timeline entry ──
function TimelineItem({ year, title, org, bullets, delay = 0 }) {
  return (
    <FadeIn delay={delay} className="relative pl-6 border-l border-cyan-800/60 pb-8 last:pb-0 group">
      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-cyan-500 bg-slate-950 group-hover:bg-cyan-500 transition-colors duration-300" />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <span className="font-mono text-xs text-cyan-500 bg-cyan-950/50 px-2 py-0.5 rounded-sm border border-cyan-800/50">{year}</span>
        <h3 className="font-semibold text-slate-100 text-base">{title}</h3>
      </div>
      <p className="text-cyan-300/70 text-sm mb-2 font-mono">{org}</p>
      {bullets && (
        <ul className="space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="text-slate-400 text-sm flex gap-2">
              <span className="text-cyan-600 mt-0.5 shrink-0">›</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </FadeIn>
  );
}

// ── Project card ──
function ProjectCard({ title, tag, bullets, delay = 0 }) {
  return (
    <FadeIn delay={delay} className="group relative border border-slate-700/60 bg-slate-900/60 rounded-sm p-5 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-t-sm" />
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-slate-100 text-base leading-snug">{title}</h3>
        <span className="shrink-0 text-xs font-mono px-2 py-0.5 bg-slate-800 border border-slate-600 text-slate-400 rounded-sm">{tag}</span>
      </div>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-slate-400 text-sm flex gap-2">
            <span className="text-cyan-600 mt-0.5 shrink-0">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </FadeIn>
  );
}

// ── Nav link ──
function NavLink({ href, label }) {
  return (
    <a href={href} className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors duration-200 relative group">
      {label}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-200" />
    </a>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Grid background texture */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Glow accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur border-b border-slate-800/80" : ""}`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-mono text-cyan-400 font-bold tracking-widest text-sm">MA_</span>
          <div className="hidden sm:flex items-center gap-8">
            <NavLink href="#about" label="about" />
            <NavLink href="#skills" label="skills" />
            <NavLink href="#projects" label="projects" />
            <NavLink href="#experience" label="experience" />
            <NavLink href="#contact" label="contact" />
          </div>
          <a href="mailto:mahmoud.alaa.19247@gmail.com"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200 rounded-sm">
            hire me
          </a>
        </div>
      </nav>

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section id="about" className="max-w-5xl mx-auto px-6 pt-36 pb-28">
          <div className="max-w-3xl">
            <p className="font-mono text-cyan-500 text-sm mb-4 tracking-widest animate-fadeIn" style={{ animation: "fadeUp 0.6s ease both" }}>
              &gt; mechatronics_engineer.init()
            </p>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-50 leading-tight tracking-tight mb-4" style={{ animation: "fadeUp 0.7s ease 0.1s both" }}>
              Mahmoud<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Alaa</span>
            </h1>
            <div className="text-xl sm:text-2xl font-light text-slate-400 mb-6 h-8" style={{ animation: "fadeUp 0.7s ease 0.2s both" }}>
              <Typewriter words={["Digital Twin Engineer", "Industry 4.0 Specialist", "Automation Designer", "IIoT Architect"]} />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xl mb-8 text-base" style={{ animation: "fadeUp 0.7s ease 0.3s both" }}>
              Bridging mechanical systems and digital intelligence. Specialized in IIoT, predictive maintenance, 
              and simulation-driven automation with grounding across steel, maritime, and green hydrogen sectors.
            </p>
            <div className="flex flex-wrap gap-3" style={{ animation: "fadeUp 0.7s ease 0.4s both" }}>
              <a href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-sm transition-colors duration-200">
                View Projects
              </a>
              <a href="mailto:mahmoud.alaa.19247@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 text-sm font-mono rounded-sm transition-all duration-200">
                mahmoud.alaa.19247@gmail.com
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-12 border-t border-slate-800">
            {[
              { n: 374, suffix: "/400", label: "GPA Score" },
              { n: 6, suffix: "+", label: "Industrial Sites" },
              { n: 3, suffix: "", label: "Active Programs" },
              { n: 2, suffix: "", label: "Key Projects" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-slate-50 font-mono mb-1">
                  <Counter target={s.n} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-500 font-mono tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="max-w-5xl mx-auto px-6 py-20">
          <FadeIn><SectionHeader number="01" title="Technical Skills" /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { cat: "Industrial Automation", icon: "⚙", items: ["Siemens Simatic Manager (PLC)", "WinCC (HMI)", "Electric Arc Furnace control", "Relay logic design"] },
              { cat: "CAD & Simulation", icon: "◈", items: ["SolidWorks", "Solid Edge", "AutoCAD", "MATLAB / Simulink", "Proteus Professional", "Multisim"] },
              { cat: "Programming", icon: "< >", items: ["C++", "Arduino IDE", "Logic sequencing", "Embedded systems"] },
              { cat: "AI & Data", icon: "◎", items: ["AI/ML for predictive maintenance", "IIoT architecture", "Real-time data streaming", "Excel for Data Analytics"] },
              { cat: "Digital Twin", icon: "⬡", items: ["High-fidelity virtual models", "Process optimization", "NTI Industry 4.0 track", "Digital-twin-native automation"] },
              { cat: "Green Hydrogen", icon: "⬡", items: ["Intelligent control systems", "Advanced sensing", "Predictive intelligence", "BUE × Coventry program"] },
            ].map((group, gi) => (
              <FadeIn key={gi} delay={gi * 0.07}>
                <div className="border border-slate-700/60 bg-slate-900/40 rounded-sm p-5 h-full hover:border-slate-600/80 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-cyan-400 font-mono text-base">{group.icon}</span>
                    <h3 className="font-semibold text-slate-200 text-sm tracking-wide">{group.cat}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item, ii) => <SkillBadge key={ii} label={item} />)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="max-w-5xl mx-auto px-6 py-20">
          <FadeIn><SectionHeader number="02" title="Projects" /></FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            <ProjectCard
              title="Automated PCB Production Line"
              tag="Graduation · Excellent"
              delay={0}
              bullets={[
                "Designed PCB transport system using linear motion components — aluminum profile, gantry car, pulleys, belts, bearings.",
                "Defined step-by-step PLC logic sequence with limit switch sensors to trigger motor actions and UV-exposure cycles.",
                "Performed motion studies in SolidWorks and verified circuit logic in Proteus before physical assembly.",
                "Dual-power setup: separate motor supply and logic-level voltage; relay-controlled UV-LED array.",
              ]}
            />
            <ProjectCard
              title="Autonomous Mobile Robotic Platform"
              tag="Vision-Capable"
              delay={0.1}
              bullets={[
                "Designed mobile chassis with an integrated pick-and-place robotic arm and specialized end-effectors.",
                "Engineered mounting and stability controls to support vision-based recognition hardware.",
                "Integrated mobile-app remote control for manual override and arm reach/grip testing.",
              ]}
            />
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="max-w-5xl mx-auto px-6 py-20">
          <FadeIn><SectionHeader number="03" title="Industrial Training" /></FadeIn>
          <div className="grid sm:grid-cols-2 gap-x-12">
            <div>
              <TimelineItem year="Aug 2023" title="Steel Making Division" org="Ezzsteel" delay={0}
                bullets={["Analyzed end-to-end steel billets production process.", "Observed Electric Arc Furnace (EAF) operation and heavy automation."]} />
              <TimelineItem year="Aug 2022" title="Alexandria Shipyard" org="Alexandria" delay={0.05}
                bullets={["Exposure to large-scale marine mechanical and electrical systems.", "Observed CNC machining and metal fabrication."]} />
              <TimelineItem year="Aug 2022" title="Packaging Line Automation" org="Abikir Engineering Industries" delay={0.1}
                bullets={["Studied high-speed automated lines for aluminum and aerosol production."]} />
            </div>
            <div>
              <TimelineItem year="Jul 2022" title="Flat Steel Division" org="Ezzsteel" delay={0.05}
                bullets={["Overview of continuous flat steel production processes.", "Analyzed integration of heavy mechanical equipment with control frameworks."]} />
              <TimelineItem year="Sep 2021" title="Workshop Operations" org="Egyptian Petrochemicals" delay={0.1}
                bullets={["Maintenance protocols for heavy equipment in petrochemical environments."]} />
              <TimelineItem year="Aug 2021" title="Process Control" org="Egyptian Ethylene & Derivatives" delay={0.15}
                bullets={["Monitored high-pressure systems and safety-critical control systems."]} />
            </div>
          </div>
        </section>

        {/* ── FELLOWSHIPS ── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <FadeIn><SectionHeader number="04" title="Fellowships & Programs" /></FadeIn>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Digital Twin Engineering Track", org: "National Telecommunication Institute (NTI)", detail: "IIoT architecture, AI/ML integration, real-time data streaming, predictive maintenance.", status: "In Progress" },
              { title: "Mechatronics, Intelligence & Digitalization", org: "BUE × Coventry University · British Council", detail: "Intelligent control, advanced sensing, and predictive intelligence for green hydrogen systems.", status: "In Progress" },
              { title: "McKinsey Forward Program", org: "McKinsey & Company", detail: "Structured problem-solving, resilient leadership, and AI-driven business essentials.", status: "In Progress" },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border border-slate-700/60 bg-slate-900/40 rounded-sm p-5 h-full group hover:border-cyan-800/60 transition-colors duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded-sm bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">0{i+1}</div>
                    <span className="text-xs font-mono text-amber-400/80 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-sm">{f.status}</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm mb-1 leading-snug">{f.title}</h3>
                  <p className="text-cyan-400/60 text-xs font-mono mb-3">{f.org}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="max-w-5xl mx-auto px-6 py-20">
          <FadeIn>
            <div className="border border-slate-700/60 bg-slate-900/60 rounded-sm p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative z-10">
                <p className="font-mono text-cyan-500 text-xs tracking-widest mb-3">&gt; connect.establish()</p>
                <h2 className="text-3xl font-bold text-slate-50 mb-3">Let's Build Something Together</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Open to opportunities in industrial automation, digital twin development, and Industry 4.0 engineering roles.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="mailto:mahmoud.alaa.19247@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-sm transition-colors duration-200">
                    mahmoud.alaa.19247@gmail.com
                  </a>
                  <a href="tel:+201202072729"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 text-sm font-mono rounded-sm transition-all duration-200">
                    +20 120 207 2729
                  </a>
                  <a href="https://www.linkedin.com/in/mkhairallah/" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 text-sm font-mono rounded-sm transition-all duration-200">
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-800/60 py-6 text-center">
          <p className="font-mono text-slate-600 text-xs tracking-wider">
            © 2025 Mahmoud Alaa · Mechatronics Engineer · Egypt
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
