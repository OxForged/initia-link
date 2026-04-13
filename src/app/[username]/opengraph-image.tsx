import { ImageResponse } from "next/og";
import { resolveUsernameToAddress, resolveAddressToUsername } from "@/lib/username";
import { getProfile, formatGas } from "@/lib/contract";
import { parseBioTheme, resolveTheme } from "@/lib/themes";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function isHexAddress(s: string): boolean {
  return s.startsWith("0x") && s.length === 42;
}

async function isValidImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(2500) });
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return false;
    const len = res.headers.get("content-length");
    if (len && parseInt(len, 10) < 100) return false;
    return true;
  } catch {
    return false;
  }
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);

  let address: string | null = null;
  if (isHexAddress(decoded)) {
    address = decoded;
  } else {
    address = await resolveUsernameToAddress(decoded).catch(() => null);
  }

  if (!address) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f4f9fb, #e0f2fe)", fontFamily: "sans-serif" }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#1a1a1a" }}>Profile Not Found</div>
        </div>
      ),
      { ...size }
    );
  }

  let profile;
  try {
    profile = await getProfile(address);
  } catch {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f4f9fb, #e0f2fe)", fontFamily: "sans-serif" }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#1a1a1a" }}>initiaLink</div>
        </div>
      ),
      { ...size }
    );
  }

  // Resolve display name
  let displayName = decoded;
  if (isHexAddress(decoded)) {
    try {
      const name = await resolveAddressToUsername(address);
      if (name) displayName = `${name}.init`;
    } catch {}
    if (displayName === decoded) displayName = `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  const { themeId, customColors } = parseBioTheme(profile.bio);
  const theme = resolveTheme(themeId, customColors);
  const avatarOk = profile.avatarUrl ? await isValidImage(profile.avatarUrl) : false;
  const initial = (displayName.replace(/\.init$/, "")[0] || "?").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f4f9fb 0%, #e0f2fe 50%, #ede9fe 100%)",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        {/* Left side - profile info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
            {avatarOk ? (
              <img
                src={profile.avatarUrl}
                width={96}
                height={96}
                style={{ borderRadius: "50%", objectFit: "cover", border: `3px solid ${theme.accent}` }}
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {initial}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: "#1a1a1a" }}>{displayName}</div>
              <div style={{ fontSize: 20, color: "#888", marginTop: 4 }}>on initiaLink</div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (() => {
            const { cleanBio } = parseBioTheme(profile.bio);
            return cleanBio ? (
              <div style={{ fontSize: 22, color: "#555", lineHeight: 1.5, marginBottom: 32, maxWidth: 600 }}>
                {cleanBio.length > 120 ? cleanBio.slice(0, 120) + "..." : cleanBio}
              </div>
            ) : null;
          })()}

          {/* Stats */}
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#0891b2" }}>{profile.followerCount}</div>
              <div style={{ fontSize: 16, color: "#888" }}>followers</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#8b5cf6" }}>{formatGas(profile.totalTips)}</div>
              <div style={{ fontSize: 16, color: "#888" }}>GAS tipped</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#0891b2" }}>{profile.links.length}</div>
              <div style={{ fontSize: 16, color: "#888" }}>links</div>
            </div>
          </div>
        </div>

        {/* Bottom right branding */}
        <div style={{ position: "absolute", bottom: 40, right: 60, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>initiaLink</div>
          <div style={{ fontSize: 18, color: "#888" }}>Your on-chain identity</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
