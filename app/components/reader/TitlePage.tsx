import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, User, Calendar } from "lucide-react-native";
import { formatArabicDate } from "../../types";
import BlurImage from "../BlurImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.4);

interface TitlePageProps {
  title: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
  fontSize: number;
  isDark: boolean;
  pageBg: string;
  accentColor: string;
}

/**
 * The first page of the reader — shows the story cover image,
 * title, author, date, and a swipe hint.
 */
const TitlePage: React.FC<TitlePageProps> = ({
  title,
  author,
  createdAt,
  imageUrl,
  fontSize,
  isDark,
  pageBg,
  accentColor,
}) => {
  const mutedColor = isDark ? "#8A7A90" : "#8A7B6D";

  return (
    <View style={styles.container}>
      {/* Cover image with gradient fade */}
      {imageUrl && (
        <View style={styles.coverContainer}>
          <BlurImage
            uri={imageUrl}
            width={SCREEN_WIDTH - 140}
            height={COVER_HEIGHT}
            borderRadius={4}
          />
          <LinearGradient
            colors={["transparent", "rgba(244,239,230,0.8)", pageBg]}
            style={styles.coverGradient}
          />
        </View>
      )}

      <View style={styles.content}>
        {/* Story title */}
        <Text
          style={[
            styles.title,
            {
              color: isDark ? "#F0E6D3" : "#2C1810",
              fontSize: fontSize + 8,
              lineHeight: (fontSize + 8) * 1.8,
              textShadowColor: isDark ? "transparent" : "rgba(0,0,0,0.1)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            },
          ]}
        >
          {title}
        </Text>
        <BookOpen color={accentColor} size={25} />
        <View style={[styles.divider, { backgroundColor: accentColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  coverContainer: {
    position: "relative",
    marginBottom: 8,
    alignItems: "center",
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Math.round(COVER_HEIGHT * 0.4),
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  content: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 16,
  },
  divider: {
    width: 48,
    height: 3,
    borderRadius: 2,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row-reverse",
    gap: 24,
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  ornament: {
    marginTop: 24,
    paddingTop: 10,
    alignItems: "center",
  },
  swipeHint: {
    fontFamily: "Amiri_400Regular",
    fontSize: 14,
    marginTop: 24,
    writingDirection: "rtl",
  },
});

export default TitlePage;
