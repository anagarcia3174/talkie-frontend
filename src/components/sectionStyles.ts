
import { StyleSheet } from "react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

export const sectionStyles = StyleSheet.create({
  section: { paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.sm,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 32,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
});
