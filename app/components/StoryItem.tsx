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
          // 3D cover effect properties
          backgroundColor: isDark ? "#2C2A3A" : "#FFFFFF",
          borderColor: isDark ? "#12111A" : "#D1D1D1",
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.bookInner}>
        {/* Book cover image with blur-load effect */}
        <BlurImage
          uri={story.image_url}
          width={cardWidth - 8} // Adjust for spine
          height={cardHeight - 2} // Adjust for book borders
          borderRadius={0}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Inner shadow to give depth to the cover image */}
        <View style={[styles.innerShadow, { 
            borderColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)',
        }]} />

        {/* Bottom gradient overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.95)"]}
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
      </View>
      
      {/* 3D Arabic Spine (On the Right) */}
      <View style={[styles.spine, { backgroundColor: accentColor }]} />
      {/* Spine highlight to simulate 3D curve */}
      <LinearGradient 
          colors={['rgba(255,255,255,0.4)', 'transparent', 'rgba(0,0,0,0.4)']} 
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
          style={styles.spineHighlight} 
      />

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 8,
    shadowOffset: { width: -4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    flexDirection: 'row', // align spine to the right
  },
  bookInner: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#000',
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  spine: {
    width: 10,
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.6)',
  },
  spineHighlight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 10,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0, // ensure it covers up to the spine
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 50,
  },
  authorBadge: {
    alignSelf: "flex-end", // Adjust to end
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  authorText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "right",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 6,
    lineHeight: 20,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  excerpt: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 15,
  },
});

export default memo(StoryItem);
