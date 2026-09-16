import { colors, fonts, spacing } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EyebrowLabel } from "./EyebrowLabel";
import { sectionStyles } from "./sectionStyles";

export function TrendingError({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <View style={sectionStyles.section}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.heading}>{title}</Text>
        <EyebrowLabel>Error</EyebrowLabel>
      </View>
      <View style={styles.errorBox}>
        <Text style={styles.message}>Failed to load trending media.</Text>
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const errorBoxStyles = StyleSheet.create({
  errorBox: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    padding: spacing.md,
    backgroundColor: colors.bgElevated,
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  message: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.textPrimary },
  retryButton: {
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  retryLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
});
const styles = errorBoxStyles;
