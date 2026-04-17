import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BookOpen } from "lucide-react-native";
import ParagraphRenderer from "./ParagraphRenderer";
import { PageData } from "../../utils/storyContentParser";

interface ChapterPageProps {
  page: PageData;
  fontSize: number;
  isDark: boolean;
  accentColor: string;
  isLastPage: boolean;
}

/**
 * Renders one chapter of the story — an ornamental heading
 * followed by the chapter's paragraphs. The last page shows
 * a "تمت" (The End) ornament.
 */
const ChapterPage: React.FC<ChapterPageProps> = ({
  page,
  fontSize,
  isDark,
  accentColor,
  isLastPage,
}) => {
  return (
    <View style={styles.container}>
      {/* Chapter heading with ornamental decoration */}
      {page.heading && (
        <View style={styles.headingContainer}>
          <View style={styles.ornamentRow}>
            <View
              style={[styles.ornamentLine, { backgroundColor: accentColor }]}
            />
            <BookOpen color={accentColor} size={16} />
            <View
              style={[styles.ornamentLine, { backgroundColor: accentColor }]}
            />
          </View>
          <Text
            style={[
              styles.headingText,
              {
                color: accentColor,
                fontSize: fontSize + 4,
                lineHeight: (fontSize + 4) * 1.7,
              },
            ]}
          >
            {page.heading}
          </Text>
          <View
            style={[styles.headingUnderline, { backgroundColor: accentColor }]}
          />
        </View>
      )}

      {/* Chapter body paragraphs */}
      <View style={styles.content}>
        <ParagraphRenderer
          paragraphs={page.paragraphs}
          fontSize={fontSize}
          isDark={isDark}
          accentColor={accentColor}
        />
      </View>

      {/* "The End" ornament on the last page */}
      {isLastPage && (
        <View style={styles.endContainer}>
          <View
            style={[
              styles.endLine,
              { backgroundColor: isDark ? "#3A3A3A" : "#D1C8B8" },
            ]}
          />
          <Text
            style={[
              styles.endText,
              {
                color: isDark ? "#3A3A3A" : "#D1C8B8",
                fontSize: fontSize - 4,
              },
            ]}
          >
            تمت
          </Text>
          <View
            style={[
              styles.endLine,
              { backgroundColor: isDark ? "#3A3A3A" : "#D1C8B8" },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
  },
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  ornamentLine: {
    width: 30,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.5,
  },
  headingText: {
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    writingDirection: "rtl",
  },
  headingUnderline: {
    width: 40,
    height: 2,
    borderRadius: 1,
    marginTop: 8,
    opacity: 0.4,
  },
  content: {
    paddingTop: 4,
  },
  endContainer: {
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
  endText: {
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
  },
});

export default ChapterPage;
