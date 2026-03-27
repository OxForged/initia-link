"use client";

import ConnectButton from "./ConnectButton";

export default function Navbar() {
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
          <a href="/discover" className="text-[#666] font-medium hover:text-[var(--accent)] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent)] after:transition-all after:duration-300 hover:after:w-full">Discover</a>
          <a href="/edit" className="text-[#666] font-medium hover:text-[var(--accent)] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent)] after:transition-all after:duration-300 hover:after:w-full">Create Profile</a>
          <a href="/dashboard" className="text-[#666] font-medium hover:text-[var(--accent)] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent)] after:transition-all after:duration-300 hover:after:w-full">Dashboard</a>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
