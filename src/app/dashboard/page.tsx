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
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-[var(--muted)] mb-8">Connect your wallet to view your dashboard.</p>
        <button
          onClick={openConnect}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
        <h1 className="text-2xl font-bold mb-4">No Profile Yet</h1>
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
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      {username && (
        <p className="text-sm text-[var(--muted)] mb-6">{username}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{formatEther(profile.totalTips)}</p>
          <p className="text-xs text-[var(--muted)]">INIT Received</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{profile.tipCount.toString()}</p>
          <p className="text-xs text-[var(--muted)]">Tips</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{profile.followerCount.toString()}</p>
          <p className="text-xs text-[var(--muted)]">Followers</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <a
          href="/edit"
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Edit Profile
        </a>
        {username && (
          <a
            href={`/${username}`}
            className="border border-[var(--card-border)] hover:border-[var(--accent)] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Profile
          </a>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Following ({followingList.length})</h2>
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
                className="block bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm hover:border-[var(--accent)] transition-colors"
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
