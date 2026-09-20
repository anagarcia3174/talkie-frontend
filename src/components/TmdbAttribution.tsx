import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

export function TmdbAttribution() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("@/assets/images/tmdb-logo.svg")}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="TMDB"
      />
      <Text style={styles.notice}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  logo: { width: 100, height: 16 },
  notice: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: colors.textMuted,
  },
});
