import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, ChevronLeft } from "lucide-react-native";
import { getStreak } from "../services/statsService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface StreakBannerProps {
  onPress: () => void;
  isDark: boolean;
}

const toArabicNum = (n: number) =>
  String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

/**
 * Compact streak banner shown on home screen when user has an active streak.
 * Returns null if streak is 0.
 */
const StreakBanner: React.FC<StreakBannerProps> = ({ onPress, isDark }) => {
  const [streakCount, setStreakCount] = useState<number>(0);

  const refresh = useCallback(async () => {
    const s = await getStreak();
    // Only show if streak is active (read today or yesterday)
    if (!s.lastReadDate) {
      setStreakCount(0);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (s.lastReadDate === today || s.lastReadDate === yesterday) {
      setStreakCount(s.currentStreak);
    } else {
      setStreakCount(0);
    }
  }, []);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  if (streakCount === 0) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <LinearGradient
        colors={["#F59E0B", "#DC2626"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.left}>
          <Flame color="#fff" size={26} />
          <View>
            <Text style={styles.count}>
              {toArabicNum(streakCount)} {streakCount === 1 ? "يوم" : "أيام"} متتالية
            </Text>
            <Text style={styles.subtitle}>
              {streakCount >= 7
                ? "إنجاز رهيب! حافظ على السلسلة"
                : "استمر في القراءة يومياً"}
            </Text>
          </View>
        </View>
        <ChevronLeft color="#fff" size={20} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  banner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 12,
    elevation: 3,
  },
  left: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  count: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Amiri_700Bold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 2,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
  },
});

export default StreakBanner;
