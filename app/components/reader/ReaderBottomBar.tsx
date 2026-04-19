import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface ReaderBottomBarProps {
  /** Current index in the reversed pages array. */
  currentPageIndex: number;
  totalPages: number;
  isDark: boolean;
  accentColor: string;
  onNext: () => void;
  onPrev: () => void;
}

/**
 * Bottom navigation bar for the paginated reader.
 * Shows prev/next arrows and a page counter.
 * Layout accounts for normal RTL list:
 *   Right arrow → go to next page
 *   Left arrow  → go to previous page
 */
const ReaderBottomBar: React.FC<ReaderBottomBarProps> = ({
  currentPageIndex,
  totalPages,
  isDark,
  accentColor,
  onNext,
  onPrev,
}) => {
  const disabledColor = isDark ? "#3A3040" : "#D0C0B0";
  const mutedText = isDark ? "#8A7A90" : "#8A7B6D";

  const canGoPrev = currentPageIndex > 0;
  const canGoNext = currentPageIndex < totalPages - 1;

  const displayPage = currentPageIndex + 1;

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
      {/* Previous page (on the right, pointing right) */}
      <TouchableOpacity
        onPress={onPrev}
        style={[
          styles.navBtn,
          {
            backgroundColor: canGoPrev
              ? accentColor + "20"
              : "transparent",
          },
        ]}
        disabled={!canGoPrev}
      >
        <ChevronRight
          color={canGoPrev ? accentColor : disabledColor}
          size={20}
        />
      </TouchableOpacity>

      {/* Page counter */}
      <View style={styles.counter}>
        <Text style={[styles.counterText, { color: mutedText }]}>
          {displayPage} / {totalPages}
        </Text>
      </View>

      {/* Next page (on the left, pointing left) */}
      <TouchableOpacity
        onPress={onNext}
        style={[
          styles.navBtn,
          {
            backgroundColor: canGoNext
              ? accentColor + "20"
              : "transparent",
          },
        ]}
        disabled={!canGoNext}
      >
        <ChevronLeft
          color={canGoNext ? accentColor : disabledColor}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    alignItems: "center",
  },
  counterText: {
    fontFamily: "Amiri_400Regular",
    fontSize: 14,
  },
});

export default ReaderBottomBar;
