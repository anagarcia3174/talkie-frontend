import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

export function DetailBackLink({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress ?? (() => router.back())}
        hitSlop={8}
        style={styles.link}
      >
        <Text style={styles.label}>← {label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.bgBase,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  link: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
});
