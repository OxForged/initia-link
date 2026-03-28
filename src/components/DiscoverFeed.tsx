"use client";

import { useState, useEffect } from "react";
import { getRecentProfiles, getProfile, getTotalProfiles, type Profile } from "@/lib/contract";
import { resolveAddressToUsername } from "@/lib/username";
import ProfileCard from "./ProfileCard";
import { ProfileCardSkeleton } from "./Skeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Address } from "viem";

const PAGE_SIZE = 12;

type ProfileData = {
  address: Address;
  profile: Profile;
  username?: string;
};

export default function DiscoverFeed() {
  const [tab, setTab] = useState<"new" | "popular">("new");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const gridRef = useScrollReveal<HTMLDivElement>([profiles.length, tab, visible, search]);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    try {
      const total = await getTotalProfiles();
      const limit = total > 200n ? 200n : total;
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

  const query = search.trim().toLowerCase();

  const filtered = query
    ? profiles.filter((p) => {
        const name = (p.username || p.address).toLowerCase();
        return name.includes(query);
      })
    : profiles;

  const sorted =
    tab === "popular"
      ? [...filtered].sort((a, b) => Number(b.profile.followerCount - a.profile.followerCount))
      : filtered;

  const shown = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  // Reset visible count when search or tab changes
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, tab]);

  return (
    <div>
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex gap-3">
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
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username..."
          className="w-full sm:w-56 bg-white border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm input-glow outline-none placeholder:text-[#aaa]"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-[var(--muted)] text-center py-8 animate-fade-in">
          {query ? (
            <>No profiles matching &ldquo;{search.trim()}&rdquo;</>
          ) : (
            <>No profiles yet. Be the first to{" "}
            <a href="/edit" className="text-[var(--accent)] font-medium">create one</a>!</>
          )}
        </p>
      ) : (
        <>
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shown.map((p, i) => (
              <div key={p.address} className="scroll-reveal" style={{ transitionDelay: `${Math.min(i, 11) * 80}ms` }}>
                <ProfileCard address={p.address} profile={p.profile} username={p.username} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn-press bg-white border-2 border-[var(--card-border)] text-[#555] px-6 py-2.5 rounded-xl text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300"
              >
                Load More ({sorted.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
