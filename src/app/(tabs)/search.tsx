import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type DimensionValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { describeApiError } from "@/lib/api-errors";
import { search } from "@/lib/media";
import { colors, fonts, shadow, spacing } from "@/theme/tokens";
import { SearchResultRow } from "@/components/SearchResultRow";
import { SearchResultRowSkeleton } from "@/components/SearchResultRowSkeleton";
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

  const showSearching = isPending || (debounced.length > 0 && isLoading);

  return (
    <SafeAreaView style={styles.page} edges={[]}>
      <View style={styles.searchBar}>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies and shows"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Pressable style={styles.goButton} onPress={() => setDebounced(trimmedQuery)}>
            <Text style={styles.goLabel}>Go</Text>
          </Pressable>
        </View>
        {showSearching && <EyebrowLabel muted>Searching…</EyebrowLabel>}
      </View>

      {debounced.length === 0 ? null : isLoading ? (
        <FlatList
          data={SKELETON_WIDTHS}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <SearchResultRowSkeleton titleWidth={item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : error ? (
        <View style={styles.statusBox}>
          <EyebrowLabel>Search failed</EyebrowLabel>
          <Text style={styles.statusMessage}>{describeApiError(error)}</Text>
        </View>
      ) : data && data.length === 0 ? (
        <View style={styles.noResults}>
          <EyebrowLabel muted>No results</EyebrowLabel>
          <View style={styles.noResultsGlyphBox}>
            <Text style={styles.noResultsGlyph}>0</Text>
          </View>
          <Text style={styles.noResultsMessage}>
            Nothing matched <Text style={styles.noResultsQuery}>{debounced}</Text>. Try a different
            title.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.media_type}-${item.tmdb_id}`}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <EyebrowLabel muted>{data?.length ?? 0} results</EyebrowLabel>
          }
          renderItem={({ item }) => <SearchResultRow item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  searchBar: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: 18,
    gap: spacing.md,
  },
  searchRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
    paddingHorizontal: spacing.md,
  },
  goButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.inkLight,
    boxShadow: `${shadow.offset}px ${shadow.offset}px 0 ${shadow.color}`,
  },
  goLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.inkDark,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: 18,
  },
  statusBox: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
  statusMessage: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22.5, color: colors.textSecondary },
  noResults: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: "flex-start",
    gap: spacing.lg,
  },
  noResultsGlyphBox: {
    width: 96,
    height: 132,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsGlyph: { fontFamily: fonts.mono, fontSize: 22, color: colors.textMuted },
  noResultsMessage: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  noResultsQuery: { color: colors.textPrimary },
});
