import { colors, fonts, spacing } from "@/theme/tokens";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import type { TrendingResult } from "@/lib/types";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlaceholderBlock } from "./PlaceholderBlock";

export function MediaCard({ item }: { item: TrendingResult }) {
  const router = useRouter();
  const poster = tmdbImageUrl(item.poster_path, "w342");
  const path = (item.media_type === "tv" ? `/tv/${item.tmdb_id}` : `/movie/${item.tmdb_id}`) as any;

  return (
    <Pressable style={styles.card} onPress={() => router.push(path)}>
      <View style={styles.posterWrap}>
        {poster ? (
          <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <PlaceholderBlock label="Poster" height="100%" />
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      {item.release_year ? <Text style={styles.year}>{item.release_year}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 140, gap: spacing.xs },
  posterWrap: { width: "100%", aspectRatio: 2 / 3, backgroundColor: colors.surface, overflow: "hidden" },
  title: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.textPrimary },
  year: { fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted },
});
