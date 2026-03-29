"use client";

import { useState } from "react";
import FollowListModal from "./FollowListModal";

type Props = {
  profileOwner: string;
  followerCount: number;
  followingCount: number;
};

export default function FollowStats({ profileOwner, followerCount, followingCount }: Props) {
  const [openTab, setOpenTab] = useState<"followers" | "following" | null>(null);

  return (
    <>
      <div className="animate-fade-in-up delay-2 flex justify-center gap-4 text-sm mt-1 mb-4">
        <button
          onClick={() => setOpenTab("followers")}
          className="hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          <b className="text-[var(--foreground)]">{followerCount}</b>{" "}
          <span className="text-[var(--muted)]">followers</span>
        </button>
        <button
          onClick={() => setOpenTab("following")}
          className="hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          <b className="text-[var(--foreground)]">{followingCount}</b>{" "}
          <span className="text-[var(--muted)]">following</span>
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
