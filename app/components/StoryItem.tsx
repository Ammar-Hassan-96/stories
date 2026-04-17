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

  return (
    <View style={styles.bookWrapper}>
      <TouchableOpacity
        activeOpacity={0.88}
        style={[
          styles.container,
          {
            width: cardWidth,
            height: cardHeight,
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
            width={cardWidth - 8}
            height={cardHeight - 2}
            borderRadius={0}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Inner shadow to give depth to the cover image */}
          <View style={[styles.innerShadow, { 
              borderColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)',
          }]} />

          {/* Bottom gradient overlay — book title area */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.92)"]}
            locations={[0, 0.35, 1]}
            style={styles.gradient}
          >
            {/* Title — printed on the book cover */}
            <View style={styles.titleContainer}>
              <View style={[styles.titleAccentLine, { backgroundColor: accentColor }]} />
              <Text
                style={[styles.title, { fontFamily: 'Amiri_700Bold' }]}
                numberOfLines={2}
                allowFontScaling={false}
              >
                {story.title}
              </Text>
            </View>
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

      {/* Desk shadow under the book */}
      <View style={[styles.deskShadow, { 
        width: cardWidth * 0.75,
        backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)',
      }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  bookWrapper: {
    alignItems: 'center',
    margin: 8,
  },
  container: {
    borderRadius: 6,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    flexDirection: 'row-reverse',
  },
  bookInner: {
    flex: 1,
    overflow: 'hidden',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#000',
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 50,
    justifyContent: 'flex-end',
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
    alignSelf: 'center',
    opacity: 0.85,
  },
  title: {
    color: "#F0E6D3",
    fontSize: 15,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 24,
    // Embossed book look: subtle warm tint + text shadow
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  deskShadow: {
    height: 6,
    borderRadius: 100,
    marginTop: 2,
    opacity: 0.7,
  },
});

export default memo(StoryItem);
