"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { getProfile, getFollowing, type Profile, formatEther } from "@/lib/contract";
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
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)]">Dashboard</h1>
        <p className="text-[var(--muted)] mb-8">Connect your wallet to view your dashboard.</p>
        <button
          onClick={openConnect}
          className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(244,63,94,0.3)] hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-[var(--muted)] py-16">Loading...</p>;
  }

  if (!profile?.exists) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4 text-[var(--foreground)]">No Profile Yet</h1>
        <a
          href="/edit"
          className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          Create your profile
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Dashboard</h1>
      {username && (
        <p className="text-sm text-[var(--muted)] mb-6">{username}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[linear-gradient(135deg,#fff7ed,#fce7f3)] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">{formatEther(profile.totalTips)}</p>
          <p className="text-xs text-[var(--muted)]">INIT Received</p>
        </div>
        <div className="bg-[linear-gradient(135deg,#fce7f3,#fef3c7)] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">{profile.tipCount.toString()}</p>
          <p className="text-xs text-[var(--muted)]">Tips</p>
        </div>
        <div className="bg-[linear-gradient(135deg,#fef3c7,#fff7ed)] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">{profile.followerCount.toString()}</p>
          <p className="text-xs text-[var(--muted)]">Followers</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <a
          href="/edit"
          className="gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(244,63,94,0.25)] hover:opacity-90 transition-opacity"
        >
          Edit Profile
        </a>
        {username && (
          <a
            href={`/${username}`}
            className="bg-white border-2 border-[#f0d0c0] text-[#666] px-5 py-2 rounded-xl text-sm font-medium hover:border-[var(--accent)] transition-colors"
          >
            View Profile
          </a>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">Following ({followingList.length})</h2>
        {followingList.length === 0 ? (
          <p className="text-[var(--muted)] text-sm">
            Not following anyone yet.{" "}
            <a href="/discover" className="text-[var(--accent)]">Discover profiles</a>
          </p>
        ) : (
          <div className="space-y-2">
            {followingList.map((addr) => (
              <a
                key={addr}
                href={`/${addr}`}
                className="block bg-white border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all"
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
