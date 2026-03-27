"use client";

import { useState, useEffect } from "react";
import { getRecentProfiles, getProfile, getTotalProfiles, type Profile } from "@/lib/contract";
import ProfileCard from "./ProfileCard";
import type { Address } from "viem";

type ProfileData = {
  address: Address;
  profile: Profile;
};

export default function DiscoverFeed() {
  const [tab, setTab] = useState<"new" | "popular">("new");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

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
          const profile = await getProfile(addr);
          return { address: addr, profile };
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
          className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
            tab === "new" ? "gradient-primary text-white" : "bg-[#f5f5f5] text-[#888]"
          }`}
        >
          New
        </button>
        <button
          onClick={() => setTab("popular")}
          className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
            tab === "popular" ? "gradient-primary text-white" : "bg-[#f5f5f5] text-[#888]"
          }`}
        >
          Popular
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] text-center py-8">Loading profiles...</p>
      ) : sorted.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-8">
          No profiles yet. Be the first to{" "}
          <a href="/edit" className="text-[var(--accent)] font-medium">create one</a>!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((p) => (
            <ProfileCard key={p.address} address={p.address} profile={p.profile} />
          ))}
        </div>
      )}
    </div>
  );
}
