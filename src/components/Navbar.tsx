"use client";

import { usePathname } from "next/navigation";
import ConnectButton from "./ConnectButton";

const navLinks = [
  { href: "/discover", label: "Discover" },
  { href: "/edit", label: "Create Profile" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="px-6 py-4 animate-fade-in-down">
      <div className="mx-auto max-w-4xl bg-white/85 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_28px_rgba(244,63,94,0.1)] transition-shadow duration-500">
        <a
          href="/"
          className="text-xl font-extrabold tracking-tight gradient-text-animated"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          InitiaLink
        </a>
        <div className="flex items-center gap-5 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-[var(--accent)] after:transition-all after:duration-300 ${
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
      </div>
    </nav>
  );
}
