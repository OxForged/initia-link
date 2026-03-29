"use client";

import { type ProfileTheme, themeCSSVars } from "@/lib/themes";

type Props = {
  theme: ProfileTheme;
  children: React.ReactNode;
};

export default function ThemedProfileWrapper({ theme, children }: Props) {
  const vars = themeCSSVars(theme);

  return (
    <div style={vars as React.CSSProperties}>
      {children}
    </div>
  );
}
