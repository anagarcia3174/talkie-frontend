import { spacing } from "@/theme/tokens";
import { StyleSheet, View } from "react-native";
import { PlaceholderBlock } from "./PlaceholderBlock";

export function MediaDetailSkeleton() {
  return (
    <View style={styles.page}>
      <View style={styles.posterWrap}>
        <PlaceholderBlock height="100%" />
      </View>
      <View style={styles.info}>
        <PlaceholderBlock height={40} style={{ width: "70%" }} />
        <PlaceholderBlock height={14} style={{ width: 140 }} />
        <View style={styles.lines}>
          <PlaceholderBlock height={16} />
          <PlaceholderBlock height={16} />
          <PlaceholderBlock height={16} style={{ width: "60%" }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.lg, gap: spacing.xl },
  posterWrap: { width: "100%", aspectRatio: 2 / 3, maxWidth: 340, alignSelf: "center" },
  info: { gap: spacing.md },
  lines: { gap: spacing.xs },
});
