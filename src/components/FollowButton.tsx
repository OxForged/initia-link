"use client";

import { useState } from "react";
import { followProfile, unfollowProfile } from "@/lib/contract";
import type { Address } from "viem";

type Props = {
  profileOwner: Address;
  initialFollowing: boolean;
};

export default function FollowButton({ profileOwner, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      if (following) {
        await unfollowProfile(profileOwner);
        setFollowing(false);
      } else {
        await followProfile(profileOwner);
        setFollowing(true);
      }
    } catch (e) {
      console.error("Follow/unfollow failed:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        following
          ? "border border-[var(--card-border)] hover:border-red-500 hover:text-red-400"
          : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
      }`}
    >
      {loading ? "..." : following ? "Unfollow" : "Follow"}
    </button>
  );
}
