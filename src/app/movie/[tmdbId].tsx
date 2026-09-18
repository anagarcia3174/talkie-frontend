import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CollapsibleText } from "@/components/CollapsibleText";
import { Comments } from "@/components/Comments";
import { DetailBackLink } from "@/components/DetailBackLink";
import { MediaDetailError } from "@/components/MediaDetailError";
import { MediaDetailSkeleton } from "@/components/MediaDetailSkeleton";
import { PlaceholderBlock } from "@/components/PlaceholderBlock";
import { formatTime } from "@/lib/format-time";
import { getMovie } from "@/lib/media";
import { yearFromDate } from "@/lib/release-date";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { colors, fonts, spacing } from "@/theme/tokens";

export default function MovieDetailScreen() {
  const { tmdbId, from } = useLocalSearchParams<{ tmdbId: string; from?: string }>();
  const id = Number(tmdbId);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const sub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          Platform.OS === "ios" ? (e.duration ?? 250) : 100
        );
      }
    );
    return () => sub.remove();
  }, []);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id),
    enabled: Number.isFinite(id),
  });

  const poster = tmdbImageUrl(movie?.poster_path, "w342");
  const meta = movie
    ? [yearFromDate(movie.release_date), movie.runtime_minutes ? formatTime(movie.runtime_minutes * 60) : null]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <SafeAreaView style={styles.page} edges={["top"]}>
      <DetailBackLink label={from ?? "Back"} />
      {isLoading ? (
        <MediaDetailSkeleton />
      ) : error || !movie ? (
        <MediaDetailError message="Couldn't load this title." />
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.hero}>
            <View style={styles.posterWrap}>
              {poster ? (
                <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} contentFit="cover" />
              ) : (
                <PlaceholderBlock label="Poster" height="100%" />
              )}
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              {meta ? <Text style={styles.meta}>{meta}</Text> : null}
            </View>
          </View>

          {movie.overview ? <CollapsibleText>{movie.overview}</CollapsibleText> : null}

          <Comments
            mediaType="movie"
            tmdbId={id}
            durationSeconds={(movie.runtime_minutes ?? 120) * 60}
            releaseDate={movie.release_date ?? null}
          />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  keyboardAvoiding: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl },
  hero: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  posterWrap: { width: 108, flexShrink: 0, aspectRatio: 2 / 3, backgroundColor: colors.surface, overflow: "hidden" },
  heroInfo: { flex: 1, minWidth: 0, gap: 10 },
  title: { fontFamily: fonts.display, fontSize: 38, lineHeight: 40, textTransform: "uppercase", color: colors.textPrimary },
  meta: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 12, color: colors.textMuted },
});
