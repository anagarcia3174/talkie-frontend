import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const { data } = await GoogleSignin.signIn();
  const idToken = data?.idToken;
  if (!idToken) throw new Error("No ID token returned from Google");

  const { data: session, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
  if (error) throw error;
  return session;
}

async function appleSignIn() {
  if (Platform.OS !== "ios") {
    throw new Error("Sign in with Apple is only available on iOS");
  }

  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) throw new Error("No identity token from Apple");

  const { data: session, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) throw error;
  return { session, authorizationCode: credential.authorizationCode };
}

export async function signInWithApple() {
  const { session } = await appleSignIn();
  return session;
}

export async function reauthenticateWithApple() {
  const { authorizationCode } = await appleSignIn();
  if (!authorizationCode) throw new Error("No authorization code from Apple");
  return authorizationCode;
}

export async function reauthenticateWithGoogle() {
  await signInWithGoogle();
}

export async function signOutOfGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {}
}

export async function revokeGoogleAccess() {
  try {
    await GoogleSignin.revokeAccess();
  } catch {}
  await signOutOfGoogle();
}