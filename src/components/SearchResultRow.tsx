import { colors, fonts, spacing } from "@/theme/tokens";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import type { SearchResult } from "@/lib/types";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlaceholderBlock } from "./PlaceholderBlock";

export function SearchResultRow({ item }: { item: SearchResult }) {
  const router = useRouter();
  const poster = tmdbImageUrl(item.poster_path, "w200");
  const path = ((item.media_type === "tv" ? `/tv/${item.tmdb_id}` : `/movie/${item.tmdb_id}`) + "?from=Search") as any;
  const typeLabel = item.media_type === "tv" ? "Series" : "Movie";
  const meta = [item.release_year, typeLabel].filter(Boolean).join(" · ");

  return (
    <Pressable style={styles.row} onPress={() => router.push(path)}>
      <View style={styles.posterWrap}>
        {poster ? (
          <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <PlaceholderBlock height="100%" />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  posterWrap: { width: 68, aspectRatio: 2 / 3, backgroundColor: colors.surface, overflow: "hidden" },
  info: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 21, color: colors.textPrimary },
  meta: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 11, color: colors.textMuted },
});
