"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useContractWrite } from "@/hooks/useContractWrite";
import { type Profile } from "@/lib/contract";
import { platforms, detectPlatform } from "@/lib/platforms";
import { THEMES, type ThemeId, parseBioTheme, encodeBioTheme, resolveTheme } from "@/lib/themes";
import Avatar from "@/components/Avatar";
import { toast } from "sonner";

type LinkItem = {
  url: string;
  label: string;
  platformId: string;
};

type Props = {
  existingProfile?: Profile | null;
  onSaved?: () => void;
};

function initPlatformId(url: string): string {
  if (!url) return "website";
  return detectPlatform(url).id;
}

export default function EditProfileForm({ existingProfile, onSaved }: Props) {
  const { createProfile, updateBio, updateAvatar, updateLinks } = useContractWrite();
  const isNew = !existingProfile?.exists;

  const { cleanBio: initialBio, themeId: initialTheme, customColors: initialCustom } = parseBioTheme(existingProfile?.bio || "");
  const [bio, setBio] = useState(initialBio);
  const [theme, setTheme] = useState<ThemeId>(initialTheme);
  const [customColor1, setCustomColor1] = useState(initialCustom?.[0] || "#0891b2");
  const [customColor2, setCustomColor2] = useState(initialCustom?.[1] || "#8b5cf6");
  const [avatarUrl, setAvatarUrl] = useState(existingProfile?.avatarUrl || "");
  const [links, setLinks] = useState<LinkItem[]>(
    existingProfile?.links?.map((url, i) => ({
      url,
      label: existingProfile.linkLabels[i] || "",
      platformId: initPlatformId(url),
    })) || [{ url: "", label: "", platformId: "website" }]
  );
  const [saving, setSaving] = useState(false);
  const [expandedPicker, setExpandedPicker] = useState<number | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState<"color1" | "color2" | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setOpenColorPicker(null);
      }
    }
    if (openColorPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openColorPicker]);

  function addLink() {
    if (links.length >= 10) return;
    setLinks([...links, { url: "", label: "", platformId: "website" }]);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
    if (expandedPicker === index) setExpandedPicker(null);
  }

  function updateLink(index: number, field: keyof LinkItem, value: string) {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "url" && value.trim()) {
      const detected = detectPlatform(value);
      updated[index].platformId = detected.id;
      if (!updated[index].label || platforms.some((p) => p.label === updated[index].label)) {
        updated[index].label = detected.label;
      }
    }

    setLinks(updated);
  }

  function selectPlatform(index: number, platformId: string) {
    const updated = [...links];
    const platform = platforms.find((p) => p.id === platformId)!;
    updated[index] = {
      ...updated[index],
      platformId,
      label: updated[index].label && !platforms.some((p) => p.label === updated[index].label)
        ? updated[index].label
        : platform.label,
    };
    setLinks(updated);
    setExpandedPicker(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const validLinks = links.filter((l) => l.url.trim());
    const urls = validLinks.map((l) => l.url.trim());
    const labels = validLinks.map((l) => l.label.trim() || l.url.trim());

    const encodedBio = encodeBioTheme(bio, theme, theme === "custom" ? [customColor1, customColor2] : undefined);

    try {
      if (isNew) {
        await createProfile(encodedBio, avatarUrl, urls, labels);
        toast.success("Profile created!");
      } else {
        if (encodedBio !== existingProfile?.bio) await updateBio(encodedBio);
        if (avatarUrl !== existingProfile?.avatarUrl) await updateAvatar(avatarUrl);

        const linksChanged =
          JSON.stringify(urls) !== JSON.stringify(existingProfile?.links) ||
          JSON.stringify(labels) !== JSON.stringify(existingProfile?.linkLabels);
        if (linksChanged) await updateLinks(urls, labels);

        toast.success("Profile updated!");
      }
      onSaved?.();
    } catch (e: any) {
      const msg = e.message || "";
      if (msg.includes("0x10003")) {
        toast.error("Bio too long. Keep it under 250 characters (theme data uses the rest).");
      } else if (msg.includes("0x10004")) {
        toast.error("Avatar URL too long.");
      } else if (msg.includes("0x10005")) {
        toast.error("Too many links (max 10).");
      } else if (msg.includes("0x10001")) {
        toast.error("Profile already exists.");
      } else {
        toast.error(msg.slice(0, 150) || "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  }

  const selectedTheme = resolveTheme(theme, theme === "custom" ? [customColor1, customColor2] : undefined);

  // ── Icon color map for preview link buttons ──
  const previewIconColors: Record<string, { bg: string; text: string }> = {
    twitter: { bg: "bg-purple-50", text: "text-[#8b5cf6]" },
    github: { bg: "bg-gray-100", text: "text-gray-700" },
    instagram: { bg: "bg-pink-50", text: "text-pink-500" },
    youtube: { bg: "bg-red-50", text: "text-red-500" },
    linkedin: { bg: "bg-blue-50", text: "text-blue-600" },
    discord: { bg: "bg-indigo-50", text: "text-indigo-500" },
    telegram: { bg: "bg-sky-50", text: "text-sky-500" },
    tiktok: { bg: "bg-gray-100", text: "text-gray-800" },
    website: { bg: "bg-teal-50", text: "text-[#0891b2]" },
  };
  const defaultIconColors = { bg: "bg-teal-50", text: "text-[#0891b2]" };

  // ── Preview Card (shared between desktop sidebar and mobile modal) ──
  const previewCard = (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{ border: '2px solid var(--foreground)', boxShadow: '6px 6px 0 var(--foreground)' }}
    >
      {/* Banner gradient (avatar only) */}
      <div
        className="relative text-center overflow-hidden"
        style={{
          padding: '24px 20px 16px',
          background: `linear-gradient(165deg, ${selectedTheme.gradient[0]} 0%, ${selectedTheme.gradient[1]} 100%)`,
          borderRadius: '16px 16px 0 0',
        }}
      >
        <div className="mx-auto" style={{ width: 64 }}>
          <Avatar
            src={avatarUrl || undefined}
            initial={"?"}
            size={64}
            gradient={selectedTheme.gradient}
            alt="avatar"
            imgStyle={{ border: '3px solid rgba(255,255,255,0.3)' }}
          />
        </div>
      </div>

      {/* Identity in white area */}
      <div className="bg-[var(--card)] text-center px-5 pt-3 pb-4">
        <p className="text-sm text-[var(--muted)] mb-3">{bio || "Your bio here..."}</p>
        <div className="flex justify-center gap-2">
          <span
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})` }}
          >
            Tip GAS
          </span>
          <span
            className="px-4 py-1.5 rounded-xl text-xs font-semibold border-2"
            style={{ borderColor: selectedTheme.accent, color: selectedTheme.accent }}
          >
            Follow
          </span>
        </div>
      </div>

      {/* Links as icon-box */}
      {links.filter((l) => l.url.trim()).length > 0 && (
        <div className="bg-[var(--card)] px-4 py-3" style={{ borderTop: '2px solid var(--foreground)' }}>
          <div className="flex flex-col gap-1.5">
            {links
              .filter((l) => l.url.trim())
              .map((l, i) => {
                const platform = detectPlatform(l.url);
                const colors = previewIconColors[platform.id] || defaultIconColors;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--card)]"
                    style={{ border: '2px solid var(--foreground)', boxShadow: '2px 2px 0 var(--foreground)' }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{platform.icon}</span>
                    </div>
                    <span className="font-semibold text-[var(--foreground)] text-xs truncate">{l.label || l.url}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {links.filter((l) => l.url.trim()).length === 0 && (
        <div className="bg-[var(--card)] px-4 py-3" style={{ borderTop: '2px solid var(--foreground)' }}>
          <p className="text-xs text-[var(--muted)] text-center">Add links to see them here</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Two-column layout: form left, sticky preview right */}
      <div className="flex gap-8 items-start">
        {/* ── Left column: Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-4">

          {/* ═══ Section 1: Identity ═══ */}
          <section className="bg-[var(--card)] rounded-2xl p-4 sm:p-5" style={{ border: '2px solid var(--foreground)', boxShadow: '4px 4px 0 var(--foreground)' }}>
            <h2 className="font-heading mb-4" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Identity</h2>

            {/* Avatar with inline preview */}
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0">
                <Avatar
                  src={avatarUrl || undefined}
                  initial={"?"}
                  size={48}
                  gradient={selectedTheme.gradient}
                  alt="avatar"
                  imgStyle={{ border: `2px solid ${selectedTheme.accent}` }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="font-heading block mb-1 text-[var(--muted)]" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-[var(--surface)] rounded-lg px-3 py-2 text-sm input-glow outline-none" style={{ border: '2px solid var(--foreground)' }}
                  placeholder="https://example.com/avatar.png"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="font-heading block mb-1 text-[var(--muted)]" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={180}
                rows={2}
                className="w-full bg-[var(--surface)] rounded-lg px-3 py-2 text-sm input-glow outline-none resize-none"
                style={{ border: '2px solid var(--foreground)' }}
                placeholder="Tell the world about yourself..."
              />
              <p className="text-xs text-[var(--muted)] mt-0.5 text-right">{bio.length}/180</p>
            </div>
          </section>

          {/* ═══ Section 2: Theme ═══ */}
          <section className="bg-[var(--card)] rounded-2xl p-4 sm:p-5" style={{ border: '2px solid var(--foreground)', boxShadow: '4px 4px 0 var(--foreground)' }}>
            <h2 className="font-heading mb-3" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Theme</h2>
            {/* Selected theme label */}
            <p className="font-heading mb-2" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>
              {theme === "custom" ? "Custom" : THEMES.find(t => t.id === theme)?.label ?? "Teal"}
            </p>
            <div className="grid grid-cols-7 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.label}
                  onClick={() => setTheme(t.id)}
                  className="relative flex items-center justify-center rounded-xl transition-all duration-150"
                  style={{
                    aspectRatio: "1",
                    background: `linear-gradient(135deg, ${t.gradient[0]}18, ${t.gradient[1]}18)`,
                    border: theme === t.id ? `2px solid ${t.accent}` : '2px solid var(--foreground)',
                    boxShadow: theme === t.id ? `3px 3px 0 ${t.accent}` : '2px 2px 0 var(--foreground)',
                    transform: theme === t.id ? 'translate(-1px, -1px)' : '',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}
                  />
                  {theme === t.id && (
                    <div
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: t.accent, border: '1.5px solid white' }}
                    >
                      <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
              {/* Custom color option */}
              <button
                type="button"
                title="Custom"
                onClick={() => setTheme("custom")}
                className="relative flex items-center justify-center rounded-xl transition-all duration-150"
                style={{
                  aspectRatio: "1",
                  background: theme === "custom"
                    ? `linear-gradient(135deg, ${customColor1}18, ${customColor2}18)`
                    : 'var(--surface)',
                  border: theme === "custom" ? `2px solid ${customColor1}` : '2px solid var(--foreground)',
                  boxShadow: theme === "custom" ? `3px 3px 0 ${customColor1}` : '2px 2px 0 var(--foreground)',
                  transform: theme === "custom" ? 'translate(-1px, -1px)' : '',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: theme === "custom"
                      ? `linear-gradient(135deg, ${customColor1}, ${customColor2})`
                      : "conic-gradient(#ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)",
                  }}
                />
                {theme === "custom" && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: customColor1, border: '1.5px solid white' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
            {/* Custom color pickers — react-colorful inline, no OS modal */}
            {theme === "custom" && (
              <div className="mt-3 p-3 rounded-xl bg-[var(--surface)]" style={{ border: '2px solid var(--foreground)' }} ref={colorPickerRef}>
                <div className="flex items-center gap-3">
                  {/* Color 1 */}
                  <div className="flex items-center gap-2 flex-1 relative">
                    <label className="font-heading text-[var(--muted)] shrink-0" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>From</label>
                    <button
                      type="button"
                      onClick={() => setOpenColorPicker(openColorPicker === "color1" ? null : "color1")}
                      className="w-7 h-7 rounded shrink-0"
                      style={{ background: customColor1, border: '2px solid var(--foreground)', boxShadow: '2px 2px 0 var(--foreground)' }}
                    />
                    <span className="font-mono text-[11px] text-[var(--muted)]">{customColor1}</span>
                    {openColorPicker === "color1" && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-scale-in" style={{ filter: 'drop-shadow(4px 4px 0 var(--foreground))' }}>
                        <div style={{ border: '2px solid var(--foreground)', borderRadius: '12px', overflow: 'hidden' }}>
                          <HexColorPicker color={customColor1} onChange={setCustomColor1} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Color 2 */}
                  <div className="flex items-center gap-2 flex-1 relative">
                    <label className="font-heading text-[var(--muted)] shrink-0" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>To</label>
                    <button
                      type="button"
                      onClick={() => setOpenColorPicker(openColorPicker === "color2" ? null : "color2")}
                      className="w-7 h-7 rounded shrink-0"
                      style={{ background: customColor2, border: '2px solid var(--foreground)', boxShadow: '2px 2px 0 var(--foreground)' }}
                    />
                    <span className="font-mono text-[11px] text-[var(--muted)]">{customColor2}</span>
                    {openColorPicker === "color2" && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-scale-in" style={{ filter: 'drop-shadow(4px 4px 0 var(--foreground))' }}>
                        <div style={{ border: '2px solid var(--foreground)', borderRadius: '12px', overflow: 'hidden' }}>
                          <HexColorPicker color={customColor2} onChange={setCustomColor2} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gradient preview */}
                  <div className="w-12 h-8 rounded shrink-0" style={{ background: `linear-gradient(135deg, ${customColor1}, ${customColor2})`, border: '2px solid var(--foreground)' }} />
                </div>
              </div>
            )}
          </section>

          {/* ═══ Section 3: Links ═══ */}
          <section className="bg-[var(--card)] rounded-2xl p-4 sm:p-5" style={{ border: '2px solid var(--foreground)', boxShadow: '4px 4px 0 var(--foreground)' }}>
            <h2 className="font-heading mb-3" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Links <span className="normal-case font-normal">({links.length}/10)</span>
            </h2>
            <div className="space-y-3">
              {links.map((link, i) => {
                const activePlatform = platforms.find((p) => p.id === link.platformId) || platforms[platforms.length - 1];
                const isPickerOpen = expandedPicker === i;

                return (
                  <div
                    key={i}
                    className="animate-fade-in-up bg-[var(--surface)] rounded-xl p-3"
                    style={{ border: '2px solid var(--foreground)', boxShadow: '3px 3px 0 var(--foreground)' }}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Top row: icon + label + delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedPicker(isPickerOpen ? null : i)}
                        title={`${activePlatform.label} (click to change)`}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 text-white"
                        style={{ background: '#0891b2', border: '2px solid var(--foreground)', boxShadow: '3px 3px 0 var(--foreground)' }}
                      >
                        {activePlatform.icon}
                      </button>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(i, "label", e.target.value)}
                        className="bg-[var(--surface)] rounded-lg px-3 py-2 text-sm flex-1 min-w-0 input-glow outline-none"
                        style={{ border: '2px solid var(--foreground)' }}
                        placeholder="Label"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(i)}
                        className="text-[var(--muted)] hover:text-red-500 w-8 h-8 flex items-center justify-center shrink-0 hover:scale-110 transition-all duration-200"
                        title="Remove link"
                      >
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* URL row: full width */}
                    <div className="mt-2">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(i, "url", e.target.value)}
                        className="bg-[var(--surface)] rounded-lg px-3 py-2 text-sm w-full input-glow outline-none"
                        style={{ border: '2px solid var(--foreground)' }}
                        placeholder={activePlatform.placeholder || "https://..."}
                      />
                    </div>

                    {/* Expandable platform picker */}
                    <div className={`expand-section ${isPickerOpen ? "open" : "closed"}`}>
                      <div>
                        <div className="flex items-center gap-1.5 pt-3 flex-wrap">
                          {platforms.map((p) => {
                            const isActive = link.platformId === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => selectPlatform(i, p.id)}
                                title={p.label}
                                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
                                style={{
                                  background: isActive ? '#0891b2' : 'var(--surface)',
                                  color: isActive ? '#fff' : 'var(--muted)',
                                  border: isActive ? '2px solid var(--foreground)' : '2px solid transparent',
                                  boxShadow: isActive ? '2px 2px 0 var(--foreground)' : 'none',
                                }}
                              >
                                {p.icon}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {links.length < 10 && (
              <button
                type="button"
                onClick={addLink}
                className="btn-fizz btn-fizz-ghost font-heading mt-3 flex items-center gap-2"
                style={{ fontSize: '12px', padding: '8px 14px', boxShadow: '3px 3px 0 var(--foreground)' }}
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add link
              </button>
            )}
          </section>

          {/* ── Submit (sticky on mobile) ── */}
          <div className="sticky bottom-0 z-20 pb-4 pt-3 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent -mx-4 px-4 sm:static sm:bg-none sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0">
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-fizz btn-fizz-primary font-heading disabled:opacity-50"
              style={{ fontSize: '15px', padding: '14px', borderRadius: '12px' }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
                  Saving...
                </span>
              ) : isNew ? "Create Profile" : "Update Profile"}
            </button>
          </div>
        </form>

        {/* ── Right column: Sticky Preview (desktop only) ── */}
        <div className="hidden lg:block w-72 shrink-0 self-start sticky top-24">
          <div>
            <h3 className="font-heading mb-3 text-[var(--muted)]" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Preview</h3>
            {previewCard}
          </div>
        </div>
      </div>

      {/* ── Mobile preview FAB + modal ── */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="fixed bottom-32 right-4 z-30 w-12 h-12 rounded-full text-white flex items-center justify-center transition-transform"
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})`,
            border: "2px solid var(--foreground)",
            boxShadow: "4px 4px 0 var(--foreground)",
          }}
          title="Preview profile"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {showMobilePreview && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={() => setShowMobilePreview(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
            <div
              className="relative bg-[var(--background)] rounded-2xl w-full max-w-sm p-5 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-[var(--muted)]" style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Preview</h3>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {previewCard}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
