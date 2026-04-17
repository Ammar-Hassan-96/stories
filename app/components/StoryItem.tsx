import React, { memo } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Story, getExcerpt } from "../types";
import { useTheme } from "../services/ThemeContext";
import BlurImage from "./BlurImage";

// Category accent colors for book spine visual
const categoryAccent: Record<string, string> = {
  horror: "#8B0000",
  love: "#C2185B",
  "sci-fi": "#1565C0",
  thriller: "#E65100",
  islamic: "#1B5E20",
  drama: "#4A148C",
  kids: "#F57F17",
};

interface StoryItemProps {
  story: Story;
  onPress: () => void;
  width?: number;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress, width }) => {
  const { isDark } = useTheme();
  const cardWidth = width ? width - 16 : 160;
  const cardHeight = cardWidth * 1.45;
  const accentColor = categoryAccent[story.category_id] ?? "#5C4033";
  const excerpt = getExcerpt(story.content, 70);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.container,
        {
          width: cardWidth,
          height: cardHeight,
          margin: 8,
          borderLeftColor: accentColor,
          backgroundColor: isDark ? "#1E1A2E" : "#FAF6F0",
          shadowColor: accentColor,
        },
      ]}
      onPress={onPress}
    >
      {/* Book cover image with blur-load effect */}
      <BlurImage
        uri={story.image_url}
        width={cardWidth}
        height={cardHeight}
        borderRadius={0}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.92)"]}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      >
        {/* Author tag */}
        <View style={[styles.authorBadge, { backgroundColor: accentColor + "DD" }]}>
          <Text style={styles.authorText} numberOfLines={1}>
            {story.author}
          </Text>
        </View>

        {/* Title */}
        <Text
          style={styles.title}
          numberOfLines={2}
          allowFontScaling={false}
        >
          {story.title}
        </Text>

        {/* Excerpt */}
        <Text
          style={styles.excerpt}
          numberOfLines={2}
          allowFontScaling={false}
        >
          {excerpt}
        </Text>
      </LinearGradient>

      {/* Decorative top-right corner fold */}
      <View
        style={[
          styles.cornerFold,
          { borderBottomColor: isDark ? "#2C2840" : "#EDE0D4" },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    borderLeftWidth: 8,
    elevation: 6,
    shadowOffset: { width: -3, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 40,
  },
  authorBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 6,
  },
  authorText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "right",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 4,
    lineHeight: 18,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  excerpt: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 14,
  },
  cornerFold: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderLeftColor: "transparent",
    borderBottomWidth: 18,
    borderBottomColor: "transparent",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderStyle: "solid",
    opacity: 0.5,
  },
});

export default memo(StoryItem);
