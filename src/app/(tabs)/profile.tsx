import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuth } from "@/hooks/use-auth";
import { signInWithApple, signInWithGoogle } from "@/lib/auth";
import { getMe, updateUsername } from "@/lib/profile";
import { ApiError } from "@/lib/api";
import { colors, fonts, spacing } from "@/theme/tokens";
import { Button } from "@/components/Button";
import { EyebrowLabel } from "@/components/EyebrowLabel";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  apple: "Apple",
};

export default function ProfileScreen() {
  const { session, loading, logout } = useAuth();

  if (loading) {
    return <SafeAreaView style={styles.page} edges={[]} />;
  }

  return (
    <SafeAreaView style={styles.page} edges={[]}>
      <ScrollView contentContainerStyle={styles.content}>
        {session ? (
          <AccountView
            email={session.user.email ?? null}
            provider={session.user.app_metadata.provider}
          />
        ) : (
          <SignInView />
        )}
      </ScrollView>

      {session && (
        <View style={styles.footer}>
          <Pressable onPress={logout} style={styles.logoutRow}>
            <Text style={styles.logoutLabel}>Log out</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function SignInView() {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleGoogle() {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Google sign-in failed.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleApple() {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signInWithApple();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Apple sign-in failed.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <View style={styles.authPrompt}>
      <EyebrowLabel>Every moment counts</EyebrowLabel>
      <Text style={styles.heading}>Sign in to{"\n"}join the conversation</Text>
      <Text style={styles.subheading}>
        Browsing Talkie is open to everyone — sign in to comment at the exact
        moment something happens.
      </Text>
      {authError && <Text style={styles.errorText}>{authError}</Text>}
      <View style={styles.authButtons}>
        <Pressable
          onPress={handleGoogle}
          disabled={authLoading}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && !authLoading && styles.googleButtonPressed,
            authLoading && styles.disabledButton,
          ]}
        >
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonLabel}>Continue with Google</Text>
        </Pressable>
        {Platform.OS === "ios" && (
          <View
            pointerEvents={authLoading ? "none" : "auto"}
            style={authLoading && styles.disabledButton}
          >
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
              }
              cornerRadius={4}
              style={styles.appleButton}
              onPress={handleApple}
            />
          </View>
        )}
        {authLoading && <Text style={styles.loadingText}>Signing in…</Text>}
      </View>
    </View>
  );
}

function AccountView({
  email,
  provider,
}: {
  email: string | null;
  provider?: string;
}) {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const hasUsername = !!profile?.username;

  const [usernameInput, setUsernameInput] = useState("");
  useEffect(() => {
    setUsernameInput(profile?.username ?? "");
  }, [profile?.username]);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const showUsernameEditor = !hasUsername || isEditingUsername;

  const updateUsernameMutation = useMutation({
    mutationFn: (username: string) => updateUsername(username),
    onSuccess: (updated) => {
      queryClient.setQueryData(["me"], updated);
      setIsEditingUsername(false);
    },
  });

  function cancelEditingUsername() {
    setUsernameInput(profile?.username ?? "");
    setIsEditingUsername(false);
  }

  const trimmed = usernameInput.trim();
  const unchanged = trimmed.length === 0 || trimmed === profile?.username;
  const providerLabel = provider
    ? (PROVIDER_LABELS[provider] ?? provider)
    : null;

  return (
    <View style={styles.account}>
      <View style={styles.identity}>
        <EyebrowLabel muted>
          {providerLabel ? `Signed in with ${providerLabel}` : "Signed in"}
        </EyebrowLabel>
        {email && <Text style={styles.email}>{email}</Text>}
      </View>

      <View style={styles.usernameSection}>
        {showUsernameEditor ? (
          <>
            <EyebrowLabel>
              {hasUsername ? "Edit username" : "Choose a username"}
            </EyebrowLabel>
            <TextInput
              value={usernameInput}
              onChangeText={setUsernameInput}
              placeholder="e.g. film_fan_92"
              placeholderTextColor={colors.textMuted}
              style={styles.usernameInput}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={hasUsername}
            />
            {updateUsernameMutation.isError && (
              <Text style={styles.errorText}>
                {updateUsernameMutation.error instanceof ApiError &&
                updateUsernameMutation.error.status === 409
                  ? "That username is already taken."
                  : "Couldn't update username. Try again."}
              </Text>
            )}
            <View style={styles.usernameActions}>
              <Button
                onPress={() => updateUsernameMutation.mutate(trimmed)}
                disabled={unchanged || updateUsernameMutation.isPending}
              >
                {updateUsernameMutation.isPending ? "Saving…" : "Save username"}
              </Button>
              {hasUsername && (
                <Pressable onPress={cancelEditingUsername} hitSlop={8}>
                  <Text style={styles.cancelLabel}>Cancel</Text>
                </Pressable>
              )}
            </View>
          </>
        ) : (
          <View style={styles.usernameRow}>
            <View style={styles.usernameInfo}>
              <EyebrowLabel muted>Username</EyebrowLabel>
              <Text style={styles.usernameText}>{profile?.username}</Text>
            </View>
            <Pressable
              onPress={() => setIsEditingUsername(true)}
              style={styles.editRow}
              hitSlop={8}
            >
              <Ionicons
                name="pencil-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.editLabel}>Edit</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  content: { flexGrow: 1 },

  authPrompt: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.md,
    justifyContent: "center",
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 44,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
  subheading: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 400,
  },
  authButtons: { gap: spacing.sm, marginTop: spacing.sm },
  googleButton: {
    width: "100%",
    height: 48,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleButtonPressed: { opacity: 0.85 },
  googleLogo: { width: 18, height: 18 },
  googleButtonLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: "#1F1F1F",
  },
  appleButton: { width: "100%", height: 48 },
  disabledButton: { opacity: 0.5 },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },

  account: { padding: spacing.xl, gap: spacing.xl },
  identity: { gap: spacing.xs },
  email: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  usernameSection: { gap: spacing.xs },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usernameInfo: { gap: 4 },
  usernameText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  editRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  editLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  usernameActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  cancelLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textMuted,
  },
  usernameInput: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  errorText: { fontFamily: fonts.body, fontSize: 13, color: colors.accent },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  logoutRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerStrong,
    paddingBottom: 4,
  },
  logoutLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
