import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  Menu,
  BookOpen,
  Clock,
  Flame,
  Trophy,
  TrendingUp,
  Award,
  Lock,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../services/ThemeContext";
import { useReadingStats } from "../hooks/useReadingStats";
import { AppDrawerNavigationProp } from "../types/navigation";
import { StoryService } from "../services/StoryService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_W = SCREEN_WIDTH - 48;
const CHART_H = 120;

// Arabic day abbreviations
const DAY_NAMES = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

const toArabicNum = (n: number) =>
  String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

const StatsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { stats, streak, last30Days, achievements, loading, refresh } =
    useReadingStats();
  const drawerNavigation = useNavigation<AppDrawerNavigationProp>();

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const bgColor = isDark ? "#0F0D1A" : "#EDE3D6";
  const headerBg = isDark ? "#13101F" : "#A8784E";
  const cardBg = isDark ? "#1A1630" : "#F5EBD8";
  const textPrimary = isDark ? "#F0E6D3" : "#3D2B1F";
  const textSecondary = isDark ? "#9E91B0" : "#8A6F5A";
  const accent = isDark ? "#C8A96E" : "#8B5A2B";
  const iconColor = isDark ? "#F9FAFB" : "#3D2B1F";

  // Chart data — last 14 days
  const last14Days = last30Days.slice(-14);
  const maxMinutes = Math.max(...last14Days.map((d) => d.minutesRead), 10);

  // Category breakdown
  const categories = useMemo(() => StoryService.getCategories(), []);
  const categoryStats = useMemo(() => {
    if (!stats) return [];
    const breakdown = stats.categoryBreakdown;
    return categories
      .map((c) => ({
        ...c,
        count: breakdown[c.id] ?? 0,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [stats, categories]);

  const topCategory = categoryStats[0];

  // This week's reading
  const thisWeek = last30Days.slice(-7);
  const weekStories = thisWeek.reduce((sum, d) => sum + d.storiesRead, 0);
  const weekMinutes = thisWeek.reduce((sum, d) => sum + d.minutesRead, 0);

  if (loading || !stats || !streak) {
    return (
      <View style={[styles.screen, { backgroundColor: bgColor }]}>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <TrendingUp color={accent} size={48} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <TouchableOpacity
            onPress={() => drawerNavigation.openDrawer()}
            style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }]}
          >
            <Menu color={iconColor} size={22} />
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <TrendingUp color={accent} size={18} />
            <Text style={[styles.title, { color: textPrimary }]}>
              إحصائيات القراءة
            </Text>
          </View>

          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refresh} tintColor={accent} />
          }
        >
          {/* === STREAK BANNER === */}
          <Animated.View entering={FadeInDown.springify()}>
            <LinearGradient
              colors={
                streak.currentStreak > 0
                  ? ["#F59E0B", "#DC2626"]
                  : isDark
                  ? ["#2C2140", "#1A1630"]
                  : ["#D4A574", "#B8895D"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.streakBanner}
            >
              <View style={styles.streakLeft}>
                <Flame color="#fff" size={40} />
                <View>
                  <Text style={styles.streakNum}>
                    {toArabicNum(streak.currentStreak)}
                  </Text>
                  <Text style={styles.streakLabel}>
                    {streak.currentStreak === 0
                      ? "ابدأ قراءتك اليوم"
                      : streak.currentStreak === 1
                      ? "يوم قراءة"
                      : "أيام متتالية"}
                  </Text>
                </View>
              </View>
              <View style={styles.streakRight}>
                <Text style={styles.streakBestLabel}>أطول سلسلة</Text>
                <Text style={styles.streakBestNum}>
                  {toArabicNum(streak.longestStreak)} {streak.longestStreak === 1 ? "يوم" : "يوم"}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* === OVERALL STATS (4 cards) === */}
          <Animated.View
            entering={FadeInDown.delay(80).springify()}
            style={styles.statsGrid}
          >
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <BookOpen color={accent} size={22} />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {toArabicNum(stats.totalStoriesRead)}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                قصة مقروءة
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <Clock color={accent} size={22} />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {toArabicNum(stats.totalMinutesRead)}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                دقيقة قراءة
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <Trophy color={accent} size={22} />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {toArabicNum(achievements.filter((a) => a.unlocked).length)}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                إنجاز مفتوح
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <TrendingUp color={accent} size={22} />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {toArabicNum(weekStories)}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                قصة هذا الأسبوع
              </Text>
            </View>
          </Animated.View>

          {/* === ACTIVITY CHART === */}
          <Animated.View
            entering={FadeInDown.delay(160).springify()}
            style={[styles.section, { backgroundColor: cardBg }]}
          >
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              نشاط آخر ١٤ يوم
            </Text>
            <View style={styles.chartContainer}>
              {last14Days.map((day, idx) => {
                const h = day.minutesRead > 0
                  ? Math.max(6, (day.minutesRead / maxMinutes) * (CHART_H - 28))
                  : 4;
                const dayDate = new Date(day.date + "T00:00:00");
                const dayIdx = dayDate.getDay();
                return (
                  <View key={day.date} style={styles.chartBar}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: h,
                          backgroundColor:
                            day.minutesRead > 0
                              ? accent
                              : isDark ? "#2C2840" : "#D8C8B0",
                        },
                      ]}
                    />
                    <Text style={[styles.barLabel, { color: textSecondary }]}>
                      {DAY_NAMES[dayIdx]}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={[styles.chartFooter, { color: textSecondary }]}>
              إجمالي هذا الأسبوع: {toArabicNum(weekMinutes)} دقيقة
            </Text>
          </Animated.View>

          {/* === CATEGORY BREAKDOWN === */}
          {categoryStats.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(240).springify()}
              style={[styles.section, { backgroundColor: cardBg }]}
            >
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>
                التصنيفات الأكثر قراءة
              </Text>
              {topCategory && (
                <View style={[styles.topCategoryBadge, { backgroundColor: accent + "22" }]}>
                  <Text style={[styles.topCategoryLabel, { color: accent }]}>
                    المفضل عندك
                  </Text>
                  <Text style={[styles.topCategoryName, { color: textPrimary }]}>
                    {topCategory.name}
                  </Text>
                </View>
              )}
              {categoryStats.map((c, i) => {
                const maxCount = categoryStats[0].count;
                const pct = (c.count / maxCount) * 100;
                return (
                  <View key={c.id} style={styles.catRow}>
                    <Text style={[styles.catCount, { color: textSecondary }]}>
                      {toArabicNum(c.count)}
                    </Text>
                    <View style={styles.catBarContainer}>
                      <View
                        style={[
                          styles.catBarBg,
                          { backgroundColor: isDark ? "#2C2840" : "#E8DDC9" },
                        ]}
                      >
                        <View
                          style={[
                            styles.catBarFill,
                            {
                              width: `${pct}%`,
                              backgroundColor: accent,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={[styles.catName, { color: textPrimary }]}>
                      {c.name}
                    </Text>
                  </View>
                );
              })}
            </Animated.View>
          )}

          {/* === ACHIEVEMENTS === */}
          <Animated.View
            entering={FadeInDown.delay(320).springify()}
            style={[styles.section, { backgroundColor: cardBg }]}
          >
            <View style={styles.achievementsHeader}>
              <Text style={[styles.sectionTitle, { color: textPrimary, marginBottom: 0 }]}>
                الإنجازات
              </Text>
              <Text style={[styles.achievementsCount, { color: textSecondary }]}>
                {toArabicNum(achievements.filter((a) => a.unlocked).length)} / {toArabicNum(achievements.length)}
              </Text>
            </View>
            <View style={styles.achievementsGrid}>
              {achievements.map((a, i) => (
                <Animated.View
                  key={a.id}
                  entering={FadeIn.delay(i * 40).springify()}
                  style={[
                    styles.achievementItem,
                    {
                      backgroundColor: a.unlocked
                        ? isDark ? "rgba(200,169,110,0.15)" : "rgba(139,90,43,0.1)"
                        : isDark ? "#0F0D1A" : "#E8DDC9",
                      borderColor: a.unlocked ? accent : "transparent",
                      opacity: a.unlocked ? 1 : 0.55,
                    },
                  ]}
                >
                  <Text style={styles.achievementIcon}>
                    {a.unlocked ? a.icon : "🔒"}
                  </Text>
                  <Text style={[styles.achievementTitle, { color: textPrimary }]}>
                    {a.title}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: textSecondary }]}>
                    {a.description}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconBtn: { padding: 8, borderRadius: 20 },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "Amiri_700Bold",
  },

  // Streak
  streakBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  streakLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  streakNum: {
    color: "#fff",
    fontSize: 42,
    fontFamily: "Amiri_700Bold",
    textAlign: "right",
  },
  streakLabel: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
  },
  streakRight: { alignItems: "flex-start" },
  streakBestLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    writingDirection: "rtl",
  },
  streakBestNum: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Amiri_700Bold",
    marginTop: 2,
    writingDirection: "rtl",
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 16,
  },
  statCard: {
    width: "50%",
    paddingHorizontal: 6,
  },
  statValue: {
    fontSize: 28,
    fontFamily: "Amiri_700Bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
  },

  // Section
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    direction: 'rtl',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
    textAlign: "left",
    marginBottom: 14,
  },

  // Chart
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: CHART_H,
    justifyContent: "space-between",
    gap: 4,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: "Amiri_400Regular",
  },
  chartFooter: {
    marginTop: 14,
    fontSize: 12,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
  },

  // Stats grid card override
  // (using separate wrapper)

  // Top category badge
  topCategoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
  },
  topCategoryLabel: {
    fontSize: 10,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  topCategoryName: {
    fontSize: 16,
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
    marginTop: 2,
  },
  catRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  catName: {
    width: 110,
    fontSize: 13,
    fontFamily: "Amiri_400Regular",
    textAlign: "right",
    writingDirection: "rtl",
  },
  catBarContainer: { flex: 1 },
  catBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  catBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  catCount: {
    width: 30,
    fontSize: 13,
    fontFamily: "Amiri_700Bold",
    textAlign: "left",
  },

  // Achievements
  achievementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  achievementsCount: {
    fontSize: 13,
    fontFamily: "Amiri_700Bold",
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  achievementItem: {
    width: (SCREEN_WIDTH - 32 - 16 - 16) / 4,  // 3 per row
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 12,
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
    textAlign: "center",
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 10,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
    lineHeight: 14,
  },
});

export default StatsScreen;
