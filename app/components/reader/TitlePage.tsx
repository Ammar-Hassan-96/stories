import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User, Calendar, Clock } from "lucide-react-native";
import { formatArabicDate } from "../../types";
import BlurImage from "../BlurImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.52);

interface TitlePageProps {
  title: string;
  author: string;
  createdAt: string;
  readingTime?: number;
  imageUrl?: string;
  fontSize: number;
  isDark: boolean;
  pageBg: string;
  accentColor: string;
}

const TitlePage: React.FC<TitlePageProps> = ({
  title,
  author,
  createdAt,
  readingTime,
  imageUrl,
  fontSize,
  isDark,
  pageBg,
  accentColor,
}) => {
  const mutedColor = isDark ? "#8A7A90" : "#8A7B6D";
  const textColor = isDark ? "#F0E6D3" : "#2C1810";
  const metaFontSize = Math.max(11, fontSize - 5);

  return (
    <View style={styles.container}>
      {/* Cover image with gradient fade into page color */}
      {imageUrl ? (
        <View style={styles.coverContainer}>
          <BlurImage
            uri={imageUrl}
            width={SCREEN_WIDTH - 140}
            height={COVER_HEIGHT}
            borderRadius={4}
          />
          <LinearGradient
            colors={["transparent", pageBg]}
            locations={[0.55, 1]}
            style={styles.coverGradient}
          />
        </View>
      ) : (
        <View style={styles.noCoverSpacer} />
      )}

      <View style={styles.content}>
        {/* Ornamental top rule */}
        <View style={styles.ornamentRow}>
          <View style={[styles.ornamentLine, { backgroundColor: accentColor }]} />
          <Text style={[styles.ornamentStar, { color: accentColor }]}>✦</Text>
          <View style={[styles.ornamentLine, { backgroundColor: accentColor }]} />
        </View>

        {/* Story title */}
        <Text
          style={[
            styles.title,
            {
              color: textColor,
              fontSize: fontSize + 10,
              lineHeight: (fontSize + 10) * 1.7,
            },
          ]}
        >
          {title}
        </Text>

        {/* Thin divider */}
        <View style={[styles.divider, { backgroundColor: accentColor }]} />

        {/* Metadata */}
        <View style={styles.metaBlock}>
          {author ? (
            <View style={styles.metaItem}>
              <User color={mutedColor} size={12} />
              <Text style={[styles.metaText, { color: mutedColor, fontSize: metaFontSize }]}>
                {author}
              </Text>
            </View>
          ) : null}

          {createdAt ? (
            <View style={styles.metaItem}>
              <Calendar color={mutedColor} size={12} />
              <Text style={[styles.metaText, { color: mutedColor, fontSize: metaFontSize }]}>
                {formatArabicDate(createdAt)}
              </Text>
            </View>
          ) : null}

          {readingTime ? (
            <View style={[styles.metaItem, styles.readingTimeChip, { borderColor: accentColor + "55" }]}>
              <Clock color={accentColor} size={12} />
              <Text style={[styles.metaText, { color: accentColor, fontSize: metaFontSize, fontFamily: "Amiri_700Bold" }]}>
                {readingTime} دقيقة
              </Text>
            </View>
          ) : null}
        </View>

        {/* Ornamental bottom rule */}
        <View style={styles.ornamentRow}>
          <View style={[styles.ornamentLine, { backgroundColor: accentColor }]} />
          <Text style={[styles.ornamentStar, { color: accentColor }]}>❖</Text>
          <View style={[styles.ornamentLine, { backgroundColor: accentColor }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 20,
  },
  coverContainer: {
    position: "relative",
    marginBottom: 0,
    alignItems: "center",
    width: "100%",
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Math.round(COVER_HEIGHT * 0.55),
  },
  noCoverSpacer: {
    height: 16,
  },
  content: {
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 8,
    width: "100%",
  },
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "65%",
    marginVertical: 12,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  ornamentStar: {
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    fontFamily: "Amiri_700Bold",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  divider: {
    width: 36,
    height: 2,
    borderRadius: 1,
    marginBottom: 18,
    opacity: 0.7,
  },
  metaBlock: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  readingTimeChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default TitlePage;
