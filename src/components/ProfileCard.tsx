"use client";

import { type Profile, formatGas } from "@/lib/contract";
import { parseBioTheme, resolveTheme } from "@/lib/themes";
import Avatar from "@/components/Avatar";

type Props = {
  address: string;
  profile: Profile;
  username?: string;
};

export default function ProfileCard({ address, profile, username }: Props) {
  const displayName = username || `${address.slice(0, 6)}...${address.slice(-4)}`;
  const href = username ? `/${username}` : `/${address}`;
  const { themeId, customColors } = parseBioTheme(profile.bio);
  const theme = resolveTheme(themeId, customColors);
  const initial = (username?.replace(/\.init$/, "")[0] || displayName[0] || "?").toUpperCase();

  return (
    <a
      href={href}
      className="card-tilt bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] block h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={profile.avatarUrl}
          initial={initial}
          size={48}
          gradient={theme.gradient}
          alt={displayName}
          imgStyle={{ boxShadow: "0 0 0 2px var(--card-border)" }}
        />
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">{displayName}</h3>
          <p className="text-xs text-[var(--muted)]">
            {profile.followerCount} followers
          </p>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{parseBioTheme(profile.bio).cleanBio}</p>
      )}
      <div className="flex gap-4 mt-auto pt-3 text-xs text-[var(--muted)]">
        <span>{profile.links.length} links</span>
        <span>{formatGas(profile.totalTips)} GAS tipped</span>
      </div>
    </a>
  );
}
