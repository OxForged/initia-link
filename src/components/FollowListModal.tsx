"use client";

import { useState, useEffect, useCallback } from "react";
import { getFollowers, getFollowing } from "@/lib/contract";
import { resolveAddressToUsername } from "@/lib/username";

type Tab = "followers" | "following";

type ResolvedUser = {
  address: string;
  username?: string;
};

type Props = {
  profileOwner: string;
  followerCount: number;
  followingCount: number;
  initialTab: Tab;
  onClose: () => void;
};

const PAGE_SIZE = 20;

export default function FollowListModal({
  profileOwner,
  followerCount,
  followingCount,
  initialTab,
  onClose,
}: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [users, setUsers] = useState<ResolvedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const totalForTab = tab === "followers" ? followerCount : followingCount;

  const fetchPage = useCallback(
    async (currentOffset: number, append: boolean) => {
      setLoading(true);
      try {
        const fetcher = tab === "followers" ? getFollowers : getFollowing;
        const addresses = await fetcher(profileOwner, currentOffset, PAGE_SIZE);

        const resolved = await Promise.all(
          addresses.map(async (addr) => {
            const name = await resolveAddressToUsername(addr).catch(() => null);
            return { address: addr, username: name ? `${name}.init` : undefined };
          })
        );

        setUsers((prev) => (append ? [...prev, ...resolved] : resolved));
        setHasMore(currentOffset + addresses.length < totalForTab);
      } catch {
        setUsers((prev) => (append ? prev : []));
      } finally {
        setLoading(false);
      }
    },
    [tab, profileOwner, totalForTab]
  );

  useEffect(() => {
    setUsers([]);
    setOffset(0);
    fetchPage(0, false);
  }, [tab, fetchPage]);

  function loadMore() {
    const next = offset + PAGE_SIZE;
    setOffset(next);
    fetchPage(next, true);
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.15)] w-full max-w-sm max-h-[70vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex gap-1 bg-[var(--background)] rounded-xl p-1">
            <button
              onClick={() => setTab("followers")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === "followers"
                  ? "bg-white text-[var(--accent)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Followers ({followerCount})
            </button>
            <button
              onClick={() => setTab("following")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === "following"
                  ? "bg-white text-[var(--accent)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Following ({followingCount})
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {totalForTab === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--muted)] text-sm">
                {tab === "followers" ? "No followers yet" : "Not following anyone"}
              </p>
            </div>
          ) : loading && users.length === 0 ? (
            <div className="space-y-2">
              {Array.from({ length: Math.min(totalForTab, 5) }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="skeleton w-9 h-9 rounded-full shrink-0" />
                  <div className="skeleton h-4 w-32 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {users.map((user, i) => (
                  <a
                    key={`${user.address}-${i}`}
                    href={`/${user.username || user.address}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--background)] transition-colors"
                  >
                    <span className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {(user.username || user.address)[0]?.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-[var(--foreground)] truncate">
                      {user.username || `${user.address.slice(0, 8)}...${user.address.slice(-4)}`}
                    </span>
                  </a>
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full mt-3 py-2 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
