type Props = {
  url: string;
  label: string;
};

export default function LinkButton({ url, label }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg py-3 px-4 text-sm hover:border-[var(--accent)] transition-colors block text-center"
    >
      {label}
    </a>
  );
}
