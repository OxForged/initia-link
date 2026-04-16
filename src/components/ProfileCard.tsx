"use client";

import { type Profile, formatGas } from "@/lib/contract";
import { parseBioTheme, resolveTheme } from "@/lib/themes";
import Avatar from "@/components/Avatar";

type Props = {
  address: string;
  profile: Profile;
  username?: string;
};

const TILTS = ["-1.2deg", "0.5deg", "-0.6deg", "1deg", "-0.8deg", "0.7deg"];

export default function ProfileCard({ address, profile, username }: Props) {
  const displayName = username || `${address.slice(0, 6)}...${address.slice(-4)}`;
  const href = username ? `/${username}` : `/${address}`;
  const { themeId, customColors, cleanBio } = parseBioTheme(profile.bio);
  const theme = resolveTheme(themeId, customColors);
  const initial = (username?.replace(/\.init$/, "")[0] || displayName[0] || "?").toUpperCase();

  // Deterministic tilt based on address
  const tiltIndex = parseInt(address.slice(-2), 16) % TILTS.length;
  const tilt = TILTS[tiltIndex];

  return (
    <a
      href={href}
      className="fizz-card block h-full flex flex-col"
      style={{
        padding: "20px",
        transform: `rotate(${tilt})`,
        transition: "transform 200ms ease, box-shadow 200ms ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) translate(-2px, -2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0 var(--foreground)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${tilt})`;
        (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--foreground)";
      }}
    >
      {/* Mini banner strip */}
      <div
        style={{
          height: "6px",
          borderRadius: "4px",
          background: `linear-gradient(90deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
          marginBottom: "16px",
          border: "2px solid var(--foreground)",
        }}
      />

      {/* Avatar + name row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          style={{
            borderRadius: "50%",
            padding: "2px",
            background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
            border: "2px solid var(--foreground)",
            boxShadow: "3px 3px 0 var(--foreground)",
            flexShrink: 0,
          }}
        >
          <Avatar
            src={profile.avatarUrl}
            initial={initial}
            size={44}
            gradient={theme.gradient}
            alt={displayName}
          />
        </div>
        <div>
          <h3
            className="font-heading"
            style={{ fontWeight: 800, fontSize: "15px", color: "var(--foreground)", letterSpacing: "-0.01em" }}
          >
            {displayName}
          </h3>
          <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "1px" }}>
            {profile.followerCount.toString()} followers
          </p>
        </div>
      </div>

      {/* Bio */}
      {cleanBio && (
        <p
          className="font-heading"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            fontStyle: "italic",
            color: "var(--muted)",
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            marginBottom: "12px",
          }}
        >
          {cleanBio}
        </p>
      )}

      {/* Stats row */}
      <div
        className="mt-auto"
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          borderTop: "2px solid var(--foreground)",
          paddingTop: "12px",
          marginTop: cleanBio ? "0" : "auto",
        }}
      >
        <span
          className="font-heading"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--muted)",
            padding: "3px 8px",
            background: "var(--surface)",
            border: "2px solid var(--foreground)",
            borderRadius: "9999px",
            boxShadow: "2px 2px 0 var(--foreground)",
          }}
        >
          {profile.links.length} links
        </span>
        <span
          className="font-heading"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#8b5cf6",
            padding: "3px 8px",
            background: "rgba(139,92,246,0.08)",
            border: "2px solid var(--foreground)",
            borderRadius: "9999px",
            boxShadow: "2px 2px 0 var(--foreground)",
          }}
        >
          {profile.tipCount} tips
        </span>
        <span
          className="font-heading"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0891b2",
            padding: "3px 8px",
            background: "rgba(8,145,178,0.08)",
            border: "2px solid var(--foreground)",
            borderRadius: "9999px",
            boxShadow: "2px 2px 0 var(--foreground)",
          }}
        >
          {formatGas(profile.totalTips)} GAS tipped
        </span>
      </div>
    </a>
  );
}
