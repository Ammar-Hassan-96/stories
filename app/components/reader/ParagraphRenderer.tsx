import React from "react";
import { Text, StyleSheet } from "react-native";

interface ParagraphRendererProps {
  paragraphs: string[];
  fontSize: number;
  isDark: boolean;
  accentColor: string;
  isFirstChapter?: boolean;
}

const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({
  paragraphs,
  fontSize,
  isDark,
  accentColor,
  isFirstChapter = false,
}) => {
  const textColor = isDark ? "#E8DDD0" : "#1A1A1A";
  const lineHeight = fontSize * 1.9;

  const renderInlineParts = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={i} style={{ fontFamily: "Amiri_700Bold", color: accentColor }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={i}>{part}</Text>;
    });

  return (
    <>
      {paragraphs.map((paragraph, pIdx) => {
        const isDropCap = isFirstChapter && pIdx === 0 && paragraph.length > 1;

        if (isDropCap) {
          const dropChar = paragraph[0];
          const rest = paragraph.slice(1);
          return (
            <Text
              key={pIdx}
              style={[styles.paragraph, { fontSize, lineHeight, color: textColor, marginBottom: fontSize * 1.2 }]}
            >
              {/* Decorative drop cap — first character of the chapter */}
              <Text
                style={{
                  fontFamily: "Amiri_700Bold",
                  fontSize: fontSize * 2.9,
                  color: accentColor,
                  lineHeight: fontSize * 3.1,
                }}
              >
                {dropChar}
              </Text>
              {renderInlineParts(rest)}
            </Text>
          );
        }

        return (
          <Text
            key={pIdx}
            style={[styles.paragraph, { fontSize, lineHeight, color: textColor, marginBottom: fontSize * 1.2 }]}
          >
            {renderInlineParts(paragraph)}
          </Text>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "Amiri_400Regular",
    textAlign: "justify",
    writingDirection: "rtl",
  },
});

export default ParagraphRenderer;
