import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ParagraphRenderer from "./ParagraphRenderer";
import { PageData } from "../../utils/storyContentParser";

interface ChapterPageProps {
  page: PageData;
  fontSize: number;
  isDark: boolean;
  accentColor: string;
  isLastPage: boolean;
  isFirstChapter?: boolean;
  chapterIndex?: number;
}

const toArabicNum = (n: number): string =>
  (n + 1).toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

const ChapterPage: React.FC<ChapterPageProps> = ({
  page,
  fontSize,
  isDark,
  accentColor,
  isLastPage,
  isFirstChapter = false,
  chapterIndex = 0,
}) => {
  const mutedColor = isDark ? "#3A3848" : "#C8B8A2";

  return (
    <View style={styles.container}>
      {/* Chapter heading with ornamental decoration */}
      {page.heading && (
        <View style={styles.headingContainer}>
          {/* Top ornament: ─── ✦ ─── */}
          <View style={styles.ornamentRow}>
            <View style={[styles.ornamentLine, { backgroundColor: accentColor }]} />
            <Text style={[styles.ornamentGlyph, { color: accentColor }]}>✦</Text>
            <View style={[styles.ornamentLine, { backgroundColor: accentColor }]} />
          </View>

          <Text
            style={[
              styles.headingText,
              {
                color: accentColor,
                fontSize: fontSize + 5,
                lineHeight: (fontSize + 5) * 1.7,
              },
            ]}
          >
            {page.heading}
          </Text>

          {/* Bottom rule */}
          <View style={[styles.headingRule, { backgroundColor: accentColor }]} />
        </View>
      )}

      {/* Chapter body paragraphs */}
      <View style={styles.content}>
        <ParagraphRenderer
          paragraphs={page.paragraphs}
          fontSize={fontSize}
          isDark={isDark}
          accentColor={accentColor}
          isFirstChapter={isFirstChapter}
        />
      </View>

      {/* "The End" ornament on the last page */}
      {isLastPage && (
        <View style={styles.endContainer}>
          <View style={[styles.endLine, { backgroundColor: mutedColor }]} />
          <Text style={[styles.endGlyph, { color: mutedColor }]}>❦</Text>
          <Text style={[styles.endText, { color: mutedColor, fontSize: fontSize - 3 }]}>
            تمّت
          </Text>
          <Text style={[styles.endGlyph, { color: mutedColor }]}>❦</Text>
          <View style={[styles.endLine, { backgroundColor: mutedColor }]} />
        </View>
      )}

      {/* Chapter page number at the bottom */}
      {page.heading && (
        <Text style={[styles.pageNum, { color: mutedColor, fontSize: fontSize - 5 }]}>
          — {toArabicNum(chapterIndex)} —
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingBottom: 8,
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 4,
  },
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    width: "60%",
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    opacity: 0.45,
  },
  ornamentGlyph: {
    fontSize: 13,
    lineHeight: 18,
  },
  headingText: {
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 12,
  },
  headingRule: {
    width: 48,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.4,
  },
  content: {
    paddingTop: 4,
  },
  endContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 48,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  endLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  endGlyph: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.7,
  },
  endText: {
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
    opacity: 0.65,
  },
  pageNum: {
    fontFamily: "Amiri_400Regular",
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: 20,
    opacity: 0.5,
    letterSpacing: 2,
  },
});

export default ChapterPage;
