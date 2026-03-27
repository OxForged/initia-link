"use client";

import ConnectButton from "./ConnectButton";

export default function Navbar() {
  return (
    <nav className="px-6 py-4">
      <div className="mx-auto max-w-4xl bg-white/85 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <a href="/" className="text-xl font-extrabold tracking-tight gradient-primary gradient-text">
          InitiaLink
        </a>
        <div className="flex items-center gap-5 text-sm">
          <a href="/discover" className="text-[#666] font-medium hover:text-[var(--accent)] transition-colors">Discover</a>
          <a href="/edit" className="text-[#666] font-medium hover:text-[var(--accent)] transition-colors">Create Profile</a>
          <a href="/dashboard" className="text-[#666] font-medium hover:text-[var(--accent)] transition-colors">Dashboard</a>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
