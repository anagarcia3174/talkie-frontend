import { ScrollView, StyleSheet, Text, View, type DimensionValue } from "react-native";
import { EyebrowLabel } from "./EyebrowLabel";
import { MediaCardSkeleton } from "./MediaCardSkeleton";
import { sectionStyles } from "./sectionStyles";
import { spacing } from "@/theme/tokens";

const TITLE_WIDTHS: DimensionValue[] = ["80%", "60%", "70%", "50%", "75%", "65%"];

export function TrendingSkeleton({ title }: { title: string }) {
  return (
    <View style={sectionStyles.section}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.heading}>{title}</Text>
        <EyebrowLabel>Loading</EyebrowLabel>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {TITLE_WIDTHS.map((width, i) => (
          <MediaCardSkeleton key={i} titleWidth={width} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.md },
});
