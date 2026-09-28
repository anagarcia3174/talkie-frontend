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
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuth } from "@/hooks/use-auth";
import { signInWithApple, signInWithGoogle } from "@/lib/auth";
import { describeAuthError } from "@/lib/auth-errors";
import { getMe, updateUsername } from "@/lib/profile";
import { describeApiError } from "@/lib/api-errors";
import { colors, fonts, shadow, spacing } from "@/theme/tokens";
import { Button } from "@/components/Button";
import { EyebrowLabel } from "@/components/EyebrowLabel";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  apple: "Apple",
};

const PROVIDER_ORDER = ["google", "apple"];

function formatProviders(providers: string[] | undefined): string | null {
  if (!providers || providers.length === 0) return null;
  const ordered = [
    ...PROVIDER_ORDER.filter((known) => providers.includes(known)),
    ...providers.filter((p) => !PROVIDER_ORDER.includes(p)),
  ];
  const labels = ordered.map((p) => PROVIDER_LABELS[p] ?? p);
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

export default function ProfileScreen() {
  const { session, loading } = useAuth();

  if (loading) {
    return <SafeAreaView style={styles.page} edges={[]} />;
  }

  return (
    <SafeAreaView style={styles.page} edges={[]}>
      <ScrollView contentContainerStyle={styles.content}>
        {session ? (
          <AccountView
            email={session.user.email ?? null}
            providers={session.user.app_metadata.providers}
          />
        ) : (
          <SignInView />
        )}
      </ScrollView>
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
      setAuthError(describeAuthError(err));
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
      setAuthError(describeAuthError(err));
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <View style={styles.authPrompt}>
      <View style={styles.authText}>
        <EyebrowLabel>Every moment counts</EyebrowLabel>
        <View>
          <Text style={styles.heading}>Sign in to</Text>
          <Text style={[styles.heading, styles.headingSecondLine]}>join the</Text>
          <Text style={[styles.heading, styles.headingSecondLine]}>conversation</Text>
        </View>
        <Text style={styles.subheading}>
          Browsing Talkie is open to everyone — sign in to comment at the exact
          moment something happens.
        </Text>
      </View>
      <View style={styles.authButtons}>
        {authError && <Text style={styles.errorText}>{authError}</Text>}
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
  providers,
}: {
  email: string | null;
  providers?: string[];
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
  const providerLabel = formatProviders(providers);

  return (
    <View style={styles.account}>
      <View style={styles.identityCard}>
        <View style={styles.identityRow}>
          <EyebrowLabel>
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
                  {describeApiError(updateUsernameMutation.error, "username")}
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
              {/* Bordered button, not an icon — the design system defines
                  no icon set (mono text labels only). */}
              <Pressable
                onPress={() => setIsEditingUsername(true)}
                style={styles.editButton}
                hitSlop={8}
              >
                <Text style={styles.editButtonLabel}>Edit</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgBase },
  content: { flexGrow: 1 },

  authPrompt: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 34,
    gap: 24,
    justifyContent: "center",
  },
  authText: { gap: spacing.lg },
  heading: {
    fontFamily: fonts.display,
    fontSize: 60,
    lineHeight: 62,
    textTransform: "uppercase",
    color: colors.textPrimary,
    textShadowColor: shadow.color,
    textShadowOffset: { width: shadow.offsetLg, height: shadow.offsetLg },
    textShadowRadius: 0,
  },
  headingSecondLine: {
    marginTop: -12,
  },
  subheading: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 340,
  },
  authButtons: { gap: spacing.md },
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

  account: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.lg },
  identityCard: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.bgElevated,
    padding: spacing.lg,
    gap: 18,
  },
  identityRow: { gap: 8 },
  email: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  usernameSection: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 18,
    gap: spacing.xs,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  usernameInfo: { gap: 8, flexShrink: 1, minWidth: 0 },
  usernameText: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 34,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
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
});
