import { useEffect, useRef, useState } from "react";
import "./ImpactStats.css";

/* ── Inline SVG icons (style matched to existing badge pattern) ── */

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="stat-icon-svg">
      <path d="M7 4.5h3l1.2 3.5-1.7 1.7a14.3 14.3 0 0 0 4.8 4.8l1.7-1.7 3.5 1.2v3A1.8 1.8 0 0 1 17.7 19 16.7 16.7 0 0 1 5 6.3 1.8 1.8 0 0 1 7 4.5Z"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="stat-icon-svg">
      <path d="M3 10.5 12 3l9 7.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10.5V20a1 1 0 0 0 1 1h4v-5.5h4V21h4a1 1 0 0 0 1-1v-9.5"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function IconFood() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="stat-icon-svg">
      <path d="M7 4h2v7a3 3 0 0 1-6 0V4h2v3"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 4h2v7a3 3 0 0 1-6 0V4h2v3"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18h14v2H5Z" fill="currentColor" opacity="0.25" />
      <path d="M5 18h14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLightning() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="stat-icon-svg">
      <path d="M13 2 4 13h6l-1 9 10-12h-6Z"
        fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="7" r="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/* ── Count-up hook ── */

function useCountUp(target, duration = 2000) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    prevTarget.current = value;
    const startVal = prevTarget.current;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = progress * (2 - progress);
      setValue(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

/* ── Stat item ── */

function StatItem({ icon, target, suffix, label }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(visible ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`stat-item${visible ? " visible" : ""}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">
        <span className="stat-value">{count.toLocaleString()}</span>
        <span className="stat-suffix">{suffix}</span>
      </div>
      <p className="stat-label">{label}</p>
    </div>
  );
}

/* ── Impact stats bar ── */

export default function ImpactStats() {
  const stats = [
    { icon: <IconPhone />, target: 12000, suffix: "+", label: "Calls Answered Last Year" },
    { icon: <IconHome />, target: 3400, suffix: "+", label: "Housing Referrals Made" },
    { icon: <IconFood />, target: 1800, suffix: "+", label: "Food Assistance Connections" },
    { icon: <IconLightning />, target: 72, suffix: "%", label: "Benefits Connected Within 48 Hours" },
  ];

  return (
    <section className="impact-stats" aria-label="211 Ashtabula County impact">
      <div className="impact-stats-inner">
        <p className="impact-eyebrow">Our Impact</p>
        <div className="stats-grid">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
