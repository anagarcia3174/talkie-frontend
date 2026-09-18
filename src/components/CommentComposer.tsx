import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fonts, shadow, spacing } from "@/theme/tokens";
import { EyebrowLabel } from "./EyebrowLabel";

export function CommentComposer({
  label,
  time,
  value,
  onChangeText,
  onSubmit,
  submitLabel,
  pendingLabel,
  isSubmitting = false,
  editable = true,
  requireValue = true,
}: {
  label: string;
  time: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting?: boolean;
  editable?: boolean;
  requireValue?: boolean;
}) {
  const disabled = isSubmitting || (requireValue && value.trim().length === 0);

  function handleChangeText(text: string) {
    if (text.endsWith("\n")) {
      Keyboard.dismiss();
      onChangeText(text.slice(0, -1));
      return;
    }
    onChangeText(text);
  }

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <EyebrowLabel>{label}</EyebrowLabel>
        <Text style={styles.time}>{time}</Text>
      </View>
      <TextInput
        multiline
        numberOfLines={3}
        value={value}
        onChangeText={handleChangeText}
        placeholder="What happens at this moment?"
        placeholderTextColor={colors.textMuted}
        style={[styles.textarea, !editable && styles.textareaDisabled]}
        textAlignVertical="top"
        editable={editable && !isSubmitting}
        returnKeyType="done"
      />
      <Pressable onPress={onSubmit} disabled={disabled} style={[styles.submit, disabled && styles.disabled]}>
        <Text style={styles.submitLabel}>{isSubmitting ? pendingLabel : submitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.bgElevated,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 8 },
  time: { fontFamily: fonts.monoMedium, fontSize: 12, color: colors.accent },
  textarea: {
    width: "100%",
    minHeight: 84,
    backgroundColor: colors.bgBase,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22.5,
    padding: 12,
  },
  textareaDisabled: { opacity: 0.5 },
  submit: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inkLight,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  disabled: { opacity: 0.5 },
  submitLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.56,
    textTransform: "uppercase",
    color: colors.inkDark,
  },
});
