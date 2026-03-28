"use client";

import { useState } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import { type Profile } from "@/lib/contract";
import { platforms, detectPlatform } from "@/lib/platforms";
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

  const [bio, setBio] = useState(existingProfile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(existingProfile?.avatarUrl || "");
  const [links, setLinks] = useState<LinkItem[]>(
    existingProfile?.links?.map((url, i) => ({
      url,
      label: existingProfile.linkLabels[i] || "",
      platformId: initPlatformId(url),
    })) || [{ url: "", label: "", platformId: "website" }]
  );
  const [saving, setSaving] = useState(false);

  function addLink() {
    if (links.length >= 10) return;
    setLinks([...links, { url: "", label: "", platformId: "website" }]);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const validLinks = links.filter((l) => l.url.trim());
    const urls = validLinks.map((l) => l.url.trim());
    const labels = validLinks.map((l) => l.label.trim() || l.url.trim());

    try {
      if (isNew) {
        await createProfile(bio, avatarUrl, urls, labels);
        toast.success("Profile created!");
      } else {
        if (bio !== existingProfile?.bio) await updateBio(bio);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bio */}
      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={280}
          rows={3}
          className="w-full bg-white border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm input-glow outline-none"
          placeholder="Tell the world about yourself..."
        />
        <p className="text-xs text-[var(--muted)] mt-1">{bio.length}/280</p>
      </div>

      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full bg-white border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm input-glow outline-none"
          placeholder="https://example.com/avatar.png"
        />
      </div>

      {/* Links with icon picker */}
      <div>
        <label className="block text-sm font-medium mb-3 text-[var(--foreground)]">Links (max 10)</label>
        <div className="space-y-4">
          {links.map((link, i) => {
            const activePlatform = platforms.find((p) => p.id === link.platformId);

            return (
              <div
                key={i}
                className="animate-fade-in-up bg-white border border-[var(--card-border)] rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(8,145,178,0.08)] transition-shadow duration-300"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Platform icon picker row */}
                <div className="flex items-center gap-1.5 sm:gap-1.5 mb-3 flex-wrap">
                  {platforms.map((p) => {
                    const isActive = link.platformId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectPlatform(i, p.id)}
                        title={p.label}
                        className={`
                          w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200
                          ${isActive
                            ? "gradient-primary text-white shadow-[0_2px_10px_rgba(8,145,178,0.3)] scale-110"
                            : "bg-[#f0f5f7] text-[#999] hover:bg-[#d1e8ed] hover:text-[#0891b2] hover:scale-105"
                          }
                        `}
                      >
                        {p.icon}
                      </button>
                    );
                  })}
                </div>

                {/* Active platform indicator */}
                {activePlatform && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[11px] font-semibold text-[#0891b2] uppercase tracking-wider">
                      {activePlatform.label}
                    </span>
                  </div>
                )}

                {/* Input fields */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(i, "label", e.target.value)}
                      className="bg-[#f0f5f7] border border-[var(--card-border)] rounded-xl px-3 py-2.5 text-sm w-1/3 sm:w-1/3 input-glow outline-none"
                      placeholder="Label"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      className="bg-[#f0f5f7] border border-[var(--card-border)] rounded-xl px-3 py-2.5 text-sm flex-1 input-glow outline-none"
                      placeholder={activePlatform?.placeholder || "https://..."}
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(i)}
                      className="text-[var(--muted)] hover:text-red-500 text-sm px-2 min-w-[40px] min-h-[40px] flex items-center justify-center hover:scale-110 transition-all duration-200"
                      title="Remove link"
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
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
      </div>

      {/* Live Preview */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-[var(--foreground)]">Preview</h3>
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(8,145,178,0.12)] transition-shadow duration-500">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-[#d1e8ed] select-none pointer-events-none"
              draggable="false"
            />
          ) : (
            <div className="w-16 h-16 rounded-full gradient-animated mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white animate-pulse-glow">
              ?
            </div>
          )}
          <p className="text-sm text-[#666] mb-4">{bio || "Your bio here..."}</p>
          <div className="flex flex-col gap-2">
            {links
              .filter((l) => l.url.trim())
              .map((l, i) => {
                const gradients = ["gradient-primary", "gradient-secondary", "gradient-accent"];
                const platform = detectPlatform(l.url);
                return (
                  <div
                    key={i}
                    className={`${gradients[i % 3]} rounded-xl py-2.5 px-4 text-sm text-white hover-lift flex items-center justify-center gap-2`}
                  >
                    <span className="opacity-90">{platform.icon}</span>
                    <span>{l.label || l.url}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full btn-press btn-shimmer gradient-primary text-white py-3 rounded-xl font-semibold shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
            Saving...
          </span>
        ) : isNew ? "Create Profile" : "Update Profile"}
      </button>

    </form>
  );
}
