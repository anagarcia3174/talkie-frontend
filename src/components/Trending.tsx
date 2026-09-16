import { spacing } from "@/theme/tokens";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { EyebrowLabel } from "./EyebrowLabel";
import { MediaCard } from "./MediaCard";
import { sectionStyles } from "./sectionStyles";
import type { TrendingResult } from "@/lib/types";

export function Trending({ title, items }: { title: string; items: TrendingResult[] }) {
  return (
    <View style={sectionStyles.section}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.heading}>{title}</Text>
        <EyebrowLabel muted>{items.length} titles</EyebrowLabel>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <MediaCard key={`${item.media_type}-${item.tmdb_id}`} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.md },
});
