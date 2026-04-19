import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { usePreventScreenCapture } from "expo-screen-capture";
import { StoryDetailsScreenProps } from "../types/navigation";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReadingTime } from "../types";
import { BookOpen } from "lucide-react-native";

import {
  splitIntoPages,
  categoryAccent,
  defaultAccent,
} from "../utils/storyContentParser";

import ReaderTopBar from "../components/reader/ReaderTopBar";
import BookFrame from "../components/reader/BookFrame";
import TitlePage from "../components/reader/TitlePage";
import ChapterPage from "../components/reader/ChapterPage";
import TableOfContents from "../components/reader/TableOfContents";
import AudioPlayer from "../components/reader/AudioPlayer";
import AchievementToast from "../components/AchievementToast";

import { useStoryBookmark } from "../hooks/useBookmarks";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { addToHistory } from "../services/historyService";
import { recordStoryCompletion, checkAchievements, Achievement } from "../services/statsService";

const StoryDetailsScreen: React.FC<StoryDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { story } = route.params;
  const [fontSize, setFontSize] = useState(18);
  const { isDark } = useTheme();
  const { bookmarked, toggle: toggleBookmark } = useStoryBookmark(story);
  const { savedProgress, saveProgress, clearProgress } = useReadingProgress(story);

  usePreventScreenCapture();

  useEffect(() => {
    addToHistory(story);
  }, [story.id]);

  const handleBookmark = useCallback(async () => {
    await toggleBookmark();
    const msg = bookmarked ? "تم إزالة القصة من المفضلة" : "تم حفظ القصة في المفضلة";
    Alert.alert("", msg, [{ text: "حسناً" }]);
  }, [toggleBookmark, bookmarked]);

  // === Audio player toggle ===
  const [audioOpen, setAudioOpen] = useState(false);

  const accent = categoryAccent[story.category_id] ?? defaultAccent;
  const bgColor = isDark ? "#08070A" : "#C19A6B";
  const pageBg = isDark ? "#121017" : "#cec1b6ff";
  const inkColor = isDark ? "#4A4550" : "#C19A6B";

  const chapters = useMemo(() => splitIntoPages(story.content), [story.content]);
  const readingTime = useMemo(() => getReadingTime(story.content), [story.content]);

  const incFontSize = useCallback(() => setFontSize((v) => Math.min(28, v + 1)), []);
  const decFontSize = useCallback(() => setFontSize((v) => Math.max(14, v - 1)), []);

  // ── Table of Contents ─────────────────────────────────────────
  const [tocVisible, setTocVisible] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const chapterPositionsRef = useRef<number[]>([]);

  const jumpToChapter = useCallback((index: number) => {
    setCurrentChapter(index);
    const y = chapterPositionsRef.current[index];
    if (y != null) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y, animated: true });
      }, 320);
    }
  }, []);

  // ── Reading progress ──────────────────────────────────────────
  const scrollProgress = useSharedValue(0);
  const progressTrackWidth = useSharedValue(0);

  // ── Continue-reading tracking ─────────────────────────────────
  const contentHeightRef = useRef(0);
  const currentScrollYRef = useRef(0);
  const restoredRef = useRef(false);


  // ── Reading completion celebration ────────────────────────────
  const [completedVisible, setCompletedVisible] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const completedOpacity = useSharedValue(0);
  const completedScale = useSharedValue(0.8);
  const hasCompleted = useRef(false);

  /**
   * When the user finishes the story: record stats, check achievements, show celebrations.
   */
  const handleReadingComplete = useCallback(async () => {
    setCompletedVisible(true);
    completedOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withDelay(2800, withTiming(0, { duration: 600 }))
    );
    completedScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    setTimeout(() => {
      setCompletedVisible(false);
      completedScale.value = 0.8;
    }, 4000);

    // Clear continue-reading entry since story is done
    clearProgress();

    try {
      await recordStoryCompletion(story, readingTime);
      const unlocked = await checkAchievements();
      if (unlocked.length > 0) {
        setTimeout(() => setNewAchievement(unlocked[0]), 4500);
      }
    } catch {
      // Silent fail - stats aren't critical
    }
  }, [story, readingTime, completedOpacity, completedScale, clearProgress]);

  // Chapter + progress tracking (JS thread)
  const updateChapterFromScroll = useCallback((scrollY: number) => {
    const positions = chapterPositionsRef.current;
    let active = 0;
    for (let i = positions.length - 1; i >= 0; i--) {
      if (positions[i] != null && scrollY >= positions[i] - 120) {
        active = i;
        break;
      }
    }
    setCurrentChapter(active);
  }, []);

  const onScrollProgressUpdate = useCallback((scrollY: number, contentH: number, layoutH: number) => {
    currentScrollYRef.current = scrollY;
    saveProgress(scrollY, contentH, layoutH);
  }, [saveProgress]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, contentSize, layoutMeasurement } = event;
      const y = contentOffset.y;
      const maxScroll = contentSize.height - layoutMeasurement.height;
      const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;
      scrollProgress.value = progress;

      runOnJS(updateChapterFromScroll)(y);
      runOnJS(onScrollProgressUpdate)(y, contentSize.height, layoutMeasurement.height);

      if (progress >= 0.98 && !hasCompleted.current) {
        hasCompleted.current = true;
        runOnJS(handleReadingComplete)();
      }
    },
  });

  const progressFillStyle = useAnimatedStyle(() => ({
    width: scrollProgress.value * progressTrackWidth.value,
  }));

  const progressBarOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollProgress.value,
      [0, 0.015],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const completedBadgeStyle = useAnimatedStyle(() => ({
    opacity: completedOpacity.value,
    transform: [{ scale: completedScale.value }],
  }));

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        <ReaderTopBar
          fontSize={fontSize}
          isDark={isDark}
          onGoBack={() => navigation.goBack()}
          onIncrease={incFontSize}
          onDecrease={decFontSize}
          onOpenToC={chapters.length > 1 ? () => setTocVisible(true) : undefined}
          chapterInfo={chapters.length > 1 ? { current: currentChapter, total: chapters.length } : undefined}
          onBookmark={handleBookmark}
          isBookmarked={bookmarked}
          onToggleAudio={() => setAudioOpen((v) => !v)}
          isAudioActive={audioOpen}
        />

        {/* Reading progress bar */}
        <Animated.View
          style={[
            styles.progressTrack,
            { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" },
            progressBarOpacity,
          ]}
          onLayout={({ nativeEvent }) => {
            progressTrackWidth.value = nativeEvent.layout.width;
          }}
        >
          <Animated.View
            style={[styles.progressFill, { backgroundColor: accent.primary }, progressFillStyle]}
          />
        </Animated.View>

        {/* Book body */}
        <View style={[styles.physicalBook, { backgroundColor: pageBg }]}>
          <View
            style={[
              styles.bookBlockShadow,
              { backgroundColor: isDark ? "#050408" : "#B8B3A8" },
            ]}
          />

          <Animated.ScrollView
            ref={scrollViewRef as any}
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.scrollContent,
              audioOpen && { paddingBottom: 140 },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            onContentSizeChange={(_w, h) => {
              contentHeightRef.current = h;
              // Restore saved position the first time content is fully laid out
              if (savedProgress && !restoredRef.current && h > 0) {
                restoredRef.current = true;
                const targetY = savedProgress.percentage * h;
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({ x: 0, y: targetY, animated: false });
                }, 100);
              }
            }}
          >
            <TitlePage
              title={story.title}
              author={''}
              createdAt={story.created_at}
              readingTime={readingTime}
              imageUrl={story.image_url ?? undefined}
              fontSize={fontSize}
              isDark={isDark}
              pageBg={pageBg}
              accentColor={accent.primary}
            />

            {chapters.map((chapter, index) => (
              <View
                key={`chapter-${index}`}
                onLayout={(e) => {
                  chapterPositionsRef.current[index] = e.nativeEvent.layout.y;
                }}
              >
                <ChapterPage
                  page={chapter}
                  fontSize={fontSize}
                  isDark={isDark}
                  accentColor={accent.primary}
                  isLastPage={index === chapters.length - 1}
                  isFirstChapter={index === 0}
                  chapterIndex={index}
                />
              </View>
            ))}
          </Animated.ScrollView>

          <BookFrame inkColor={inkColor} pageBg={pageBg} />

          {/* Reading completion badge */}
          {completedVisible && (
            <Animated.View
              style={[
                styles.completedBadge,
                {
                  backgroundColor: isDark
                    ? "rgba(18,16,23,0.92)"
                    : "rgba(244,239,230,0.95)",
                  borderColor: accent.primary + "55",
                },
                completedBadgeStyle,
              ]}
            >
              <BookOpen color={accent.primary} size={18} />
              <Text style={[styles.completedText, { color: accent.primary }]}>
                اكتملت القراءة
              </Text>
            </Animated.View>
          )}

          {/* Audio player (floating) */}
          {audioOpen && (
            <AudioPlayer
              text={story.content}
              isDark={isDark}
              accentColor={accent.primary}
              onClose={() => setAudioOpen(false)}
            />
          )}
        </View>
      </SafeAreaView>

      {/* Achievement toast — outside everything for full overlay */}
      {newAchievement && (
        <AchievementToast
          achievement={newAchievement}
          onDismiss={() => setNewAchievement(null)}
        />
      )}

      {/* Table of Contents bottom sheet */}
      {tocVisible && (
        <TableOfContents
          chapters={chapters}
          currentChapter={currentChapter}
          isDark={isDark}
          accentColor={accent.primary}
          onSelectChapter={jumpToChapter}
          onClose={() => setTocVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  progressTrack: {
    height: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  physicalBook: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 14,
    borderRadius: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    elevation: 14,
    shadowColor: "#000",
    shadowOffset: { width: -3, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  bookBlockShadow: {
    position: "absolute",
    top: 6,
    bottom: -6,
    left: -6,
    width: 14,
    borderRadius: 3,
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 36,
    paddingTop: 40,
    paddingBottom: 48,
  },
  completedBadge: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completedText: {
    fontFamily: "Amiri_700Bold",
    fontSize: 15,
    writingDirection: "rtl",
  },
});

export default StoryDetailsScreen;
