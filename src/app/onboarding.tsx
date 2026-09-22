import { useState, type ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { TimestampedQuote } from "@/components/TimestampedQuote";
import { formatTime } from "@/lib/format-time";
import { getMovie } from "@/lib/media";
import { markOnboardingSeen } from "@/lib/onboarding";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { colors, fonts, shadow, spacing } from "@/theme/tokens";

interface Step {
  title: string;
  body: string;
  cta: string;
  visual: ReactNode;
}

const DEMO_MOVIE_ID = 634649;
const FALLBACK_RUNTIME_MINUTES = 148;

const DEMO_COMMENTS = [
  { username: "mara_k", seconds: 548, body: "How'd he catch the brick...isn't he blind?" },
  { username: "webhead", seconds: 4480, body: "My favorite fight scene." },
  { username: "film_fan", seconds: 6900, body: "Andrew finally gets his moment." },
];
const DEMO_POSITION = DEMO_COMMENTS[DEMO_COMMENTS.length - 1].seconds;

const STAGE_MARGIN = 6;
const BUBBLE_OVERLAP = 54;

function posterWidthFor(screenHeight: number) {
  return Math.min(210, Math.max(150, Math.round(screenHeight * 0.235)));
}

function demoPct(duration: number) {
  return Math.min(100, (DEMO_POSITION / duration) * 100);
}

function Bubble({ comment, side, width }: { comment: (typeof DEMO_COMMENTS)[number]; side: "left" | "right"; width: number }) {
  return (
    <View style={[styles.bubble, { width }]}>
      <View style={styles.bubbleMeta}>
        <Text style={styles.bubbleTime}>{formatTime(comment.seconds)}</Text>
        <Text style={styles.bubbleUser}>{comment.username}</Text>
      </View>
      <Text style={styles.bubbleBody}>{comment.body}</Text>
      <View style={[styles.tail, side === "left" ? styles.tailToRight : styles.tailToLeft]} />
    </View>
  );
}

function CommentMomentVisual({ posterUrl }: { posterUrl?: string }) {
  const { width, height } = useWindowDimensions();
  const posterWidth = posterWidthFor(height);
  const posterHeight = posterWidth * 1.5;
  const stageWidth = width - STAGE_MARGIN * 2;
  const bubbleWidth = (stageWidth - posterWidth) / 2 + BUBBLE_OVERLAP;
  const left = DEMO_COMMENTS.filter((_, i) => i % 2 === 1);
  const right = DEMO_COMMENTS.filter((_, i) => i % 2 === 0);

  return (
    <View
      style={[styles.stage, { width: stageWidth, height: posterHeight, marginHorizontal: STAGE_MARGIN - spacing.lg }]}
    >
      <View style={[styles.poster, { width: posterWidth, height: posterHeight }]}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        ) : null}
      </View>
      <View style={[styles.sideColumn, styles.sideColumnLeft, { width: bubbleWidth }]}>
        {left.map((c) => (
          <Bubble key={c.username} comment={c} side="left" width={bubbleWidth} />
        ))}
      </View>
      <View style={[styles.sideColumn, styles.sideColumnRight, { width: bubbleWidth }]}>
        {right.map((c) => (
          <Bubble key={c.username} comment={c} side="right" width={bubbleWidth} />
        ))}
      </View>
    </View>
  );
}

function HowVisual({ duration }: { duration: number }) {
  const pct = demoPct(duration);
  const visible = DEMO_COMMENTS.slice(-2);
  return (
    <View style={styles.howWrap}>
      <View style={styles.playheadBox}>
        <View style={styles.playheadHeader}>
          <EyebrowLabel>Playhead</EyebrowLabel>
          <Text style={styles.playheadTime}>
            {formatTime(DEMO_POSITION)} <Text style={styles.playheadTimeMuted}>/ {formatTime(duration)}</Text>
          </Text>
        </View>
        <View style={styles.trackArea}>
          <View style={styles.trackBg} />
          <View style={[styles.trackFill, { width: `${pct}%` }]} />
          <View style={[styles.thumb, { left: `${pct}%` }]} />
          <View style={styles.marksRow}>
            {[6, 24, 51, 70, pct].map((markPct) => (
              <View
                key={markPct}
                style={[styles.mark, { left: `${markPct}%` }, markPct === pct && styles.markActive]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.quotes}>
        {visible.map((c, i, list) => (
          <TimestampedQuote
            key={c.username}
            time={formatTime(c.seconds)}
            username={c.username}
            active={i === list.length - 1}
          >
            {c.body}
          </TimestampedQuote>
        ))}
      </View>

      <View style={styles.hiddenRow}>
        <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
        <Text style={styles.hiddenText}>Later comments stay hidden</Text>
      </View>
    </View>
  );
}


const GENERIC_REVIEW = { rating: 4, body: "Really enjoyed it overall." };


const WHY_BUBBLES = [
  {
    seconds: 1260,
    body: "That reveal 😭",
    width: 150,
    top: 94,
    left: 30,
    rotate: "-1deg",
    zIndex: 2,
  },
  {
    seconds: 3480,
    body: "I was NOT ready",
    width: 164,
    top: 96,
    right: 20,
    rotate: "2deg",
    zIndex: 2,
  },
  {
    seconds: 4480,
    body: "Best scene",
    width: 136,
    top: 154,
    left: 20,
    rotate: "1deg",
    zIndex: 3,
  },
  {
    seconds: 5040,
    body: "I could watch this scene over and over again.",
    width: 210,
    top: 150,
    left: 145,
    rotate: "-1deg",
    zIndex: 4,
  },
  {
    seconds: 6900,
    body: "I knew it!",
    width: 132,
    top: 212,
    left: 54,
    rotate: "-2deg",
    zIndex: 5,
  },
  {
    seconds: 7620,
    body: "Goosebumps",
    width: 148,
    top: 216,
    right: 20,
    rotate: "2deg",
    zIndex: 5,
  },
];

function WhyVisual() {
  return (
    <View style={styles.whyStage}>
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < GENERIC_REVIEW.rating ? "star" : "star-outline"}
                size={13}
                color={colors.textMuted}
              />
            ))}
          </View>

          <Text style={styles.reviewLabel}>Review</Text>
        </View>

        <Text style={styles.reviewBody}>
          &ldquo;{GENERIC_REVIEW.body}&rdquo;
        </Text>
      </View>

      <View style={styles.whyBubbleField}>
        {WHY_BUBBLES.map((bubble) => (
          <View
            key={bubble.seconds}
            style={[
              styles.whyBubble,
              {
                width: bubble.width,
                top: bubble.top,
                zIndex: bubble.zIndex,
                transform: [{ rotate: bubble.rotate }],
                ...(bubble.left !== undefined
                  ? { left: bubble.left }
                  : { right: bubble.right }),
              },
            ]}
          >
            <Text style={styles.whyBubbleTime}>
              {formatTime(bubble.seconds)}
            </Text>

            <Text style={styles.whyBubbleBody} numberOfLines={2}>
              {bubble.body}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function buildSteps(posterUrl: string | undefined, duration: number): Step[] {
  return [
  {
    title: "Comments\npinned to\nthe scene",
    body: "Every comment is pinned to the exact scene it's about, so you see it right as it's happening.",
    cta: "Next",
    visual: <CommentMomentVisual posterUrl={posterUrl} />,
  },
  {
    title: "Mark your\nplace",
    body: "Slide to where you are in the film or show. Comments appear as you reach each scene, while anything ahead stays hidden.",
    cta: "Next",
    visual: <HowVisual duration={duration} />,
  },
  {
    title: "One review\ncan't say\nit all",
    body: "Movies and shows are full of moments worth discussing. Talkie lets you talk about each one.",
    cta: "Start exploring",
    visual: <WhyVisual />,
  },
  ];
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const { data: movie } = useQuery({
    queryKey: ["movie", DEMO_MOVIE_ID],
    queryFn: () => getMovie(DEMO_MOVIE_ID),
  });
  const duration = (movie?.runtime_minutes ?? FALLBACK_RUNTIME_MINUTES) * 60;
  const steps = buildSteps(tmdbImageUrl(movie?.poster_path, "w342"), duration);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  async function finish() {
    await markOnboardingSeen();
    router.replace("/");
  }

  function back() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    if (isLast) {
      finish();
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <View style={styles.topSide}>
          <Text style={styles.brand}>Talkie</Text>
        </View>
        <Text style={styles.counter}>
          {index + 1} / {steps.length}
        </Text>
        <View style={[styles.topSide, styles.topSideEnd]}>
          <Pressable onPress={finish} style={styles.skip} accessibilityLabel="Skip intro">
            <Text style={styles.skipLabel}>Skip</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, styles.contentTop]}
        showsVerticalScrollIndicator={false}
      >
        {step.visual}
        <View style={styles.copy}>
          <View>
            {step.title.split("\n").map((line, i) => (
              <Text key={line} style={[styles.title, i > 0 && styles.titleNextLine]}>
                {line}
              </Text>
            ))}
          </View>
          <Text style={styles.body}>{step.body}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {index > 0 && (
          <Pressable
            onPress={back}
            accessibilityLabel="Back"
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
        )}
        <View style={styles.flex}>
          <Button onPress={next}>{step.cta}</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { flex: 1, backgroundColor: colors.bgDeep },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.lg,
    paddingRight: 10,
    paddingVertical: spacing.xs,
  },
  topSide: { flex: 1 },
  topSideEnd: { alignItems: "flex-end" },
  brand: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  counter: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    color: colors.accent,
  },
  skip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 12 },
  skipLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  contentTop: {
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  copy: { gap: spacing.md },
  title: {
    fontFamily: fonts.display,
    fontSize: 58,
    lineHeight: 60,
    textTransform: "uppercase",
    color: colors.textPrimary,
    textShadowColor: shadow.color,
    textShadowOffset: { width: shadow.offsetLg, height: shadow.offsetLg },
    textShadowRadius: 0,
  },
  titleNextLine: { marginTop: -11 },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 340,
  },

  footer: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
    paddingBottom: spacing.xl,
  },

  backButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    backgroundColor: "transparent",
  },
  backButtonPressed: { opacity: 0.5 },

  stage: { alignItems: "center" },
  sideColumn: { position: "absolute", top: 0, bottom: 0, gap: spacing.xs },
  sideColumnLeft: { left: 0, justifyContent: "center" },
  sideColumnRight: { right: 0, justifyContent: "space-between", paddingTop: 14, paddingBottom: 26 },
  poster: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: "hidden",
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  bubble: {
    backgroundColor: colors.bgDeep,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
  },
  tail: {
    position: "absolute",
    top: 18,
    width: 11,
    height: 11,
    backgroundColor: colors.bgDeep,
    borderColor: colors.accent,
    transform: [{ rotate: "45deg" }],
  },
  tailToRight: { right: -7, borderTopWidth: 1.5, borderRightWidth: 1.5 },
  tailToLeft: { left: -7, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  bubbleMeta: { flexDirection: "row", flexWrap: "wrap", columnGap: 6, marginBottom: 2 },
  bubbleTime: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 0.2,
    color: colors.accent,
  },
  bubbleUser: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 0.2,
    color: colors.textMuted,
  },
  bubbleBody: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 19, color: colors.textPrimary },

  playheadBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.bgElevated,
    padding: 20,
    gap: spacing.sm,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  playheadHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  playheadTime: { fontFamily: fonts.monoMedium, fontSize: 13, color: colors.textPrimary },
  playheadTimeMuted: { color: colors.textMuted },
  trackArea: { height: 60, justifyContent: "center" },
  trackBg: { position: "absolute", left: 0, right: 0, height: 3, backgroundColor: colors.track },
  trackFill: { position: "absolute", left: 0, height: 3, backgroundColor: colors.accent },
  thumb: {
    position: "absolute",
    width: 15,
    height: 15,
    marginLeft: -7,
    backgroundColor: colors.accent,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  marksRow: { position: "absolute", left: 0, right: 0, top: 42, height: 8 },
  mark: { position: "absolute", width: 1, height: 8, backgroundColor: colors.dividerStrong },
  markActive: { backgroundColor: colors.accent },

  howWrap: { gap: spacing.md },
  quotes: { gap: spacing.md },
  hiddenRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  hiddenText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },

whyStage: {
  height: 270,
  position: "relative",
},

whyBubbleField: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

whyBubble: {
  position: "absolute",
  minHeight: 58,

  backgroundColor: colors.bgDeep,
  borderWidth: 1.5,
  borderColor: colors.accent,
  borderRadius: 15,

  paddingHorizontal: 12,
  paddingVertical: 9,

  justifyContent: "center",
  gap: 3,
},

whyBubbleTime: {
  fontFamily: fonts.monoMedium,
  fontSize: 9,
  letterSpacing: 0.3,
  color: colors.accent,
},

whyBubbleBody: {
  fontFamily: fonts.bodyMedium,
  fontSize: 13,
  lineHeight: 17,
  color: colors.textPrimary,
},
  reviewCard: {
    position: "relative",
    zIndex: 10,
    marginHorizontal: 10,
    gap: spacing.xs,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  starsRow: {
    flexDirection: "row",
    gap: 2,
  },

  reviewLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },

  reviewBody: {
    fontFamily: fonts.body,
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  bubbleField: {
    position: "relative",
    marginTop: -8,
    height: 206,
  },

  miniBubble: {
    position: "absolute",
    zIndex: 1,
    gap: 3,
    backgroundColor: colors.bgDeep,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  miniBubbleTime: {
    fontFamily: fonts.monoMedium,
    fontSize: 9,
    letterSpacing: 0.2,
    color: colors.accent,
  },
  miniBubbleBody: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16, color: colors.textPrimary },
});
