import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Achievement } from "../services/statsService";

const { width: SCREEN_W } = Dimensions.get("window");

interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss,
}) => {
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 14, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 12 });

    // Auto dismiss after 3.5s
    translateY.value = withDelay(
      3500,
      withTiming(-150, { duration: 400 }, (finished) => {
        if (finished) runOnJS(onDismiss)();
      })
    );
    opacity.value = withDelay(3500, withTiming(0, { duration: 400 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <LinearGradient
        colors={["#F59E0B", "#DC2626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.icon}>{achievement.icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.unlockedLabel}>🎉 إنجاز جديد!</Text>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.desc}>{achievement.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 999,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  gradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  icon: {
    fontSize: 42,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  unlockedLabel: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 11,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
    marginBottom: 2,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
    textAlign: "right",
  },
  desc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
    textAlign: "right",
  },
});

export default AchievementToast;
