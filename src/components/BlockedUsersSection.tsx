import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { listBlockedUsers, unblockUser } from "@/lib/blocks";
import { describeApiError } from "@/lib/api-errors";
import { colors, fonts, spacing } from "@/theme/tokens";
import { EyebrowLabel } from "@/components/EyebrowLabel";

export function BlockedUsersSection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: blocked, isLoading, error } = useQuery({
    queryKey: ["blocks", user?.id ?? null],
    queryFn: listBlockedUsers,
    enabled: !!user,
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (err) => Alert.alert("Couldn't unblock user", describeApiError(err)),
  });

  return (
    <View style={styles.blockedCard}>
      <EyebrowLabel>Blocked users</EyebrowLabel>
      {isLoading ? (
        <Text style={styles.blockedEmpty}>Loading…</Text>
      ) : error ? (
        <Text style={styles.errorText}>{describeApiError(error)}</Text>
      ) : !blocked || blocked.length === 0 ? (
        <Text style={styles.blockedEmpty}>You haven't blocked anyone.</Text>
      ) : (
        blocked.map((b) => (
          <View key={b.id} style={styles.blockedRow}>
            <Text style={styles.blockedName} numberOfLines={1}>
              {b.username ?? "unknown"}
            </Text>
            <Pressable
              onPress={() => unblockMutation.mutate(b.id)}
              disabled={unblockMutation.isPending}
              style={[styles.editButton, unblockMutation.isPending && styles.disabledButton]}
              hitSlop={8}
            >
              <Text style={styles.editButtonLabel}>Unblock</Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  blockedCard: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.bgElevated,
    padding: spacing.lg,
    gap: spacing.md,
  },
  blockedEmpty: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  blockedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  blockedName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.accent },
  editButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    paddingHorizontal: 18,
    flexShrink: 0,
  },
  editButtonLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.44,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
  disabledButton: { opacity: 0.5 },
});
