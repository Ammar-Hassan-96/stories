import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StoryDetailsScreenProps } from "../types/navigation";
import { formatArabicDate } from "../types";
import { ChevronLeft, Minus, Plus, BookOpen, User, Calendar } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import BlurImage from "../components/BlurImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.55);

// Category colors for book theme
const categoryAccent: Record<string, { primary: string; light: string; dark: string }> = {
  horror: { primary: "#8B0000", light: "#FFF0F0", dark: "#2C0A0A" },
  love: { primary: "#C2185B", light: "#FFF0F5", dark: "#2C0A18" },
  "sci-fi": { primary: "#1565C0", light: "#F0F4FF", dark: "#0A1228" },
  thriller: { primary: "#E65100", light: "#FFF3EE", dark: "#2C1000" },
  islamic: { primary: "#1B5E20", light: "#F0FFF2", dark: "#061A08" },
  drama: { primary: "#4A148C", light: "#F5F0FF", dark: "#140A2C" },
  kids: { primary: "#F57F17", light: "#FFFBF0", dark: "#2C1E00" },
};

/**
 * Renders story content with markdown-style bold (**text**)
 * and proper paragraph spacing.
 */
const StoryContent = memo(
  ({
    content,
    fontSize,
    isDark,
    accentColor,
  }: {
    content: string;
    fontSize: number;
    isDark: boolean;
    accentColor: string;
  }) => {
    const textColor = isDark ? "#E8DDD0" : "#2C1E16";
    const lineHeight = fontSize * 1.9;

    // Split into paragraphs on double newline or single newline
    const paragraphs = content
      .split(/\n\n|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return (
      <>
        {paragraphs.map((paragraph, pIdx) => {
          // Detect section headings: lines wrapped in ** ... **
          const isHeading =
            paragraph.startsWith("**") && paragraph.endsWith("**");

          if (isHeading) {
            const headingText = paragraph.replace(/^\*\*|\*\*$/g, "");
            return (
              <View key={pIdx} style={styles.headingContainer}>
                <View
                  style={[styles.headingAccent, { backgroundColor: accentColor }]}
                />
                <Text
                  style={[
                    styles.headingText,
                    { color: accentColor, fontSize: fontSize + 1 },
                  ]}
                >
                  {headingText}
                </Text>
              </View>
            );
          }

          // Render inline bold (split on **)
          const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);

          return (
            <Text
              key={pIdx}
              style={[
                styles.paragraph,
                {
                  fontSize,
                  lineHeight,
                  color: textColor,
                  marginBottom: fontSize * 0.9,
                },
              ]}
            >
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <Text key={i} style={{ fontWeight: "800", color: accentColor }}>
                      {part.slice(2, -2)}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          );
        })}
      </>
    );
  }
);

const StoryDetailsScreen: React.FC<StoryDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { story } = route.params;
  const [fontSize, setFontSize] = useState(17);
  const { isDark } = useTheme();

  const accent = categoryAccent[story.category_id] ?? {
    primary: "#8B5A2B",
    light: "#FDF6E3",
    dark: "#2C1E10",
  };

  const bgColor = isDark ? "#0F0D18" : accent.light;
  const pageBg = isDark ? "#1A1628" : "#FDFAF4";
  const pageEdge = isDark ? "#2A2240" : "#E8D5B0";
  const spineColor = isDark ? accent.dark : "#D4B483";
  const textMuted = isDark ? "#8B8095" : "#9C8167";

  const incFontSize = useCallback(
    () => setFontSize((v) => Math.min(26, v + 1)),
    []
  );
  const decFontSize = useCallback(
    () => setFontSize((v) => Math.max(13, v - 1)),
    []
  );

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Top bar */}
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: isDark ? "rgba(15,13,24,0.95)" : "rgba(253,250,244,0.95)",
              borderBottomColor: pageEdge,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)" }]}
          >
            <ChevronLeft color={isDark ? "#E0D5C5" : "#5C3A21"} size={22} />
          </TouchableOpacity>

          {/* Font size controls */}
          <View style={styles.fontControls}>
            <TouchableOpacity
              onPress={decFontSize}
              style={[styles.fontBtn, { borderColor: isDark ? "#3D3055" : "#C8B08A" }]}
            >
              <Minus color={isDark ? "#C8A96E" : "#8B5A2B"} size={16} />
            </TouchableOpacity>
            <Text style={[styles.fontSizeLabel, { color: isDark ? "#C8A96E" : "#8B5A2B" }]}>
              {fontSize}
            </Text>
            <TouchableOpacity
              onPress={incFontSize}
              style={[styles.fontBtn, { borderColor: isDark ? "#3D3055" : "#C8B08A" }]}
            >
              <Plus color={isDark ? "#C8A96E" : "#8B5A2B"} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Book page container */}
        <View style={styles.bookWrapper}>
          {/* Book spine (left edge) */}
          <View style={[styles.bookSpine, { backgroundColor: spineColor }]} />

          {/* Book page */}
          <View
            style={[
              styles.bookPage,
              {
                backgroundColor: pageBg,
                borderColor: pageEdge,
                shadowColor: accent.primary,
              },
            ]}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              {/* Cover image */}
              {story.image_url && (
                <View style={styles.coverImageContainer}>
                  <BlurImage
                    uri={story.image_url}
                    width={SCREEN_WIDTH - 56}
                    height={COVER_HEIGHT}
                    borderRadius={8}
                  />
                  <LinearGradient
                    colors={["transparent", pageBg]}
                    style={styles.coverGradient}
                  />
                </View>
              )}

              {/* Title page */}
              <View style={styles.titlePage}>
                {/* Decorative ornament */}
                <Text style={[styles.ornament, { color: accent.primary }]}>
                  ❦
                </Text>

                <Text
                  style={[
                    styles.storyTitle,
                    { color: isDark ? "#F0E6D3" : "#2C1810", fontSize: fontSize + 6 },
                  ]}
                >
                  {story.title}
                </Text>

                <View style={[styles.titleDivider, { backgroundColor: accent.primary }]} />

                {/* Author & date row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={13} color={textMuted} />
                    <Text style={[styles.metaText, { color: textMuted, fontSize: fontSize - 4 }]}>
                      {formatArabicDate(story.created_at)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <User size={13} color={textMuted} />
                    <Text style={[styles.metaText, { color: isDark ? "#C8A96E" : "#8B5A2B", fontSize: fontSize - 3 }]}>
                      {story.author}
                    </Text>
                  </View>
                </View>

                {/* Chapter start ornament */}
                <View style={[styles.chapterDivider, { borderColor: accent.primary + "40" }]}>
                  <BookOpen color={accent.primary} size={16} />
                </View>
              </View>

              {/* Story content — rendered as paragraphs */}
              <View style={styles.contentContainer}>
                <StoryContent
                  content={story.content}
                  fontSize={fontSize}
                  isDark={isDark}
                  accentColor={accent.primary}
                />

                {/* End of story ornament */}
                <View style={styles.endOrnamentContainer}>
                  <View style={[styles.endLine, { backgroundColor: accent.primary + "50" }]} />
                  <Text style={[styles.endOrnament, { color: accent.primary }]}>
                    ✦
                  </Text>
                  <View style={[styles.endLine, { backgroundColor: accent.primary + "50" }]} />
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Right page edge shadow */}
          <View style={[styles.pageRightEdge, { backgroundColor: pageEdge }]} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fontBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fontSizeLabel: {
    fontSize: 13,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  bookWrapper: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bookSpine: {
    width: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bookPage: {
    flex: 1,
    borderWidth: 1,
    borderLeftWidth: 0,
    elevation: 6,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: "hidden",
  },
  pageRightEdge: {
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0.6,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  coverImageContainer: {
    position: "relative",
    marginBottom: -20,
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  titlePage: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
  },
  ornament: {
    fontSize: 28,
    marginBottom: 12,
  },
  storyTitle: {
    fontWeight: "900",
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 38,
    marginBottom: 16,
  },
  titleDivider: {
    width: 64,
    height: 2,
    borderRadius: 1,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row-reverse",
    gap: 20,
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontWeight: "600",
    writingDirection: "rtl",
  },
  chapterDivider: {
    marginTop: 20,
    width: "100%",
    borderTopWidth: 1,
    borderStyle: "dashed",
    paddingTop: 14,
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  headingAccent: {
    width: 3,
    height: "100%",
    minHeight: 20,
    borderRadius: 2,
  },
  headingText: {
    flex: 1,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 26,
  },
  paragraph: {
    textAlign: "right",
    writingDirection: "rtl",
    fontWeight: "400",
  },
  endOrnamentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  endLine: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
  endOrnament: {
    fontSize: 18,
  },
});

export default StoryDetailsScreen;
