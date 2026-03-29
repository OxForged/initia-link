"use client";

import { useState, useEffect, useRef } from "react";
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
  const [sortBy, setSortBy] = useState<"score" | "followers" | "tipCount" | "totalTips">("score");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
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
      ? [...filtered].sort((a, b) => {
          if (sortBy === "followers") return Number(b.profile.followerCount - a.profile.followerCount);
          if (sortBy === "tipCount") return Number(b.profile.tipCount - a.profile.tipCount);
          if (sortBy === "totalTips") return Number(b.profile.totalTips - a.profile.totalTips);
          // score (default)
          const scoreA = Number(a.profile.followerCount) * 3 + Number(a.profile.tipCount) * 2 + Number(a.profile.totalTips);
          const scoreB = Number(b.profile.followerCount) * 3 + Number(b.profile.tipCount) * 2 + Number(b.profile.totalTips);
          return scoreB - scoreA;
        })
      : filtered;

  const shown = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  // Close sort dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    if (sortOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [sortOpen]);

  // Reset visible count when search or tab changes
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, tab, sortBy]);

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
          {tab === "popular" && (
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl bg-white border border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
              >
                {{ score: "Overall", followers: "Followers", tipCount: "Tip Count", totalTips: "Total Tipped" }[sortBy]}
                <svg className={`w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {sortOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-[0_8px_32px_rgba(8,145,178,0.12)] border border-[var(--card-border)] py-1.5 animate-scale-in z-50">
                  {([["score", "Overall"], ["followers", "Followers"], ["tipCount", "Tip Count"], ["totalTips", "Total Tipped"]] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setSortOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        sortBy === value
                          ? "text-[var(--accent)] font-semibold bg-[rgba(8,145,178,0.06)]"
                          : "text-[var(--foreground)] hover:bg-[rgba(8,145,178,0.04)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
        <div className="text-center py-12 animate-fade-in">
          <svg className="mx-auto mb-3 w-14 h-14 text-[var(--muted)] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
          <p className="text-[var(--muted)]">
            {query ? (
              <>No profiles matching &ldquo;{search.trim()}&rdquo;</>
            ) : (
              <>No profiles yet. Be the first to{" "}
              <a href="/edit" className="text-[var(--accent)] font-medium">create one</a>!</>
            )}
          </p>
        </div>
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
