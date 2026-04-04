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
      <div className={`flex justify-center gap-4 text-sm ${isHero ? "" : "animate-fade-in-up delay-2 mt-1 mb-4"}`}>
        <button
          onClick={() => setOpenTab("followers")}
          className={`transition-colors cursor-pointer ${isHero ? "hover:text-white/90" : "hover:text-[var(--accent)]"}`}
        >
          <b className={isHero ? "text-white" : "text-[var(--foreground)]"}>{followerCount}</b>{" "}
          <span className={isHero ? "text-white/70" : "text-[var(--muted)]"}>followers</span>
        </button>
        <button
          onClick={() => setOpenTab("following")}
          className={`transition-colors cursor-pointer ${isHero ? "hover:text-white/90" : "hover:text-[var(--accent)]"}`}
        >
          <b className={isHero ? "text-white" : "text-[var(--foreground)]"}>{followingCount}</b>{" "}
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
