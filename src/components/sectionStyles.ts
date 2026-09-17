import { StyleSheet } from "react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

export const sectionStyles = StyleSheet.create({
  section: { paddingVertical: spacing.xl, paddingHorizontal: spacing.md, gap: spacing.md },
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
    fontSize: 36,
    lineHeight: 36,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
});
