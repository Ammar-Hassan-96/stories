import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Clock, ChevronLeft } from "lucide-react-native";
import { Story, getReadingTime } from "../types";
import { categoryAccent, defaultAccent } from "../utils/storyContentParser";
import BlurImage from "./BlurImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.58);

const CATEGORY_NAMES: Record<string, string> = {
  horror: "رعب",
  love: "حب ورومانسية",
  "sci-fi": "خيال علمي",
  thriller: "إثارة وتشويق",
  islamic: "إسلامية",
  drama: "دراما",
  kids: "أطفال",
};

interface FeaturedStoryBannerProps {
  story: Story;
  onPress: () => void;
}

const FeaturedStoryBanner: React.FC<FeaturedStoryBannerProps> = ({ story, onPress }) => {
  const accent = categoryAccent[story.category_id] ?? defaultAccent;
  const readingTime = getReadingTime(story.content);
  const categoryName = CATEGORY_NAMES[story.category_id] ?? story.category_id;

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(80).springify().damping(16).stiffness(100)}
      style={[styles.wrapper, animStyle]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 180 });
        }}
        onPress={onPress}
        style={styles.card}
      >
        {/* Background Image */}
        <BlurImage
          uri={story.image_url}
          resizeMode="contain"
          style={StyleSheet.absoluteFillObject as any}
        />

        {/* Multi-stop gradient for depth */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.05)",
            "rgba(0,0,0,0.35)",
            "rgba(0,0,0,0.82)",
          ]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Subtle colored tint at bottom */}
        <LinearGradient
          colors={["transparent", accent.primary + "55"]}
          locations={[0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Top badges row */}
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: accent.primary }]}>
            <Text style={styles.categoryBadgeText}>{categoryName}</Text>
          </View>
          <View style={styles.featuredPill}>
            <BookOpen size={10} color="rgba(255,255,255,0.85)" />
            <Text style={styles.featuredPillText}>قصة اليوم</Text>
          </View>
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>

          <View style={styles.metaRow}>
            {story.author ? (
              <Text style={styles.author} numberOfLines={1}>
                {story.author}
              </Text>
            ) : null}
            <View style={styles.timePill}>
              <Clock size={10} color="rgba(255,255,255,0.75)" />
              <Text style={styles.timeText}>{readingTime} دقيقة</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.readBtn, { backgroundColor: accent.primary }]}
            onPress={onPress}
            activeOpacity={0.85}
          >
            <ChevronLeft size={15} color="#fff" />
            <Text style={styles.readBtnText}>اقرأ الآن</Text>
          </TouchableOpacity>
        </View>

        {/* Accent glow line at very bottom */}
        <View style={[styles.glowLine, { backgroundColor: accent.primary }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  card: {
    height: BANNER_HEIGHT,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#111",
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 0,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    writingDirection: "rtl",
  },
  featuredPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  featuredPillText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 10,
    fontWeight: "700",
    writingDirection: "rtl",
  },
  bottomContent: {
    padding: 18,
    paddingTop: 8,
    alignItems: "flex-end",
  },
  title: {
    fontFamily: "Amiri_700Bold",
    fontSize: 23,
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  author: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  timePill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timeText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "600",
  },
  readBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 26,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  readBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    writingDirection: "rtl",
  },
  glowLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.75,
  },
});

export default FeaturedStoryBanner;
