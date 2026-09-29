import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { describeApiError } from "@/lib/api-errors";
import { describeAuthError } from "@/lib/auth-errors";
import {
  APP_VERSION,
  openHelpCenter,
  openPrivacyPolicy,
  openSupportEmail,
  openTerms,
} from "@/lib/support";
import { colors, fonts, spacing } from "@/theme/tokens";
import { BlockedUsersSection } from "@/components/BlockedUsersSection";
import { DetailBackLink } from "@/components/DetailBackLink";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { TmdbAttribution } from "@/components/TmdbAttribution";

export default function SettingsScreen() {
  const router = useRouter();
  const { session, logout, deleteAccount } = useAuth();
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // After logging out or deleting, return to Profile (which then shows sign-in).
  function returnToProfile() {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  async function handleLogout() {
    setLogoutError(null);
    setLoggingOut(true);
    try {
      await logout();
      returnToProfile();
    } catch (err) {
      setLogoutError(describeAuthError(err) ?? "Couldn't log out. Try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteAccount();
      queryClient.clear();
      returnToProfile();
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? describeApiError(err, "account-delete")
          : describeAuthError(err),
      );
    } finally {
      setDeleting(false);
    }
  }

  function confirmDeleteAccount() {
    Alert.alert(
      "Delete account?",
      "This permanently deletes your account, username, and all of your comments. You'll be asked to sign in again to confirm. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <DetailBackLink label="Profile" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {session && <BlockedUsersSection />}

        <View style={styles.card}>
          <EyebrowLabel>Support</EyebrowLabel>
          <SettingsRow label="Contact support" hint="Email" onPress={openSupportEmail} />
          <SettingsRow label="Help center" hint="Web" onPress={openHelpCenter} />
        </View>

        <View style={styles.card}>
          <EyebrowLabel>Legal</EyebrowLabel>
          <SettingsRow label="Terms of Service" hint="Web" onPress={openTerms} />
          <SettingsRow label="Privacy Policy" hint="Web" onPress={openPrivacyPolicy} />
        </View>

        <View style={styles.card}>
          <EyebrowLabel>About</EyebrowLabel>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowHint}>{APP_VERSION}</Text>
          </View>
          <View style={styles.attribution}>
            <TmdbAttribution />
          </View>
        </View>

        {session && (
          <View style={styles.accountActions}>
            {logoutError && <Text style={styles.actionError}>{logoutError}</Text>}
            <Pressable
              onPress={handleLogout}
              disabled={loggingOut || deleting}
              style={[styles.logoutButton, (loggingOut || deleting) && styles.disabledButton]}
            >
              <Text style={styles.logoutLabel}>
                {loggingOut ? "Logging out…" : "Log out"}
              </Text>
            </Pressable>

            {deleteError && <Text style={styles.actionError}>{deleteError}</Text>}
            <Pressable
              onPress={confirmDeleteAccount}
              disabled={deleting || loggingOut}
              style={[styles.deleteButton, (deleting || loggingOut) && styles.disabledButton]}
            >
              <Text style={styles.deleteLabel}>
                {deleting ? "Deleting account…" : "Delete account"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  label,
  hint,
  onPress,
}: {
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link">
      {({ pressed }) => (
        <View style={[styles.row, pressed && styles.rowPressed]}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowHint}>{hint ? `${hint} →` : "→"}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 50,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.bgElevated,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  rowPressed: { opacity: 0.6 },
  rowLabel: { fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.textPrimary },
  rowHint: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  attribution: { borderTopWidth: 1, borderTopColor: colors.divider, marginTop: spacing.xs },

  accountActions: { gap: spacing.sm, marginTop: spacing.sm },
  actionError: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.accent,
    textAlign: "center",
  },
  logoutButton: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.dividerStrong,
    backgroundColor: "transparent",
  },
  logoutLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.56,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
  deleteButton: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: "transparent",
    marginTop: spacing.lg,
  },
  deleteLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.56,
    textTransform: "uppercase",
    color: colors.accent,
  },
  disabledButton: { opacity: 0.5 },
});
