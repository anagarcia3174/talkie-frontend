import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export const SUPPORT_EMAIL = "support@gettalkie.app";
export const SUPPORT_URL = "https://gettalkie.app/support";
export const TERMS_URL = "https://gettalkie.app/terms";
export const PRIVACY_URL = "https://gettalkie.app/privacy";

export const APP_VERSION = Constants.expoConfig?.version ?? "unknown";

function buildMailto() {
  const subject = "Talkie support";
  // Pre-fill app/OS version so bug reports arrive with basic context.
  const body = `\n\n—\nApp version: ${APP_VERSION}\n${Platform.OS} ${Platform.Version}`;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function openSupportEmail() {
  try {
    await Linking.openURL(buildMailto());
  } catch {
    // No mail app configured (e.g. the iOS Simulator) — show the address instead.
    Alert.alert("Contact support", `Email us at ${SUPPORT_EMAIL}`);
  }
}

/** Opens a gettalkie.app page in the in-app browser. */
export async function openWebPage(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch {
    Alert.alert("Couldn't open page", `Visit ${url}`);
  }
}

export const openHelpCenter = () => openWebPage(SUPPORT_URL);
export const openTerms = () => openWebPage(TERMS_URL);
export const openPrivacyPolicy = () => openWebPage(PRIVACY_URL);
