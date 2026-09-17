import { colors, fonts } from "@/theme/tokens";
import { StyleSheet, Text, View, type DimensionValue, type ViewStyle } from "react-native";

export function PlaceholderBlock({
  label,
  height = 240,
  active = false,
  style,
}: {
  label?: string;
  height?: DimensionValue;
  active?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.block, active && styles.active, { height }, style]}>
      {label && <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  active: { backgroundColor: colors.surfaceActive, borderWidth: 2, borderColor: colors.accent },
  label: { fontFamily: fonts.monoMedium, fontSize: 11, letterSpacing: 3.3, textTransform: "uppercase", color: colors.textMuted },
  labelActive: { color: colors.accent },
});
