import { Metadata } from "next";
import { AccAddress } from "@initia/initia.js";
import { resolveUsernameToAddress, resolveAddressToUsername } from "@/lib/username";
import { getProfile, formatGas } from "@/lib/contract";
import LinkButton from "@/components/LinkButton";
import TipButton from "@/components/TipButton";
import FollowButton from "@/components/FollowButton";
import EditProfileButton from "@/components/EditProfileButton";
import ShareButton from "@/components/ShareButton";
import QRButton from "@/components/QRButton";
import L1IdentityCard from "@/components/L1Identity";
import FollowStats from "@/components/FollowStats";
import ThemedProfileWrapper from "@/components/ThemedProfileWrapper";
import { parseBioTheme, resolveTheme } from "@/lib/themes";
type Props = {
  params: Promise<{ username: string }>;
};

function isHexAddress(s: string): boolean {
  return s.startsWith("0x") && s.length === 42;
}

function hexToBech32(hex: string): string {
  try {
    return AccAddress.fromHex(hex.replace("0x", ""));
  } catch {
    return "";
  }
}

async function resolveAddress(username: string): Promise<string | null> {
  if (isHexAddress(username)) {
    return username;
  }
  return await resolveUsernameToAddress(username).catch(() => null);
}

async function resolveDisplayName(decoded: string, address: string): Promise<string> {
  if (!isHexAddress(decoded)) return decoded;
  try {
    const name = await resolveAddressToUsername(address);
    if (name) return `${name}.init`;
  } catch {}
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  const address = await resolveAddress(decoded);

  if (!address) {
    return { title: "Profile Not Found | initiaLink" };
  }

  try {
    const profile = await getProfile(address);
    if (!profile.exists) {
      return { title: "Profile Not Found | initiaLink" };
    }
    const displayName = await resolveDisplayName(decoded, address);
    const { cleanBio } = parseBioTheme(profile.bio);
    return {
      title: `${displayName} | initiaLink`,
      description: cleanBio || `Check out ${displayName} on initiaLink`,
      openGraph: {
        title: `${displayName} | initiaLink`,
        description: cleanBio || `Check out ${displayName} on initiaLink`,
        ...(profile.avatarUrl ? { images: [profile.avatarUrl] } : {}),
      },
    };
  } catch {
    return { title: `${decoded} | initiaLink` };
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  const address = await resolveAddress(decoded);

  if (!address) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Profile Not Found</h1>
        <p className="text-[var(--muted)]">Could not resolve &quot;{decoded}&quot; to an address.</p>
      </div>
    );
  }

  let profile;
  try {
    profile = await getProfile(address);
  } catch {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Error Loading Profile</h1>
        <p className="text-[var(--muted)]">Could not fetch profile data. Make sure the appchain is running.</p>
      </div>
    );
  }

  if (!profile.exists) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">No Profile</h1>
        <p className="text-[var(--muted)]">This address has not created a profile yet.</p>
      </div>
    );
  }

  const displayName = await resolveDisplayName(decoded, address);
  const { cleanBio, themeId, customColors } = parseBioTheme(profile.bio);
  const theme = resolveTheme(themeId, customColors);
  const createdDate = new Date(Number(profile.createdAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <ThemedProfileWrapper theme={theme}>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Unified profile block */}
        <div className="profile-block rounded-2xl overflow-visible" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          {/* === BANNER (avatar only) === */}
          <div
            className="relative rounded-t-2xl overflow-hidden text-center"
            style={{
              padding: '32px 24px 20px',
              background: `linear-gradient(165deg, var(--theme-gradient-from, #0891b2) 0%, var(--theme-gradient-to, #8b5cf6) 100%)`,
            }}
          >
            {/* Mesh overlay */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6,182,212,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 85% 15%, rgba(139,92,246,0.4) 0%, transparent 70%)`,
              }}
            />
            <div className="hero-noise" aria-hidden="true" />
            <div
              className="hero-orb"
              style={{ width: 120, height: 120, background: 'rgba(6,182,212,0.22)', top: -20, left: -15, animation: 'heroFloat1 8s ease-in-out infinite' }}
              aria-hidden="true"
            />
            <div
              className="hero-orb"
              style={{ width: 90, height: 90, background: 'rgba(167,139,250,0.18)', bottom: 0, right: 5, animation: 'heroFloat2 10s ease-in-out infinite' }}
              aria-hidden="true"
            />

            {/* Avatar only in banner */}
            <div className="relative z-10">
              <div className="animate-scale-in">
                <div className="hero-avatar-ring">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={displayName}
                      className="w-[98px] h-[98px] rounded-full object-cover select-none pointer-events-none"
                      style={{ border: '3px solid rgba(255,255,255,0.2)' }}
                      draggable="false"
                    />
                  ) : (
                    <div
                      className="w-[98px] h-[98px] rounded-full"
                      style={{ background: `linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))`, border: '3px solid rgba(255,255,255,0.2)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* === IDENTITY SECTION === */}
          <div className="bg-[var(--card)] text-center" style={{ padding: '16px 24px 18px' }}>
            {/* Username - large and prominent */}
            <h1
              className="animate-fade-in-up delay-1 font-heading font-bold text-[var(--foreground)]"
              style={{ fontSize: 28, letterSpacing: '-0.5px' }}
            >
              {displayName}
            </h1>

            {/* Bio - muted, smaller, constrained width */}
            {cleanBio && (
              <p className="animate-fade-in-up delay-1 text-[var(--muted)] text-sm mt-2 max-w-xs mx-auto leading-relaxed">{cleanBio}</p>
            )}

            {/* Divider */}
            <div className="mx-auto mt-4 mb-3" style={{ width: 40, height: 2, borderRadius: 1, background: 'linear-gradient(90deg, var(--theme-gradient-from, #0891b2), var(--theme-gradient-to, #8b5cf6))' }} />

            {/* Follow stats */}
            <div>
              <FollowStats
                profileOwner={address}
                followerCount={profile.followerCount}
                followingCount={profile.followingCount}
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-2.5 mt-3">
              <TipButton profileOwner={address} />
              <FollowButton profileOwner={address} />
              <EditProfileButton profileOwner={address} />
            </div>
          </div>

          {/* === LINKS SECTION === */}
          {profile.links.length > 0 && (
            <div className="profile-section bg-[var(--card)] border-t border-[var(--card-border)]" style={{ padding: '14px 20px' }}>
              <div className="profile-section-label">Links</div>
              <div className="flex flex-col gap-2">
                {profile.links.map((url, i) => (
                  <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* === ON-CHAIN + L1 IDENTITY SECTION === */}
          <div className="profile-section bg-[var(--card)] border-t border-[var(--card-border)]" style={{ padding: '14px 20px' }}>
            <div className="profile-section-label">On-chain</div>
            <div className="flex gap-2 mb-3">
              <div className="stat-chip teal-bg flex-1">
                <div className="stat-chip-value font-heading text-[#0891b2]">{formatGas(profile.totalTips)}</div>
                <div className="stat-chip-label">GAS received</div>
              </div>
              <div className="stat-chip purple-bg flex-1">
                <div className="stat-chip-value font-heading text-[#8b5cf6]">{profile.tipCount}</div>
                <div className="stat-chip-label">Tips</div>
              </div>
            </div>
            <L1IdentityCard initAddress={hexToBech32(address)} variant="compact" />
          </div>

          {/* === FOOTER BAR === */}
          <div
            className="profile-footer bg-[var(--card)] border-t border-[var(--card-border)] flex items-center justify-between"
            style={{ padding: '10px 20px', borderRadius: '0 0 24px 24px' }}
          >
            <div className="text-[10px] text-[var(--muted)]">On-chain since {createdDate}</div>
            <div className="flex gap-1.5">
              <ShareButton username={displayName} variant="compact" />
              <QRButton username={displayName} variant="compact" />
            </div>
          </div>

        </div>
      </div>
    </ThemedProfileWrapper>
  );
}
