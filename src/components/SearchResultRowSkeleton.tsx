import { spacing } from "@/theme/tokens";
import { View, type DimensionValue } from "react-native";
import { PlaceholderBlock } from "./PlaceholderBlock";

export function SearchResultRowSkeleton({ titleWidth = "70%" }: { titleWidth?: DimensionValue }) {
  return (
    <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
      <View style={{ width: 68, aspectRatio: 2 / 3 }}>
        <PlaceholderBlock height="100%" />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
        <PlaceholderBlock height={16} style={{ width: titleWidth }} />
        <PlaceholderBlock height={11} style={{ width: "35%" }} />
      </View>
    </View>
  );
}
