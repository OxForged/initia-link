"use client";

import { useState } from "react";
import { createProfile, updateBio, updateAvatar, updateLinks, type Profile } from "@/lib/contract";

type Props = {
  existingProfile?: Profile | null;
  onSaved?: () => void;
};

export default function EditProfileForm({ existingProfile, onSaved }: Props) {
  const isNew = !existingProfile?.exists;

  const [bio, setBio] = useState(existingProfile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(existingProfile?.avatarUrl || "");
  const [links, setLinks] = useState<{ url: string; label: string }[]>(
    existingProfile?.links?.map((url, i) => ({
      url,
      label: existingProfile.linkLabels[i] || "",
    })) || [{ url: "", label: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function addLink() {
    if (links.length >= 10) return;
    setLinks([...links, { url: "", label: "" }]);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: "url" | "label", value: string) {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const validLinks = links.filter((l) => l.url.trim());
    const urls = validLinks.map((l) => l.url.trim());
    const labels = validLinks.map((l) => l.label.trim() || l.url.trim());

    try {
      if (isNew) {
        await createProfile(bio, avatarUrl, urls, labels);
        setStatus("Profile created!");
      } else {
        if (bio !== existingProfile?.bio) await updateBio(bio);
        if (avatarUrl !== existingProfile?.avatarUrl) await updateAvatar(avatarUrl);

        const linksChanged =
          JSON.stringify(urls) !== JSON.stringify(existingProfile?.links) ||
          JSON.stringify(labels) !== JSON.stringify(existingProfile?.linkLabels);
        if (linksChanged) await updateLinks(urls, labels);

        setStatus("Profile updated!");
      }
      onSaved?.();
    } catch (e: any) {
      setStatus(e.message?.slice(0, 150) || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={280}
          rows={3}
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm focus:border-[var(--accent)] outline-none"
          placeholder="Tell the world about yourself..."
        />
        <p className="text-xs text-[var(--muted)] mt-1">{bio.length}/280</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-sm focus:border-[var(--accent)] outline-none"
          placeholder="https://example.com/avatar.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Links (max 10)</label>
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm w-1/3 focus:border-[var(--accent)] outline-none"
                placeholder="Label"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm flex-1 focus:border-[var(--accent)] outline-none"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-[var(--muted)] hover:text-red-400 text-sm px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {links.length < 10 && (
          <button
            type="button"
            onClick={addLink}
            className="mt-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            + Add link
          </button>
        )}
      </div>

      {/* Live Preview */}
      <div>
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 text-center max-w-sm mx-auto">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--accent)] mx-auto mb-3 flex items-center justify-center text-xl font-bold">
              ?
            </div>
          )}
          <p className="text-sm text-[var(--muted)] mb-4">{bio || "Your bio here..."}</p>
          <div className="flex flex-col gap-2">
            {links
              .filter((l) => l.url.trim())
              .map((l, i) => (
                <div
                  key={i}
                  className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg py-2 px-3 text-sm"
                >
                  {l.label || l.url}
                </div>
              ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : isNew ? "Create Profile" : "Update Profile"}
      </button>

      {status && (
        <p className={`text-sm text-center ${status.includes("!") ? "text-green-400" : "text-red-400"}`}>
          {status}
        </p>
      )}
    </form>
  );
}
