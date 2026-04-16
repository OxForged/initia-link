"use client";

import { useState, useEffect, useRef } from "react";
import { getRecentProfiles, getProfile, getTotalProfiles, type Profile } from "@/lib/contract";
import { resolveAddressToUsername } from "@/lib/username";
import ProfileCard from "./ProfileCard";
import { ProfileCardSkeleton } from "./Skeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PAGE_SIZE = 12;

type ProfileData = {
  address: string;
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
      const limit = total > 200 ? 200 : total;
      const addresses = await getRecentProfiles(0, limit);

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
          const scoreA = Number(a.profile.followerCount) * 3 + Number(a.profile.tipCount) * 2 + Number(a.profile.totalTips);
          const scoreB = Number(b.profile.followerCount) * 3 + Number(b.profile.tipCount) * 2 + Number(b.profile.totalTips);
          return scoreB - scoreA;
        })
      : filtered;

  const shown = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    if (sortOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [sortOpen]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, tab, sortBy]);

  return (
    <div>
      {/* Tabs + Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        {/* Tab pill nav */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            style={{
              padding: "4px",
              background: "var(--card)",
              border: "2px solid var(--foreground)",
              borderRadius: "9999px",
              boxShadow: "4px 4px 0 var(--foreground)",
            }}
          >
            {(["new", "popular"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="font-heading"
                style={{
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: tab === t ? "#0891b2" : "transparent",
                  color: tab === t ? "#fff" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 200ms, color 200ms",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "new" ? "New" : "Popular"}
              </button>
            ))}
          </div>

          {/* Sort dropdown (popular only) */}
          {tab === "popular" && (
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="font-heading flex items-center gap-1.5"
                style={{
                  padding: "9px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  background: "var(--card)",
                  border: "2px solid var(--foreground)",
                  borderRadius: "9999px",
                  boxShadow: "3px 3px 0 var(--foreground)",
                  cursor: "pointer",
                  color: "var(--foreground)",
                  transition: "box-shadow 180ms",
                }}
              >
                {{ score: "Overall", followers: "Followers", tipCount: "Tip Count", totalTips: "Total Tipped" }[sortBy]}
                <svg
                  style={{
                    width: "12px",
                    height: "12px",
                    color: "#0891b2",
                    transform: sortOpen ? "rotate(180deg)" : "none",
                    transition: "transform 200ms",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {sortOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-40 py-1.5 animate-scale-in z-50"
                  style={{
                    background: "var(--card)",
                    border: "2px solid var(--foreground)",
                    borderRadius: "14px",
                    boxShadow: "5px 5px 0 var(--foreground)",
                  }}
                >
                  {([["score", "Overall"], ["followers", "Followers"], ["tipCount", "Tip Count"], ["totalTips", "Total Tipped"]] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setSortOpen(false); }}
                      className="font-heading w-full px-4 py-2 text-left"
                      style={{
                        fontSize: "13px",
                        fontWeight: sortBy === value ? 800 : 600,
                        color: sortBy === value ? "#0891b2" : "var(--foreground)",
                        background: sortBy === value ? "rgba(8,145,178,0.06)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username..."
          className="font-heading"
          style={{
            width: "100%",
            maxWidth: "220px",
            padding: "9px 16px",
            fontSize: "13px",
            fontWeight: 600,
            background: "var(--card)",
            border: "2px solid var(--foreground)",
            borderRadius: "9999px",
            boxShadow: "3px 3px 0 var(--foreground)",
            outline: "none",
            color: "var(--foreground)",
            transition: "box-shadow 180ms",
          }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="text-center py-12 animate-fade-in fizz-card"
          style={{ padding: "48px 24px" }}
        >
          <svg
            className="mx-auto mb-3"
            style={{ width: "48px", height: "48px", color: "var(--muted)", opacity: 0.4 }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            {query ? (
              <>No profiles matching &ldquo;{search.trim()}&rdquo;</>
            ) : (
              <>No profiles yet. Be the first to{" "}
                <a href="/edit" style={{ color: "#0891b2", fontWeight: 700 }}>create one</a>!
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shown.map((p, i) => (
              <div
                key={p.address}
                className="scroll-reveal"
                style={{ transitionDelay: `${Math.min(i, 11) * 80}ms` }}
              >
                <ProfileCard address={p.address} profile={p.profile} username={p.username} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn-fizz btn-fizz-ghost font-heading"
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
