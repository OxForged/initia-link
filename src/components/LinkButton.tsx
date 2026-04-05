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
      className={`animate-fade-in-up w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-sm ${colors.hoverBorder} hover:shadow-md hover:translate-x-0.5 transition-all duration-200`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
        <span className="text-base sm:text-lg">{platform.icon}</span>
      </div>
      <span className="font-semibold text-[var(--foreground)] text-sm truncate">{label}</span>
    </a>
  );
}
