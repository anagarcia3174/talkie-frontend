import { colors, fonts } from "@/theme/tokens";
import { StyleSheet, Text } from "react-native";

export function EyebrowLabel({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <Text style={[styles.eyebrow, muted && styles.muted]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.accent,
  },
  muted: { color: colors.textMuted },
});
