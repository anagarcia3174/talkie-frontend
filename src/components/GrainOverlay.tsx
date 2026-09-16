import { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming, useSharedValue } from "react-native-reanimated";

export function GrainOverlay() {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(0.46, { duration: 1125 }), withTiming(0.34, { duration: 1125 })), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <Image source={require("../../assets/images/grain.png")} resizeMode="repeat" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}
