import { useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View, type GestureResponderEvent } from "react-native";
import { colors, fonts, shadow, spacing } from "@/theme/tokens";
import { formatTime } from "@/lib/format-time";
import { EyebrowLabel } from "./EyebrowLabel";

export interface ScrubberMark {
  id: string;
  time: number;
  active: boolean;
}

const MARK_SNAP_PX = 12;

export function Scrubber({
  headerLabel,
  position,
  duration,
  isPlaying,
  speed,
  marks,
  onSeek,
  onTogglePlay,
  onCycleSpeed,
}: {
  headerLabel: string;
  position: number;
  duration: number;
  isPlaying: boolean;
  speed: number;
  marks: ScrubberMark[];
  onSeek: (seconds: number) => void;
  onTogglePlay: () => void;
  onCycleSpeed: () => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const safeDuration = duration > 0 ? duration : 1;
  const fillPct = Math.max(0, Math.min(100, (position / safeDuration) * 100));

  const trackWidthRef = useRef(trackWidth);
  const durationRef = useRef(safeDuration);
  const marksRef = useRef(marks);
  const onSeekRef = useRef(onSeek);
  trackWidthRef.current = trackWidth;
  durationRef.current = safeDuration;
  marksRef.current = marks;
  onSeekRef.current = onSeek;

  function handleTouch(x: number) {
    const width = trackWidthRef.current;
    if (width <= 0) return;
    const clampedX = Math.max(0, Math.min(width, x));

    const nearestMark = marksRef.current.find((mark) => {
      const markX = (mark.time / durationRef.current) * width;
      return Math.abs(markX - clampedX) <= MARK_SNAP_PX;
    });
    if (nearestMark) {
      onSeekRef.current(nearestMark.time);
      return;
    }

    const ratio = clampedX / width;
    onSeekRef.current(ratio * durationRef.current);
  }


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt: GestureResponderEvent) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt: GestureResponderEvent) => handleTouch(evt.nativeEvent.locationX),
    })
  ).current;

  return (
    <View style={styles.box}>
      <View style={styles.headerRow}>
        <EyebrowLabel>{headerLabel}</EyebrowLabel>
        <Text style={styles.time}>
          {formatTime(position)} <Text style={styles.timeMuted}>/ {formatTime(duration)}</Text>
        </Text>
      </View>

      <View
        style={styles.trackArea}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >

        <View style={styles.trackBg} pointerEvents="none" />
        <View style={[styles.trackFill, { width: `${fillPct}%` }]} pointerEvents="none" />
        <View style={[styles.thumb, { left: `${fillPct}%` }]} pointerEvents="none" />
        <View style={styles.marksRow} pointerEvents="none">
          {marks.map((mark) => (
            <View
              key={mark.id}
              style={[
                styles.mark,
                { left: `${Math.max(0, Math.min(100, (mark.time / safeDuration) * 100))}%` },
                mark.active && styles.markActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.controlsSide}>
          <Pressable onPress={onTogglePlay} style={styles.playButton}>
            <Text style={styles.playLabel}>{isPlaying ? "Pause" : "Play"}</Text>
          </Pressable>
        </View>
        <View style={styles.nudgeRow}>
          <Pressable onPress={() => onSeek(position - 1)} style={styles.nudgeButton} hitSlop={8}>
            <Text style={styles.nudgeLabel}>-1s</Text>
          </Pressable>
          <Pressable onPress={() => onSeek(position + 1)} style={styles.nudgeButton} hitSlop={8}>
            <Text style={styles.nudgeLabel}>+1s</Text>
          </Pressable>
        </View>
        <View style={[styles.controlsSide, styles.controlsSideEnd]}>
          <Pressable onPress={onCycleSpeed} style={styles.speedButton}>
            <Text style={styles.speedLabel}>{speed}×</Text>
          </Pressable>
        </View>
      </View>
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
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  time: { fontFamily: fonts.monoMedium, fontSize: 12, lineHeight: 12, color: colors.textPrimary },
  timeMuted: { color: colors.textMuted },
  trackArea: { height: 40, justifyContent: "center" },
  trackBg: { position: "absolute", left: 0, right: 0, height: 3, backgroundColor: colors.track },
  trackFill: { position: "absolute", left: 0, height: 3, backgroundColor: colors.accent },
  thumb: {
    position: "absolute",
    width: 13,
    height: 13,
    marginLeft: -6.5,
    backgroundColor: colors.accent,
  },
  marksRow: { position: "absolute", left: 0, right: 0, top: 28, height: 7 },
  mark: { position: "absolute", width: 1, height: 7, backgroundColor: colors.dividerStrong },
  markActive: { backgroundColor: colors.accent },
  controlsRow: { flexDirection: "row", alignItems: "center" },
  controlsSide: { flex: 1, flexDirection: "row" },
  controlsSideEnd: { justifyContent: "flex-end" },
  nudgeRow: { flexDirection: "row", gap: 8, marginHorizontal: spacing.md },
  nudgeButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 10,
  },
  nudgeLabel: { fontFamily: fonts.monoMedium, fontSize: 12, letterSpacing: 1.2, color: colors.textSecondary },
  playButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inkLight,
    paddingHorizontal: 22,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  playLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.44,
    textTransform: "uppercase",
    color: colors.inkDark,
  },
  speedButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 14,
  },
  speedLabel: { fontFamily: fonts.monoMedium, fontSize: 12, letterSpacing: 1.2, color: colors.textSecondary },
});
