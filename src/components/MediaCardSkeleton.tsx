import { spacing } from "@/theme/tokens";
import { View, type DimensionValue } from "react-native";
import { PlaceholderBlock } from "./PlaceholderBlock";

export function MediaCardSkeleton({ titleWidth = "70%" }: { titleWidth?: DimensionValue }) {
  return (
    <View style={{ width: 140, gap: spacing.xs }}>
      <View style={{ width: "100%", aspectRatio: 2 / 3 }}>
        <PlaceholderBlock height="100%" />
      </View>
      <PlaceholderBlock height={18} style={{ width: titleWidth }} />
      <PlaceholderBlock height={11} style={{ width: "35%" }} />
    </View>
  );
}
