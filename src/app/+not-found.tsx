import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/theme/tokens";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.page}>
        <Text style={styles.heading}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          Go to Home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, backgroundColor: colors.bgBase, padding: 24 },
  heading: { fontFamily: fonts.bodyMedium, fontSize: 18, color: colors.textPrimary, textAlign: "center" },
  link: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.accent },
});
