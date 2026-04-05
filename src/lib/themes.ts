export type ThemeId = "teal" | "violet" | "sunset" | "rose" | "ocean" | "emerald" | "midnight" | "lavender" | "amber" | "cherry" | "sky" | "lime" | "custom";

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
  {
    id: "midnight",
    label: "Midnight",
    accent: "#4338ca",
    accentHover: "#3730a3",
    gradient: ["#312e81", "#1e40af"],
    orb1: "#312e81",
    orb2: "#1e40af",
    ring: "#312e81, #1e40af, #312e81",
    cardBorder: "#c7caf5",
    shadow: "rgba(49,46,129,0.25)",
  },
  {
    id: "lavender",
    label: "Lavender",
    accent: "#a78bfa",
    accentHover: "#8b5cf6",
    gradient: ["#a78bfa", "#60a5fa"],
    orb1: "#a78bfa",
    orb2: "#60a5fa",
    ring: "#a78bfa, #60a5fa, #a78bfa",
    cardBorder: "#ddd6fe",
    shadow: "rgba(167,139,250,0.25)",
  },
  {
    id: "amber",
    label: "Amber",
    accent: "#d97706",
    accentHover: "#b45309",
    gradient: ["#d97706", "#f59e0b"],
    orb1: "#d97706",
    orb2: "#f59e0b",
    ring: "#d97706, #f59e0b, #d97706",
    cardBorder: "#fde68a",
    shadow: "rgba(217,119,6,0.25)",
  },
  {
    id: "cherry",
    label: "Cherry",
    accent: "#be123c",
    accentHover: "#9f1239",
    gradient: ["#9f1239", "#e11d48"],
    orb1: "#9f1239",
    orb2: "#e11d48",
    ring: "#9f1239, #e11d48, #9f1239",
    cardBorder: "#fda4af",
    shadow: "rgba(159,18,57,0.25)",
  },
  {
    id: "sky",
    label: "Sky",
    accent: "#0ea5e9",
    accentHover: "#0284c7",
    gradient: ["#38bdf8", "#7dd3fc"],
    orb1: "#38bdf8",
    orb2: "#7dd3fc",
    ring: "#38bdf8, #7dd3fc, #38bdf8",
    cardBorder: "#bae6fd",
    shadow: "rgba(14,165,233,0.25)",
  },
  {
    id: "lime",
    label: "Lime",
    accent: "#65a30d",
    accentHover: "#4d7c0f",
    gradient: ["#65a30d", "#a3e635"],
    orb1: "#65a30d",
    orb2: "#a3e635",
    ring: "#65a30d, #a3e635, #65a30d",
    cardBorder: "#d9f99d",
    shadow: "rgba(101,163,13,0.25)",
  },
];

export const DEFAULT_THEME_ID: ThemeId = "teal";

const THEME_SEPARATOR = "||theme:";

export function getThemeById(id: string): ProfileTheme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/** Build a ProfileTheme from custom hex colors */
export function buildCustomTheme(color1: string, color2: string): ProfileTheme {
  return {
    id: "custom",
    label: "Custom",
    accent: color1,
    accentHover: color1,
    gradient: [color1, color2],
    orb1: color1,
    orb2: color2,
    ring: `${color1}, ${color2}, ${color1}`,
    cardBorder: `${color1}30`,
    shadow: `${color1}40`,
  };
}

/** Extract theme id from bio string. Returns the theme id, clean bio, and custom colors if applicable. */
export function parseBioTheme(bio: string): { cleanBio: string; themeId: ThemeId; customColors?: [string, string] } {
  const idx = bio.lastIndexOf(THEME_SEPARATOR);
  if (idx === -1) return { cleanBio: bio, themeId: DEFAULT_THEME_ID };
  const raw = bio.slice(idx + THEME_SEPARATOR.length).trim();
  const cleanBio = bio.slice(0, idx).trim();

  // Custom format: custom:#hex1:#hex2
  if (raw.startsWith("custom:")) {
    const parts = raw.slice(7).split(":");
    if (parts.length === 2 && parts[0].startsWith("#") && parts[1].startsWith("#")) {
      return { cleanBio, themeId: "custom", customColors: [parts[0], parts[1]] };
    }
    return { cleanBio, themeId: DEFAULT_THEME_ID };
  }

  const themeId = raw as ThemeId;
  const valid = THEMES.some((t) => t.id === themeId);
  return { cleanBio, themeId: valid ? themeId : DEFAULT_THEME_ID };
}

/** Encode theme id into bio string */
export function encodeBioTheme(bio: string, themeId: ThemeId, customColors?: [string, string]): string {
  if (themeId === DEFAULT_THEME_ID) return bio;
  if (themeId === "custom" && customColors) {
    return `${bio}${THEME_SEPARATOR}custom:${customColors[0]}:${customColors[1]}`;
  }
  return `${bio}${THEME_SEPARATOR}${themeId}`;
}

/** Get the resolved theme object (handles custom) */
export function resolveTheme(themeId: ThemeId, customColors?: [string, string]): ProfileTheme {
  if (themeId === "custom" && customColors) {
    return buildCustomTheme(customColors[0], customColors[1]);
  }
  return getThemeById(themeId);
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
