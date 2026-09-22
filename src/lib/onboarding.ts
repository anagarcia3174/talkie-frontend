import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "talkie.onboarding.seen.v1";


export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === "1";
  } catch {
    return true;
  }
}

export async function markOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, "1");
  } catch {
  }
}
