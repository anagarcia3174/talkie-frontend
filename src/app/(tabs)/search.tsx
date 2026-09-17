import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  type DimensionValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { search } from "@/lib/media";
import { colors, fonts, spacing } from "@/theme/tokens";
import { MediaCard } from "@/components/MediaCard";
import { MediaCardSkeleton } from "@/components/MediaCardSkeleton";
import { EyebrowLabel } from "@/components/EyebrowLabel";

const SKELETON_WIDTHS: DimensionValue[] = [
  "80%",
  "60%",
  "70%",
  "50%",
  "75%",
  "65%",
];
const DEBOUNCE_MS = 450;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const trimmedQuery = query.trim();
  const isPending = trimmedQuery.length > 0 && trimmedQuery !== debounced;

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => search(debounced),
    enabled: debounced.length > 0,
  });

  const showSpinnerRow = isPending || (debounced.length > 0 && isLoading);

  return (
    <SafeAreaView style={styles.page} edges={[]}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search movies and shows"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {showSpinnerRow && <EyebrowLabel muted>Searching…</EyebrowLabel>}
      </View>

      {debounced.length === 0 ? null : isLoading ? (
        <FlatList
          data={SKELETON_WIDTHS}
          keyExtractor={(_, i) => String(i)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => <MediaCardSkeleton titleWidth={item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : error ? (
        <View style={styles.statusBox}>
          <EyebrowLabel>Search failed</EyebrowLabel>
        </View>
      ) : data && data.length === 0 ? (
        <View style={styles.statusBox}>
          <EyebrowLabel muted>No results</EyebrowLabel>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.media_type}-${item.tmdb_id}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => <MediaCard item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  searchBar: { padding: spacing.lg, gap: spacing.xs },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  row: { justifyContent: "space-between" },
  statusBox: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
});
