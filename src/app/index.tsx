import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { signInWithApple, signInWithGoogle } from "@/lib/auth";

export default function Index() {
  async function handleGoogle() {
    try {
      const session = await signInWithGoogle();
      console.log("Google sign-in OK", session);
      Alert.alert("Google sign-in OK", session?.user?.id ?? "no user id");
    } catch (err) {
      console.error("Google sign-in failed", err);
      Alert.alert("Google sign-in failed", String(err));
    }
  }

  async function handleApple() {
    try {
      const session = await signInWithApple();
      console.log("Apple sign-in OK", session);
      Alert.alert("Apple sign-in OK", session?.user?.id ?? "no user id");
    } catch (err) {
      console.error("Apple sign-in failed", err);
      Alert.alert("Apple sign-in failed", String(err));
    }
  }

  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>

      {/* TEMPORARY — Phase 7 auth test buttons, remove once there's a real login screen */}
      <View style={styles.testButtons}>
        <Button title="Test Google sign-in" onPress={handleGoogle} />
        {Platform.OS === "ios" && (
          <Button title="Test Apple sign-in" onPress={handleApple} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  testButtons: {
    marginTop: 24,
    gap: 12,
    width: 220,
  },
});
