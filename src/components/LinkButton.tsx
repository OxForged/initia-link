import { detectPlatform } from "@/lib/platforms";

type Props = {
  url: string;
  label: string;
  index?: number;
};

const gradients = [
  "gradient-primary",
  "gradient-secondary",
  "gradient-accent",
];

const hoverShadows = [
  "hover:shadow-[0_8px_24px_rgba(8,145,178,0.3)]",
  "hover:shadow-[0_8px_24px_rgba(139,92,246,0.3)]",
  "hover:shadow-[0_8px_24px_rgba(8,145,178,0.2)]",
];

const shadows = [
  "shadow-[0_3px_12px_rgba(8,145,178,0.2)]",
  "shadow-[0_3px_12px_rgba(139,92,246,0.2)]",
  "shadow-[0_3px_12px_rgba(8,145,178,0.15)]",
];

export default function LinkButton({ url, label, index = 0 }: Props) {
  const i = index % 3;
  const gradientClass = gradients[i];
  const shadowClass = shadows[i];
  const hoverShadowClass = hoverShadows[i];
  const platform = detectPlatform(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`animate-fade-in-up w-full btn-shimmer ${gradientClass} rounded-xl py-3 px-4 text-sm text-white font-medium flex items-center justify-center gap-2.5 ${shadowClass} ${hoverShadowClass} hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="opacity-90 flex-shrink-0">{platform.icon}</span>
      <span className="truncate">{label}</span>
    </a>
  );
}
