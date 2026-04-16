"use client";

import { detectPlatform } from "@/lib/platforms";

type Props = {
  url: string;
  label: string;
  index?: number;
  themed?: boolean;
};

const iconColors: Record<string, { bg: string; text: string; hoverBorder: string }> = {
  twitter: { bg: "bg-purple-50", text: "text-[#8b5cf6]", hoverBorder: "hover:border-purple-200" },
  github: { bg: "bg-gray-100", text: "text-gray-700", hoverBorder: "hover:border-gray-300" },
  instagram: { bg: "bg-pink-50", text: "text-pink-500", hoverBorder: "hover:border-pink-200" },
  youtube: { bg: "bg-red-50", text: "text-red-500", hoverBorder: "hover:border-red-200" },
  linkedin: { bg: "bg-blue-50", text: "text-blue-600", hoverBorder: "hover:border-blue-200" },
  discord: { bg: "bg-indigo-50", text: "text-indigo-500", hoverBorder: "hover:border-indigo-200" },
  telegram: { bg: "bg-sky-50", text: "text-sky-500", hoverBorder: "hover:border-sky-200" },
  tiktok: { bg: "bg-gray-100", text: "text-gray-800", hoverBorder: "hover:border-gray-300" },
  website: { bg: "bg-teal-50", text: "text-[#0891b2]", hoverBorder: "hover:border-teal-200" },
};

const defaultColors = { bg: "bg-teal-50", text: "text-[#0891b2]", hoverBorder: "hover:border-teal-200" };

export default function LinkButton({ url, label, index = 0 }: Props) {
  const platform = detectPlatform(url);
  const colors = iconColors[platform.id] || defaultColors;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-fade-in-up w-full flex items-center gap-3 bg-[var(--card)] transition-all duration-180"
      style={{
        animationDelay: `${index * 80}ms`,
        border: '2px solid var(--foreground)',
        borderRadius: '12px',
        boxShadow: '3px 3px 0 var(--foreground)',
        padding: '10px 12px',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translate(-1px, -1px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 var(--foreground)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 var(--foreground)';
      }}
    >
      <div
        className={`w-9 h-9 ${colors.text} flex items-center justify-center flex-shrink-0`}
        style={{ border: '2px solid var(--foreground)', borderRadius: '8px', background: 'var(--surface)' }}
      >
        <span className="text-base">{platform.icon}</span>
      </div>
      <span className="font-heading font-bold text-[var(--foreground)] text-sm truncate" style={{ fontSize: '13px', fontWeight: 800 }}>{label}</span>
    </a>
  );
}
