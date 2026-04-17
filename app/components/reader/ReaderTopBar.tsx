import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, Minus, Plus } from "lucide-react-native";

interface ReaderTopBarProps {
  fontSize: number;
  isDark: boolean;
  onGoBack: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

/**
 * Top toolbar for the reader — contains a back button and
 * font size increase/decrease controls.
 */
const ReaderTopBar: React.FC<ReaderTopBarProps> = ({
  fontSize,
  isDark,
  onGoBack,
  onIncrease,
  onDecrease,
}) => {
  const controlColor = isDark ? "#C8A96E" : "#7A5C43";
  const borderColor = isDark ? "#3D3055" : "#BBAA94";

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: isDark
            ? "rgba(18,16,23,0.85)"
            : "rgba(244,239,230,0.85)",
        },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={onGoBack}
        style={[
          styles.backBtn,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <ChevronLeft color={isDark ? "#E0D5C5" : "#3D2A1C"} size={22} />
      </TouchableOpacity>

      {/* Font size controls */}
      <View style={styles.fontControls}>
        <TouchableOpacity
          onPress={onDecrease}
          style={[styles.fontBtn, { borderColor }]}
        >
          <Minus color={controlColor} size={16} />
        </TouchableOpacity>
        <Text style={[styles.fontLabel, { color: controlColor }]}>
          {fontSize}
        </Text>
        <TouchableOpacity
          onPress={onIncrease}
          style={[styles.fontBtn, { borderColor }]}
        >
          <Plus color={controlColor} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 4,
    zIndex: 10,
  },
  backBtn: {
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
  fontLabel: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
});

export default ReaderTopBar;
