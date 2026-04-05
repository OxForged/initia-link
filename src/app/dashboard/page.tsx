"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { getProfile, getFollowing, getTipsReceived, type Profile, type TipEvent, formatGas } from "@/lib/contract";
import { resolveAddressToUsername } from "@/lib/username";
import { DashboardSkeleton } from "@/components/Skeleton";
type ResolvedAddress = {
  address: string;
  username?: string;
};

export default function DashboardPage() {
  const { isConnected, openConnect, username } = useInterwovenKit();
  const hexAddress = useHexAddress();
  const account = hexAddress as string | undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [followingList, setFollowingList] = useState<ResolvedAddress[]>([]);
  const [tips, setTips] = useState<TipEvent[]>([]);
  const [tipNames, setTipNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    Promise.all([
      getProfile(account),
      getFollowing(account, 0, 50),
      getTipsReceived(account),
    ])
      .then(async ([p, f, t]) => {
        setProfile(p);
        setTips(t.slice(0, 20)); // last 20 tips

        // Resolve following usernames
        const resolved = await Promise.all(
          f.map(async (addr) => {
            const name = await resolveAddressToUsername(addr).catch(() => null);
            return { address: addr, username: name ? `${name}.init` : undefined };
          })
        );
        setFollowingList(resolved);

        // Resolve tip sender usernames
        const uniqueAddrs = [...new Set(t.slice(0, 20).map((tip) => tip.from))];
        const names: Record<string, string> = {};
        await Promise.all(
          uniqueAddrs.map(async (addr) => {
            const name = await resolveAddressToUsername(addr).catch(() => null);
            if (name) names[addr.toLowerCase()] = `${name}.init`;
          })
        );
        setTipNames(names);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [account]);

  if (!isConnected || !account) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)] font-heading">
          Dashboard
        </h1>
        <p className="text-[var(--muted)] mb-8">Connect your wallet to view your dashboard.</p>
        <button
          onClick={openConnect}
          className="btn-press btn-shimmer gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300"
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
        <svg className="mx-auto mb-4 w-16 h-16 text-[var(--muted)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)] font-heading">No Profile Yet</h1>
        <p className="text-[var(--muted)] mb-6">Create your profile to start receiving tips and followers.</p>
        <a
          href="/edit"
          className="btn-press btn-shimmer gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:scale-105 transition-all duration-300"
        >
          Create Profile
        </a>
      </div>
    );
  }

  function displayAddr(addr: string) {
    const name = tipNames[addr.toLowerCase()];
    return name || `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="animate-fade-in-up delay-0 text-2xl font-bold mb-2 text-[var(--foreground)] font-heading">
        Dashboard
      </h1>
      {username && (
        <p className="animate-fade-in-up delay-1 text-sm text-[var(--muted)] mb-6">{username}</p>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        <div className="animate-scale-in delay-1 bg-[linear-gradient(135deg,#f4f9fb,#e0f2fe)] rounded-2xl p-3 sm:p-4 text-center hover-pop">
          <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">{formatGas(profile.totalTips)}</p>
          <p className="text-[10px] sm:text-xs text-[var(--muted)]">GAS Received</p>
        </div>
        <div className="animate-scale-in delay-2 bg-[linear-gradient(135deg,#e0f2fe,#ede9fe)] rounded-2xl p-3 sm:p-4 text-center hover-pop">
          <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">{profile.tipCount}</p>
          <p className="text-[10px] sm:text-xs text-[var(--muted)]">Tips</p>
        </div>
        <div className="animate-scale-in delay-3 bg-[linear-gradient(135deg,#ede9fe,#f4f9fb)] rounded-2xl p-3 sm:p-4 text-center hover-pop">
          <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">{profile.followerCount}</p>
          <p className="text-[10px] sm:text-xs text-[var(--muted)]">Followers</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="animate-fade-in-up delay-4 flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
        <a
          href="/edit"
          className="btn-press btn-shimmer gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)] hover:scale-105 transition-all duration-300"
        >
          Edit Profile
        </a>
        {username && (
          <a
            href={`/${username}`}
            className="bg-[var(--card)] border-2 border-[var(--card-border)] text-[var(--text-secondary)] px-5 py-2 rounded-xl text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
          >
            View Profile
          </a>
        )}
      </div>

      {/* Recent Tips */}
      <div className="animate-fade-in-up delay-5 mb-8">
        <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)] font-heading">
          Recent Tips ({tips.length})
        </h2>
        {tips.length === 0 ? (
          <div className="text-center py-6 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]">
            <svg className="mx-auto mb-2 w-10 h-10 text-[var(--muted)] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            <p className="text-[var(--muted)] text-sm">No tips received yet. Share your profile!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tips.map((tip, i) => (
              <a
                key={`${tip.from}-${tip.timestamp}-${i}`}
                href={`/${tipNames[tip.from.toLowerCase()] || tip.from}`}
                className="animate-fade-in-up flex items-center justify-between bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 hover:shadow-[0_4px_16px_rgba(8,145,178,0.1)] hover:-translate-y-0.5 transition-all duration-200"
                style={{ animationDelay: `${500 + i * 60}ms` }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {displayAddr(tip.from)[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm text-[var(--foreground)] font-medium">{displayAddr(tip.from)}</span>
                </div>
                <span className="text-sm font-semibold text-[var(--accent)]">+{formatGas(tip.amount)} GAS</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Following */}
      <div className="animate-fade-in-up delay-6">
        <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)] font-heading">
          Following ({followingList.length})
        </h2>
        {followingList.length === 0 ? (
          <div className="text-center py-6 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]">
            <svg className="mx-auto mb-2 w-10 h-10 text-[var(--muted)] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-[var(--muted)] text-sm">
              Not following anyone yet.{" "}
              <a href="/discover" className="text-[var(--accent)] font-medium">Discover profiles</a>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {followingList.map((item, i) => (
              <a
                key={item.address}
                href={`/${item.username || item.address}`}
                className="animate-fade-in-up flex items-center gap-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 hover:shadow-[0_4px_16px_rgba(8,145,178,0.1)] hover:-translate-y-0.5 transition-all duration-200"
                style={{ animationDelay: `${500 + i * 60}ms` }}
              >
                <span className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {(item.username || item.address)[0]?.toUpperCase()}
                </span>
                <span className="text-sm text-[var(--foreground)] font-medium">
                  {item.username || `${item.address.slice(0, 6)}...${item.address.slice(-4)}`}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
