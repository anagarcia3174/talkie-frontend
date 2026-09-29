import { Pressable, StyleSheet, Text, View } from "react-native";
import { openPrivacyPolicy, openTerms } from "@/lib/support";
import { colors, fonts, spacing } from "@/theme/tokens";

/** Required agreement to the Terms of Service (App Store guideline 1.2). */
export function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(!checked)}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
        style={[styles.box, checked && styles.boxChecked]}
      >
        {checked && <Text style={styles.check}>✓</Text>}
      </Pressable>
      <Text style={styles.label} onPress={() => onChange(!checked)}>
        I agree to the{" "}
        <Text style={styles.link} onPress={openTerms}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text style={styles.link} onPress={openPrivacyPolicy}>
          Privacy Policy
        </Text>
        . Talkie has zero tolerance for objectionable content or abusive users.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginBottom: spacing.xs },
  box: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  check: { fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 16, color: colors.inkDark },
  label: { flex: 1, fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  link: { color: colors.accent, textDecorationLine: "underline" },
});
