export const colors = {
  inkLight: "#f1ede4",
  inkDark: "#1d1c19",
  bgBase: "#1d1c19",
  bgElevated: "#232220",
  bgDeep: "#151412",
  bgDeepest: "#161513",
  accent: "#d79a5c",
  accentHover: "#eab77f",
  surface: "#33322d",
  surfaceActive: "#4a4841",
  textPrimary: "#f1ede4",
  textSecondary: "rgba(241, 237, 228, 0.68)",
  textMuted: "rgba(241, 237, 228, 0.42)",
  divider: "rgba(241, 237, 228, 0.18)",
  dividerStrong: "rgba(241, 237, 228, 0.25)",
} as const;

export const fonts = {
  display: "BigShouldersDisplay_900Black",
  body: "SpaceGrotesk_400Regular",
  bodyMedium: "SpaceGrotesk_500Medium",
  bodyBold: "SpaceGrotesk_700Bold",
  mono: "IBMPlexMono_400Regular",
  monoMedium: "IBMPlexMono_500Medium",
} as const;

export const spacing = { xs: 8, sm: 12, md: 16, lg: 22, xl: 24, xxl: 40 } as const;

export const shadow = { offset: 6, offsetLg: 8, color: "rgba(14, 14, 12, 0.6)" } as const;
