"use client";

import DiscoverFeed from "@/components/DiscoverFeed";

export default function DiscoverPage() {
  return (
    <div>
      <h1
        className="animate-fade-in-up delay-0 text-2xl font-bold mb-6 text-[var(--foreground)] font-heading"
      >
        Discover Profiles
      </h1>
      <div className="animate-fade-in-up delay-1">
        <DiscoverFeed />
      </div>
    </div>
  );
}
