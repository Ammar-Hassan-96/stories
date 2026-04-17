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
const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.5);

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
    // Books usually use pure black ink on beige pages
    const textColor = isDark ? "#E8DDD0" : "#1A1A1A"; 
    const lineHeight = fontSize * 1.9;

    // Split into paragraphs
    const paragraphs = content
      .split(/\n\n|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return (
      <>
        {paragraphs.map((paragraph, pIdx) => {
          // Detect section headings
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
                    { color: accentColor, fontSize: fontSize + 2 },
                  ]}
                >
                  {headingText}
                </Text>
              </View>
            );
          }

          // Regular paragraph with inline bold support
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
                  marginBottom: fontSize * 1.2, // standard paragraph spacing
                },
              ]}
            >
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <Text key={i} style={{ fontFamily: 'Amiri_700Bold', color: accentColor }}>
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
  const [fontSize, setFontSize] = useState(18); // Base physical book size is slightly larger
  const { isDark } = useTheme();

  const accent = categoryAccent[story.category_id] ?? {
    primary: "#8B5A2B",
    light: "#FDF6E3",
    dark: "#2C1E10",
  };

  const bgColor = isDark ? "#08070A" : "#D4D0C8"; 
  const pageBg = isDark ? "#121017" : "#F8F1E3"; 
  const inkColor = isDark ? "#4A4550" : "#8C7B65"; 

  const incFontSize = useCallback(
    () => setFontSize((v) => Math.min(28, v + 1)),
    []
  );
  const decFontSize = useCallback(
    () => setFontSize((v) => Math.max(14, v - 1)),
    []
  );

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Top bar floating outside the book */}
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: isDark ? "rgba(18,16,23,0.85)" : "rgba(244,239,230,0.85)",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)" }]}
          >
            <ChevronLeft color={isDark ? "#E0D5C5" : "#3D2A1C"} size={22} />
          </TouchableOpacity>

          {/* Font size controls */}
          <View style={styles.fontControls}>
            <TouchableOpacity
              onPress={decFontSize}
              style={[styles.fontBtn, { borderColor: isDark ? "#3D3055" : "#BBAA94" }]}
            >
              <Minus color={isDark ? "#C8A96E" : "#7A5C43"} size={16} />
            </TouchableOpacity>
            <Text style={[styles.fontSizeLabel, { color: isDark ? "#C8A96E" : "#7A5C43" }]}>
              {fontSize}
            </Text>
            <TouchableOpacity
              onPress={incFontSize}
              style={[styles.fontBtn, { borderColor: isDark ? "#3D3055" : "#BBAA94" }]}
            >
              <Plus color={isDark ? "#C8A96E" : "#7A5C43"} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Outer view to represent the book binding */}
        <View style={[styles.physicalBook, { backgroundColor: pageBg }]}>
          {/* A right shadow specifically to simulate thick book block for Arabic */}
          <View style={[styles.bookBlockShadow, { backgroundColor: isDark ? '#050408' : '#B8B3A8' }]} />
          
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
                  width={SCREEN_WIDTH - 120} 
                  height={COVER_HEIGHT}
                  borderRadius={4}
                />
                <LinearGradient
                  colors={["transparent", "rgba(244,239,230,0.8)", pageBg]}
                  style={styles.coverGradient}
                />
              </View>
            )}

            {/* Title Content */}
            <View style={styles.titlePage}>
              <Text
                style={[
                  styles.storyTitle,
                  { 
                    color: isDark ? "#F0E6D3" : "#2C1810", 
                    fontSize: fontSize + 8,
                    lineHeight: (fontSize + 8) * 1.8,
                    textShadowColor: isDark ? 'transparent' : 'rgba(0,0,0,0.1)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 1 
                  },
                ]}
              >
                {story.title}
              </Text>

              <View style={[styles.titleDivider, { backgroundColor: accent.primary }]} />

              {/* Author & date row */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Calendar size={13} color={isDark ? '#8A7A90' : '#8A7B6D'} />
                  <Text style={[styles.metaText, { color: isDark ? '#8A7A90' : '#8A7B6D', fontSize: fontSize - 4 }]}>
                    {formatArabicDate(story.created_at)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <User size={13} color={isDark ? '#8A7A90' : '#8A7B6D'} />
                  <Text style={[styles.metaText, { color: accent.primary, fontSize: fontSize - 3 }]}>
                    {story.author}
                  </Text>
                </View>
              </View>

              {/* Chapter start ornament overlaying frame style */}
              <View style={styles.chapterDivider}>
                <BookOpen color={accent.primary} size={18} />
              </View>
            </View>

            {/* Text Layout */}
            <View style={styles.contentContainer}>
              <StoryContent
                content={story.content}
                fontSize={fontSize}
                isDark={isDark}
                accentColor={accent.primary}
              />

              {/* End of story text ornament */}
              <View style={styles.endOrnamentContainer}>
                <View style={[styles.endLine, { backgroundColor: isDark ? '#3A3A3A' : '#D1C8B8' }]} />
                <Text style={[styles.endTextIndicator, { color: isDark ? '#3A3A3A' : '#D1C8B8', fontSize: fontSize - 4 }]}>
                  تمت
                </Text>
                <View style={[styles.endLine, { backgroundColor: isDark ? '#3A3A3A' : '#D1C8B8' }]} />
              </View>
            </View>
          </ScrollView>

          {/* Pure CSS Frame Overlay (pointerEvents none allows scrolling underneath) */}
          <View style={[styles.cssOuterFrame, { borderColor: inkColor }]} pointerEvents="none">
            <View style={[styles.cssInnerFrame, { borderColor: inkColor }]} />
            
            {/* Corner Ornaments */}
            <View style={[styles.cornerBase, styles.topLeftCorner, { backgroundColor: pageBg, borderColor: inkColor }]}>
              <Text style={[styles.cornerText, { color: inkColor }]}>❖</Text>
            </View>
            <View style={[styles.cornerBase, styles.topRightCorner, { backgroundColor: pageBg, borderColor: inkColor }]}>
              <Text style={[styles.cornerText, { color: inkColor }]}>❖</Text>
            </View>
            <View style={[styles.cornerBase, styles.bottomLeftCorner, { backgroundColor: pageBg, borderColor: inkColor }]}>
              <Text style={[styles.cornerText, { color: inkColor }]}>❖</Text>
            </View>
            <View style={[styles.cornerBase, styles.bottomRightCorner, { backgroundColor: pageBg, borderColor: inkColor }]}>
              <Text style={[styles.cornerText, { color: inkColor }]}>❖</Text>
            </View>
          </View>
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
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 4,
    zIndex: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    fontSize: 14,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  physicalBook: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  bookBlockShadow: {
    position: 'absolute',
    top: 4,
    bottom: -4,
    left: -4,
    width: 12,
    borderRadius: 4,
    zIndex: -1,
  },
  
  // Pure CSS Frame Styles
  cssOuterFrame: {
    position: 'absolute',
    top: 14,
    bottom: 14,
    left: 14,
    right: 14,
    borderWidth: 1.5,
  },
  cssInnerFrame: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
    borderWidth: 0.8,
  },
  cornerBase: {
    position: 'absolute',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cornerText: {
    fontSize: 16,
    lineHeight: 20,
  },
  topLeftCorner: {
    top: -10,
    left: -10,
  },
  topRightCorner: {
    top: -10,
    right: -10,
  },
  bottomLeftCorner: {
    bottom: -10,
    left: -10,
  },
  bottomRightCorner: {
    bottom: -10,
    right: -10,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 60,
  },
  coverImageContainer: {
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
  titlePage: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
    writingDirection: "ltr",
  },
  storyTitle: {
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 16,
  },
  titleDivider: {
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
  chapterDivider: {
    marginTop: 24,
    paddingTop: 10,
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingTop: 10,
  },
  headingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginTop: 28,
    marginBottom: 16,
  },
  headingAccent: {
    width: 4,
    height: "100%",
    minHeight: 22,
    borderRadius: 2,
  },
  headingText: {
    flex: 1,
    fontFamily: "Amiri_700Bold",
    textAlign: "left",
    writingDirection: "rtl",
    lineHeight: 34,
  },
  paragraph: {
    fontFamily: "Amiri_400Regular",
    textAlign: "justify",
    writingDirection: "rtl",
  },
  endOrnamentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  endLine: {
    flex: 1,
    height: 1,
  },
  endTextIndicator: {
    fontFamily: 'Amiri_700Bold',
    writingDirection: 'rtl',
  },
});

export default StoryDetailsScreen;
