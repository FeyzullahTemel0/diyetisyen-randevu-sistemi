"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["#hakkinda", "Diyetisyen"],
  ["#hizmetler", "Hizmetler"],
  ["#surec", "Süreç"],
  ["#panel", "Panel demosu"],
  ["#sss", "SSS"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          Denge <em>Beslenme Atölyesi</em>
        </a>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Menüyü kapat" : "Menüyü aç"}</span>
          <span className={`burger ${open ? "x" : ""}`} aria-hidden="true" />
        </button>
        <nav id="main-nav" className={open ? "open" : ""} aria-label="Ana menü">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href="#randevu" className="btn btn-primary btn-small" onClick={() => setOpen(false)}>
            Randevu al
          </a>
        </nav>
      </div>
    </header>
  );
}
