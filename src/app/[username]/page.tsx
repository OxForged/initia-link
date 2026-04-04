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
import { parseBioTheme, getThemeById } from "@/lib/themes";
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
    return { title: "Profile Not Found | InitiaLink" };
  }

  try {
    const profile = await getProfile(address);
    if (!profile.exists) {
      return { title: "Profile Not Found | InitiaLink" };
    }
    const displayName = await resolveDisplayName(decoded, address);
    const { cleanBio } = parseBioTheme(profile.bio);
    return {
      title: `${displayName} | InitiaLink`,
      description: cleanBio || `Check out ${displayName} on InitiaLink`,
      openGraph: {
        title: `${displayName} | InitiaLink`,
        description: cleanBio || `Check out ${displayName} on InitiaLink`,
        ...(profile.avatarUrl ? { images: [profile.avatarUrl] } : {}),
      },
    };
  } catch {
    return { title: `${decoded} | InitiaLink` };
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
  const { cleanBio, themeId } = parseBioTheme(profile.bio);
  const theme = getThemeById(themeId);
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

          {/* === HERO SECTION === */}
          <div
            className="relative rounded-t-2xl overflow-hidden text-center"
            style={{
              padding: '40px 24px 36px',
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

            {/* Noise */}
            <div className="hero-noise" aria-hidden="true" />

            {/* Orbs */}
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

            {/* Hero content */}
            <div className="relative z-10">
              {/* Avatar with spinning ring */}
              <div className="animate-scale-in mb-4">
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

              {/* Username */}
              <h1
                className="animate-fade-in-up delay-1 font-heading font-bold text-white"
                style={{ fontSize: 26, textShadow: '0 2px 16px rgba(0,0,0,0.12)' }}
              >
                {displayName}
              </h1>

              {/* Bio */}
              {cleanBio && (
                <p className="animate-fade-in-up delay-1 text-white/80 text-sm mt-1">{cleanBio}</p>
              )}

              {/* Follow stats */}
              <div className="animate-fade-in-up delay-2 mt-3">
                <FollowStats
                  profileOwner={address}
                  followerCount={profile.followerCount}
                  followingCount={profile.followingCount}
                  variant="hero"
                />
              </div>

              {/* CTA buttons */}
              <div className="animate-fade-in-up delay-2 flex justify-center gap-2.5 mt-4">
                <TipButton profileOwner={address} variant="hero" />
                <FollowButton profileOwner={address} variant="hero" />
                <EditProfileButton profileOwner={address} variant="hero" />
              </div>
            </div>
          </div>

          {/* === LINKS SECTION === */}
          {profile.links.length > 0 && (
            <div className="profile-section bg-white border-t border-[#e8f1f4]" style={{ padding: '14px 20px' }}>
              <div className="profile-section-label">Links</div>
              <div className="flex flex-col gap-2">
                {profile.links.map((url, i) => (
                  <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} index={i} themed />
                ))}
              </div>
            </div>
          )}

          {/* === ON-CHAIN STATS SECTION === */}
          <div className="profile-section bg-white border-t border-[#e8f1f4]" style={{ padding: '14px 20px' }}>
            <div className="profile-section-label">On-chain</div>
            <div className="flex gap-2">
              <div className="stat-chip teal-bg flex-1" style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)' }}>
                <div className="stat-chip-value font-heading text-[#0891b2]">{formatGas(profile.totalTips)}</div>
                <div className="stat-chip-label">GAS received</div>
              </div>
              <div className="stat-chip purple-bg flex-1" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}>
                <div className="stat-chip-value font-heading text-[#8b5cf6]">{profile.tipCount}</div>
                <div className="stat-chip-label">Tips</div>
              </div>
            </div>
          </div>

          {/* === L1 IDENTITY SECTION === */}
          <div className="profile-section bg-white border-t border-[#e8f1f4]" style={{ padding: '14px 20px' }}>
            <L1IdentityCard initAddress={hexToBech32(address)} variant="compact" />
          </div>

          {/* === FOOTER BAR === */}
          <div
            className="profile-footer bg-white border-t border-[#e8f1f4] flex items-center justify-between"
            style={{ padding: '10px 20px', borderRadius: '0 0 24px 24px' }}
          >
            <div className="text-[10px] text-[#bbb]">On-chain since {createdDate}</div>
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
