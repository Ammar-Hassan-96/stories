import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { X, BookOpen } from "lucide-react-native";
import { PageData } from "../../utils/storyContentParser";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface TableOfContentsProps {
  chapters: PageData[];
  currentChapter: number;
  isDark: boolean;
  accentColor: string;
  onSelectChapter: (index: number) => void;
  onClose: () => void;
}

const toArabicNumerals = (n: number): string =>
  (n + 1).toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  currentChapter,
  isDark,
  accentColor,
  onSelectChapter,
  onClose,
}) => {
  const bgColor = isDark ? "#1A1625" : "#F4EFE6";
  const textColor = isDark ? "#E8DDD0" : "#1A1A1A";
  const mutedColor = isDark ? "#6B5F7A" : "#9C8878";
  const borderColor = isDark ? "#2D2840" : "#D4C8B5";

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(20).stiffness(180)}
      exiting={SlideOutDown.springify().damping(20)}
      style={styles.backdrop}
    >
      {/* Tap outside to dismiss */}
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View
        entering={FadeIn.delay(80)}
        style={[styles.sheet, { backgroundColor: bgColor, borderColor }]}
      >
        {/* Drag handle */}
        <View style={[styles.handle, { backgroundColor: mutedColor }]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <X color={mutedColor} size={20} />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <BookOpen color={accentColor} size={18} />
            <Text style={[styles.headerText, { color: textColor }]}>فهرس القصة</Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        {/* Chapter list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          bounces={false}
        >
          {chapters.map((chapter, index) => {
            const isActive = index === currentChapter;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onSelectChapter(index);
                  onClose();
                }}
                style={[
                  styles.chapterItem,
                  {
                    borderBottomColor: borderColor,
                    backgroundColor: isActive ? accentColor + "18" : "transparent",
                    borderRightWidth: isActive ? 3 : 0,
                    borderRightColor: accentColor,
                    paddingRight: isActive ? 17 : 20,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chapterNum,
                    { color: isActive ? accentColor : mutedColor },
                  ]}
                >
                  {toArabicNumerals(index)}
                </Text>
                <Text
                  style={[
                    styles.chapterTitle,
                    { color: isActive ? accentColor : textColor },
                  ]}
                  numberOfLines={2}
                >
                  {chapter.heading ?? `الجزء ${toArabicNumerals(index)}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: SCREEN_HEIGHT * 0.65,
    overflow: "hidden",
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
    opacity: 0.35,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "Amiri_700Bold",
    fontSize: 18,
    writingDirection: "rtl",
  },
  listContent: {
    paddingBottom: 48,
  },
  chapterItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  chapterNum: {
    fontSize: 15,
    fontFamily: "Amiri_700Bold",
    minWidth: 28,
    textAlign: "center",
  },
  chapterTitle: {
    flex: 1,
    fontFamily: "Amiri_400Regular",
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
  },
});

export default TableOfContents;
