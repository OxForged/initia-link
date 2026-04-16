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
        setTips(t.slice(0, 20));

        const resolved = await Promise.all(
          f.map(async (addr) => {
            const name = await resolveAddressToUsername(addr).catch(() => null);
            return { address: addr, username: name ? `${name}.init` : undefined };
          })
        );
        setFollowingList(resolved);

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
      <div className="text-center py-16 animate-fade-in-up max-w-sm mx-auto">
        <div
          className="fizz-card mb-6 mx-auto"
          style={{ width: "64px", height: "64px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg style={{ width: "28px", height: "28px", color: "var(--muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="2" y="6" width="20" height="12" rx="3" />
            <path d="M12 12h.01M7 12h.01M17 12h.01" strokeLinecap="round" />
          </svg>
        </div>
        <h1
          className="font-heading"
          style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "8px" }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
          Connect your wallet to view your dashboard.
        </p>
        <button onClick={openConnect} className="btn-fizz btn-fizz-primary">
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
      <div className="text-center py-16 animate-fade-in max-w-sm mx-auto">
        <div
          className="fizz-card mb-6 mx-auto"
          style={{ width: "64px", height: "64px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg style={{ width: "28px", height: "28px", color: "var(--muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
        <h1
          className="font-heading"
          style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "8px" }}
        >
          No Profile Yet
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
          Create your profile to start receiving tips and followers.
        </p>
        <a href="/edit" className="btn-fizz btn-fizz-primary">
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

      {/* Header */}
      <div className="mb-8">
        <div
          className="font-heading"
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "4px",
          }}
        >
          Your account
        </div>
        <h1
          className="font-heading animate-fade-in-up delay-0"
          style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}
        >
          Dashboard
        </h1>
        {username && (
          <p
            className="animate-fade-in-up delay-1 font-heading"
            style={{ fontSize: "13px", fontStyle: "italic", color: "var(--muted)", marginTop: "4px", fontWeight: 700 }}
          >
            {username}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { value: formatGas(profile.totalTips), label: "GAS Recv.", color: "#0891b2", rotate: "-1.2deg" },
          { value: profile.tipCount.toString(), label: "Tips", color: "#8b5cf6", rotate: "0.4deg" },
          { value: profile.followerCount.toString(), label: "Followers", color: "#0891b2", rotate: "1.2deg" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="fizz-card animate-scale-in text-center"
            style={{
              padding: "16px 8px",
              transform: `rotate(${stat.rotate})`,
              animationDelay: `${(i + 1) * 80}ms`,
            }}
          >
            <p
              className="font-heading"
              style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900, color: stat.color, letterSpacing: "-0.02em", margin: 0 }}
            >
              {stat.value}
            </p>
            <p
              className="font-heading"
              style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginTop: "4px" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="animate-fade-in-up delay-4 flex flex-col sm:flex-row gap-3 mb-10">
        <a href="/edit" className="btn-fizz btn-fizz-primary" style={{ fontSize: "14px", padding: "12px 20px" }}>
          Edit Profile
        </a>
        {username && (
          <a href={`/${username}`} className="btn-fizz btn-fizz-ghost" style={{ fontSize: "14px", padding: "12px 20px" }}>
            View Profile
          </a>
        )}
      </div>

      {/* Recent Tips */}
      <div className="animate-fade-in-up delay-5 mb-8">
        <div
          className="font-heading"
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "4px",
          }}
        >
          Incoming
        </div>
        <h2
          className="font-heading"
          style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.015em", margin: "0 0 14px" }}
        >
          Recent Tips{" "}
          <em style={{ fontStyle: "italic", color: "#0891b2", fontWeight: 800 }}>({tips.length})</em>
        </h2>

        {tips.length === 0 ? (
          <div
            className="fizz-card text-center"
            style={{ padding: "32px 24px" }}
          >
            <svg
              style={{ width: "40px", height: "40px", color: "var(--muted)", opacity: 0.35, margin: "0 auto 8px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>No tips yet. Share your profile!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {tips.map((tip, i) => (
              <a
                key={`${tip.from}-${tip.timestamp}-${i}`}
                href={`/${tipNames[tip.from.toLowerCase()] || tip.from}`}
                className="animate-fade-in-up"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "var(--card)",
                  border: "2px solid var(--foreground)",
                  borderRadius: "14px",
                  boxShadow: "4px 4px 0 var(--foreground)",
                  textDecoration: "none",
                  animationDelay: `${500 + i * 60}ms`,
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--foreground)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "9px",
                      background: "linear-gradient(135deg, #0891b2, #8b5cf6)",
                      border: "2px solid var(--foreground)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {displayAddr(tip.from)[0]?.toUpperCase()}
                  </div>
                  <span
                    className="font-heading"
                    style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}
                  >
                    {displayAddr(tip.from)}
                  </span>
                </div>
                <span
                  className="font-heading"
                  style={{ fontSize: "13px", fontWeight: 800, color: "#0891b2" }}
                >
                  +{formatGas(tip.amount)} GAS
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Following */}
      <div className="animate-fade-in-up delay-6">
        <div
          className="font-heading"
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "4px",
          }}
        >
          Connections
        </div>
        <h2
          className="font-heading"
          style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.015em", margin: "0 0 14px" }}
        >
          Following{" "}
          <em style={{ fontStyle: "italic", color: "#8b5cf6", fontWeight: 800 }}>({followingList.length})</em>
        </h2>

        {followingList.length === 0 ? (
          <div className="fizz-card text-center" style={{ padding: "32px 24px" }}>
            <svg
              style={{ width: "40px", height: "40px", color: "var(--muted)", opacity: 0.35, margin: "0 auto 8px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
              Not following anyone yet.{" "}
              <a href="/discover" style={{ color: "#0891b2", fontWeight: 700 }}>Discover profiles</a>
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {followingList.map((item, i) => (
              <a
                key={item.address}
                href={`/${item.username || item.address}`}
                className="animate-fade-in-up"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  background: "var(--card)",
                  border: "2px solid var(--foreground)",
                  borderRadius: "14px",
                  boxShadow: "4px 4px 0 var(--foreground)",
                  textDecoration: "none",
                  animationDelay: `${500 + i * 60}ms`,
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--foreground)";
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background: "linear-gradient(135deg, #0891b2, #8b5cf6)",
                    border: "2px solid var(--foreground)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {(item.username || item.address)[0]?.toUpperCase()}
                </div>
                <span
                  className="font-heading"
                  style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}
                >
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
