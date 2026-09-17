import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme/tokens";

export function TalkieHeader({ title = "Talkie" }: { title?: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.wordmark}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bgBase,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 34,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
});
