import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/theme/tokens";

export function TimestampedQuote({
  time,
  username,
  active = false,
  onPress,
  onLongPress,
  children,
}: {
  time: string;
  username: string;
  active?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  children: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.item, { borderLeftColor: active ? colors.accent : colors.dividerStrong }]}
    >
      <Text style={[styles.time, active && styles.timeActive]}>{time}</Text>
      <Text style={[styles.username, active && styles.usernameActive]}>{username}</Text>
      <Text style={[styles.body, active && styles.bodyActive]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { borderLeftWidth: 2, paddingLeft: 16, gap: 6 },
  time: { fontFamily: fonts.monoMedium, fontSize: 11, letterSpacing: 3.3, color: colors.textMuted },
  timeActive: { color: colors.accent },
  username: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
  usernameActive: { color: colors.accent },
  body: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19.5, color: colors.textSecondaryStrong },
  bodyActive: { color: colors.textPrimary },
});
