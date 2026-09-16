import { colors, fonts, shadow } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, type GestureResponderEvent } from "react-native";

export function Button({
  children,
  onPress,
  disabled = false,
  onLight = false,
}: {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  onLight?: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        onLight && styles.onLight,
        disabled && styles.disabled,
        pressed &&
          !disabled && {
            transform: [{ translateX: 3 }, { translateY: 3 }],
            boxShadow: `3px 3px 0 ${shadow.color}`,
          },
      ]}
    >
      <Text style={[styles.label, onLight && styles.labelOnLight]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 38,
    backgroundColor: colors.inkLight,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  onLight: { backgroundColor: colors.inkDark },
  disabled: { opacity: 0.4 },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: colors.inkDark,
  },
  labelOnLight: { color: colors.inkLight },
});
