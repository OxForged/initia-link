"use client";

import { useState } from "react";
import { useHexAddress } from "@initia/interwovenkit-react";
import { followProfile, unfollowProfile } from "@/lib/contract";
import type { Address } from "viem";

type Props = {
  profileOwner: Address;
  initialFollowing: boolean;
};

export default function FollowButton({ profileOwner, initialFollowing }: Props) {
  const hexAddress = useHexAddress();
  const account = hexAddress as Address | undefined;
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!account) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowProfile(account, profileOwner);
        setFollowing(false);
      } else {
        await followProfile(account, profileOwner);
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
      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 hover:scale-105 ${
        following
          ? "text-white shadow-[0_2px_10px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.35)]"
          : "border-2 border-[#f472b6] text-[#f472b6] hover:bg-[#f43f5e] hover:text-white hover:border-[#f43f5e] hover:shadow-[0_4px_16px_rgba(244,63,94,0.25)]"
      }`}
      style={following ? { background: "linear-gradient(135deg, #f43f5e, #f472b6)" } : undefined}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
