import React, { memo } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Story, getReadingTime } from "../types";
import { useTheme } from "../services/ThemeContext";
import BlurImage from "./BlurImage";
import { Clock } from "lucide-react-native";
import { categoryAccent, defaultAccent } from "../utils/storyContentParser";

interface StoryItemProps {
  story: Story;
  onPress: () => void;
  width?: number;
  index?: number;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress, width }) => {
  const { isDark } = useTheme();
  const cardWidth = width ? width - 16 : 160;
  const cardHeight = cardWidth * 1.45;
  const accentColor = (categoryAccent[story.category_id] ?? defaultAccent).primary;
  const readingTime = getReadingTime(story.content);

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.bookWrapper, animStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.93, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 180 });
        }}
        onPress={onPress}
        style={[
          styles.container,
          {
            width: cardWidth,
            height: cardHeight,
            backgroundColor: isDark ? "#2C2A3A" : "#FFFFFF",
            borderColor: isDark ? "#12111A" : "#D1D1D1",
          },
        ]}
      >
        <View style={styles.bookInner}>
          {/* Cover image */}
          <BlurImage
            uri={story.image_url}
            width={cardWidth - 8}
            height={cardHeight - 2}
            borderRadius={0}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Inner shadow depth */}
          <View
            style={[
              styles.innerShadow,
              {
                borderColor: isDark
                  ? "rgba(0,0,0,0.5)"
                  : "rgba(255,255,255,0.4)",
              },
            ]}
          />

          {/* Top gradient overlay */}
          <LinearGradient
            colors={["rgba(0,0,0,0.92)", "rgba(0,0,0,0.4)", "transparent"]}
            locations={[0, 0.65, 1]}
            style={styles.gradient}
          >
            <View style={styles.titleContainer}>
              <View
                style={[styles.titleAccentLine, { backgroundColor: accentColor }]}
              />
              <Text
                style={[styles.title, { fontFamily: "Amiri_700Bold" }]}
                numberOfLines={3}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                allowFontScaling={false}
              >
                {story.title}
              </Text>
            </View>
          </LinearGradient>

          {/* Reading time badge — bottom left */}
          <View style={styles.readingBadge}>
            <Clock size={9} color="rgba(255,255,255,0.85)" />
            <Text style={styles.readingBadgeText}>{readingTime} د</Text>
          </View>
        </View>

        {/* 3D spine */}
        <View style={[styles.spine, { backgroundColor: accentColor }]} />
        <LinearGradient
          colors={["rgba(255,255,255,0.4)", "transparent", "rgba(0,0,0,0.4)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.spineHighlight}
        />
      </Pressable>

      {/* Desk shadow */}
      <View
        style={[
          styles.deskShadow,
          {
            width: cardWidth * 0.75,
            backgroundColor: isDark
              ? "rgba(0,0,0,0.5)"
              : "rgba(0,0,0,0.15)",
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bookWrapper: {
    alignItems: "center",
    margin: 8,
  },
  container: {
    borderRadius: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    flexDirection: "row-reverse",
  },
  bookInner: {
    flex: 1,
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#000",
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  spine: {
    width: 12,
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.6)",
  },
  spineHighlight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 10,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 70,
    justifyContent: "flex-start",
  },
  titleContainer: {
    borderLeftWidth: 0,
    paddingLeft: 0,
  },
  titleAccentLine: {
    height: 2,
    width: 28,
    borderRadius: 1,
    marginBottom: 6,
    alignSelf: "center",
    opacity: 0.85,
  },
  title: {
    color: "#F0E6D3",
    fontSize: 14,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  readingBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  readingBadgeText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 9,
    fontWeight: "700",
  },
  deskShadow: {
    height: 6,
    borderRadius: 100,
    marginTop: 2,
    opacity: 0.7,
  },
});

export default memo(StoryItem);
