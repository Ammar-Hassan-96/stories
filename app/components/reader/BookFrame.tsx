import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BookFrameProps {
  inkColor: string;
  pageBg: string;
}

const BookFrame: React.FC<BookFrameProps> = ({ inkColor, pageBg }) => {
  return (
    <View
      pointerEvents="none"
      style={[styles.outerFrame, { borderColor: inkColor }]}
    >
      {/* Inner double-border */}
      <View style={[styles.innerFrame, { borderColor: inkColor }]} />

      {/* Corner ornaments — ✦ */}
      <View style={[styles.corner, styles.topLeft, { backgroundColor: pageBg }]}>
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>✦</Text>
      </View>
      <View style={[styles.corner, styles.topRight, { backgroundColor: pageBg }]}>
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>✦</Text>
      </View>
      <View style={[styles.corner, styles.bottomLeft, { backgroundColor: pageBg }]}>
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>✦</Text>
      </View>
      <View style={[styles.corner, styles.bottomRight, { backgroundColor: pageBg }]}>
        <Text style={[styles.cornerSymbol, { color: inkColor }]}>✦</Text>
      </View>

      {/* Mid-edge ornaments — top & bottom */}
      <View style={[styles.midOrnament, styles.midTop, { backgroundColor: pageBg }]}>
        <Text style={[styles.midSymbol, { color: inkColor }]}>◆</Text>
      </View>
      <View style={[styles.midOrnament, styles.midBottom, { backgroundColor: pageBg }]}>
        <Text style={[styles.midSymbol, { color: inkColor }]}>◆</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    borderWidth: 1.5,
  },
  innerFrame: {
    position: "absolute",
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
    borderWidth: 0.7,
    opacity: 0.55,
  },
  corner: {
    position: "absolute",
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cornerSymbol: {
    fontSize: 12,
    lineHeight: 18,
  },
  topLeft: { top: -9, left: -9 },
  topRight: { top: -9, right: -9 },
  bottomLeft: { bottom: -9, left: -9 },
  bottomRight: { bottom: -9, right: -9 },
  midOrnament: {
    position: "absolute",
    width: 18,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    left: "50%",
    marginLeft: -9,
  },
  midTop: { top: -8 },
  midBottom: { bottom: -8 },
  midSymbol: {
    fontSize: 9,
    lineHeight: 12,
  },
});

export default BookFrame;
