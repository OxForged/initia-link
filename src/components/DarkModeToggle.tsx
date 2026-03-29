"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    setMounted(true);
  }, []);

  function toggle() {
    const doc = document.documentElement;
    doc.classList.add("theme-transition");

    const next = !dark;
    setDark(next);
    if (next) {
      doc.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      doc.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setTimeout(() => doc.classList.remove("theme-transition"), 350);
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="relative w-[52px] h-[28px] rounded-full overflow-hidden focus:outline-none shrink-0"
      style={{
        transition: "background 0.6s ease",
        background: dark
          ? "linear-gradient(180deg, #0c1445 0%, #1a237e 100%)"
          : "linear-gradient(180deg, #64b5f6 0%, #42a5f5 100%)",
      }}
      title={dark ? "Light mode" : "Dark mode"}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Stars */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          transition: "opacity 0.6s ease",
          opacity: dark ? 1 : 0,
        }}
      >
        <span style={{ position: "absolute", width: 2, height: 2, borderRadius: "50%", background: "#fff", top: 6, left: 8, animation: "twinkle 1.5s ease-in-out infinite" }} />
        <span style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "#fff", top: 16, left: 14, animation: "twinkle 1.5s ease-in-out 0.4s infinite" }} />
        <span style={{ position: "absolute", width: 2, height: 2, borderRadius: "50%", background: "#e0e0ff", top: 5, left: 22, animation: "twinkle 1.5s ease-in-out 0.8s infinite" }} />
        <span style={{ position: "absolute", width: 1.5, height: 1.5, borderRadius: "50%", background: "#fff", top: 18, left: 6, animation: "twinkle 1.5s ease-in-out 1.2s infinite" }} />
      </span>

      {/* Clouds */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          transition: "opacity 0.6s ease",
          opacity: dark ? 0 : 1,
        }}
      >
        <span style={{ position: "absolute", width: 10, height: 5, borderRadius: 8, background: "rgba(255,255,255,0.8)", bottom: 4, right: 6 }} />
        <span style={{ position: "absolute", width: 14, height: 5, borderRadius: 8, background: "rgba(255,255,255,0.6)", bottom: 6, right: 3 }} />
        <span style={{ position: "absolute", width: 8, height: 4, borderRadius: 8, background: "rgba(255,255,255,0.5)", bottom: 3, right: 16 }} />
      </span>

      {/* Sliding orb */}
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease, box-shadow 0.5s ease",
          transform: dark ? "translateX(24px)" : "translateX(0)",
          background: dark ? "#f5e6a3" : "#ffc645",
          boxShadow: dark
            ? "0 0 8px rgba(245,230,163,0.6), inset -3px -2px 0 0 #d4c070"
            : "0 0 10px rgba(255,198,69,0.4), 0 0 20px rgba(255,198,69,0.15)",
        }}
      >
        {/* Moon craters - always rendered, opacity controlled */}
        <span
          style={{
            position: "absolute",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(180,160,80,0.5)",
            top: 4,
            left: 3,
            transition: "opacity 0.5s ease",
            opacity: dark ? 1 : 0,
          }}
        />
        <span
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(180,160,80,0.4)",
            top: 13,
            left: 11,
            transition: "opacity 0.5s ease",
            opacity: dark ? 1 : 0,
          }}
        />
        <span
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(180,160,80,0.35)",
            top: 6,
            left: 14,
            transition: "opacity 0.5s ease",
            opacity: dark ? 1 : 0,
          }}
        />

        {/* Sun rays ring - always rendered, opacity controlled */}
        <span
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "2px solid rgba(255,198,69,0.25)",
            transition: "opacity 0.5s ease",
            opacity: dark ? 0 : 1,
            animation: dark ? "none" : "sunPulse 2s ease-in-out infinite",
          }}
        />
      </span>
    </button>
  );
}
