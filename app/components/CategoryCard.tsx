import React from "react";
import { Text, ImageBackground, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  fullWidth?: boolean;
  index?: number;
}

const categoryImages: Record<string, any> = {
  love: require("../../assets/categories/love.png"),
  horror: require("../../assets/categories/horror.png"),
  kids: require("../../assets/categories/kids.png"),
  "sci-fi": require("../../assets/categories/scifi.png"),
  thriller: require("../../assets/categories/thriller.png"),
  islamic: require("../../assets/categories/religious.png"),
  drama: require("../../assets/categories/drama.png"),
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  fullWidth,
  index = 0,
}) => {
  const imageSource = categoryImages[category.id];
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(14)
        .stiffness(120)}
      style={[
        styles.card,
        fullWidth ? styles.fullWidth : styles.halfWidth,
        animStyle,
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 180 });
        }}
        onPress={onPress}
      >
        <ImageBackground
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            style={styles.gradient}
          >
            <Text style={styles.label}>{category.name}</Text>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    height: 208,
    borderRadius: 24,
    overflow: "hidden",
  },
  fullWidth: {
    width: "96%",
  },
  halfWidth: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    paddingBottom: 16,
    paddingHorizontal: 8,
    writingDirection: "rtl",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default CategoryCard;
