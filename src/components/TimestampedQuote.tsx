import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/theme/tokens";

export function TimestampedQuote({
  time,
  username,
  active = false,
  onPress,
  onDelete,
  onReport,
  onBlock,
  children,
}: {
  time: string;
  username: string;
  active?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  children: string;
}) {
  return (
    <View style={[styles.item, { borderLeftColor: active ? colors.accent : colors.dividerStrong }]}>
      <Pressable onPress={onPress} style={styles.content}>
        <Text style={[styles.time, active && styles.timeActive]}>{time}</Text>
        <Text style={[styles.username, active && styles.usernameActive]}>{username}</Text>
        <Text style={[styles.body, active && styles.bodyActive]}>{children}</Text>
      </Pressable>
      {onDelete && (
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        </Pressable>
      )}
      {onReport && (
        <Pressable
          onPress={onReport}
          hitSlop={8}
          accessibilityLabel="Report comment"
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        >
          <Ionicons name="flag-outline" size={16} color={colors.textMuted} />
        </Pressable>
      )}
      {onBlock && (
        <Pressable
          onPress={onBlock}
          hitSlop={8}
          accessibilityLabel="Block user"
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        >
          <Ionicons name="ban-outline" size={16} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "flex-start", borderLeftWidth: 2, paddingLeft: 16, gap: 12 },
  content: { flex: 1, gap: 6 },
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
  deleteButton: { padding: 4 },
  deleteButtonPressed: { opacity: 0.5 },
});
