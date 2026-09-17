import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme/tokens";

// Minimal top header shown above the tab navigator — just the wordmark,
// mirroring talkie-web's header but without the nav links (those live in
// the tab bar / Profile tab on mobile instead).
export function TalkieHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.wordmark}>Talkie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bgDeepest,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 26,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
});
