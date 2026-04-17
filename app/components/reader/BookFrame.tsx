import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BookFrameProps {
  /** The ink/border color for the frame lines and corner ornaments. */
  inkColor: string;
  /** Background color behind the corner ornaments so they blend with the page. */
  pageBg: string;
}

/**
 * Decorative double-border frame with corner ornaments (❖).
 * Overlaid on top of the book content area using absolute positioning.
 * Receives pointerEvents="none" from parent so it doesn't block touches.
 */
const BookFrame: React.FC<BookFrameProps> = ({ inkColor, pageBg }) => {
  return (
    <View
      style={[styles.outerFrame, { borderColor: inkColor }]}
      pointerEvents="none"
    >
      <View style={[styles.innerFrame, { borderColor: inkColor }]} />

      {/* Corner ornaments */}
      <View
        style={[
          styles.corner,
          styles.topLeft,
          { backgroundColor: pageBg, borderColor: inkColor },
        ]}
      >
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>❖</Text>
      </View>
      <View
        style={[
          styles.corner,
          styles.topRight,
          { backgroundColor: pageBg, borderColor: inkColor },
        ]}
      >
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>❖</Text>
      </View>
      <View
        style={[
          styles.corner,
          styles.bottomLeft,
          { backgroundColor: pageBg, borderColor: inkColor },
        ]}
      >
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>❖</Text>
      </View>
      <View
        style={[
          styles.corner,
          styles.bottomRight,
          { backgroundColor: pageBg, borderColor: inkColor },
        ]}
      >
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>❖</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    position: "absolute",
    top: 14,
    bottom: 14,
    left: 14,
    right: 14,
    borderWidth: 1.5,
  },
  innerFrame: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
    borderWidth: 0.8,
  },
  corner: {
    position: "absolute",
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  cornerSymbol: {
    fontSize: 16,
    lineHeight: 20,
  },
  topLeft: { top: -10, left: -10 },
  topRight: { top: -10, right: -10 },
  bottomLeft: { bottom: -10, left: -10 },
  bottomRight: { bottom: -10, right: -10 },
});

export default BookFrame;
