"use client";

import ConnectButton from "./ConnectButton";

export default function Navbar() {
  return (
    <nav className="border-b border-[var(--card-border)] px-6 py-4">
      <div className="mx-auto max-w-4xl flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">
          Initia<span className="text-[var(--accent)]">Link</span>
        </a>
        <div className="flex items-center gap-4 text-sm">
          <a href="/discover" className="hover:text-[var(--accent)] transition-colors">Discover</a>
          <a href="/edit" className="hover:text-[var(--accent)] transition-colors">Create Profile</a>
          <a href="/dashboard" className="hover:text-[var(--accent)] transition-colors">Dashboard</a>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
