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

const shadows = [
  "shadow-[0_3px_12px_rgba(244,63,94,0.2)]",
  "shadow-[0_3px_12px_rgba(251,146,60,0.2)]",
  "shadow-[0_3px_12px_rgba(244,114,182,0.2)]",
];

export default function LinkButton({ url, label, index = 0 }: Props) {
  const gradientClass = gradients[index % 3];
  const shadowClass = shadows[index % 3];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full ${gradientClass} rounded-xl py-3 px-4 text-sm text-white font-medium text-center block ${shadowClass} hover:opacity-90 transition-opacity`}
    >
      {label}
    </a>
  );
}
