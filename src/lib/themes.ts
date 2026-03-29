export type ThemeId = "teal" | "violet" | "sunset" | "rose" | "ocean" | "emerald";

export type ProfileTheme = {
  id: ThemeId;
  label: string;
  accent: string;
  accentHover: string;
  gradient: [string, string];
  orb1: string;
  orb2: string;
  ring: string; // conic-gradient stops for avatar ring
  cardBorder: string;
  shadow: string; // rgba for box-shadow
};

export const THEMES: ProfileTheme[] = [
  {
    id: "teal",
    label: "Teal",
    accent: "#0891b2",
    accentHover: "#0e7490",
    gradient: ["#0891b2", "#8b5cf6"],
    orb1: "#0891b2",
    orb2: "#8b5cf6",
    ring: "#0891b2, #8b5cf6, #0891b2",
    cardBorder: "#d1e8ed",
    shadow: "rgba(8,145,178,0.25)",
  },
  {
    id: "violet",
    label: "Violet",
    accent: "#7c3aed",
    accentHover: "#6d28d9",
    gradient: ["#7c3aed", "#ec4899"],
    orb1: "#7c3aed",
    orb2: "#ec4899",
    ring: "#7c3aed, #ec4899, #7c3aed",
    cardBorder: "#e0d4f5",
    shadow: "rgba(124,58,237,0.25)",
  },
  {
    id: "sunset",
    label: "Sunset",
    accent: "#ea580c",
    accentHover: "#c2410c",
    gradient: ["#ea580c", "#eab308"],
    orb1: "#ea580c",
    orb2: "#eab308",
    ring: "#ea580c, #eab308, #ea580c",
    cardBorder: "#f5dcc4",
    shadow: "rgba(234,88,12,0.25)",
  },
  {
    id: "rose",
    label: "Rose",
    accent: "#e11d48",
    accentHover: "#be123c",
    gradient: ["#e11d48", "#f472b6"],
    orb1: "#e11d48",
    orb2: "#f472b6",
    ring: "#e11d48, #f472b6, #e11d48",
    cardBorder: "#f5d0d8",
    shadow: "rgba(225,29,72,0.25)",
  },
  {
    id: "ocean",
    label: "Ocean",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    gradient: ["#2563eb", "#06b6d4"],
    orb1: "#2563eb",
    orb2: "#06b6d4",
    ring: "#2563eb, #06b6d4, #2563eb",
    cardBorder: "#c7d9f5",
    shadow: "rgba(37,99,235,0.25)",
  },
  {
    id: "emerald",
    label: "Emerald",
    accent: "#059669",
    accentHover: "#047857",
    gradient: ["#059669", "#34d399"],
    orb1: "#059669",
    orb2: "#34d399",
    ring: "#059669, #34d399, #059669",
    cardBorder: "#c4eede",
    shadow: "rgba(5,150,105,0.25)",
  },
];

export const DEFAULT_THEME_ID: ThemeId = "teal";

const THEME_SEPARATOR = "||theme:";

export function getThemeById(id: string): ProfileTheme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/** Extract theme id from bio string. Returns the theme id and the clean bio. */
export function parseBioTheme(bio: string): { cleanBio: string; themeId: ThemeId } {
  const idx = bio.lastIndexOf(THEME_SEPARATOR);
  if (idx === -1) return { cleanBio: bio, themeId: DEFAULT_THEME_ID };
  const themeId = bio.slice(idx + THEME_SEPARATOR.length).trim() as ThemeId;
  const cleanBio = bio.slice(0, idx).trim();
  const valid = THEMES.some((t) => t.id === themeId);
  return { cleanBio, themeId: valid ? themeId : DEFAULT_THEME_ID };
}

/** Encode theme id into bio string */
export function encodeBioTheme(bio: string, themeId: ThemeId): string {
  if (themeId === DEFAULT_THEME_ID) return bio;
  return `${bio}${THEME_SEPARATOR}${themeId}`;
}

/** Generate CSS custom properties for a theme */
export function themeCSSVars(theme: ProfileTheme): Record<string, string> {
  return {
    "--theme-accent": theme.accent,
    "--theme-accent-hover": theme.accentHover,
    "--theme-gradient-from": theme.gradient[0],
    "--theme-gradient-to": theme.gradient[1],
    "--theme-orb1": theme.orb1,
    "--theme-orb2": theme.orb2,
    "--theme-ring": theme.ring,
    "--theme-card-border": theme.cardBorder,
    "--theme-shadow": theme.shadow,
  };
}
