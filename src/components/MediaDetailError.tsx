import { colors, fonts, spacing } from "@/theme/tokens";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { errorBoxStyles } from "./TrendingError";

export function MediaDetailError({ message }: { message: string }) {
  return (
    <View style={styles.page}>
      <View style={errorBoxStyles.errorBox}>
        <Text style={errorBoxStyles.message}>{message}</Text>
        <Link href="/" style={styles.link}>
          Back to trending
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.lg },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerStrong,
    paddingBottom: 4,
  },
});
