"use client";

import { useState, useEffect } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import { useHexAddress } from "@initia/interwovenkit-react";
import { isFollowing as checkIsFollowing } from "@/lib/contract";
import { toast } from "sonner";
import type { Address } from "viem";

type Props = {
  profileOwner: Address;
};

export default function FollowButton({ profileOwner }: Props) {
  const { followProfile, unfollowProfile, isConnected } = useContractWrite();
  const hexAddress = useHexAddress();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check on-chain follow status
  useEffect(() => {
    if (!hexAddress) return;
    checkIsFollowing(hexAddress as Address, profileOwner)
      .then(setFollowing)
      .catch(() => {});
  }, [hexAddress, profileOwner]);

  // Hide if viewing own profile
  if (hexAddress && hexAddress.toLowerCase() === profileOwner.toLowerCase()) return null;

  async function handleToggle() {
    if (!isConnected) { toast.error("Connect wallet first"); return; }
    setLoading(true);
    try {
      if (following) {
        await unfollowProfile(profileOwner);
        setFollowing(false);
        toast.success("Unfollowed");
      } else {
        await followProfile(profileOwner);
        setFollowing(true);
        toast.success("Following!");
      }
    } catch (e: any) {
      toast.error(e.message?.slice(0, 100) || "Follow/unfollow failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`follow-morph btn-press px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:scale-105 min-h-[44px] ${
        following
          ? "following text-white shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)]"
          : "border-2 border-[#0891b2] text-[#0891b2] hover:text-white hover:border-transparent hover:shadow-[0_4px_16px_rgba(8,145,178,0.25)]"
      }`}
    >
      <span className="relative z-[1]">
        {loading ? "..." : following ? "Following" : "Follow"}
      </span>
    </button>
  );
}
