"use client";

import DiscoverFeed from "@/components/DiscoverFeed";

export default function DiscoverPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Discover Profiles</h1>
      <DiscoverFeed />
    </div>
  );
}
