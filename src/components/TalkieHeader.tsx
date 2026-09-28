import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme/tokens";

export function TalkieHeader({
  title = "Talkie",
  right,
}: {
  title?: string;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.wordmark}>{title}</Text>
      {right}
    </View>
  );
}

/** Mono text action for the right side of a TalkieHeader (no icon set in the design system). */
export function HeaderAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" style={styles.action}>
      {({ pressed }) => (
        <Text style={[styles.actionLabel, pressed && styles.actionLabelPressed]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bgBase,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 35,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
  action: { minHeight: 44, justifyContent: "center" },
  actionLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
  actionLabelPressed: { color: colors.accent },
});
