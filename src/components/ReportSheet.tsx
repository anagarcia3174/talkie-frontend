import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, fonts, shadow, spacing } from "@/theme/tokens";
import type { ReportReason } from "@/lib/types";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate", label: "Inappropriate" },
  { value: "spoiler", label: "Spoiler" },
  { value: "other", label: "Other" },
];

const MAX_DETAIL = 500;

export function ReportSheet({
  visible,
  isSubmitting,
  errorText,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  isSubmitting: boolean;
  errorText: string | null;
  onClose: () => void;
  onSubmit: (reason: ReportReason, detail: string) => void;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (visible) {
      setReason(null);
      setDetail("");
    }
  }, [visible]);

  const disabled = !reason || isSubmitting;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              <Text style={styles.sheetLabel}>Report comment</Text>
              <Text style={styles.help}>Why are you reporting this?</Text>
              <View>
                {REASONS.map((r) => (
                  <Pressable key={r.value} style={styles.option} onPress={() => setReason(r.value)}>
                    <Text style={[styles.optionLabel, r.value === reason && styles.optionActive]}>{r.label}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                value={detail}
                onChangeText={setDetail}
                maxLength={MAX_DETAIL}
                multiline
                placeholder="Tell us more (optional)"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
              {errorText && <Text style={styles.errorText}>{errorText}</Text>}
              <Pressable
                onPress={() => reason && onSubmit(reason, detail.trim())}
                disabled={disabled}
                style={[styles.submit, disabled && styles.disabled]}
              >
                <Text style={styles.submitLabel}>{isSubmitting ? "Sending…" : "Send report"}</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.cancel} disabled={isSubmitting}>
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: "rgba(14, 14, 12, 0.7)", justifyContent: "flex-end" },
  sheet: {
    maxHeight: "90%",
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderColor: colors.divider,
  },
  sheetContent: { padding: spacing.lg, gap: spacing.md },
  sheetLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.accent,
  },
  help: { fontFamily: fonts.body, fontSize: 15, color: colors.textSecondary },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
  optionLabel: { fontFamily: fonts.body, fontSize: 16, color: colors.textSecondary },
  optionActive: { fontFamily: fonts.bodyMedium, color: colors.accent },
  input: {
    minHeight: 72,
    backgroundColor: colors.bgBase,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22.5,
    padding: 12,
  },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.accent },
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
  cancel: { alignItems: "center", paddingVertical: 8 },
  cancelLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textSecondary },
});
