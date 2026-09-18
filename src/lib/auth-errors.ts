import { isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";

const APPLE_CANCEL_CODE = "ERR_REQUEST_CANCELED";

export function describeAuthError(err: unknown): string | null {
  if (isAppleCancel(err)) return null;

  if (isErrorWithCode(err)) {
    switch (err.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return null;
      case statusCodes.IN_PROGRESS:
        return "Still signing you in — give it a moment and try again.";
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return "Google Play Services isn't available on this device.";
    }
  }

  const message = err instanceof Error ? err.message : String(err);

  if (/network|fetch|timed? ?out/i.test(message)) {
    return "Couldn't reach the server. Check your connection and try again.";
  }

  return "Something went wrong signing in. Please try again.";
}

function isAppleCancel(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === APPLE_CANCEL_CODE
  );
}
