import { useEffect, useRef, useState } from "react";
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
import { SelectField } from "@/components/SelectField";
import { getEpisode, getTVShow } from "@/lib/media";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { colors, fonts, spacing } from "@/theme/tokens";

export default function TVShowScreen() {
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

  const { data: show, isLoading, error } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVShow(id),
    enabled: Number.isFinite(id),
  });

  const [season, setSeason] = useState<number | null>(null);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    if (show && season === null) {
      const defaultSeason = show.seasons.find((s) => s.season_number === 1) ?? show.seasons[0];
      setSeason(defaultSeason?.season_number ?? 1);
    }
  }, [show, season]);

  const currentSeason = show?.seasons.find((s) => s.season_number === season);
  const episodeCount = currentSeason?.episode_count ?? 1;

  const { data: ep, isLoading: episodeLoading } = useQuery({
    queryKey: ["episode", id, season, episode],
    queryFn: () => getEpisode(id, season as number, episode),
    enabled: Number.isFinite(id) && season !== null,
  });

  function handleSeasonChange(value: string) {
    setSeason(Number(value));
    setEpisode(1);
  }

  const poster = tmdbImageUrl(show?.poster_path, "w342");
  const meta = show
    ? [show.first_air_year, `${show.seasons.length} season${show.seasons.length === 1 ? "" : "s"}`]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <SafeAreaView style={styles.page} edges={["top"]}>
      <DetailBackLink label={from ?? "Back"} />
      {isLoading || (show && season === null) ? (
        <MediaDetailSkeleton />
      ) : error || !show ? (
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
              <Text style={styles.title}>{show.name}</Text>
              {meta ? <Text style={styles.meta}>{meta}</Text> : null}
            </View>
          </View>

          {show.overview ? <CollapsibleText>{show.overview}</CollapsibleText> : null}

          <Comments
            key={`${season}-${episode}`}
            mediaType="tv"
            tmdbId={id}
            season={season as number}
            episode={episode}
            durationSeconds={episodeLoading || !ep ? null : (ep.runtime_minutes ?? 50) * 60}
            belowHeader={
              <View style={styles.pickerRow}>
                <SelectField
                  label="Season"
                  value={String(season)}
                  options={show.seasons.map((s) => ({
                    label: `Season ${s.season_number}`,
                    value: String(s.season_number),
                  }))}
                  onChange={handleSeasonChange}
                />
                <SelectField
                  label="Episode"
                  value={String(episode)}
                  options={Array.from({ length: episodeCount }, (_, i) => i + 1).map((n) => ({
                    label: `Episode ${n}`,
                    value: String(n),
                  }))}
                  onChange={(v) => setEpisode(Number(v))}
                />
              </View>
            }
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
  pickerRow: { flexDirection: "row", gap: 10 },
});
