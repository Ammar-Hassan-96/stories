import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  ChevronLeft,
  Minus,
  Plus,
  List,
  Bookmark,
  Headphones,
} from "lucide-react-native";

interface ReaderTopBarProps {
  fontSize: number;
  isDark: boolean;
  onGoBack: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onOpenToC?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  chapterInfo?: { current: number; total: number };
  onToggleAudio?: () => void;
  isAudioActive?: boolean;
}

const toArabicNumerals = (n: number): string =>
  n.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

const ReaderTopBar: React.FC<ReaderTopBarProps> = ({
  fontSize,
  isDark,
  onGoBack,
  onIncrease,
  onDecrease,
  onOpenToC,
  onBookmark,
  isBookmarked,
  chapterInfo,
  onToggleAudio,
  isAudioActive,
}) => {
  const controlColor = isDark ? "#C8A96E" : "#7A5C43";
  const borderColor = isDark ? "#3D3055" : "#BBAA94";
  const mutedColor = isDark ? "#7A6A8A" : "#A09080";

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: isDark
            ? "rgba(18,16,23,0.9)"
            : "rgba(244,239,230,0.9)",
        },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={onGoBack}
        style={[
          styles.iconBtn,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <ChevronLeft color={isDark ? "#E0D5C5" : "#3D2A1C"} size={22} />
      </TouchableOpacity>

      {/* Center: chapter indicator (if available) */}
      {chapterInfo && chapterInfo.total > 1 ? (
        <View style={[styles.chapterIndicator, { borderColor: borderColor }]}>
          <Text style={[styles.chapterText, { color: mutedColor }]}>
            {toArabicNumerals(chapterInfo.current)} / {toArabicNumerals(chapterInfo.total)}
          </Text>
        </View>
      ) : (
        <View />
      )}

      {/* Right: audio + bookmark + download + font controls + ToC */}
      <View style={styles.rightGroup}>
        {/* Audio narration toggle */}
        {onToggleAudio && (
          <TouchableOpacity
            onPress={onToggleAudio}
            style={[
              styles.iconBtn,
              {
                borderColor: isAudioActive ? "#C8A96E" : borderColor,
                borderWidth: 1,
                marginLeft: 4,
                backgroundColor: isAudioActive
                  ? isDark ? "rgba(200,169,110,0.25)" : "rgba(139,90,43,0.15)"
                  : "transparent",
              },
            ]}
          >
            <Headphones
              color={isAudioActive ? "#C8A96E" : controlColor}
              size={16}
            />
          </TouchableOpacity>
        )}

        {onBookmark && (
          <TouchableOpacity
            onPress={onBookmark}
            style={[
              styles.iconBtn,
              {
                borderColor: isBookmarked ? "#C8A96E" : borderColor,
                borderWidth: 1,
                marginLeft: 4,
                backgroundColor: isBookmarked
                  ? isDark ? "rgba(200,169,110,0.2)" : "rgba(139,90,43,0.12)"
                  : "transparent",
              },
            ]}
          >
            <Bookmark
              color={isBookmarked ? "#C8A96E" : controlColor}
              size={16}
              fill={isBookmarked ? "#C8A96E" : "none"}
            />
          </TouchableOpacity>
        )}

        {onOpenToC && (
          <TouchableOpacity
            onPress={onOpenToC}
            style={[styles.iconBtn, { borderColor, borderWidth: 1, marginLeft: 4 }]}
          >
            <List color={controlColor} size={17} />
          </TouchableOpacity>
        )}

        <View style={styles.fontControls}>
          <TouchableOpacity onPress={onDecrease} style={[styles.fontBtn, { borderColor }]}>
            <Minus color={controlColor} size={16} />
          </TouchableOpacity>
          <Text style={[styles.fontLabel, { color: controlColor }]}>{fontSize}</Text>
          <TouchableOpacity onPress={onIncrease} style={[styles.fontBtn, { borderColor }]}>
            <Plus color={controlColor} size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 4,
    zIndex: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  rightGroup: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
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
  fontLabel: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 22,
    textAlign: "center",
  },
  chapterIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
    opacity: 0.85,
  },
  chapterText: {
    fontSize: 13,
    fontFamily: "Amiri_400Regular",
    textAlign: "center",
  },
});

export default ReaderTopBar;
