"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { getProfile, getFollowing, type Profile, formatEther } from "@/lib/contract";
import { DashboardSkeleton } from "@/components/Skeleton";
import type { Address } from "viem";

export default function DashboardPage() {
  const { isConnected, openConnect, username } = useInterwovenKit();
  const hexAddress = useHexAddress();
  const account = hexAddress as Address | undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [followingList, setFollowingList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    Promise.all([
      getProfile(account),
      getFollowing(account, 0n, 50n),
    ])
      .then(([p, f]) => {
        setProfile(p);
        setFollowingList(f);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [account]);

  if (!isConnected || !account) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <h1
          className="text-3xl font-bold mb-4 text-[var(--foreground)]"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Dashboard
        </h1>
        <p className="text-[var(--muted)] mb-8">Connect your wallet to view your dashboard.</p>
        <button
          onClick={openConnect}
          className="btn-press btn-shimmer gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(244,63,94,0.3)] hover:shadow-[0_8px_28px_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-300"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!profile?.exists) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-4 text-[var(--foreground)]">No Profile Yet</h1>
        <a
          href="/edit"
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          Create your profile
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1
        className="animate-fade-in-up delay-0 text-2xl font-bold mb-2 text-[var(--foreground)]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Dashboard
      </h1>
      {username && (
        <p className="animate-fade-in-up delay-1 text-sm text-[var(--muted)] mb-6">{username}</p>
      )}

      {/* Stat cards with stagger */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="animate-scale-in delay-1 bg-[linear-gradient(135deg,#fff7ed,#fce7f3)] rounded-2xl p-4 text-center hover-pop">
          <p className="text-2xl font-bold text-[var(--foreground)]">{formatEther(profile.totalTips)}</p>
          <p className="text-xs text-[var(--muted)]">INIT Received</p>
        </div>
        <div className="animate-scale-in delay-2 bg-[linear-gradient(135deg,#fce7f3,#fef3c7)] rounded-2xl p-4 text-center hover-pop">
          <p className="text-2xl font-bold text-[var(--foreground)]">{profile.tipCount.toString()}</p>
          <p className="text-xs text-[var(--muted)]">Tips</p>
        </div>
        <div className="animate-scale-in delay-3 bg-[linear-gradient(135deg,#fef3c7,#fff7ed)] rounded-2xl p-4 text-center hover-pop">
          <p className="text-2xl font-bold text-[var(--foreground)]">{profile.followerCount.toString()}</p>
          <p className="text-xs text-[var(--muted)]">Followers</p>
        </div>
      </div>

      <div className="animate-fade-in-up delay-4 flex gap-4 mb-8">
        <a
          href="/edit"
          className="btn-press btn-shimmer gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.35)] hover:scale-105 transition-all duration-300"
        >
          Edit Profile
        </a>
        {username && (
          <a
            href={`/${username}`}
            className="bg-white border-2 border-[#f0d0c0] text-[#666] px-5 py-2 rounded-xl text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
          >
            View Profile
          </a>
        )}
      </div>

      <div className="animate-fade-in-up delay-5">
        <h2
          className="text-lg font-semibold mb-3 text-[var(--foreground)]"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Following ({followingList.length})
        </h2>
        {followingList.length === 0 ? (
          <p className="text-[var(--muted)] text-sm">
            Not following anyone yet.{" "}
            <a href="/discover" className="text-[var(--accent)]">Discover profiles</a>
          </p>
        ) : (
          <div className="space-y-2">
            {followingList.map((addr, i) => (
              <a
                key={addr}
                href={`/${addr}`}
                className="animate-fade-in-up block bg-white border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm hover:shadow-[0_4px_16px_rgba(244,114,182,0.1)] hover:-translate-y-0.5 transition-all duration-200"
                style={{ animationDelay: `${500 + i * 60}ms` }}
              >
                {addr.slice(0, 6)}...{addr.slice(-4)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
