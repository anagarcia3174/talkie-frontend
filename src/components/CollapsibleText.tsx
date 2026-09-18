import { useState } from "react";
import { Pressable, StyleSheet, Text, View, type NativeSyntheticEvent, type TextLayoutEventData } from "react-native";
import { colors, fonts } from "@/theme/tokens";

const COLLAPSED_LINES = 3;

export function CollapsibleText({ children }: { children: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);

  function handleMeasure(e: NativeSyntheticEvent<TextLayoutEventData>) {
    setIsTruncatable(e.nativeEvent.lines.length > COLLAPSED_LINES);
  }

  return (
    <View>
      <Text style={[styles.text, styles.measure]} onTextLayout={handleMeasure}>
        {children}
      </Text>
      <Pressable onPress={() => setExpanded((e) => !e)} disabled={!isTruncatable}>
        <Text style={styles.text} numberOfLines={expanded ? undefined : COLLAPSED_LINES}>
          {children}
        </Text>
        {isTruncatable && <Text style={styles.toggle}>{expanded ? "Show less" : "Show more"}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22.5, color: colors.textSecondary },
  measure: { position: "absolute", left: 0, right: 0, opacity: 0, zIndex: -1 },
  toggle: {
    marginTop: 8,
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.accent,
  },
});
