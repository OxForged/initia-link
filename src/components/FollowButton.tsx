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

  useEffect(() => {
    if (!hexAddress) return;
    checkIsFollowing(hexAddress, profileOwner)
      .then(setFollowing)
      .catch(() => {});
  }, [hexAddress, profileOwner]);

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
        className="btn-fizz font-heading disabled:opacity-50 min-h-[44px]"
      style={{ padding: '10px 20px', fontSize: '13px', background: following ? '#8b5cf6' : 'var(--card)', color: following ? '#fff' : '#8b5cf6', borderColor: 'var(--foreground)', boxShadow: '4px 4px 0 var(--foreground)' }}
      >
        {loading ? "..." : following ? "Following" : "Follow"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="btn-fizz font-heading disabled:opacity-50"
      style={{
        fontSize: "13px",
        padding: "10px 18px",
        background: following ? "#8b5cf6" : "var(--card)",
        color: following ? "#fff" : "#8b5cf6",
        borderColor: "var(--foreground)",
        boxShadow: "4px 4px 0 var(--foreground)",
        transition: "background 200ms, color 200ms, box-shadow 200ms",
      }}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
