import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { trending } from "@/lib/media";
import { colors } from "@/theme/tokens";
import { Trending } from "@/components/Trending";
import { TrendingSkeleton } from "@/components/TrendingSkeleton";
import { TrendingError } from "@/components/TrendingError";

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["trending"],
    queryFn: trending,
  });

  return (
    <SafeAreaView style={styles.page} edges={[]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <>
            <TrendingSkeleton title="Trending Movies" />
            <TrendingSkeleton title="Trending Shows" />
          </>
        ) : error ? (
          <TrendingError title="Trending" onRetry={() => refetch()} />
        ) : (
          <>
            <Trending title="Trending Movies" items={data?.movies ?? []} />
            <Trending title="Trending Shows" items={data?.shows ?? []} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  content: { paddingBottom: 40 },
});
