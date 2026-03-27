"use client";

import { type Profile, formatEther } from "@/lib/contract";
import type { Address } from "viem";

type Props = {
  address: Address;
  profile: Profile;
  username?: string;
  index?: number;
};

export default function ProfileCard({ address, profile, username, index = 0 }: Props) {
  const displayName = username || `${address.slice(0, 6)}...${address.slice(-4)}`;
  const href = username ? `/${username}` : `/${address}`;

  return (
    <a
      href={href}
      className="animate-fade-in-up bg-white border border-[var(--card-border)] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(244,114,182,0.15)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#fde8e8]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-lg font-bold text-white ring-2 ring-white/50">
            {displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">{displayName}</h3>
          <p className="text-xs text-[var(--muted)]">
            {profile.followerCount.toString()} followers
          </p>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-[#666] line-clamp-2">{profile.bio}</p>
      )}
      <div className="flex gap-4 mt-3 text-xs text-[var(--muted)]">
        <span>{profile.links.length} links</span>
        <span>{formatEther(profile.totalTips)} INIT tipped</span>
      </div>
    </a>
  );
}
