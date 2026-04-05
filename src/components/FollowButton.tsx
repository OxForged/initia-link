"use client";

import { useState, useEffect } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import { useHexAddress } from "@initia/interwovenkit-react";
import { isFollowing as checkIsFollowing } from "@/lib/contract";
import { toast } from "sonner";
type Props = {
  profileOwner: string;
  variant?: "default" | "hero";
};

export default function FollowButton({ profileOwner, variant = "default" }: Props) {
  const { followProfile, unfollowProfile, isConnected } = useContractWrite();
  const hexAddress = useHexAddress();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isHero = variant === "hero";

  // Check on-chain follow status
  useEffect(() => {
    if (!hexAddress) return;
    checkIsFollowing(hexAddress, profileOwner)
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

  if (isHero) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className="btn-hero-solid btn-press px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 min-h-[44px]"
      >
        {loading ? "..." : following ? "Following" : "Follow"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`follow-morph btn-press px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:scale-105 min-h-[44px] ${
        following
          ? "following text-white"
          : "border-2 border-[var(--theme-accent,#0891b2)] text-[var(--theme-accent,#0891b2)] hover:text-white hover:border-transparent"
      }`}
    >
      <span className="relative z-[1]">
        {loading ? "..." : following ? "Following" : "Follow"}
      </span>
    </button>
  );
}
