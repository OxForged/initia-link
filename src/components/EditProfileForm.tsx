"use client";

import { useState } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import { type Profile } from "@/lib/contract";
import { platforms, detectPlatform } from "@/lib/platforms";
import { THEMES, type ThemeId, parseBioTheme, encodeBioTheme } from "@/lib/themes";
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

  const { cleanBio: initialBio, themeId: initialTheme } = parseBioTheme(existingProfile?.bio || "");
  const [bio, setBio] = useState(initialBio);
  const [theme, setTheme] = useState<ThemeId>(initialTheme);
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

    const encodedBio = encodeBioTheme(bio, theme);

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
      toast.error(e.message?.slice(0, 150) || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const selectedTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  // ── Preview Card (shared between desktop sidebar and mobile modal) ──
  const previewCard = (
    <div
      className="bg-white rounded-2xl p-6 text-center transition-all duration-500"
      style={{ boxShadow: `0 4px 24px ${selectedTheme.shadow}` }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover select-none pointer-events-none"
          style={{ border: `3px solid ${selectedTheme.accent}` }}
          draggable="false"
        />
      ) : (
        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})` }}
        >
          ?
        </div>
      )}
      <p className="text-sm text-[#666] mb-4">{bio || "Your bio here..."}</p>
      <div className="flex flex-col gap-2">
        {links
          .filter((l) => l.url.trim())
          .map((l, i) => {
            const platform = detectPlatform(l.url);
            return (
              <div
                key={i}
                className="rounded-xl py-2.5 px-4 text-sm text-white flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})`,
                  opacity: i % 2 === 0 ? 1 : 0.85,
                }}
              >
                <span className="opacity-90">{platform.icon}</span>
                <span className="truncate">{l.label || l.url}</span>
              </div>
            );
          })}
      </div>
      {links.filter((l) => l.url.trim()).length === 0 && (
        <p className="text-xs text-[var(--muted)]">Add links to see them here</p>
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
          <section className="bg-white rounded-2xl border border-[var(--card-border)] p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-4">Identity</h2>

            {/* Avatar with inline preview */}
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover select-none pointer-events-none"
                    style={{ border: `2px solid ${selectedTheme.accent}` }}
                    draggable="false"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})` }}
                  >
                    ?
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium mb-1 text-[var(--muted)]">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#f0f5f7] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm input-glow outline-none"
                  placeholder="https://example.com/avatar.png"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--muted)]">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={280}
                rows={2}
                className="w-full bg-[#f0f5f7] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm input-glow outline-none resize-none"
                placeholder="Tell the world about yourself..."
              />
              <p className="text-xs text-[var(--muted)] mt-0.5 text-right">{bio.length}/280</p>
            </div>
          </section>

          {/* ═══ Section 2: Theme ═══ */}
          <section className="bg-white rounded-2xl border border-[var(--card-border)] p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Theme</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`relative rounded-xl p-2.5 text-center transition-all duration-200 ${
                    theme === t.id
                      ? "scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${t.gradient[0]}15, ${t.gradient[1]}15)`,
                    ...(theme === t.id
                      ? { boxShadow: `0 0 0 2px ${t.accent}, 0 4px 12px ${t.shadow}` }
                      : { border: "1px solid #e5e7eb" }),
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full mx-auto mb-1"
                    style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}
                  />
                  <span className="text-[11px] font-medium text-[var(--foreground)]">{t.label}</span>
                  {theme === t.id && (
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: t.accent }}
                    >
                      <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l4 4 6-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ═══ Section 3: Links ═══ */}
          <section className="bg-white rounded-2xl border border-[var(--card-border)] p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
              Links <span className="normal-case font-normal">({links.length}/10)</span>
            </h2>
            <div className="space-y-3">
              {links.map((link, i) => {
                const activePlatform = platforms.find((p) => p.id === link.platformId) || platforms[platforms.length - 1];
                const isPickerOpen = expandedPicker === i;

                return (
                  <div
                    key={i}
                    className="animate-fade-in-up bg-[#f8fbfc] border border-[var(--card-border)] rounded-xl p-3 transition-shadow duration-200"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Top row: icon + label + delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedPicker(isPickerOpen ? null : i)}
                        title={`${activePlatform.label} (click to change)`}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 gradient-primary text-white shadow-sm hover:scale-110"
                      >
                        {activePlatform.icon}
                      </button>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(i, "label", e.target.value)}
                        className="bg-[#f0f5f7] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm flex-1 min-w-0 input-glow outline-none"
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
                        className="bg-[#f0f5f7] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm w-full input-glow outline-none"
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
                                className={`
                                  w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                                  ${isActive
                                    ? "gradient-primary text-white shadow-[0_2px_8px_rgba(8,145,178,0.3)] scale-110"
                                    : "bg-[#f0f5f7] text-[#999] hover:bg-[#d1e8ed] hover:text-[#0891b2] hover:scale-105"
                                  }
                                `}
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
                className="mt-3 flex items-center gap-2 text-sm text-[#0891b2] hover:text-[var(--accent-hover)] font-medium hover:scale-105 transition-all duration-200 group"
              >
                <span className="w-7 h-7 rounded-lg bg-[#d1e8ed] flex items-center justify-center group-hover:bg-[#0891b2] group-hover:text-white transition-all duration-200">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Add link
              </button>
            )}
          </section>

          {/* ── Submit (sticky on mobile) ── */}
          <div className="sticky bottom-0 z-20 pb-4 pt-3 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent -mx-4 px-4 sm:static sm:bg-none sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0">
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-press btn-shimmer text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})`,
                boxShadow: `0 4px 16px ${selectedTheme.shadow}`,
              }}
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
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Preview</h3>
            {previewCard}
          </div>
        </div>
      </div>

      {/* ── Mobile preview FAB + modal ── */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="fixed bottom-32 right-4 z-30 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.gradient[0]}, ${selectedTheme.gradient[1]})`,
            boxShadow: `0 4px 20px ${selectedTheme.shadow}`,
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
                <h3 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">Preview</h3>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
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
