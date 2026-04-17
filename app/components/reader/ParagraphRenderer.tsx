import React from "react";
import { Text, StyleSheet } from "react-native";

interface ParagraphRendererProps {
  paragraphs: string[];
  fontSize: number;
  isDark: boolean;
  accentColor: string;
}

/**
 * Renders an array of paragraphs with inline bold (**text**) support.
 * Bold segments are highlighted in the accent color with Amiri bold font.
 */
const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({
  paragraphs,
  fontSize,
  isDark,
  accentColor,
}) => {
  const textColor = isDark ? "#E8DDD0" : "#1A1A1A";
  const lineHeight = fontSize * 1.9;

  return (
    <>
      {paragraphs.map((paragraph, pIdx) => {
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
                marginBottom: fontSize * 1.2,
              },
            ]}
          >
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <Text
                    key={i}
                    style={{
                      fontFamily: "Amiri_700Bold",
                      color: accentColor,
                    }}
                  >
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
};

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "Amiri_400Regular",
    textAlign: "justify",
    writingDirection: "rtl",
  },
});

export default ParagraphRenderer;
