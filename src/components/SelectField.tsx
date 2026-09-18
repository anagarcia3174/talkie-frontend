import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

export interface SelectOption {
  label: string;
  value: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View style={styles.field}>
      <Pressable style={styles.control} onPress={() => setOpen(true)}>
        <Text style={styles.value} numberOfLines={1}>
          {current?.label ?? value}
        </Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetLabel}>{label}</Text>
            <ScrollView style={styles.optionList} showsVerticalScrollIndicator={false}>
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={styles.option}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionLabel, opt.value === value && styles.optionActive]}>{opt.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, minWidth: 0 },
  control: {
    height: 48,
    justifyContent: "center",
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.md,
  },
  value: { fontFamily: fonts.body, fontSize: 15, color: colors.textPrimary },
  backdrop: { flex: 1, backgroundColor: "rgba(14, 14, 12, 0.7)", justifyContent: "flex-end" },
  sheet: {
    maxHeight: "60%",
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sheetLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.accent,
  },
  optionList: { flexGrow: 0 },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
  optionLabel: { fontFamily: fonts.body, fontSize: 16, color: colors.textSecondary },
  optionActive: { fontFamily: fonts.bodyMedium, color: colors.accent },
});
