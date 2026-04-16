"use client";

import { useState } from "react";
import FollowListModal from "./FollowListModal";

type Props = {
  profileOwner: string;
  followerCount: number;
  followingCount: number;
  variant?: "default" | "hero";
};

export default function FollowStats({ profileOwner, followerCount, followingCount, variant = "default" }: Props) {
  const [openTab, setOpenTab] = useState<"followers" | "following" | null>(null);
  const isHero = variant === "hero";

  return (
    <>
      <div className={`flex justify-center gap-2 ${isHero ? "" : "animate-fade-in-up delay-2 mt-1 mb-4"}`}>
        <button
          onClick={() => setOpenTab("followers")}
          className="cursor-pointer font-heading transition-all duration-180"
          style={isHero ? { color: 'white', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', padding: 0 } : {
            border: '2px solid var(--foreground)',
            borderRadius: '9999px',
            boxShadow: '3px 3px 0 var(--foreground)',
            padding: '6px 14px',
            background: 'var(--card)',
            fontSize: '12px',
            fontWeight: 800,
          }}
          onMouseEnter={e => { if (!isHero) { (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 var(--foreground)'; } }}
          onMouseLeave={e => { if (!isHero) { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 var(--foreground)'; } }}
        >
          <span className={isHero ? "text-white" : "text-[var(--foreground)]"}>{followerCount}</span>{" "}
          <span className={isHero ? "text-white/70" : "text-[var(--muted)]"}>followers</span>
        </button>
        <button
          onClick={() => setOpenTab("following")}
          className="cursor-pointer font-heading transition-all duration-180"
          style={isHero ? { color: 'white', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', padding: 0 } : {
            border: '2px solid var(--foreground)',
            borderRadius: '9999px',
            boxShadow: '3px 3px 0 var(--foreground)',
            padding: '6px 14px',
            background: 'var(--card)',
            fontSize: '12px',
            fontWeight: 800,
          }}
          onMouseEnter={e => { if (!isHero) { (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 var(--foreground)'; } }}
          onMouseLeave={e => { if (!isHero) { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 var(--foreground)'; } }}
        >
          <span className={isHero ? "text-white" : "text-[var(--foreground)]"}>{followingCount}</span>{" "}
          <span className={isHero ? "text-white/70" : "text-[var(--muted)]"}>following</span>
        </button>
      </div>

      {openTab && (
        <FollowListModal
          profileOwner={profileOwner}
          followerCount={followerCount}
          followingCount={followingCount}
          initialTab={openTab}
          onClose={() => setOpenTab(null)}
        />
      )}
    </>
  );
}
