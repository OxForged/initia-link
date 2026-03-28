"use client";

import { useState, useEffect } from "react";
import { getRecentProfiles, getProfile, getTotalProfiles, type Profile } from "@/lib/contract";
import { resolveAddressToUsername } from "@/lib/username";
import ProfileCard from "./ProfileCard";
import { ProfileCardSkeleton } from "./Skeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Address } from "viem";

type ProfileData = {
  address: Address;
  profile: Profile;
  username?: string;
};

export default function DiscoverFeed() {
  const [tab, setTab] = useState<"new" | "popular">("new");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useScrollReveal<HTMLDivElement>([profiles.length, tab]);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    try {
      const total = await getTotalProfiles();
      const limit = total > 50n ? 50n : total;
      const addresses = await getRecentProfiles(0n, limit);

      const data = await Promise.all(
        addresses.map(async (addr) => {
          const [profile, username] = await Promise.all([
            getProfile(addr),
            resolveAddressToUsername(addr).catch(() => null),
          ]);
          return {
            address: addr,
            profile,
            username: username ? `${username}.init` : undefined,
          };
        })
      );

      setProfiles(data);
    } catch (e) {
      console.error("Failed to load profiles:", e);
    } finally {
      setLoading(false);
    }
  }

  const sorted =
    tab === "popular"
      ? [...profiles].sort((a, b) => Number(b.profile.followerCount - a.profile.followerCount))
      : profiles;

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("new")}
          className={`btn-press text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 ${
            tab === "new" ? "gradient-primary text-white shadow-[0_2px_8px_rgba(8,145,178,0.25)]" : "bg-[#f5f5f5] text-[#888] hover:bg-[#eee]"
          }`}
        >
          New
        </button>
        <button
          onClick={() => setTab("popular")}
          className={`btn-press text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 ${
            tab === "popular" ? "gradient-primary text-white shadow-[0_2px_8px_rgba(8,145,178,0.25)]" : "bg-[#f5f5f5] text-[#888] hover:bg-[#eee]"
          }`}
        >
          Popular
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-8 animate-fade-in">
          No profiles yet. Be the first to{" "}
          <a href="/edit" className="text-[var(--accent)] font-medium">create one</a>!
        </p>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((p, i) => (
            <div key={p.address} className="scroll-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <ProfileCard address={p.address} profile={p.profile} username={p.username} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
