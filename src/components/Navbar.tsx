"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ConnectButton from "./ConnectButton";

const navLinks = [
  { href: "/discover", label: "Discover" },
  { href: "/edit", label: "Create Profile" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="px-4 sm:px-6 py-4 animate-fade-in-down">
      <div className="mx-auto max-w-4xl bg-white/85 backdrop-blur-xl rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_28px_rgba(8,145,178,0.1)] transition-shadow duration-500">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-[var(--foreground)] font-heading"
        >
          InitiaLink
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`py-2 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[var(--accent)] after:transition-all after:duration-300 ${
                  isActive
                    ? "text-[var(--accent)] after:w-full"
                    : "text-[#666] hover:text-[var(--accent)] after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <ConnectButton />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-[#f0f5f7] transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-[var(--foreground)] transition-all duration-300 ${open ? "rotate-45 translate-y-[3px]" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[var(--foreground)] mt-1 transition-all duration-300 ${open ? "-rotate-45 -translate-y-[3px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mx-auto max-w-4xl mt-2 bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-down flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--accent)] bg-[rgba(8,145,178,0.06)]"
                    : "text-[#666] hover:text-[var(--accent)] hover:bg-[rgba(8,145,178,0.04)]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2 px-4 border-t border-[var(--card-border)]">
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}
