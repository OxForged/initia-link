"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { getProfile } from "@/lib/contract";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isConnected, username } = useInterwovenKit();
  const hexAddress = useHexAddress();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!isConnected || !hexAddress) { setHasProfile(false); return; }
    getProfile(hexAddress)
      .then((p) => setHasProfile(p.exists))
      .catch(() => setHasProfile(false));
  }, [isConnected, hexAddress]);

  const profileHref = hasProfile && username ? `/${username}` : "/edit";
  const profileLabel = hasProfile ? "My Profile" : "Create Profile";

  const navLinks = [
    { href: "/discover", label: "Discover" },
    { href: profileHref, label: profileLabel },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="px-4 sm:px-6 py-4 animate-fade-in-down relative z-50">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">

        {/* Brand */}
        <a
          href="/"
          className="inline-flex items-center gap-2.5 flex-shrink-0"
          style={{ textDecoration: "none" }}
        >
          {/* Logo mark */}
          <img
            src="/favicon.svg"
            alt="initiaLink"
            width={30}
            height={30}
            style={{
              borderRadius: "7px",
              border: "2px solid var(--foreground)",
              boxShadow: "2px 2px 0 var(--foreground)",
              flexShrink: 0,
            }}
          />
          <span
            className="font-heading"
            style={{ fontWeight: 900, fontStyle: "italic", fontSize: "22px", letterSpacing: "-0.02em", color: "var(--foreground)" }}
          >
            initiaLink
          </span>
        </a>

        {/* Desktop: pill nav */}
        <div
          className="hidden md:flex items-center gap-1"
          style={{
            padding: "5px",
            background: "var(--card)",
            border: "2px solid var(--foreground)",
            borderRadius: "9999px",
            boxShadow: "4px 4px 0 var(--foreground)",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className="font-heading"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: isActive ? "#0891b2" : "transparent",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  transition: "background 200ms, color 200ms",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop: connect */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <ConnectButton />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{
            border: "2px solid var(--foreground)",
            boxShadow: "3px 3px 0 var(--foreground)",
            background: "var(--card)",
          }}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[var(--foreground)] transition-all duration-300 ${open ? "rotate-45 translate-y-[3px]" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[var(--foreground)] mt-1 transition-all duration-300 ${open ? "-rotate-45 -translate-y-[3px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden mx-auto max-w-4xl mt-2 animate-fade-in-down flex flex-col gap-1"
          style={{
            background: "var(--card)",
            border: "2px solid var(--foreground)",
            borderRadius: "20px",
            boxShadow: "6px 6px 0 var(--foreground)",
            padding: "16px",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-heading"
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 700,
                  background: isActive ? "rgba(8, 145, 178, 0.1)" : "transparent",
                  color: isActive ? "#0891b2" : "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            );
          })}
          <div
            style={{
              paddingTop: "12px",
              marginTop: "4px",
              borderTop: "1px solid var(--card-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px 0",
            }}
          >
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}
